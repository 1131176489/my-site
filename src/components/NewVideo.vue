<template>
        <div class="c">
                <el-row :gutter="20">
                        <el-col :span="20" class="videocontainer" :xs="24">
                                <div ref="artRef" style="aspect-ratio: 16 / 9">
                                </div>
                        </el-col>
                        <el-col :span="4" class="list hidden-xs-only">
                                <el-scrollbar>
                                        <el-tree
                                                 v-bind:data="mydata"
                                                 v-bind:render-after-expand=true
                                                 v-bind:props="defaultProps"
                                                 v-on:node-click="handleClick" />
                                </el-scrollbar>
                        </el-col>
                </el-row>
                <el-row class="hidden-sm-and-up">
                        <el-scrollbar>
                                <el-tree
                                         v-bind:data="mydata"
                                         v-bind:render-after-expand=true
                                         v-bind:props="defaultProps"
                                         v-on:node-click="handleClick" />
                        </el-scrollbar>
                </el-row>
        </div>
</template>
    
<script lang="ts" setup>
import Artplayer from 'artplayer';
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue';
import { myStore } from '../assets/Video'
Artplayer.CONTROL_HIDE_TIME = 2000;

interface Tree {
        label: string
        children?: Tree[]
}
type Data = {
        status: number,
        msg: Array<Tree>,
}
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
const videoData = myStore()
const mydata = ref()
const endFlag = ref(true)
function findPlayList() {
        for (let index = 0; index < (videoData.mydata[0] as any).children.length; index++) {
                const element = (videoData.mydata[0] as any).children[index];
                if (videoData.currentVideo == element.label) {

                        (document.querySelector("#fav") as any).style.color = "#00AEEC"
                        return
                }
        }
        (document.querySelector("#fav") as any).style.color = "#ffffff"
}

if (import.meta.env.MODE == 'development') {
        videoData.srcBaseUrl = "http://192.168.0.106:9000/"
}
else {
        videoData.srcBaseUrl = "/"
}
function preVideo() {
        // vi.value!.currentTime = 99999999
        videoEnd(-1)
}
//按键下一个视频的回调
function nextVideo() {
        videoEnd(1)
}
function endVideo() {
        if (endFlag.value) {
                nextVideo()
        } else {
                instance.value?.play()
        }
}
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
        instance.value!.url = videoData.srcBaseUrl + videoData.currentPlayList.children![videoData.index].label
}
function setCurrentPlayList(parentLabel: string, sonLabel: string) {
        let f1 = (obj: Tree[]) => {
                for (let i = 0; i < obj.length; i++) {
                        if (obj[i].children) {
                                if (obj[i].label == parentLabel) {
                                        videoData.currentPlayList = obj[i]
                                } else {
                                        f1((obj[i].children as any))
                                }
                        }
                        // if (videoData.mydata[i].label == parentLabel) {
                        //         videoData.currentPlayList = videoData.mydata[i]
                        // }
                }
        }
        f1(videoData.mydata)
        for (let i = 0; i < videoData.currentPlayList.children!.length; i++) {
                if (videoData.currentPlayList.children![i].label == sonLabel) {
                        videoData.index = i
                }
        }
}
function playListAdd() {
        console.log(videoData.mydata[0])
        findPlayList()
}
const handleClick = (f1: Tree, f2: any, f3: any, f4: any) => {
        const d = window.document.documentElement.getElementsByClassName('currentHeightLight')

        if (d.length != 0) {
                //如果有元素，就清除类名
                d[0].classList.remove('currentHeightLight')
        }
        f4.target.classList.add("currentHeightLight")
        if (f1.children == undefined) {

                instance.value!.url = videoData.srcBaseUrl + f1.label
                videoData.currentVideo = f1.label
                videoData.playListLabelList = []
                videoData.playListLabel = f1.label
                videoData.currentVideoParent = f2.parent.label as string
                setCurrentPlayList(f2.parent.label, f1.label)
                const body = JSON.stringify({
                        "label": videoData.currentVideo,
                        "labelParent": videoData.currentVideoParent,
                        "artplayer_settings": JSON.parse(localStorage.getItem("artplayer_settings") as any)
                })
                fetch(videoData.srcBaseUrl + 'api/lastVideo2', {
                        method: 'POST',
                        body: body,
                        keepalive: true,
                        headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + localStorage.getItem("token"),
                        }
                })
        } else {
                f4.target.classList.add("currentHeightLight")
                videoData.currentHeightLight = f1.label
                //设置播放列表
                videoData.playListLabelList = f1.children
                videoData.playListLabel = ''
        }

}
onMounted(async () => {
        const { data }: { data: Data } = await axios.get('/videoList')
        console.log(data)
        videoData.mydata = data.msg
        mydata.value = data.msg

        const lastVideo2 = await axios.get(videoData.srcBaseUrl + 'api/lastVideo2')
        console.log(lastVideo2)
        let last = lastVideo2.data
        if (last) {
                videoData.currentVideoParent = last.labelParent
                videoData.currentVideo = last.label
                setCurrentPlayList(last.labelParent, last.label)
        } else {

        }

        console.log(videoData.currentVideo)

        setInterval(() => {
                const body = JSON.stringify({
                        "label": videoData.currentVideo,
                        "labelParent": videoData.currentVideoParent,
                        "artplayer_settings": JSON.parse(localStorage.getItem("artplayer_settings") as any)
                })
                fetch(videoData.srcBaseUrl + 'api/lastVideo2', {
                        method: 'POST',
                        body: body,
                        keepalive: true,
                        headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + localStorage.getItem("token"),
                        }
                })
        }, 1000)

        //将当前视频文件名称设置为播放信息数据包的标签，

        //设置当前播放列表和index

        instance.value = new Artplayer({
                container: artRef.value,
                url: videoData.srcBaseUrl + last.label,
                autoSize: false,
                title: 'Name',
                hotkey: true,
                fullscreen: true,
                fullscreenWeb: true,
                autoOrientation: true,
                theme: "#00aeec",
                autoplay: true,
                // muted: true,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                setting: true,
                miniProgressBar: true,
                lock: true,
                fastForward: true,
                autoPlayback: true,
                settings: [
                        {
                                html: '播放设置',
                                width: 250,
                                tooltip: '列表循环',
                                selector: [
                                        {
                                                html: '<span style="">单曲循环</span>',

                                        },
                                        {
                                                default: true,
                                                html: '<span style="">列表循环</span>',

                                        },
                                ],
                                onSelect: function (item: { html: any; }, $dom: { innerText: string; }, event: any) {

                                        console.info(item, $dom, event);
                                        console.log($dom.innerText)
                                        if ($dom.innerText == "单曲循环") {
                                                endFlag.value = false
                                        } else if ($dom.innerText == "列表循环") {
                                                endFlag.value = true
                                        }
                                        return item.html;
                                },
                        },
                ],
                whitelist: [],
                layers: [],
                controls: [
                        {
                                name: 'next',
                                index: 10,
                                position: 'left',
                                html: `
                                <svg viewBox="0 0 22 22" style="height:22px;width:22px">
                                        <path 
                                        fill="white"
                                        d="M16 5a1 1 0 00-1 1v4.615a1.431 1.431 0 00-.615-.829L7.21 5.23A1.439 1.439 0 005 6.445v9.11a1.44 1.44 0 002.21 1.215l7.175-4.555a1.436 1.436 0 00.616-.828V16a1 1 0 002 0V6C17 5.448 16.552 5 16 5z">
                                        </path>
                                 </svg>
                        `,
                                click: () => {
                                        nextVideo()
                                }
                        },
                        {
                                name: 'pre',
                                index: 10,
                                position: 'left',
                                html: `
                                        <svg viewBox="0 0 22 22" style="transform:rotate(180deg);height:22px;width:22px">
                                                <path
                                                fill="white"
                                        d="M16 5a1 1 0 00-1 1v4.615a1.431 1.431 0 00-.615-.829L7.21 5.23A1.439 1.439 0 005 6.445v9.11a1.44 1.44 0 002.21 1.215l7.175-4.555a1.436 1.436 0 00.616-.828V16a1 1 0 002 0V6C17 5.448 16.552 5 16 5z">
                                        </path>
                                        </svg>
                        `,
                                click: () => {
                                        preVideo()
                                }
                        },
                        {
                                name: 'addPlayList',
                                index: 10,
                                position: 'right',
                                html: `<svg id="fav" style="height:22px;width:22px" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="video-fav-icon video-toolbar-item-icon" data-v-912a7b4a=""><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor"></path></svg>`,
                                click: () => {
                                        axios.post('/palyListAddList', {
                                                data: {
                                                        "label": videoData.currentVideo
                                                }
                                        }).then(async (res) => {
                                                if (res.data == "add") {
                                                        (document.querySelector("#fav") as any).style.color = "#00AEEC"
                                                } else {
                                                        (document.querySelector("#fav") as any).style.color = "#ffffff"
                                                }
                                                const { data }: { data: Data } = await axios.get('/videoList')
                                                console.log(data)
                                                videoData.mydata = data.msg
                                                mydata.value = data.msg
                                        })
                                }
                        },

                ],
        } as any)
        // instance.value.on('mousemove', (event) => {
        //         console.info('mousemove', event);
        //         instance.value.controls.toggle = true
        // })
        instance.value.on('hover', (state, event) => {
                console.info('hover', state, event);
                if (instance.value) {
                        if (state) {
                                instance.value.controls.show = true
                        } else {
                                instance.value.controls.show = false
                        }
                }
        });
        instance.value.on("video:ended", endVideo)
        instance.value.on('ready', async () => {
                findPlayList()
                const v = document.querySelector("video")
                v?.addEventListener("touchstart", (event) => {
                        event.preventDefault()
                })
        })
        instance.value.on('restart', () => {
                findPlayList()

        });
})
onBeforeUnmount(() => {
        if (instance.value) {
                instance.value.destroy(false);
        }
        const artplayer_settings = localStorage.getItem("artplayer_settings")
});
const defaultProps = {
        children: 'children',
        label: 'label',
} 
</script>
<style scoped>
.el-row,
.el-col {
        padding: 0 !important;
        margin: 0 !important;
}

.next {
        width: 22px;
        height: 22px;
}

@media screen and (min-width: 768px) {
        .el-row {
                height: 100%;
        }

        .el-col {
                height: 100%;
        }

        .c {
                height: 100%;
        }
}


@media screen and (max-width: 767px) {
        .videocontainer {
                width: 100%;
        }

        .el-scrollbar {
                width: 100%;
        }

        #app {
                display: flex;
        }

        .c {
                height: 100%;
                display: flex;
                flex-direction: column;
        }

        .hidden-sm-and-up {
                overflow: scroll;
        }
}
</style>