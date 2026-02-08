<template>
  <div class="video-container" ref="artRef" style="aspect-ratio: 16 / 9">
  </div>
</template>
<script lang="ts" setup>
import Artplayer from 'artplayer';
import {ref, onMounted, onUnmounted} from 'vue';
import {useRoute} from "vue-router";
import moment from "moment";
import {postForm} from "../assets/utils";
import {ElMessage} from "element-plus";

const settingsName = "my_artplayer_settings"
let my_artplayer_settings = JSON.parse(localStorage.getItem(settingsName))
if (my_artplayer_settings === null) {
  my_artplayer_settings = {
    "播放设置": "单集循环",
    volume: 0
  }
}
const modify_my_artplayer_settings = (key: string, value: any) => {
  my_artplayer_settings[key] = value
  localStorage.setItem(settingsName, JSON.stringify(my_artplayer_settings))
}
const route = useRoute()
Artplayer.CONTROL_HIDE_TIME = 2000;
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
console.log(my_artplayer_settings)
const initArtPlayer = (videoUrl: string) => {
  console.log(videoUrl)
  instance.value = new Artplayer({
    container: artRef.value,
    url: videoUrl,
    isLive: false,
    autoSize: false,

    hotkey: true,
    fullscreen: true,
    fullscreenWeb: true,
    autoOrientation: true,
    theme: "#00aeec",
    autoplay: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: false,
    miniProgressBar: true,
    lock: true,
    fastForward: true,
    autoPlayback: true,
    layers: [
      {
        name: 'title',
        html: `<div >标题</div>`,
        disable:false,
        style: {
          position: 'absolute',
          top: '50px',
          right: '50px',
          color: 'black',
          fontSize: "24px",
        },
        click: function (...args) {
          console.info('click', args);
        },
        mounted: function (...args) {
          console.info('mounted', args);
        },
      },
    ],
    controls: [
      {
        position: 'left', // 控件位置
        html: '<div class="pre">退后</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          left: '170px', // 距离左侧 10px
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
          left: '220px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        click: async function () {
          instance.value!.currentTime = instance.value!.currentTime + 2
        },
      },
      {
        position: 'left', // 控件位置
        html: '<div class="pre">-</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          left: '270px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',

        },
        click: async function () {
          instance.value!.volume = instance.value!.volume - 0.1
        },
      },
      {
        position: 'left', // 控件位置
        html: '<div class="next">+</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          left: '310px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        click: async function () {
          instance.value!.volume = instance.value!.volume + 0.1
        },
      },
      {
        position: 'right', // 控件位置
        html: my_artplayer_settings["播放设置"]?my_artplayer_settings["播放设置"]:"播完暂停", // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          right: '80px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        selector: [
          {
            html: '播完暂停',
          },
          {
            html: '单集循环',
          },
        ],
        onSelect: function (item, $dom) {
          modify_my_artplayer_settings("播放设置", item.html as string)
          return item.html;
        },
      },
      {
        position: 'right', // 控件位置
        html: my_artplayer_settings["倍速"]?my_artplayer_settings["倍速"]:"1 倍速", // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          right: '160px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        selector: [
          {
            html: '2 倍速',
          },
          {
            html: '1.75 倍速',
          },
          {
            html: '1.5 倍速',
          },
          {
            html: '1.25 倍速',
          },
          {
            html: '1 倍速',
          },
        ],
        onSelect: function (item, $dom) {
          modify_my_artplayer_settings("倍速", item.html as string)
          instance.value.playbackRate = parseFloat(my_artplayer_settings["倍速"].replace(" 倍速"))
          return item.html;
        },
      },
    ],

  })
  instance.value.on("video:ended", () => {
    if (my_artplayer_settings["播放设置"] === "播完暂停") {
      instance.value.pause()
    } else if (my_artplayer_settings["播放设置"] === "单集循环") {
      instance.value.play()
    }
  })
  instance.value.on('ready', async () => {
    instance.value.volume = my_artplayer_settings.volume
    instance.value.playbackRate = parseFloat(my_artplayer_settings["倍速"].replace(" 倍速"))
  })
  instance.value.on('restart', () => {
  });
  instance.value.on("video:volumechange", () => {
    const effectiveVolume = instance.value.muted ? 0 : instance.value.volume;
    modify_my_artplayer_settings("volume",effectiveVolume)
  })
}
onMounted( () => {
  const path = location.href.split("=")[1]
  console.log(path)
  initArtPlayer("/file/getFileByAbsolutePath?path=" + path)

  window.addEventListener('pagehide', ()=>{
    navigator.sendBeacon("/file/progress",JSON.stringify({
      key:moment().format("hh_mm_ss"),
    }))
  })
})
onUnmounted(()=>{
})
</script>
<style lang="scss" scoped>
.video-container {

  //height: 100%;
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