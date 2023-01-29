<template>
    <div class="container">
        <div class="login">
            <label for="cheese">Do you like cheese?</label>
            <el-input v-model="email" placeholder="请输入电子邮件" />
            <el-input v-model="password" placeholder="Please input" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const password = ref("")
const email = ref("")
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login {
    width: 250px;
    height: 200px;
}
label{
    font-size: 16px;
}
</style>