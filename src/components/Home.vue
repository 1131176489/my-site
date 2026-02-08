<template>
  <div style="
  height: 100%;
  width: 100%;
  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  place-content: center center;
  grid-template-rows: repeat(auto-fill,100px);
  grid-template-columns: repeat(auto-fit,100px);
  ">
    <RouterLink
        style="display:flex;justify-content: center;align-items: center;background-color: #ddd"
        :to="{name:item.componentName}"
        target="_blank"
        v-for="item in items">
      {{ item.name }}
    </RouterLink>
  </div>
  <a href="/video/index.html">新视频</a>
</template>
<script setup lang="ts">
import {RouterLink} from "vue-router";

const items = [
  {
    componentName:'FileDownLoad',
    name: "特定目录文件下载",
  },
  {
    componentName:'FileUpload',
    name: "文件上传",
  },
  {
    componentName:'VideoInfo',
    name: "视频",
  },
  {
    componentName:'WordCopy',
    name: "用户名密码",
  },
  {
    componentName:'FileViewer',
    name: "FileViewer",
  },
  {
      componentName:'FilesTransmit',
      name: "FilesTransmit",
  },
]
</script>
<style lang="scss" scoped>
.el-link {
  margin: 0 5px;
}
.container {
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  a{
    margin: 10px 0;
    width: fit-content;
    padding-right: 5px;
  }
}
</style>
