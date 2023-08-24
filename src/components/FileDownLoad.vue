<template>
        <div id="contanier">
                <div v-for="item in renderData" class="item">
                        <el-link :href=fileUrl(item) download="download">
                                {{ item }}
                        </el-link>
                </div>
        </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
let srcBaseUrl = ref("")
let renderData = ref()
if (import.meta.env.MODE == 'development') {
        srcBaseUrl.value = "http://192.168.0.106:9000/"
}
else {
        srcBaseUrl.value = "/"
}
let fileUrl = (filename:string) => {
        // return `${srcBaseUrl.value}downloadFile?p=${filename}`
        return `${srcBaseUrl.value}getFile/${filename}`
}
onMounted(() => {
        axios.get(srcBaseUrl.value + "downloadFile").then((res) => {
                renderData.value = res.data
        })
})

</script>
<style scoped>
#contanier {
        display: flex;
        flex-direction: column;

}

.item {
        align-self: center;
        margin: 22px;
        /* border: 1px solid black; */
}
</style>