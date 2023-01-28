<template>
    <div class="login">
        <el-input v-model="username" placeholder="Please input" />
        <el-input v-model="password" placeholder="Please input" />
        <el-input v-model="email" placeholder="Please input" />
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
const username = ref("")
const password = ref("")
const email = ref("")
</script>

<style>

</style>