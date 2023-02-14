<template>
        <div class="common-layout">
                <el-container>
                        <el-header>
                                <el-scrollbar>
                                        <el-menu v-bind:default-active="key.toString()"
                                                 class="el-menu-vertical-demo"
                                                 mode=horizontal
                                                 v-on:select="handleSelect">
                                                <el-menu-item index="0">
                                                        <el-icon>
                                                                <Stamp />
                                                        </el-icon>
                                                        <span>
                                                                个人中心
                                                        </span>
                                                </el-menu-item>
                                                <el-menu-item index="1">
                                                        <el-icon>
                                                                <Stamp />
                                                        </el-icon>
                                                        <span>
                                                                学习
                                                        </span>
                                                </el-menu-item>
                                                <el-menu-item index="2">
                                                        <el-icon>
                                                                <VideoCamera />
                                                        </el-icon>
                                                        <span>
                                                                视频
                                                        </span>
                                                </el-menu-item>
                                                <el-menu-item index="3">
                                                        <el-icon>
                                                                <PictureFilled />
                                                        </el-icon>
                                                        <span>图片</span>
                                                </el-menu-item>
                                        </el-menu>
                                </el-scrollbar>
                        </el-header>
                        <el-main>
                                <component :is=currentComponent[key]>
                                </component>
                        </el-main>
                </el-container>
        </div>
</template>
<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import Study from './Study.vue'
import Video from "./Video.vue"
import Image from './Image.vue'
import { onMounted, ref } from "vue"
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { globalStore } from "../assets/Global"
const key = ref(0)
const globalStoreData = globalStore()
onMounted(() => {
        axios.get("/api/userinfo", {}).then((res) => {
                globalStoreData.userinfo  = res.data.userinfo
                if (globalStoreData.userinfo.Home_key != undefined) {
                        key.value = globalStoreData.userinfo.Home_key
                }
        }).catch((err) => {
                ElMessage({ "type": "error", message: "获取数据失败" + "错误信息：" + err.message })
        })
})

const currentComponent = [UserInfo, Study, Video, Image,]
const handleSelect = (key_: string, keyPath_: string[]) => {
        if (key_ == "0") {
                key.value = 0
        } else if (key_ == "1") {
                key.value = 1
        } else if (key_ == "2") {
                key.value = 2
        } else if (key_ == "3") {
                key.value = 3
        } else if (key_ == "4") {
                key.value = 4
        }
        globalStoreData.userinfo.Home_key = parseInt(key_)
        axios.post("/api/userinfo", {
                userinfo: globalStoreData.userinfo
        })
}
</script>
<style scoped>
.common-layout,
.el-container {
        height: 100%;
        width: 100%;
}

.el-main {
        position: relative;
}
</style>
