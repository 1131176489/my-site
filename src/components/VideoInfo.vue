<template>
  <div class="container">
    <div class="list">
      <div class="list-item" v-for="item in data" @click="onClickListItem(item.filename)">
        {{ item.filename }}
      </div>
    </div>
    <div class="files-list">
      <div class="files-list-item" v-for="item in filesList" @click="onClickFilesListItem(item.filename)">
        {{ item.filename }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
type DirectoryList = {
  isFile:boolean,
  filename:string,
  lastModified:number
}
const currentDirectoryName = ref<string>("")
const data = ref<DirectoryList[]>([])
const filesList = ref<DirectoryList[]>([])
const onClickListItem = (filename: string)=>{
  const str = `BilibiliVideo/${filename}`
  currentDirectoryName.value = str
  axios.get("/file/getDirectoryList", {
    params: {
      path:str
    }
  }).then(res => {
    filesList.value = res.data
    filesList.value = filesList.value.sort((f1,f2)=>{
      const t1 = parseInt(f1.filename.split("_")[0])
      const t2 = parseInt(f2.filename.split("_")[0])
      return t1 - t2
    })
  })
}
const onClickFilesListItem = (filename: string) => {
  open(`/#/NewVideo2?path=${currentDirectoryName.value}/${filename}`, "_blank")
}
axios.get("/file/getDirectoryList", {
  params: {
    path: "BilibiliVideo"
  }
}).then(res => {
  data.value = res.data
})
</script>


<style scoped>
@media screen and (min-width: 0px ) and (max-width: 1400px){
  .container{
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .list{
    flex: 1;
    overflow-y: scroll;
  }
  .files-list{
    flex: 1;
    overflow-y: scroll;
  }
  .list-item,.files-list-item {
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
    display: flex;
    height: 100%;
  }
  .list{
    overflow-y: scroll;
  }
  .files-list{

    flex-grow: 1;
    overflow-y: scroll;
  }
  .list-item,.files-list-item {
    border: 2px solid black;
    font-size: 24px;
    text-align: center;
    padding: 30px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}
.files-list-item{
  background-color: #eee;
}
</style>