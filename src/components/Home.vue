<template>
  <div class="container">
    <RouterLink
        :to="{name:item.componentName}"
        target="_blank"
        v-for="item in items">
      {{ item.name }}
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import {RouterLink} from "vue-router";

const items = [
  {
    componentName:'Calendar',
    name: "日历",
  },
  {
    componentName:'FileDownLoad',
    name: "文件下载",
  },
  {
    componentName:'VideoInfo',
    name: "视频",
  },
  {
    componentName:'SelectDirectory',
    name: "选择文件夹",
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

  justify-content: start;
  a{
    width: fit-content;
    padding-right: 5px;
  }
}
</style>
