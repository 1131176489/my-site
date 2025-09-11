<template>
  <div class="container">
    <span>
      按名字
    </span>
    <span>
      按文件类型
    </span>
    <span @click="">
      修改时间
    </span>
  </div>
  <div class="container">
    <div v-for="item in renderData" class="item" @click="onClickDiv(item.isFile,item.path)">
      <div v-if="item.isFile" class="file content" @click="onClickFile(item.path)">
        <span>{{ item.filename }}</span>
        <img :src="`/file/getThumbnail?path=${encodeURIComponent(item.path)}`" alt="">
      </div>
      <div class="content directory" v-else @click="onClickDirectory(<string>item.path)">
        {{ item.filename }}
      </div>
    </div>
  </div>
  <el-dialog class="dialog" v-model="dialogFormVisible" title="选择一个选项" width="300">
    <el-form :model="form">
      <el-form-item label="选项" :label-width="formLabelWidth">
        <el-select v-model="form.selected" placeholder="请选择">
          <el-option label="打开视频" value="openVideo"/>
          <el-option label="下载" value="download"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickFileConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import {onMounted, onUnmounted, ref} from 'vue';
import {DirectoryListItem} from "../declare";
import {ElOption, ElSelect} from "element-plus";
import {useRouter, useRoute} from "vue-router";

const route = useRoute()
const dialogFormVisible = ref(false)
const formLabelWidth = '80px'

const form = ref({
  selected: '',
})
let currentPath = ""
const initData = [
  {
    isFile: false,
    filename: "C盘",
    lastModified: 0,
    path: "c:/"
  },
  {
    isFile: false,
    filename: "D盘",
    lastModified: 0,
    path: "d:/"
  },
  {
    isFile: false,
    filename: "E盘",
    lastModified: 0,
    path: "e:/"
  },
  {
    isFile: false,
    filename: "G盘",
    lastModified: 0,
    path: "g:/"
  },
]
let renderData = ref<DirectoryListItem[]>(initData)
const onHashchange = async () => {
  console.log("测试", route.query)
  const path = route.query.path
  console.log(path)
  if (path) {
    let res = await axios.post("/file/getDirectoryListByAbsolutePath", {
        path
    })
    renderData.value = res.data
    const filesArray :DirectoryListItem[]= []
    const directoryArray:DirectoryListItem[]=  []
    renderData.value.forEach((value, index, array)=>{
      if (value.isFile){
        filesArray.push(value)
      }else {
        directoryArray.push(value)
      }
    })
    filesArray.sort((s1,s2)=>{
      return s2.lastModified - s1.lastModified
    })
    directoryArray.sort((s1,s2)=>{
      return s2.lastModified - s1.lastModified
    })
    renderData.value = [...filesArray,...directoryArray]
  } else {
    renderData.value = initData
  }
}
onMounted(async () => {
  window.addEventListener('hashchange', onHashchange);
  console.log(route.query)
  await onHashchange()
})
onUnmounted(() => {
  window.removeEventListener('hashchange', onHashchange);
});
const onClickDirectory = async (path: string) => {
  location.href = "/#/FileViewer?path=" + encodeURIComponent(path)
}
const onClickFile = async (path: string | undefined) => {
  dialogFormVisible.value = true
  currentPath = path as string
  console.log(currentPath)
}

const onClickDiv = async (isFile: boolean, path: string | undefined) => {
  if (isFile) {
    onClickFile(path)
  } else {
    // @ts-ignore
    onClickDirectory(path)
  }
}
const onClickFileConfirm = async () => {
  dialogFormVisible.value = false
  console.log(form.value)
  if (form.value.selected === 'download') {
    const container = document.querySelector("html")
    const htmlAnchorElement = document.createElement("a");
    htmlAnchorElement.href = (`/file/getFileByAbsolutePath?path=${encodeURIComponent(currentPath)}`)
    console.log(htmlAnchorElement.href)
    htmlAnchorElement.download = currentPath.split("/").at(-1) as string
    container!.appendChild(htmlAnchorElement)
    htmlAnchorElement.click()
  } else if (form.value.selected === 'openVideo') {
    window.open(`/#/NewVideo3?path=${encodeURIComponent(currentPath)}`)
  }
}

</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  display: grid;
  //grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  .item {
    height: 200px;
    border: 1px solid black;
    cursor: pointer;

    .content {
      position: relative;
      font-size: 20px;
      font-weight: bolder;
      word-break: break-all;
      //height: 200px;
      //line-height: 200px;
      //display: flex;
      //justify-content: center;
      //align-items: center;
      span {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis; /* 显示省略号 */
      }

      img {
        max-height: 100%; /* 图片最大宽度不超过容器 */
        max-width: 100%; /* 图片最大宽度不超过容器 */

        height: auto; /* 高度自动调整，保持宽高比 */
        width: auto; /* 高度自动调整，保持宽高比 */
        display: block; /* 避免图片下方的空白间隙 */
      }
    }
  }

}

.el-calendar-day {
  height: 65px !important;
}
</style>