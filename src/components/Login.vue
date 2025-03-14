<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-link href="/" target="_blank">my-site</el-link>
      </el-header>
      <el-main>
        <el-row :justify="'center'">
          <el-col :sm="{span:8}" :xs="{span:24}">
            <el-card class="box-card">
              <el-form
                  v-show="!show_register"
                  class="login"
                  ref="ruleFormRef"
                  label-position="top"
                  label-width="100px"
                  v-bind:model="formData"
                  v-bind:rules="rules"
                  status-icon>
                <el-form-item label="电子邮件地址" prop="email">
                  <el-input v-model="formData.email"
                            placeholder="请输入电子邮件"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="formData.password"
                            placeholder="请输入密码"
                            type="password"/>
                </el-form-item>
                <el-button type="primary" style="width: 100%;"
                           v-on:click="login(ruleFormRef)">
                  登录
                </el-button>
              </el-form>
              <el-form
                  v-show="show_register"
                  :rules="register_rules"
                  class="register"
                  ref="registerValidate"
                  label-position="top"
                  label-width="100px"
                  v-bind:model="registerData"
                  status-icon>
                <el-form-item label="电子邮件地址" prop="email">
                  <el-input v-model="registerData.email"
                            placeholder="请输入电子邮件"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="registerData.password"
                            type="password"
                            placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="password_check">
                  <el-input v-model="registerData.password_check"
                            type="password"
                            placeholder="请再次输入密码"/>
                </el-form-item>
                <el-form-item label="验证码">
                  <el-row :span="24" style="width: 100%;">
                    <el-col :span="16">
                      <el-input v-model="registerData.validate_code"
                                placeholder="请输入验证码"/>
                    </el-col>
                    <el-col :span="8">
                      <el-button type="text"
                                 style="margin-left: 10px;"
                                 v-on:click="validate_code(registerValidate)">
                        获取验证码
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-button type="primary" style="width: 100%;"
                           v-on:click="validate_code_">
                  确认注册
                </el-button>
              </el-form>
              <el-divider/>
              <el-row :justify="'space-around'">
                <el-link type="primary" v-on:click="register">{{ register_login }}</el-link>
                <el-link type="primary" v-on:click="">忘记密码</el-link>
              </el-row>
            </el-card>
          </el-col>

        </el-row>

      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from "vue"
import {validate} from "email-validator"
import {ElMessage, FormInstance} from "element-plus"
import axios from 'axios'
import router from "../assets/route"
import {computed} from "vue"

const ruleFormRef = ref<FormInstance>()
const registerValidate = ref<FormInstance>()
// const register_login = ref("注册")
const formData = reactive({
  email: "",
  password: '',
})
const registerData = ref({
  email: "",
  password: "",
  password_check: "",
  validate_code: ""
})
const show_register = ref(false)
const register_login = computed(() => {
  return show_register.value ? "登录" : "注册"
})
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入电子邮件地址'))
  } else if (!validate(value)) {
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
const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (value != registerData.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = reactive({
  email: [{validator: validateEmail, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],
})
const register_rules = reactive({
  email: [{validator: validateEmail, trigger: 'blur'}],
  password_check: [{validator: validateCheckPassword, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}],
})
const login = (ruleFormRef: any) => {
  ruleFormRef.validate(async (isValid: boolean, invalidFields: any) => {
    if (isValid) {
      try {
        const res = await axios.post("/login", {
          email: formData.email,
          password: formData.password,
        })
        const {data}: { data: { status: number, msg: string, token?: string | undefined } } = res
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
        } else {
          ElMessage({
            type: "success",
            message: "登陆成功！"
          })
          localStorage.setItem("token", (data.token as string))
          router.push({
            name: "Home"
          })
        }
      } catch (err) {
        ElMessage({
          type: "error",
          message: "网络异常"
        })
        console.log(err)
      }
    }
  })
}
const register = () => {
  show_register.value = !show_register.value
}
const validate_code = (registerValidate: any) => {
  registerValidate.validate(async (isValid: boolean, invalidFields: any) => {
    if (isValid) {
      axios.post("/register/step1", {
        data: {
          email: registerData.value.email,
          password: registerData.value.password,
        }
      }).then((res) => {
        const {data}: { data: { status: number, msg: string } } = res
        if (data.status == 0) {
          ElMessage({
            type: "success",
            message: "验证成功，已向邮箱发送验证码"
          })
        } else {
          ElMessage({
            type: "error",
            message: `验证失败，${data.msg}`
          })
        }
      }).catch((data) => {
        ElMessage({
          type: "error",
          message: `未知错误`
        })
      })
    }
  })
}
const validate_code_ = () => {
  axios.post("/register/step2", {
    data: {
      email: registerData.value.email,
      code: registerData.value.validate_code
    }
  }).then((data: any) => {
    data = data.data
    if (data.status == -1) {
      if (data.msg == "code expire") {
        ElMessage({
          type: "warning",
          message: `验证码已过期，请重新点击注册`
        })
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
        message: `注册成功！3秒后跳转到登录页面`
      })
      setTimeout(() => {
        location.reload()
      }, 3000)
    }
  })
}
</script>

<style scoped>
.box-card {
  background-color: #fff;
  border-radius: 3px;
  /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
}</style>