<script setup lang="ts">
import {useRoute} from "vue-router";
import axios from "axios";
import {EVERY_DAY_PATH} from "../assets/CONSTANT";
const route = useRoute();
const path ="/file/getFileByAbsolutePath?path="+encodeURIComponent(route.query.path as string)
axios.get("/file/getFileByAbsolutePath",{
  params: {
    path: route.query.path
  },
})
</script>

<template>
<div class="container">
  <img :src=path>
</div>
</template>

<style scoped>
.container{
  width: 100%;
  height: 100%;
}
@media screen and (min-width: 0px ) and (max-width: 1400px){

  img{
    width: 100%;
  }
}
@media screen and  (min-width: 1401px){
  .container{
    display: flex;
    justify-content: center;
    align-items: start;
  }
  img{
    width: 40%;
  }
}

</style>