<template>
        <div class="common-layout">
                <el-container>
                        <el-main>
                                <el-tabs type="border-card">
                                        <el-tab-pane label="学习">
                                                <Study>
                                                </Study>
                                        </el-tab-pane>
                                        <el-tab-pane label="视频">
                                                <Video>
                                                </Video>
                                        </el-tab-pane>
                                </el-tabs>
                        </el-main>
                        <!-- <component :is=currentComponent[key]></component> -->
                </el-container>
        </div>
</template>
<script setup lang="ts">
import Study from './Study.vue'
import Video from "./Video.vue"
</script>
<style scoped>
.common-layout,
.el-container,
.el-main,
.el-tabs {
        height: 100%;
}
</style>
