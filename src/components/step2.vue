<template>
        <el-form label-position="top" ref="ruleFormRef" status-icon v-bind:model="ruleForm" v-bind:rules="rules"
        style="width: 400px;"
        >
                <el-form-item label="请输入验证码" prop="code">
                        <el-input placeholder="请输入验证码" type="text" v-model="ruleForm.code"
                                  :rules="rules" v-on:keydown.prevent.enter="handleclick(ruleFormRef)" />
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" style="width: 100%;" v-on:click="handleclick(ruleFormRef)">
                                确定
                        </el-button>
                </el-form-item>
        </el-form>
</template>
<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { registerStore } from "../assets/Register"
import axios from 'axios'
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const registerData = registerStore()
let { get_emailParam, set_step, set_emailParam } = registerData
onMounted(() => {
        set_step(1)
})
const ruleForm = reactive({
        code: ''
})
const rules = reactive({
        code: [{ validator: validateCode, trigger: 'blur' }],
})
function handleclick(rule: any) {
        rule.validate(async (isValid: boolean, invalidFields: any) => {
                if (isValid) {
                        const { data }: { data: { status: number, msg: string } } = await axios.post("/register/step2", {
                                data: {
                                        email: get_emailParam(),
                                        code: ruleForm.code
                                }
                        })
                        if (data.status == -1) {
                                if (data.msg == "code expire") {
                                        ElMessage({
                                                type: "warning",
                                                message: `验证码已过期，请重新点击注册`
                                        })
                                        router.go(-1)
                                }
                                if (data.msg == "code error") {
                                        ElMessage({
                                                type: "error",
                                                message: `验证码错误`
                                        })
                                }
                                if (data.msg == "unkonwn error") {
                                        ElMessage({
                                                type: "error",
                                                message: `未知错误`
                                        })
                                }
                        }
                        if (data.status == 0) {
                                ElMessage({
                                        type: "success",
                                        message: `注册成功！`
                                })
                                router.push({
                                        name: "step3",

                                })
                        }
                }

        })

}
function validateCode(rule: any, value: any, callback: any) {
        // console.log(789)
        if (value === '') {
                callback(new Error('验证码不能为空'))
        } else if (!validate(ruleForm.code)) {
                callback(new Error("无效验证码"))
        }
        callback()
}
function validate(code: string) {
        const s = /^[0-9]{8,8}$/
        console.log(s.test(code))
        return s.test(code)
}
</script>

<style scoped>
.el-form {
        height: 210px;
        /* width: 90%; */
}
</style>