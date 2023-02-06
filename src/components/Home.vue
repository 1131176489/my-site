<template>
        <div class="container1">
                <div class="header">
                        <el-row class="tac">
                                <el-col :span="24">
                                        <el-menu v-bind:default-active="key.toString()" class="el-menu-vertical-demo"
                                                 unique-opened mode=horizontal
                                                 v-on:select="handleSelect" v-bind:ellipsis=ellipsis>
                                                <el-menu-item index="1">
                                                        <template #title>
                                                                <el-icon>
                                                                        <Stamp />
                                                                </el-icon>
                                                                <span>学习</span>
                                                        </template>
                                                </el-menu-item>
                                                <el-menu-item index="2">
                                                        <el-icon>
                                                                <VideoCamera />
                                                        </el-icon>
                                                        <span>视频</span>
                                                </el-menu-item>

                                                <el-menu-item index="3">
                                                        <el-icon>
                                                                <PictureFilled />
                                                        </el-icon>
                                                        <span>图片</span>
                                                </el-menu-item>
                                                
                                                <!-- <el-button type="primary" v-on:click="logout">登出</el-button>
                                                <el-button type="primary" v-on:click="handleclick">点击</el-button> -->
                                        </el-menu>

                                </el-col>
                        </el-row>
                </div>
                <component :is=currentComponent[key]></component>
        </div>
</template>
<script setup lang="ts">
import Study from './Study.vue'
import Video from "./Video.vue"
import Image from './Image.vue'
import { onMounted, ref, inject } from "vue"
import axios from 'axios'
import { reSizeContainer } from '../assets/reSizeContainer'
import router from '../assets/route'
const ellipsis = ref(false)
const key = ref(1)
const currentComponent = [undefined, Study, Video, Image,]
const handleSelect = (key_: string, keyPath_: string[]) => {
        if (key_ == "1") {
                key.value = 1
        } else if (key_ == "2") {
                key.value = 2
        } else if (key_ == "3") {
                key.value = 3
        } else if (key_ == "4") {
                key.value = 4
        }
}

const handleclick = () => {
        axios.post("/test")
}
const logout = () => {
        localStorage.removeItem("token")
        router.push({
                name:"Login"
        })
}
</script>
<style scoped>
@media screen and (min-width: 765px) {
        .container1 {
                display: flex;
                flex-direction: column;
                height: 100%;
        }
}

@media screen and (max-width: 764px) {
        .container1 {
                display: flex;
                flex-direction: column;
                /* float: left; */
                justify-content: left;
                height: 100%;
        }

}
</style>
