<template>
  <div class="container">
    <div v-for="item in renderData" class="item">
      <div v-if="item.isFile" class="file content" @click="onClickFile(item.path)">
        {{ item.filename }}
      </div>
      <div class="content directory" v-else @click="onClickDirectory(<string>item.path)">
        {{ item.filename }}
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible" title="选择一个选项" width="500">
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
import {h, ref} from 'vue';
import {DirectoryListItem} from "../declare";
import {ElOption, ElSelect} from "element-plus";

const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '80px'

const form = ref({
  selected: '',
})
let currentPath = ""
const testData: DirectoryListItem[] = (() => {
  const temp: DirectoryListItem[] = []
  for (let i = 0; i < 100; i++) {
    let filename;
    let isFile;
    let lastModified;
    if (i % 2 === 0) {
      filename = `这是文件_${i}.txt`
      isFile = true
      lastModified = Date.now() + i
    } else {
      filename = `这是目录_${i}`
      isFile = false
      lastModified = Date.now() + i
    }
    const item: DirectoryListItem = {
      filename,
      isFile,
      lastModified,
    }
    temp.push(item)
  }

  return temp
})()
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
let currentStack: string[] = []
let renderData = ref<DirectoryListItem[]>(initData)
const value = ref('')
const onClickDirectory = async (path: string) => {
  let res;
  if (path === "") {
    currentStack.pop()
    const tempPath = currentStack.at(-1)
    if (tempPath === undefined) {
      renderData.value = initData
      return
    } else {
      res = await axios.get("/file/getDirectoryListByAbsolutePath", {params: {path: tempPath}})
    }
  } else {
    currentStack.push(path)
    res = await axios.get("/file/getDirectoryListByAbsolutePath", {params: {path: path}})

  }
  renderData.value = res.data
  renderData.value = renderData.value.sort((s1, s2) => {
    if (s1.isFile === s2.isFile) {
      return 0
    } else {
      return s1.isFile ? 1 : -1
    }
  })
  renderData.value.unshift({
    isFile: false,
    filename: "...",
    lastModified: 0,
    path: ""
  })
}
const onClickFile = async (path: string |undefined) => {
  dialogFormVisible.value = true
  currentPath = path as string
  console.log(currentPath)
}
const onClickFileConfirm = async () => {
  dialogFormVisible.value = false
  console.log(form.value)
  if (form.value.selected === 'download') {
    const container = document.querySelector("html")
    const htmlAnchorElement = document.createElement("a");
    htmlAnchorElement.href = encodeURI(`/file/getFileByAbsolutePath?path=${currentPath}`)
    htmlAnchorElement.download = currentPath.split("/").at(-1) as string
    container!.appendChild(htmlAnchorElement)
    htmlAnchorElement.click()
  } else if (form.value.selected === 'openVideo') {
    location.assign(`/#/NewVideo2?path=${currentPath}`)
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  display: grid;
  //grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;

  .item {
    height: 100px;
    border: 1px solid black;

    .content {
      width: 100%;
      height: 100%;
      cursor: pointer;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }

}
.el-calendar-day{
  height: 65px !important;
}
</style>