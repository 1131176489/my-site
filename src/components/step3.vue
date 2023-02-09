<template>
        <div>
                注册成功！
        </div>
        <el-button type="primary" style="width: 400px;" v-on:click="handleclick">
                确定
        </el-button>   
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { registerStore } from "../assets/Register"
const registerData = registerStore()
let { set_step } = registerData
onMounted(()=>{
        set_step(3)
}) 
const router = useRouter()
const handleclick = () => {
        console.log(123)
        router.push({
                name:"Login"
        })
}
</script>

<style scoped>
.el-form {
        height: 210px;
}
</style>