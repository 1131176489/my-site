<template>
  <div class="container">
    <div class="list">
      <div class="list-item" v-for="item in data" @click="onClickListItem(item.path)">
        {{ item.filename }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import {getDirectoryListByAbsolutePath} from "../assets/utils";
import type {DirectoryListItem} from "../declare";

const data = ref<DirectoryListItem[]>([])
const onClickListItem = (path: string)=>{
  open(`/d/static/dist/video/index.html?path=${path}`, "_blank")
}
onMounted(()=>{
  (async ()=>{
    const res = await getDirectoryListByAbsolutePath("D:/static/BilibiliVideo")
    data.value = res.data
  })();
})
</script>
<style scoped>
@media screen and (max-width: 1400px){
  .container{
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .list{
    flex: 1;
    overflow-y: scroll;
  }
  .list-item {
    border: 2px solid black;
    font-size: 24px;
    text-align: center;
    padding: 30px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}
@media screen and (min-width: 1400px){
  .container{
    height: 100%;
  }

  .list{

    overflow-y: scroll;
  }
  .list-item {
    border: 2px solid black;
    font-size: 24px;
    text-align: center;
    padding: 30px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}

</style>