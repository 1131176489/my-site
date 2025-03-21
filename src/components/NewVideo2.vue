<template>

  <div class="container">
    <div class="left">
      <div class="video-container" ref="artRef" style="aspect-ratio: 16 / 9">
      </div>
      <textarea v-model="description" name="no" id="no" cols="30" rows="20"></textarea>
    </div>
    <div class="right">
      <div class="img-container" v-for="(image,index) in images">
        <img class="note-img" :src=image.url>
        <div class="description">
          {{ image.description }}
        </div>
        <button @click="onclickImageTimeButton(image.time)">{{ image.time }}</button>
        <button class="" @click="onEnlargeImage(image,index)">点击放大</button>
        <button class="" @click="onDeleteImage(image,index)">点击删除</button>
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
import {DirectoryListItem, MyResponse} from "../declare";

type ImageInfo = {
  url: string,
  time: number,
  description: string,
}
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

Artplayer.CONTROL_HIDE_TIME = 2000;
const instance = ref<Artplayer | null>(null);
const artRef = ref("artRef");
const srcBaseUrl = ref("")
const images = ref<Array<ImageInfo>>([])
const videoDirectoryName = ref("")
const videoName = ref("")
const description = ref("")
const DIRECTORY = "BilibiliVideoNote"
const currentIndex = ref(0)
const SEPARATOR = "-_-"
const overlayImageUrl = ref("")
const overlay = ref<HTMLElement>()

function initArtPlayer(videoUrl: string) {

  instance.value = new Artplayer({
    container: artRef.value,
    url: srcBaseUrl.value + videoUrl,
    volume: 0.5,
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
            await fetch("file/upload", {
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
    ],
  })
  instance.value.on("video:ended", () => {
  })
  instance.value.on('ready', async () => {
  })
  instance.value.on('restart', () => {
  });

}

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
  //  window.closeOverlay = ()=> {
  //   const overlay = document.querySelector('.overlay');
  //   if (overlay) {
  //     document.body.removeChild(overlay);
  //   }
  // }
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


onMounted(async () => {
  console.log(location.href.split("?")[1].split("=")[1])
  const path = location.href.split("?")[1].split("=")[1]

  videoDirectoryName.value = decodeURIComponent(path.split("/")[1])
  videoName.value = decodeURIComponent(path.split("/")[2].replaceAll(".mp4", ""))


  fetch(`/file/getDirectoryList?path=BilibiliVideoNote/${videoDirectoryName.value}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        const temp = json as DirectoryListItem[]

        images.value = temp.filter(item=>{
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
      })
  console.log(videoDirectoryName.value, videoName.value)
  initArtPlayer(path)
})
onBeforeUnmount(() => {
})
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100%;

  .left {
    display: flex;
    flex-direction: column;

    .video-container {
      width: 100%;
      height: 675px;
    }

    textarea {
      flex-grow: 1;
      font-size: 24px;
      padding: 10px;
    }
  }

  .right {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background-color: #eee;
    overflow-y: scroll;

    .img-container {
      width: 480px;
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


//body {
//  position: relative;
//}


</style>