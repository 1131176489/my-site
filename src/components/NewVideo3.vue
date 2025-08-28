<template>
  <div class="video-container" ref="artRef" style="aspect-ratio: 16 / 9">
  </div>
</template>
<script lang="ts" setup>
import Artplayer from 'artplayer';
import {ref, onMounted} from 'vue';
import {useRoute} from "vue-router";
const route =  useRoute()
Artplayer.CONTROL_HIDE_TIME = 2000;
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
const  initArtPlayer = (videoUrl: string)=> {
  console.log(videoUrl)
  instance.value = new Artplayer({
    container: artRef.value,
    url: videoUrl,
    volume: parseFloat(localStorage.getItem("volume") as string),
    isLive: false,
    autoSize: false,
    title: 'Name',
    hotkey: true,
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
    controls: [
      {
        position: 'left', // 控件位置
        html: '<div class="pre">退后</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          left: '180px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',

        },
        click: async function () {
          instance.value!.currentTime = instance.value!.currentTime - 2
        },
      },
      {
        position: 'left', // 控件位置
        html: '<div class="next">前进</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          left: '240px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        click: async function () {
          instance.value!.currentTime = instance.value!.currentTime + 2
        },
      },
    ],
  })
  instance.value.on("video:ended", () => {
  })
  instance.value.on('ready', async () => {
  })
  instance.value.on('restart', () => {
  });
  instance.value.on("video:volumechange",()=>{
    localStorage.setItem("volume",instance.value!.volume + "")
  })
}
onMounted(async () => {
  const path = location.href.split("=")[1]
  console.log(path)
  initArtPlayer("/file/getFileByAbsolutePath?path="+path)
})

</script>
<style lang="scss" scoped>
  .video-container {

    height: 100%;
    width: 100%;

  }
//@media screen and (min-width: 1400px){
//  .container {
//    display: flex;
//    flex-direction: row;
//    height: 100%;
//
//  }
//}
//@media screen and (min-width: 0px ) and (max-width: 1400px) {
//  .container {
//    display: flex;
//    flex-direction: column;
//    height: 100%;
//  }
//}

</style>