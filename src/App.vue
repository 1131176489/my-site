
<template>
    <component :is=currentComponent[key]></component>
</template>
<script setup lang="ts">
import Home from "./components/Home.vue"
import Login from "./components/Login.vue"
const key = 0
const currentComponent = [Login, Home,]
</script>
<style scoped>

</style>
