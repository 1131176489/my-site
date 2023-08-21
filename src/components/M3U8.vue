<template>
        <div class="c">
                <el-row>
                        <el-col :span="20" class="videocontainer" :xs="24">
                                <div ref="artRef" style="aspect-ratio: 16 / 9">
                                </div>
                        </el-col>
                        <!-- <el-col :span="4" class="list hidden-xs-only">
                                <el-scrollbar>
                                        <el-tree
                                                 v-bind:data="mydata"
                                                 v-bind:render-after-expand=true
                                                 v-bind:props="defaultProps"
                                                 v-on:node-click="handleClick" />
                                </el-scrollbar>
                        </el-col> -->
                </el-row>
                <!-- <el-row class="hidden-sm-and-up">
                        <el-scrollbar>
                                <el-tree
                                         v-bind:data="mydata"
                                         v-bind:render-after-expand=true
                                         v-bind:props="defaultProps"
                                         v-on:node-click="handleClick" />
                        </el-scrollbar>
                </el-row> -->
        </div>
</template>
    
<script lang="ts" setup>
import Artplayer from 'artplayer';
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import flvjs from "flv.js"
import Hls from "hls.js"

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
const endFlag = ref(true)
let srcBaseUrl = ref("")
if (import.meta.env.MODE == 'development') {
        srcBaseUrl.value = "http://192.168.0.106:9000/"
}
else {
        srcBaseUrl.value = "/"
}

function playFlv(video: any, url: any, art: any) {
        if (flvjs.isSupported()) {
                if (art.flv) art.flv.destroy();
                const flv = flvjs.createPlayer({ type: 'flv', url });
                flv.attachMediaElement(video);
                flv.load();
                art.flv = flv;
                art.on('destroy', () => flv.destroy());
        } else {
                art.notice.show = 'Unsupported playback format: flv';
        }
}
function playM3u8(video: any, url: string, art: any) {
        if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.on('destroy', () => hls.destroy());
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
        } else {
                art.notice.show = 'Unsupported playback format: m3u8';
        }
}
onMounted(async () => {
        axios.get("/video/getInfo").then((res) => {
                console.log(srcBaseUrl.value)
                // instance.value!.url =srcBaseUrl.value+res.data + "/"+  location.href.split("?")[1].split("=")[1]
                instance.value = new Artplayer({
                        container: artRef.value,
                        // url: videoData.srcBaseUrl + last.label,
                        // url: srcBaseUrl.value + "1131176489@qq.com\\催眠\\" + "糖韵Yui（助眠）-2023年07月31日00时00分00秒.mp4",
                        // url:srcBaseUrl.value +"1131176489@qq.com\\m3u8\\音乐\\《暗恋过结局呢》/" + "playlist.m3u8",
                        url: srcBaseUrl.value + "playlist.m3u8",
                        autoSize: false,
                        title: 'Name',
                        hotkey: true,
                        type: 'm3u8',
                        customType: {
                                m3u8: playM3u8,
                        },
                        fullscreen: true,
                        fullscreenWeb: true,
                        autoOrientation: true,
                        theme: "#00aeec",
                        autoplay: false,
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
                                                // nextVideo()
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
                                                // preVideo()
                                        }
                                },
                                // {
                                //         name: 'addPlayList',
                                //         index: 10,
                                //         position: 'right',
                                //         html: `<svg id="fav" style="height:22px;width:22px" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="video-fav-icon video-toolbar-item-icon" data-v-912a7b4a=""><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor"></path></svg>`,
                                //         click: () => {
                                //                 // axios.post('/palyListAddList', {
                                //                 //         data: {
                                //                 //                 "label": videoData.currentVideo
                                //                 //         }
                                //                 // }).then(async (res) => {
                                //                 //         if (res.data == "add") {
                                //                 //                 (document.querySelector("#fav") as any).style.color = "#00AEEC"
                                //                 //         } else {
                                //                 //                 (document.querySelector("#fav") as any).style.color = "#ffffff"
                                //                 //         }
                                //                 //         const { data }: { data: Data } = await axios.get('/videoList')
                                //                 //         console.log(data)
                                //                 //         videoData.mydata = data.msg
                                //                 //         mydata.value = data.msg
                                //                 // })
                                //         }
                                // },

                        ],
                } )
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
                // instance.value.on("video:ended", endVideo)
                instance.value.on('ready', async () => {
                        // findPlayList()
                        console.log(123156165)

                        const v = document.querySelector("video")
                        v?.addEventListener("touchstart", (event) => {
                                event.preventDefault()
                        })
                })
                instance.value.on('restart', () => {
                        // findPlayList()
                });

        })

        // instance.value.on('mousemove', (event) => {
        //         console.info('mousemove', event);
        //         instance.value.controls.toggle = true
        // })

})
onBeforeUnmount(() => {
        if (instance.value) {
                instance.value.destroy(false);
        }
        // const artplayer_settings = localStorage.getItem("artplayer_settings")
});

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
</style>