<template>
        <div class="container">
                <el-button plain v-on:click="logout">登出账号</el-button>
                <el-button plain v-on:click="logoff">注销账号</el-button>
                <el-divider />
                <el-button plain v-on:click="add_link">添加链接</el-button>
                <!-- <el-button plain v-on:click="del_link">删除链接</el-button> -->
                
                <el-divider />
                <el-link v-for="(item, index ) in items" type="primary" v-bind:href="item.href"
                         target="_blank">{{ item.name }}</el-link>
        </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../assets/route';

const items = [
        {
                name: "vuepress",
                href: "vuepress"
        },
        {
                name: "有道翻译",
                href: "https://fanyi.youdao.com/index.html"
        },
        {
                name: "漫画",
                href: "http://192.168.0.106:9001"
        },
        {
                name: "视频",
                href: "/#/video"
        },
        {
                name: "新视频",
                href: "/#/newvideo"
        },
        {
                name: "学习",
                href: "/#/study"
        },
]
const logout = () => {
        localStorage.setItem("token", "")
        router.push({
                name: "Login"
        })
}
const logoff = () => {
        ElMessageBox.confirm(
                '确定要注销吗？此操作将删除所有用户信息，请谨慎操作',
                '警告',
                {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                }
        ).then(() => {
                axios.post("/api/logoff", {

                }).then(() => {
                        localStorage.clear()
                        router.push({
                                name: "Login"
                        })
                        ElMessage({
                                type: 'success',
                                message: '注销成功',
                        })

                }).catch(() => {
                        ElMessage({
                                type: 'error',
                                message: '注销失败',
                        })
                })
        })
                .catch(() => {
                })
}
let add_link = async () => {
//        await axios.post("/add_link", {
//                "link_name": "123",
//                 "lik_content":"456"
//         })
}
</script>
<style scoped>
.el-link {
        margin: 0 5px;
}
.container{
        padding: 5px;
}
</style>
