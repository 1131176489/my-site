<template>
        <div class="container">
                <el-row :justify="'space-around'" :align="'top'">
                        <el-col :span="18" class="videocontainer" :xs="24">
                                <div ref="artRef" style="aspect-ratio: 16 / 9">
                                </div>
                        </el-col>
                        <el-col :span="5" class="list hidden-xs-only"
                                style="border-left: 2px gray solid;">
                                <el-scrollbar>
                                        <el-tree
                                                 v-bind:data="renderdata"
                                                 v-bind:render-after-expand=true
                                                 v-on:node-click="handleClick" />
                                </el-scrollbar>
                        </el-col>
                </el-row>
                <el-row class="hidden-sm-and-up">
                        <el-scrollbar>
                                <el-tree
                                         v-bind:data="renderdata"
                                         v-bind:render-after-expand=true
                                         v-on:node-click="handleClick" />
                        </el-scrollbar>
                </el-row>
        </div>
</template>
    
<script lang="ts" setup>
import Artplayer from 'artplayer';
import axios from 'axios';
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types';
import { ref, onMounted } from 'vue';
import { useVideoStore } from '../assets/Video'
import flvjs from "flv.js"

Artplayer.CONTROL_HIDE_TIME = 2000;
let videoData = useVideoStore()
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
const endFlag = ref(1)
let renderdata = ref()
let srcBaseUrl = ref("")
let currentVideoUrl = ref("")
let email = ref("")
let n = ref(0)
if (import.meta.env.MODE == 'development') {
        srcBaseUrl.value = "http://192.168.0.106:9000/"
}
else {
        srcBaseUrl.value = "/"
}
function playFlv(video: HTMLMediaElement, url: string, art: any) {
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
function initArtPlayer(videoUrl: string) {
        instance.value = new Artplayer({
                container: artRef.value,
                url: videoUrl,
                type: 'flv',
                customType: {
                        flv: playFlv,
                },
                volume: 0.5,
                isLive: false,
                autoSize: false,
                hotkey: true,
                fullscreen: true,
                fullscreenWeb: true,
                autoOrientation: true,
                theme: "#00aeec",
                autoplay: true,
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
                                        {

                                                html: '<span style="">播完暂停</span>',
                                        },
                                ],
                                onSelect: function (item: { html: any; }, $dom: { innerText: string; }, event: any) {

                                        console.info(item, $dom, event);
                                        console.log($dom.innerText)
                                        if ($dom.innerText == "单曲循环") {
                                                endFlag.value = 0
                                        } else if ($dom.innerText == "列表循环") {
                                                endFlag.value = 1
                                        } else if ($dom.innerText == "播完暂停") {
                                                endFlag.value = 2
                                        }
                                        return item.html;
                                },
                        },
                ],
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

                ],
        })

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
        instance.value.on("video:ended", () => {
                if (endFlag.value == 0) {
                        instance.value?.play()
                } else if (endFlag.value == 1) {
                        nextVideo()
                } else if (endFlag.value == 2) {

                }
        })
        instance.value.on('ready', async () => {
                const v = document.querySelector("video")
                v?.addEventListener("touchstart", (event) => {
                        event.preventDefault()
                })

        })
        instance.value.on('restart', () => {
        });

}

function preVideo() {

}
// //按键下一个视频的回调
function nextVideo() {

}
onMounted(async () => {
        axios.get(srcBaseUrl.value + "video/flv").then((res) => {
                let temp = []
                for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        temp.push({
                                "label": element
                        })
                }
                renderdata.value = temp
        })

})

let handleClick = (f1: any, f2: TreeNode) => {
        if (instance.value) {
                instance.value.destroy(false)
        }
        initArtPlayer(srcBaseUrl.value + f2.label)


}
</script>
<style scoped>
.el-row,
.el-col {
        padding: 0 !important;
        margin: 0 !important;
        height: 100%;
}

@media only screen and (max-width: 765px) {
        .el-row {
                height: auto;

        }

        .container {
                display: flex;
                flex-direction: column;
        }

        .hidden-sm-and-up {
                display: block;
                overflow: hidden;
                width: 100%;
        }
}

.el-row {}

.container {
        height: 100%;
}
</style>