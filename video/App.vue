<script setup lang="ts">
import { nextTick, onMounted, ref, UnwrapRef } from "vue";
import Artplayer from "artplayer";
import {
  getDirectoryListByAbsolutePath,
  getFileByAbsolutePath,
  postForm,
  filePathToUrlPath
} from "../src/assets/utils";


type DirectoryListItem = {
  filename: string,
  isFile: boolean,
  lastModified: number,
  path: string,
  isCurrentPlay: boolean,
}
const videoPlaybackProgressUrl = "http://192.168.0.108/file/videoPlaybackProgress"
let data = ref<DirectoryListItem[]>([])
let dirPath = "D:/static/BilibiliVideo/c++"
const instance = ref<Artplayer | null>(null);
const artRef = ref(null);
Artplayer.CONTROL_HIDE_TIME = 2000;
let configJson = {
  loop: "singleLoop",
  volume: 0.1,
  lastPlay: {}
}
let reg = 0
const mapObj = {
  singleLoop: "单个循环",
  pause: "暂停",
  listLoop: "列表循环",
}
const getPlayBackId = (path: string) => {
  return "/" + path
}
const playbackFun = (id: string) => {
  const obj = {
    type: "write",
    time: instance.value.currentTime,
    id,
  }
  fetch(videoPlaybackProgressUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  })
}
const initArtPlayer = async (playVideoPath: string, playVideoUrl: string) => {
  // console.log(playVideoPath,playVideoUrl)

  const res_ = await fetch(videoPlaybackProgressUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "read",
      id: getPlayBackId(playVideoPath),
    }),
  })
  const playbackTime = parseInt(await res_.text())
  let artplayer_settings = {
    times: {
      [getPlayBackId(playVideoPath)]: playbackTime,
    },
    volume: 0.1,
  }
  localStorage.setItem(
      "artplayer_settings",
      JSON.stringify(artplayer_settings),
  )

  instance.value = new Artplayer({
    id: getPlayBackId(playVideoPath),
    container: artRef.value,
    url: playVideoUrl,
    isLive: false,
    autoSize: false,
    title: 'Name',
    hotkey: true,
    fullscreen: true,
    fullscreenWeb: true,
    autoOrientation: true,
    theme: "#00aeec",
    autoplay: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: false,
    miniProgressBar: true,
    lock: true,
    fastForward: true,
    autoPlayback: true,
    controls: [
      {
        position: 'right',
        html: mapObj[configJson.loop],
        style: {
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        selector: [
          {
            html: mapObj.pause,
            key: "pause",
          },
          {
            html: mapObj.listLoop,
            key: "listLoop",
          },
          {
            html: mapObj.singleLoop,
            key: "singleLoop",
          },
        ],
        onSelect: function (item, $dom) {
          //@ignore-ts
          configJson.loop = item.key
          saveConfigJson()
          return item.html;
        }
      },
      {
        position: 'right', // 控件位置
        html: "旋转", // 自定义 HTML
        style: {
          // position: 'absolute', // 使用绝对定位
          // right: '120px', //
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        click: () => {
          reg = reg + 90
          instance.value.video.style.transform = `rotate(${reg}deg)`

        }
      }
    ]

  }) as UnwrapRef<Artplayer>
  instance.value.on("video:ended", () => {
    if (configJson.loop === "pause") {
      instance.value.pause()
    } else if (configJson.loop === "singleLoop") {
      instance.value.play()
    } else if (configJson.loop === "singleLoop") {

    }
  })
  instance.value.on('ready', async () => {
    instance.value.volume = configJson.volume
  })
  instance.value.on('restart', () => {
  });
  instance.value.on("video:volumechange", () => {

    configJson.volume = instance.value.muted ? 0 : instance.value.volume
    saveConfigJson()
  })
  instance.value.on("video:timeupdate", () => {
    const path = new URL(instance.value.url).searchParams.get("path")
    playbackFun(getPlayBackId(playVideoPath))
  })
}


async function getConfigJson() {
  return await getFileByAbsolutePath("D:/BackUpDictionary/WebConfig.json")
}

function saveConfigJson() {
  console.log(configJson)
  postForm({
    dest: "D:/BackUpDictionary",
    filename: "WebConfig.json",
    blob: new Blob([JSON.stringify(configJson)]),
  })
}

function getVideoUrl(path: string) {
  return filePathToUrlPath(path)
}

// console.log(getCurrentPlayVideoFilePath())
async function handleOnClickTitle(item: DirectoryListItem, index: number) {
  console.log(instance.value.isDestroy)
  if (!instance.value.isDestroy) {

    instance.value.destroy(true)
  }


  console.log(item.path)
  console.log(getVideoUrl(item.path))
  await initArtPlayer(item.path, getVideoUrl(item.path))


  data.value.forEach(value => value.isCurrentPlay = false)
  data.value[index].isCurrentPlay = true
  configJson.lastPlay[dirPath] = item.path
  saveConfigJson()
}


onMounted(() => {

  (async () => {
    dirPath = new URL(location.href).search.replaceAll("?path=", "")
    // 获取目录数据文件列表
    const res = await getDirectoryListByAbsolutePath(dirPath)
    data.value = res.data.map((value, index, array) => {
      return {
        ...value,
        isCurrentPlay: false,
      }
    })
    // 获取播放器配置，比如
    const configJson_ = await getConfigJson()
    // 获取配置文件
    if (configJson_.data) {
      configJson = configJson_.data
    }
    let playVideoPath: string
    let playVideoUrl: string
    if (configJson.lastPlay[dirPath]) {

      playVideoPath = configJson.lastPlay[dirPath]
      playVideoUrl = getVideoUrl(playVideoPath)
      data.value.forEach(value => {
        value.path === configJson.lastPlay[dirPath] ? value.isCurrentPlay = true : ''
      })
      await nextTick();
      document.querySelector(".heightLight").scrollIntoView(true)
    } else {
      playVideoPath = data.value[0].path
      playVideoUrl = getVideoUrl(playVideoPath)

      data.value[0].isCurrentPlay = true
      configJson.lastPlay[dirPath] = data.value[0].path
      saveConfigJson()
    }
    await initArtPlayer(playVideoPath, playVideoUrl)
    // instance.value.switchUrl(playVideoUrl)
    // instance.value.destroy()
  })();

})

const onClickDestroy = () => {
  instance.value.destroy()
  instance.value = null
}
const reBuild = () => {
  initArtPlayer('', '')
}
const width = ref()
document.documentElement.addEventListener("resize", () => {
  width.value = document.documentElement.style.width
  console.log(111)
})
window.onresize = () => {

}
setInterval(() => {
  console.log()
  width.value = document.documentElement.clientWidth
}, 1000)
</script>

<template>
  <div class="container" style=" display: flex;   height: 100%;
    width: 100%;">

    <div id="video-player" ref="artRef">
    </div>
    <div id="list">
      <div :class="['list-item',item.isCurrentPlay?'heightLight':'']" :title="item.filename"
           v-for="(item, index) in data"
            @click="handleOnClickTitle(item,index)">
        {{ item.filename }}
      </div>
    </div>
  </div>

</template>

<style scoped>

@media screen  and (min-width: 1400px) {
  .container {

    flex-direction: row;
    #video-player {
      height: 100%;
      flex: 1 0 auto;
    }
    #list{
      flex: 0 0 auto;
      /*border: 1px solid black;*/
      height: 100%;
      width: 350px;
      padding: 5px;
      overflow-y: auto;
      .list-item{
        width: 100%;
        margin-left: 0;
        margin-bottom: 5px;
        height: 60px;
        word-break: normal;
        border: 1px solid lightskyblue;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        /*padding: 5px;*/
        cursor: pointer;
        font-size: 16px;
        transition: all 0.1s;
        line-height: 60px;
        user-select: none;
        padding-left: 5px;
      }
    }
  }
}

@media screen  and (max-width: 1400px) {
  .container {
    flex-direction: column;
    #video-player {
      width: 100%;
      flex: 1 0 auto;
      aspect-ratio: 16 / 9;
    }
    #list{
      flex: 0 1 auto;
      /*border: 1px solid black;*/
      width: 100%;
      padding: 5px;
      overflow-y: scroll;
      .list-item{
        width: 100%;
        margin-left: 0;
        margin-bottom: 5px;
        height: 60px;
        word-break: normal;
        border: 1px solid lightskyblue;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        /*padding: 5px;*/
        cursor: pointer;
        font-size: 16px;
        transition: all 0.1s;
        line-height: 60px;
        user-select: none;
        padding-left: 5px;
      }
    }
  }
}

.list-item:hover {
  background-color: rgb(160, 207, 255);
}

.heightLight {
  background-color: #67c23a;
}
</style>


<!--<script setup>-->
<!--console.log(window.api)-->
<!--window.api.onSendFileListData((value)=>{-->
<!--  console.log(value)-->
<!--})-->

<!--</script>-->
<!--<template>-->
<!--</template>-->
