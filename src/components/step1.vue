<template>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                 class="demo-ruleForm"
                 label-position="top">
                <el-form-item label="电子邮件地址" prop="email">
                        <el-input v-model="ruleForm.email" type="email" autocomplete="off"
                                  placeholder="请输入电子邮件地址"
                                  v-on:keydown.enter="submitForm(ruleFormRef)" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password" type="password" autocomplete="off"
                                  v-bind:show-password="true" placeholder="请输入密码"
                                  v-on:keydown.enter="submitForm(ruleFormRef)" />
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%;">
                                注册
                        </el-button>
                </el-form-item>
        </el-form>
</template>
<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref ,onMounted} from "vue"
import { validate } from "email-validator"
import { useRouter } from 'vue-router'
import { registerStore } from "../assets/register"
import { Axios } from 'axios'
import axios from 'axios'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const registerData = registerStore()
const { set_emailParam ,set_step} = registerData
onMounted(()=>{
        set_step(0)
})
const ruleForm = reactive({
        email: '1131176489@qq.com',
        password: '123',
})
const validateEmail = (rule: any, value: any, callback: any) => {
        if (value === '') {
                callback(new Error('请输入电子邮件地址'))
        } else if (!validate(ruleForm.email)) {
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
function submitForm(ruleFormRef: any) {
        ruleFormRef.validate((isValid: boolean, invalidFields: any) => {
                if (isValid) {
                        axios.post("/register/step1", {
                                data: {
                                        email: ruleForm.email,
                                        password: ruleForm.password,
                                }
                        }).then((res) => {
                                const { data }: { data: { status: number, msg: string } } = res
                                if (data.status == 0) {
                                        ElMessage({
                                                type: "success",
                                                message: "验证成功，已向邮箱发送验证码"
                                        })
                                        router.push({
                                                name: 'step2',
                                        })
                                        set_emailParam(ruleForm.email)
                                } else {
                                        ElMessage({
                                                type: "error",
                                                message: `注册失败，${data.msg}`
                                        })
                                }
                        }).catch((data) => {
                                // console.log(data)
                                ElMessage({
                                        type: "error",
                                        message: `未知错误`
                                })
                        })
                }
        })

}

</script>
<style >
@media screen and (max-width: 765px) {
        .el-form {
                width: 90%;
        }
}

@media screen and (min-width: 766px) {
        .el-form {
                width: 400px
        }
}
</style>