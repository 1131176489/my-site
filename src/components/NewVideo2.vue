<template>

  <div class="container">
    <div class="left">
      <div class="video-container" ref="artRef" style="aspect-ratio: 16 / 9">
      </div>
      <textarea :placeholder="placeholder" v-model="description" name="no" id="no" cols="30" rows="20"></textarea>
    </div>
    <div class="right">
      <div class="img-container" v-for="(image,index) in images">
        <img class="note-img" :src=image.url>
        <div class="description">
          {{ image.description }}
        </div>
        <div class="button-group">
          <button @click="onclickImageTimeButton(image.time)">{{ image.time }}</button>
          <button class="" @click="onEnlargeImage(image,index)">点击放大</button>
          <button class="" @click="onDeleteImage(image,index)">点击删除</button>
        </div>
        <br>
      </div>
    </div>
    <div class="overlay"  ref="overlay">
      <img :src="overlayImageUrl" class="overlay-img">
      <div class="previous" @click="onClickPrevious">上一张</div>
      <div class="next"  @click="onClickNext">下一张</div>
      <div class="closeOverlay" @click="onCloseOverlay">关闭</div>
      <div class="current-index" >{{currentIndex}}</div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {DirectoryListItem} from "../declare";


// type VideoJsonObj= {
//   videoName:string,
//   screenShot:ScreenShotInfo[]
// }
// type ScreenShotInfo= {
//   filename:string,
//   // 截取视频的时间，比如在141秒截取的截取的
//   videoShotTime:number
// }
import Artplayer from 'artplayer';

import {ref, onMounted, onBeforeUnmount, UnwrapRef} from 'vue';
import axios from "axios";
type ImageInfo = {
  url: string,
  time: number,
  description: string,
}
Artplayer.CONTROL_HIDE_TIME = 2000;
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
const images = ref<Array<ImageInfo>>([])
const videoDirectoryName = ref("")
const videoName = ref("")
const description = ref("")
const DIRECTORY = "BilibiliVideoNote"
const currentIndex = ref(0)
const SEPARATOR = "-_-"
const overlayImageUrl = ref("")
const overlay = ref<HTMLElement>()
const placeholder = ref("")
async function initArtPlayer(videoUrl: string) {
    const res = await axios.get(`/file/getFileByAbsolutePath?path=${encodeURIComponent("D:/BackUpDictionary/BilibiliBackup/video-info.json")}`);
    const json = res.data
    const artplayer_settings = {
      times:{
        [videoUrl]:json[videoUrl]
      }
    }
    localStorage.setItem("artplayer_settings",JSON.stringify(artplayer_settings))
    instance.value = new Artplayer({
    container: artRef.value,
    url: videoUrl,
    volume: 0,
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
        position: 'right', // 控件位置
        html: '<div class="custom-control">截图</div>', // 自定义 HTML
        style: {
          position: 'absolute', // 使用绝对定位
          // bottom: '10px', // 距离底部 10px
          right: '120px', // 距离左侧 10px
          color: '#fff',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        },
        click: async function () {
          if (instance.value) {
            console.log(instance.value.currentTime)
            const currentTime = instance.value.currentTime
            // 上传图片
            const blobUrl = await instance.value.getBlobUrl()
            const blobData2 = await fetch(blobUrl, {
              method: "get",
            })
            const b = await blobData2.blob()
            const data = new FormData();
            data.append("file", new File([b], "file"))
            const filename = `${videoName.value}${SEPARATOR}${parseInt(currentTime.toString())}${SEPARATOR}${description.value}.jpg`
            data.append("filename", filename)
            data.append("dest", `d:/static/${DIRECTORY}/${videoDirectoryName.value}/`)
            await fetch("/file/upload", {
              method: "post",
              body: data
            })
            images.value.push({
              url: blobUrl,
              time: parseInt(currentTime.toString()),
              description: description.value
            })
            images.value = images.value.sort((c1, c2) => {
              return parseInt(String(c1.time)) - parseInt(String(c2.time))
            })
            description.value = ""

          }
        },
      },
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
    setInterval(()=>{
      axios.get(`/file/getFileByAbsolutePath?path=${encodeURIComponent("D:/BackUpDictionary/BilibiliBackup/video-info.json")}`)
          .then(res=>{
            const json = res.data
            json[videoUrl] = instance.value!.currentTime
            window.postForm({
              dest:"D:/BackUpDictionary/BilibiliBackup",
              filename:"video-info.json",
              blob:JSON.stringify(json)
            })
          });

    },2000)
  })
  instance.value.on('restart', () => {
  });

}
onMounted(async () => {
  console.log(location.href.split("?")[1].split("=")[1])
  const path = location.href.split("?")[1].split("=")[1]

  videoDirectoryName.value = decodeURIComponent(path.split("/")[1])
  videoName.value = decodeURIComponent(path.split("/")[2].replaceAll(".mp4", ""))
  document.title = videoName.value
  placeholder.value = videoName.value
  fetch(`/file/getDirectoryList?path=BilibiliVideoNote/${videoDirectoryName.value}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        const temp = json as DirectoryListItem[]

        images.value = temp.filter(item=>{
          console.log(item)
          console.log(videoName.value)
          return item.filename.includes(videoName.value)
        }).map(item => {
          const {filename} = item
          const time = parseInt(filename.split(SEPARATOR)[1].replaceAll(".jpg", ""))
          const description = filename.split(SEPARATOR)[2].replaceAll(".jpg", "")
          const url = `/BilibiliVideoNote/${videoDirectoryName.value}/${item.filename}`
          return {
            url,
            time,
            description,
          }

        }).sort((c1, c2) => {
          return parseInt(String(c1.time)) - parseInt(String(c2.time))
        })
        console.log(images.value)
      })
  console.log(videoDirectoryName.value, videoName.value)
  initArtPlayer("/"+path)
  const pre = document.querySelector(".video-container .pre")
  const next = document.querySelector(".video-container .next")
  const html = document.documentElement
  if (html.clientWidth<450){
    pre!.parentElement!.style.display = "none"
    next!.parentElement!.style.display = "none"
  }
})
const onclickImageTimeButton = (time: number) => {
  if (instance.value) {
    instance.value.currentTime = time
  }
}
let onClickPrevious = ()=>{
  console.log(currentIndex.value)
  if (currentIndex.value===0){
    currentIndex.value = images.value.length - 1
  }else {
    currentIndex.value = currentIndex.value - 1
  }
  overlayImageUrl.value = images.value[currentIndex.value].url
};
let onClickNext = ()=>{
  const lastIndex = images.value.length - 1
  console.log(currentIndex.value)
  if (currentIndex.value===lastIndex){
    currentIndex.value = 0
  }else {
    currentIndex.value = currentIndex.value + 1
  }
  overlayImageUrl.value = images.value[currentIndex.value].url
};
const onDeleteImage = (image: ImageInfo, index: number) => {
  console.log(image)
  const path = `d:/static${image.url}`
  axios.post("/file/deleteFile", {
    path
  }).then(res => {
    images.value.splice(index, 1)
    console.log(images.value)
  })
}
const onEnlargeImage = (image: ImageInfo, index: number) => {
  currentIndex.value = index
  // 创建遮罩层
  overlayImageUrl.value = image.url
  const element = document.querySelector(".overlay") as HTMLElement;
  element.style.display = "block"
  console.log(element)
}
const onCloseOverlay = ()=>{
  overlay.value!.style.display = "none"
}



onBeforeUnmount(() => {
})

</script>
<style lang="scss" scoped>
@media screen and (min-width: 1400px){
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;

    .left {
      display: flex;
      flex-direction: column;

      .video-container {
        width: 1200px;
      }

      textarea {
        flex-grow: 1;
        font-size: 24px;
        padding: 10px;
      }
    }

    .right {
      flex-grow: 1;
      //flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background-color: #eee;
      overflow-y: scroll;

      .img-container {
        width: 100%;
        padding: 20px 0;

        .note-img {
          display: block;
          width: 100%;
        }

        .description {
          border: 1px solid black;
          margin-top: 20px;
          padding: 5px;
          width: 100%;
          word-break: break-all;
        }

        button {
          width: 100px;
          height: 50px;
          cursor: pointer;
          margin-left: 100px;
          margin-top: 20px;
        }
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
      user-select: none; /* 标准语法 */

      .overlay-img {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        height: 80%;
        transform: translate(-50%, -50%);
      }

      .previous{
        position: absolute;
        background-color: #eee;
        transform: translate(0, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 2%;
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
      .next{
        cursor: pointer;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 50%;
        transform: translate(0, -50%);
        right: 2%;
        width: 50px;
        height: 50px;
      }
      .closeOverlay{
        cursor: pointer;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 5%;
        transform: translate(0, -50%);
        right: 2%;
        width: 50px;
        height: 50px;
      }
      .current-index{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 5%;
        transform: translate(0, -50%);
        right: 50%;
        width: 50px;
        height: 50px;
      }
    }
  }
}
@media screen and (min-width: 0px ) and (max-width: 1400px) {
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #67c23a;
    .left {
      display: flex;
      flex-direction: column;
      width: 100%;
      .video-container {
        width: 100%;
        .pre,.next{
          display: none;
        }

      }

      textarea {
        background-color: #ccc;
        height: 100px;
        font-size: 24px;
        padding: 10px;
      }
    }

    .right {
      flex-grow: 1;
      //background-color: gold;
      //flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background-color: #eee;
      overflow-y: scroll;
      width: 100%;
      .img-container {
        width: 100%;
        padding: 20px;
        border-bottom: 5px solid black;
        .note-img {
          display: block;
          width: 100%;
        }

        .description {
          border: 1px solid black;
          margin-top: 20px;
          padding: 5px;
          width: 100%;
          word-break: break-all;
        }
        .button-group{
          display: flex;
          justify-content: space-between;
        }
        button {
          width: 50px;
          height: 50px;
          cursor: pointer;
          margin-top: 20px;
        }
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
      user-select: none; /* 标准语法 */

      .overlay-img {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;

      }

      .previous{
        position: absolute;
        background-color: #eee;
        transform: translate(0, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 2%;
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
      .next{
        cursor: pointer;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 50%;
        transform: translate(0, -50%);
        right: 2%;
        width: 50px;
        height: 50px;
      }
      .closeOverlay{
        cursor: pointer;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 5%;
        transform: translate(0, -50%);
        right: 2%;
        width: 50px;
        height: 50px;
      }
      .current-index{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eee;
        top: 5%;
        transform: translate(0, -50%);
        right: 50%;
        width: 50px;
        height: 50px;
      }
    }
  }
}

</style>