<template>
  <div class="container">
    <el-link v-for="(item, index ) in items" type="primary" v-bind:href="item.href" target="_blank">{{ item.name }}
    </el-link>
  </div>
</template>
<script setup lang="ts">
const items = [
  {
    name: "日历",
    href: "/#/Calendar"
  },
  {
    name: "文件下载",
    href: "/#/FileDownLoad"
  },
  {
    name: "视频",
    href: "/#/VideoInfo"
  }
]
</script>
<style scoped>
.el-link {
  margin: 0 5px;
}
.container {
  padding: 5px;
}
</style>
