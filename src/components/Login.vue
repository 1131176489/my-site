<template>
        <div class="common-layout">
                <el-container>
                        <el-header>
                                <el-link href="/" target="_blank">my-site</el-link>
                        </el-header>
                        <el-main>
                                <el-row v-bind:justify="'center'">
                                        <el-col v-bind:span="12" v-bind:xs="20">
                                                <el-form
                                                         ref="ruleFormRef"
                                                         label-position="top"
                                                         label-width="100px"
                                                         v-bind:model="formData"
                                                         v-bind:rules="rules"
                                                         status-icon>
                                                        <el-form-item label="电子邮件地址" prop="email">
                                                                <el-input v-model="formData.email" placeholder="请输入电子邮件" />
                                                        </el-form-item>
                                                        <el-form-item label="密码" prop="password">
                                                                <el-input v-model="formData.password" placeholder="请输入密码"
                                                                          type="password" />
                                                        </el-form-item>
                                                        <el-button type="primary" style="width: 100%;"
                                                                   v-on:click="login(ruleFormRef)">
                                                                登录
                                                        </el-button>

                                                </el-form>
                                        </el-col>
                                </el-row>
                                <el-row v-bind:justify="'center'">
                                        <el-col v-bind:span="3" v-bind:offset="3" v-bind:xs="6">
                                                <el-link type="primary" href="/#Register/step1">注册</el-link>
                                        </el-col>
                                        <el-col v-bind:span="3" v-bind:offset="3" v-bind:xs="6">
                                                <el-link type="primary" href="/">忘记密码</el-link>
                                        </el-col>
                                </el-row>
                        </el-main>
                </el-container>
        </div>
        <div class="container">
                <el-form
                         ref="ruleFormRef"
                         label-position="top"
                         label-width="100px"
                         v-bind:model="formData"
                         v-bind:rules="rules"
                         style="max-width: 460px"
                         status-icon>
                        <el-form-item label="电子邮件地址" prop="email">
                                <el-input v-model="formData.email" placeholder="请输入电子邮件" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                                <el-input v-model="formData.password" placeholder="请输入密码" type="password" />
                        </el-form-item>
                        <el-button type="primary" style="width: 100%;" v-on:click="login(ruleFormRef)">
                                登录
                        </el-button>
                        <div class="other">
                                <router-link to="/Register/step1">
                                        注册
                                </router-link>
                                <router-link to="/">
                                        忘记密码
                                </router-link>
                        </div>
                </el-form>

        </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue"
import { registerStore } from "../assets/Register"
import { validate } from "email-validator"
import { ElMessage, FormInstance } from "element-plus"
import axios from 'axios'
import router from "../assets/route"
import { globalStore } from "../assets/global"
const { set_isAuthenticated, get_isAuthenticated } = globalStore()
const { get_emailParam } = registerStore()
const ruleFormRef = ref<FormInstance>()
const formData = reactive({
        email: "1131176489@qq.com",
        password: '123',
})
onMounted(() => {
        formData.email = get_emailParam()
})
const validateEmail = (rule: any, value: any, callback: any) => {
        if (value === '') {
                callback(new Error('请输入电子邮件地址'))
        } else if (!validate(formData.email)) {
                callback(new Error("电子邮件格式不正确"))
        }
        callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
        if (value === '') {
                callback(new Error('密码不能为空'))
        } else {
                callback()
        }
}
const rules = reactive({
        email: [{ validator: validateEmail, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
})

const login = (ruleFormRef: any) => {
        ruleFormRef.validate(async (isValid: boolean, invalidFields: any) => {
                if (isValid) {
                        try {
                                const res = await axios.post("/login", {
                                        email: formData.email,
                                        password: formData.password,
                                })
                                console.log(res)
                                const { data }: { data: { status: number, msg: string, token?: string | undefined } } = res
                                if (data.status == -1) {
                                        if (data.msg == "pwd error") {
                                                ElMessage({
                                                        type: "error",
                                                        message: "密码错误"
                                                })
                                        } else if (data.msg == "not find") {
                                                ElMessage({
                                                        type: "error",
                                                        message: "用户不存在"
                                                })
                                        }
                                }
                                else {
                                        ElMessage({
                                                type: "success",
                                                message: "登陆成功！"
                                        })
                                        set_isAuthenticated((data.token as string))
                                        console.log(get_isAuthenticated())
                                        localStorage.setItem("token", get_isAuthenticated())
                                        router.push({
                                                name: "Home"
                                        })
                                        // console.log(data.token)

                                        // console.log( jwt.decode((data.token as string)))
                                }
                        }
                        catch (err) {
                                ElMessage({
                                        type: "error",
                                        message: "网络异常"
                                })
                                console.log(err)
                        }

                }
        })
}

</script>

<style scoped>
/* .container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
}

.el-form {
        width: 90%;
        height: 200px;
}

.other {
        display: flex;
        justify-content: space-between;
        width: 90%;
}

.other a {
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        color: blue;
} */
</style>