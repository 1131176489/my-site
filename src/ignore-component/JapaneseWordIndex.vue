<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import {DirectoryListItem} from "../declare";
import {useRouter} from "vue-router";
const router = useRouter()
const list = ref<DirectoryListItem[]>([])
const onClick = (item:DirectoryListItem)=>{
  router.push({
    name:"JapaneseWordDetail",
    query:{
      path:item.path
    }
  })
}
onMounted(() => {
  axios.post("/file/getDirectoryListByAbsolutePath", {
      path: "D:\\BackUpDictionary\\日语单词图片"
  }).then(res => {
    list.value = res.data
  })

})
</script>

<template>
  <div class="container">
    <div v-for="item in list" class="item" @click="onClick(item)">
      {{item.filename}}
    </div>
  </div>
</template>

<style scoped lang="scss">
.container{
  display: grid;
  padding: 10px;


  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  .item{
    height: 50px;
    border: 1px solid black;
  }
}
</style>