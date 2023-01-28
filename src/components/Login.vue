<template>
    <div class="container">
        <div class="login">
            <el-input v-model="username" placeholder="Please input" />
            <el-input v-model="password" placeholder="Please input" />
            <el-input v-model="email" placeholder="Please input" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const username = ref("")
const password = ref("")
const email = ref("")
</script>

<style>
.container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login {
    width: 500px;
    height: 500px;
}
</style>