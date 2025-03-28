<template>
  <div id="container">
    <div v-for="item in renderData" class="item">
      <el-link :href="'/files/'+item.filename" download>
        {{ item.filename }}
      </el-link>

    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {onMounted, ref} from 'vue';
import {DirectoryListItem, MyResponse} from "../declare";

let srcBaseUrl = ref("")
let renderData = ref<DirectoryListItem[]>([])
// if (import.meta.env.MODE == 'development') {
//   srcBaseUrl.value = "http://localhost/"
// }
// else {
//   srcBaseUrl.value = "/"
// }
onMounted(() => {
  axios.get("/file/getDirectoryList",{
    params:{
      path:"files"
    }
  }).then((res) => {
    renderData.value = res.data
    renderData.value = renderData.value.filter(item=>item.isFile)
  })
})

</script>
<style scoped>
#container {
  display: flex;
  flex-direction: column;

}

.item {
  align-self: center;
  margin: 22px;
  /* border: 1px solid black; */
}
</style>