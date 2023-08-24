<template>
        <div ref="artRef" style="aspect-ratio: 16 / 9" id="videoContainer1">
        </div>
        <button v-on:click="instance.destroy(false)">
                销毁
        </button>
        <button v-on:click="new1">
                新建
        </button>
</template>
    
<script lang="ts" setup>
import Artplayer from 'artplayer';
import { onMounted, ref } from 'vue';
let instance: Artplayer;
const artRef = ref("artRef")
let new1 = () => {
        instance.play()
        // instance.value = new Artplayer({
        //         url: "http://localhost:9000/1131176489@qq.com/videodata/NonM3U8/%E5%91%A8%E6%9D%B0%E4%BC%A6%E6%AD%8C%E6%9B%B2%E5%85%A8%E9%9B%86/003%20%E6%98%9F%E6%99%B4%E3%80%901st%20JAY%E3%80%91.mp4",
        //         container: artRef.value,
        // })
}
onMounted(() => {
          instance  = new Artplayer({
                url: "http://localhost:9000/1131176489@qq.com/videodata/NonM3U8/%E5%91%A8%E6%9D%B0%E4%BC%A6%E6%AD%8C%E6%9B%B2%E5%85%A8%E9%9B%86/003%20%E6%98%9F%E6%99%B4%E3%80%901st%20JAY%E3%80%91.mp4",
                container: artRef.value,
        })
});


</script>
<style scoped>
.videoContainer1{
        width: 500px;
}
</style>