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
              v-on:node-click="handleClick"/>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-row class="hidden-sm-and-up">
      <el-scrollbar>
        <el-tree
            v-bind:data="renderdata"
            v-bind:render-after-expand=true
            v-on:node-click="handleClick"/>
      </el-scrollbar>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import Artplayer from 'artplayer';
import axios from 'axios';
import type {TreeNode} from 'element-plus/es/components/tree-v2/src/types';
import {ref, onMounted, onBeforeUnmount, nextTick, watchEffect} from 'vue';
import {useVideoStore} from '../assets/Video'
import Hls from "hls.js"

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
let title = ref()

interface currentVideoInfo {
  currentVideoPath: string,
  currentVideoList: string,
  currentVideoTime: number,
}

if (import.meta.env.MODE == 'development') {
  srcBaseUrl.value = "http://192.168.0.106:9000/"
} else {
  srcBaseUrl.value = "/"
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

function initArtPlayer(videoUrl: string, email: string, time: number) {
  console.log(videoUrl)
  localStorage.setItem("artplayer_settings", `{"times":{"/${email}${videoData.currentVideoPath}":${time}}}`)
  instance.value = new Artplayer({
    container: artRef.value,
    url: videoUrl,

    id: `/${email}${videoData.currentVideoPath}`,
    type: 'm3u8',
    customType: {
      m3u8: playM3u8,
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
    layers: [
      {
        name: 'potser',
        html: `<span id="videoTitle">${videoData.currentVideoPath}</span>`,
        tooltip: 'Potser Tip',
        style: {
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: "black",
        },
      },
    ],
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
  })
  // instance.value.on('mousemove', (event) => {
  //         console.info('mousemove', event);
  //         instance.value.controls.toggle = true
  // })
  instance.value.on('hover', (state, event) => {
    console.info('hover', state, event);
    if (instance.value) {
      if (state) {
        instance.value.controls.show = true
        title.value.style.display = ""
      } else {
        instance.value.controls.show = false
        title.value.style.display = "none"
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
    title.value = document.querySelector("#videoTitle")
    v?.addEventListener("touchstart", (event) => {
      event.preventDefault()
    })
    n.value = setInterval(() => {
      sendVideoInfo()
    }, 2000)
  })
  instance.value.on('restart', () => {
  });

}

function sendVideoInfo() {
  console.log(videoData.currentVideoList)
  fetch(srcBaseUrl.value + "video/videoInfo", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      currentVideoInfo: {
        currentVideoPath: videoData.currentVideoPath,
        currentVideoList: videoData.currentVideoList || "",
        currentVideoTime: instance.value?.currentTime,
      }
    }),
  })
}

function preVideo() {
  let filename = videoData.currentVideoPath.split("/").slice(-1)[0]
  for (let index = 0; index < renderdata.value.length; index++) {
    const element = renderdata.value[index];
    if (element.label == filename) {
      let label: string
      if (index == 0) {
        console.log(renderdata.value[renderdata.value.length - 1])
        label = renderdata.value[renderdata.value.length - 1].label
      } else {
        label = renderdata.value[index - 1].label
      }
      let temp = videoData.currentVideoPath.split("/")
      temp.pop()
      axios.get("/video/getInfo").then((res) => {
        if (instance.value) {
          instance.value.destroy(false)
          clearInterval(n.value)
        }
        currentVideoUrl.value = (`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + label}/playlist.m3u8`)
        videoData.currentVideoPath = temp.join("/") + "/" + label
        axios.get("/video/videoTime", {
          params: {
            p: videoData.currentVideoPath
          }
        }).then((res_time) => {

          initArtPlayer((`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + label}/playlist.m3u8`), email.value, res_time.data)

        })
      })
    }
  }
}

// //按键下一个视频的回调
function nextVideo() {
  let filename = videoData.currentVideoPath.split("/").slice(-1)[0]
  for (let index = 0; index < renderdata.value.length; index++) {
    const element = renderdata.value[index];
    if (element.label == filename) {
      let label: string
      if (index == renderdata.value.length - 1) {
        // console.log(renderdata.value[renderdata.value.length - 1])
        label = renderdata.value[0].label
      } else {
        label = renderdata.value[index + 1].label
      }
      let temp = videoData.currentVideoPath.split("/")
      temp.pop()
      axios.get("/video/getInfo").then((res) => {
        if (instance.value) {
          instance.value.destroy(false)
          clearInterval(n.value)
        }
        currentVideoUrl.value = (`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + label}/playlist.m3u8`)
        videoData.currentVideoPath = temp.join("/") + "/" + label
        axios.get("/video/videoTime", {
          params: {
            p: videoData.currentVideoPath
          }
        }).then((res_time) => {
          initArtPlayer((`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + label}/playlist.m3u8`), email.value, res_time.data)

        })
      })
    }
  }
}

onMounted(async () => {
  axios.get("/video/getInfo").then((user_email) => {
    email.value = user_email.data
    videoData.currentVideoList = localStorage.getItem("currentVideoList")
    videoData.currentVideoPath = localStorage.getItem("currentVideoPath") as any
    if (videoData.currentVideoList && videoData.currentVideoPath) {
      console.log(videoData.currentVideoList, videoData.currentVideoPath)
      localStorage.removeItem("currentVideoList")
      localStorage.removeItem("currentVideoPath")

      axios.get("/video/VideoDataM3U8", {
        params: {
          p: videoData.currentVideoList
        }
      }).then((res) => {
        let temp = []
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index] as string;
          temp.push({label: element.replace(".jpg", "")})
        }
        // temp.push({ label: "" })
        renderdata.value = temp
      })
      axios.get("/video/videoTime", {
        params: {
          p: videoData.currentVideoPath
        }
      }).then((res_time) => {
        initArtPlayer((`${srcBaseUrl.value}${user_email.data}/videodata/M3U8${videoData.currentVideoPath}/playlist.m3u8`), email.value, res_time.data)

      })
    } else {
      axios.get(srcBaseUrl.value + "video/videoInfo").then((res) => {
        let currentVideoInfo: currentVideoInfo = res.data
        videoData.currentVideoList = currentVideoInfo.currentVideoList
        videoData.currentVideoPath = currentVideoInfo.currentVideoPath
        currentVideoUrl.value = (`${srcBaseUrl.value}${user_email.data}/videodata/M3U8${videoData.currentVideoPath}/playlist.m3u8`)
        axios.get("/video/VideoDataM3U8", {
          params: {
            p: videoData.currentVideoList
          }
        }).then((res) => {
          let temp = []
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index] as string;
            temp.push({label: element.replace(".jpg", "")})
          }
          // temp.push({ label: "" })
          renderdata.value = temp
        })
        initArtPlayer(currentVideoUrl.value, email.value, currentVideoInfo.currentVideoTime)
      })
    }


  })
})
onBeforeUnmount(() => {
  if (instance.value) {
    instance.value.destroy(false);
    clearInterval(n.value)
  }
})
let handleClick = (f1: any, f2: TreeNode) => {
  let temp = videoData.currentVideoPath.split("/")
  temp.pop()
  axios.get("/video/getInfo").then((res) => {
    if (instance.value) {
      instance.value.destroy(false)
      clearInterval(n.value)
    }
    currentVideoUrl.value = (`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + f2.label}/playlist.m3u8`)
    videoData.currentVideoPath = temp.join("/") + "/" + f2.label
    axios.get("/video/videoTime", {
      params: {
        p: videoData.currentVideoPath
      }
    }).then((res_time) => {
      initArtPlayer((`${srcBaseUrl.value}${res.data}/videodata/M3U8${temp.join("/") + "/" + f2.label}/playlist.m3u8`), email.value, res_time.data)
    })
  })
}
</script>
<style scoped>
.container {
  height: 100%;
}
</style>