<template>
        <div class="common-layout">
                <el-container>
                        <el-aside width="200px"><el-menu
                                         default-active="2">
                                        <el-menu-item index="2">
                                                <el-icon><icon-menu /></el-icon>
                                                <span>用户信息</span>
                                        </el-menu-item>
                                </el-menu></el-aside>
                        <el-main>
                                <el-button plain v-on:click="logout">登出账号</el-button>
                                <el-button plain v-on:click="logoff">注销账号</el-button>
                        </el-main>
                </el-container>
        </div>

</template>

<script lang="ts" setup>
import {
        Menu as IconMenu,
} from '@element-plus/icons-vue'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../assets/route';

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
</script>
<style scoped>

</style>