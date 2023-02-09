<template>
        <div class="container">

                <el-steps v-bind:active="rd.step" finish-status="success"  align-center ref="els">
                        <el-step title="填写资料" />
                        <el-step title="接收验证码" />
                        <el-step title="完成注册" />
                </el-steps>
                <router-view></router-view>
        </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { registerStore } from "../assets/Register"
const els = ref(null)
const rd = registerStore()
const active = ref(2)
console.log(els)
</script>

<style scoped>
.container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: #ecf5ff;
}


.el-steps {
        width: 400px;
        font-size: 16px;
        margin-bottom: 16px;
}
</style>