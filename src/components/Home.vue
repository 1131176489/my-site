<template>
  <div class="container">
    <a v-for="(item, index ) in items" type="primary" v-bind:href="item.href" target="_blank">{{ item.name }}
    </a>
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
