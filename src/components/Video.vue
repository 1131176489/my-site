<script setup  lang="ts" >
import { myStore } from '../assets/Video'
import { onBeforeUnmount, ref } from 'vue'
import { onMounted } from "vue"
import axios from 'axios'
import { reSizeContainer } from '../assets/reSizeContainer'
import { ElTree, ElMessage } from 'element-plus'
const treeRef = ref<InstanceType<typeof ElTree>>()
//从pin2.ts引入数据
const videoData = myStore()
const vi = ref<HTMLVideoElement | null>(null)
const timer = ref(0)
const defaultProps = {
        children: 'children',
        label: 'label',
}
interface lastVideoMsg {
        label: string,
        time: string,
        labelparent: string
}
interface lastVideo {
        status: string,
        msg: lastVideoMsg,
}
interface Tree {
        label: string
        children?: Tree[]
}
type Data = {
        status: number,
        msg: Array<Tree>,
}
//视频列表数据请求
async function ff(): Promise<void> {
        try {
                const { data }: { data: Data } = await axios.get('/videoList')
                if (data.status != 200) {
                        ElMessage({
                                type: "error",
                                message: "请求数据失败，请稍后再试！"
                        })
                } else {
                        videoData.mydata = data.msg
                }
        }
        catch (err) {
                ElMessage({
                        type: "error",
                        message: (err as Error).message
                })
                // console.log()
        }

}
//设置当前播放列表
function setCurrentPlayList(parentLabel: string, sonLabel: string) {
        for (let i = 0; i < videoData.mydata.length; i++) {
                if (videoData.mydata[i].label == parentLabel) {
                        videoData.currentPlayList = videoData.mydata[i]
                }
        }
        for (let i = 0; i < videoData.currentPlayList.children!.length; i++) {
                if (videoData.currentPlayList.children![i].label == sonLabel) {
                        videoData.index = i

                }
        }
}
function getStatistics(info: string): BodyInit {
        let s = {
                "label": videoData.currentVideo,
                "time": vi.value?.currentTime,
                "labelParent": videoData.currentVideoParent,
                "info": info
        }
        let data: XMLHttpRequestBodyInit = JSON.stringify(s)
        return data
}
//向服务器发送当前视频进度数据包的函数
function lastVideo(info: string): void {
        // 
        fetch(videoData.srcBaseUrl + 'lastVideo', {
                method: 'POST',
                body: getStatistics(info),
                keepalive: true,
                headers: {
                        'Content-Type': 'application/json'
                }
        })
}
//组件挂载后的处理函数
const pageBegin = async function () {
        if (import.meta.env.MODE == 'development') {
                videoData.srcBaseUrl = "http://192.168.0.106:9000/"
        }
        else {
                videoData.srcBaseUrl = "/"
        }
        //获取视频列表数据
        await ff()
        //获取视频播放信息数据包
        const { data }: { data: lastVideo } = await axios.get("/lastVideo")
        console.log(data)
        videoData.playInfo = data.msg
        //将当前高亮设置为播放信息数据包的标签
        videoData.currentHeightLight = videoData.playInfo.label
        //设置当前视频源url
        videoData.src = videoData.srcBaseUrl + videoData.playInfo.label
        //将当前视频文件父文件名称设为播放信息数据包的父亲标签
        videoData.currentVideoParent = videoData.playInfo.labelparent
        //将当前视频文件名称设置为播放信息数据包的标签，
        videoData.currentVideo = videoData.playInfo.label
        //设置当前播放列表和index
        setCurrentPlayList(videoData.playInfo.labelparent, videoData.playInfo.label)
        //将视频进度前进到播放信息数据包的时间位置，将音量设置为0.6，播放视频
        setTimeout(() => {
                vi.value!.volume = 0.6
                vi.value!.currentTime = parseInt(videoData.playInfo.time) - 2
                vi.value?.play()
        }, 1500)
        //设置Container容器高度
        reSizeContainer()
}
//点击视频标题节点的回调函数
function handleClick(f1: Tree, f2: any, f3: any, f4: any): void {
        //获取currentHeightLight类名的元素
        const d = window.document.documentElement.getElementsByClassName('currentHeightLight')
        if (d.length != 0) {
                //如果有元素，就清除类名
                d[0].classList.remove('currentHeightLight')
        }
        //点击视频标题
        if (f1.children == undefined) {
                //高亮显示
                f4.target.classList.add("currentHeightLight")
                //设置当前video
                videoData.currentVideo = f1.label
                //设置当前src
                videoData.src = videoData.srcBaseUrl + videoData.currentVideo
                //设置播放列表
                videoData.playListLabel = f1.label
                videoData.playListLabelList = []
                //设置当前播放列表
                setCurrentPlayList(f2.parent.label, f1.label)
                //设置当前视频文件父文件夹名称
                videoData.currentVideoParent = f2.parent.label as string
        }
        //点击文件夹标题
        else {
                //高亮显示
                f4.target.classList.add("currentHeightLight")
                videoData.currentHeightLight = f1.label
                //设置播放列表
                videoData.playListLabelList = f1.children
                videoData.playListLabel = ''
        }
}
//视频结束事件的回调函数
function videoEnd(info: number) {
        //如果参数为1，则当前视频文件所在父文件中的位置+1，
        if (info == 1) videoData.index++
        //否则，则当前视频文件所在父文件中的位置-1，
        else videoData.index--
        //如果当前视频文件所在父文件中的位置大于（当前播放列表的长度-1），则视频文件所在父文件中的位置为0，
        if (videoData.index > videoData.currentPlayList.children!.length - 1) {
                videoData.index = 0
        }
        //如果当前视频文件所在父文件中的位置小于0，则视频文件所在父文件中的位置为（当前播放列表的长度-1），
        if (videoData.index < 0) {
                videoData.index = videoData.currentPlayList.children!.length - 1
        }
        //当前视频文件名称 设置为 当前播放列表中 当前视频文件所在父文件中的位置 的元素 的标签
        videoData.currentVideo = videoData.currentPlayList.children![videoData.index].label
        //视频源url设置为 基本url + 当前播放列表中 当前视频文件所在父文件中的位置 的元素 的标签
        videoData.src = videoData.srcBaseUrl + videoData.currentPlayList.children![videoData.index].label
        //播放视频
        vi.value?.play()
}
//添加至播放列表
async function playListAdd() {
        if (videoData.playListLabelList.length == 0 && videoData.playListLabel.length == 0) {
                ElMessage({
                        message: '请选择有效的视频',
                        type: 'warning',
                })
        } else if (videoData.playListLabel.length == 0) {
                const msg = await axios.post('/palyListAddList', {
                        data: {
                                "label": videoData.playListLabelList
                        }
                })
                if (msg.status == 200) {
                        ElMessage({
                                message: '添加成功',
                                type: "success",
                        })
                }
                else {
                        ElMessage({
                                message: '添加失败',
                                type: "error",
                        })
                }
        } else {
                const msg = await axios.post('/palyListAddList', {
                        data: {
                                "label": [
                                        {
                                                "label": videoData.playListLabel
                                        }
                                ]
                        }
                })
                if (msg.status == 200) {
                        ElMessage({
                                message: '添加成功',
                                type: "success",
                        })
                }
                else {
                        ElMessage({
                                message: '添加失败',
                                type: "error",
                        })
                }
        }
        ff()
}
//清除播放列表
async function playListClear() {
        const res = await axios.post('/palyListClear')
        ff()
}
//按键上一个视频的回调
function preVideo() {
        // vi.value!.currentTime = 99999999
        videoEnd(-1)
}
//按键下一个视频的回调
function nextVideo() {
        videoEnd(1)
}
const forward = () => {
        vi.value!.currentTime = vi.value!.currentTime + 3
}
const backward = () => {
        vi.value!.currentTime = vi.value!.currentTime - 3
}

//生命周期钩子
onMounted(() => {
        pageBegin()
        timer.value = setInterval(() => {
                lastVideo("setInterval")
        }, 1000)
})
window.onpageshow = pageBegin
onBeforeUnmount(() => {
        window.clearInterval(timer.value)
        lastVideo('onBeforeUnmount')
})
window.onbeforeunload = () => {
        lastVideo('onbeforeunload')
}
window.onpagehide = () => {
        lastVideo('onpagehide')
}
window.onresize = reSizeContainer
</script>

<template>
        <div class="container">
                <div class="video-container">
                        <div class="video-title">
                                {{ videoData.currentVideo }}
                        </div>
                        <video v-bind:src=videoData.src v-on:ended="videoEnd(1)" v-on:pause="lastVideo('pause')"
                               controls autoplay
                               ref="vi"></video>
                </div>
                <el-scrollbar>
                        <el-tree :data="videoData.mydata" v-bind:render-after-expand=true
                                 v-bind:props="defaultProps"
                                 v-on:node-click="handleClick" ref="treeRef" />
                </el-scrollbar>
                <el-card class="box-card">
                        <el-button v-on:click="playListAdd">
                                添加至播放列表
                        </el-button>
                        <el-button v-on:click="playListClear">
                                清空播放列表
                        </el-button>
                        <div class="btn-1">
                                <el-button v-on:click="preVideo">
                                        上一个视频
                                </el-button>
                                <el-button v-on:click="nextVideo">
                                        下一个视频
                                </el-button>
                                <el-button v-on:click="backward">
                                        后退两秒
                                </el-button>
                                <el-button v-on:click="forward">
                                        前进两秒
                                </el-button>
                        </div>
                </el-card>
                <div>
                </div>
        </div>
</template>
<style scoped >
@media screen and (min-width:765px) {
        .currentHeightLight {
                background-color: #337ecc !important;
        }
        .container {
                display: flex;
                height: 100%;
                justify-content: left;
        }
        video {
                display: block;
                width: 1044px;
                height: 587px;
                margin: 0;
                padding: 0;
                background-color: #000;
        }
        .video-container {
                width: 1044px;
                margin-left: 150px;
                flex-shrink: 0;
        }
        .video-title {
                height: 60px;
                padding-top: 20px;
                font-size: 16px;
                font-family: 'Times New Roman', Times, serif;
        }
        .video-list {
                flex-shrink: 0;
                overflow: scroll;
                width: 300px;
                height: 500px;
                margin-top: 59px;
                margin-left: 30px;
        }

        .btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 59px;
                flex-shrink: 0;
                width: 160px;
        }

        .btn-1 {
                display: flex;
                flex-direction: column;
        }

        .el-button,
        .btn-1 button {
                margin: 5px 0;
                width: 150px;
        }
}

@media screen and (max-width: 764px) {
        .video-title {
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                height: 24px;
                line-height: 24px;
                box-sizing: border-box;
                padding-left: 5px;
        }

        .video-container {
                height: 321px;
        }

        video {
                height: 295px;
                width: 100%;


                background-color: #000;
        }

        .container {
                display: flex;

                flex-direction: column;
                flex: 1 1 auto;
                /* justify-content: left; */

        }

        .container div {
                flex-shrink: 0;
        }

        .video-list {
                overflow: scroll;
                flex-shrink: 1 !important;
                width: 100%;
        }

        .btn {
                display: flex;

                box-sizing: border-box;
                flex-direction: column;
        }

        .btn-1 {
                display: flex;
        }

        .btn button {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
                border-bottom: 0;
        }
}
</style>