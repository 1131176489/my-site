<template>
        <el-dialog
                   v-model="dialogVisible"
                   title="修改密码"
                   width="30%"
                   :before-close="handleClose">
                <el-form
                         label-position="left"
                         ref="ruleFormRef"
                         :model="ruleForm"
                         status-icon
                         :rules="rules"
                         label-width="80px"
                         class="demo-ruleForm">
                        <el-form-item label="旧密码" prop="pwd">
                                <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="新密码" prop="inputPass">
                                <el-input
                                          v-model="ruleForm.inputPass"
                                          type="password"
                                          autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkInputPass">
                                <el-input v-model="ruleForm.checkInputPass" type="password" autocomplete="off" />
                        </el-form-item>
                </el-form>
                <template #footer>
                        <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="submitForm">
                                        确认
                                </el-button>
                        </span>
                </template>
        </el-dialog>
        <div class="container">
                <el-button plain v-on:click="logout">登出账号</el-button>
                <el-button plain v-on:click="logoff">注销账号</el-button>
                <el-divider />
                <el-button plain v-on:click="add_link">添加链接</el-button>
                <!-- <el-butto plain v-on:click="del_link">删除链接</el-butto
n> -->

                <el-divider />

                <el-link type="primary" @click="changePwd">
                        修改密码
                </el-link>
                <el-link v-for="(item, index ) in items" type="primary" v-bind:href="item.href" target="_blank">{{ item.name }}
                </el-link>

        </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../assets/route'
import { globalStore } from "../assets/Global"
import { reactive, ref } from 'vue'


import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const validatePwd = (rule: any, value: string, callback: any) => {
        if (value === "") {
                callback(new Error('请输入原密码'))
        } else {
                callback()
        }
}
const validateInputPass = (rule: any, value: any, callback: any) => {
        if (value === "") {
                callback(new Error('请输入新密码'))
        } else {
                callback()
        }
}
const validateCheckInputPass = (rule: any, value: any, callback: any) => {
        if (value === "") {
                callback(new Error('请再次输入新密码'))
        } else if (value != ruleForm.inputPass) {
                callback(new Error('两次密码不一致'))
        } else {
                callback()
        }
}
const ruleForm = reactive({
        pwd: "",
        inputPass: "",
        checkInputPass: "",

})

const rules = reactive({
        pwd: [{ validator: validatePwd, trigger: 'blur' }],
        inputPass: [{ validator: validateInputPass, trigger: 'blur' }],
        checkInputPass: [{ validator: validateCheckInputPass, trigger: 'blur' }],
})


const submitForm = () => {
        if (!ruleFormRef) return
        ruleFormRef.value?.validate((valid) => {
                if (valid) {
                        axios.post("api/chgpwd", {
                                pwd: ruleForm.pwd,
                                inputPwd: ruleForm.checkInputPass
                        }).then((res) => {
                                if (res.data == "pwderror") {
                                        ElMessage({
                                                type: "error",
                                                message: "密码错误"
                                        })
                                } else {
                                        ElMessage({
                                                type: "success",
                                                message: "修改成功"
                                        })
                                        dialogVisible.value = false
                                }
                        }).catch(() => {
                                ElMessage({
                                        type: "error",
                                        message: "修改失败"
                                })
                        })
                }
        })

}

const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
}
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
                href: ":9001/"
        },
        {
                name: "M3U8视频",
                href: "/#/M3U8Video"
        },
        {
                name: "m3u8",
                href: "/#/m3u8"
        },
        {
                name: "学习",
                href: "/#/study"
        },
        {
                name: "日历",
                href: "/#/calendar"
        },
        {
                name: "FLV",
                href: "/#/flv"
        },
        {
                name: "非M3U8视频",
                href: "/#/NonM3U8Video"
        },
        {
                name: "文件下载",
                href: "/#/FileDownLoad"
        }
]
const logout = () => {
        localStorage.setItem("token", "")
        router.push({
                name: "Login"
        })
}
const dialogVisible = ref(false)

const handleClose = (done: () => void) => {

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

}
const changePwd = () => {
        dialogVisible.value = true
}
</script>
<style scoped>
.el-link {
        margin: 0 5px;
}

.container {
        padding: 5px;
}
</style>
