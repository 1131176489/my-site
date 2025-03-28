<template>
  <div class="container">
    <div v-for="item in renderData" class="item">
      <a :href="'/file/getFileByAbsolutePath?path='+item.path"
         v-if="item.isFile" class="file content"
               :download="item.filename">
        {{ item.filename }}
      </a>
      <div class="content directory" v-else @click="onClickDirectory(<string>item.path)">
        {{ item.filename }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import {ref} from 'vue';
import {DirectoryListItem} from "../declare";

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
]
let currentStack: string[] = []
let renderData = ref<DirectoryListItem[]>(initData)
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
      text-overflow: ellipsis;  /* 显示省略号 */
    }
  }
}

</style>