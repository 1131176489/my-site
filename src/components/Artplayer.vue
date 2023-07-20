<template>
        
</template>
<script setup lang="ts">
import Artplayer from 'artplayer';
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue';
import { myStore } from '../assets/Video'
const videoData = myStore()
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
watchEffect(() => {
        if (instance.value) {
                instance.value!.url = videoData.url
        }
})
onMounted(() => {
        instance.value = new Artplayer({
                container: artRef.value,
                url: 'http://192.168.0.106:9000/伪恋04动漫_手机乐视视频.mp4',
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
                screenshot: true,
                setting: true,
                miniProgressBar: true,
                lock: true,
                fastForward: true,
                autoPlayback: true,
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

                                }
                        },
                ],
        } as any);
        instance.value.on("video:ended", () => {

        })
        instance.value.on('ready', async () => {
                const v = document.querySelector("video")
                v?.addEventListener("touchstart", (event) => {
                        event.preventDefault()
                })
        });
});
onBeforeUnmount(() => {
        if (instance.value) {
                instance.value.destroy(false);
        }
});
</script>
