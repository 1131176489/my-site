<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <div class="input">
                    <el-input v-model="StudyData.text" :rows="10" type="textarea" placeholder="请输入外文"
                        :autosize="{ minRows: 2, maxRows: 10 }" resize="none" />
                    <el-input v-model="StudyData.text" :rows="10" type="textarea" placeholder="请输入中文"
                        :autosize="{ minRows: 2, maxRows: 10 }" resize="none" />
                </div>
            </el-main>
            <el-aside>
                <el-scrollbar height="100%">
                    <p v-for="item in 50" :key="item" class="scrollbar-demo-item">{{
                        StudyData.text
                    }}</p>
                </el-scrollbar>
            </el-aside>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { Study } from '../assets/Study'
const StudyData = Study()
StudyData.text = `123`
// import { ElCol, ElMenu, ElContainer, ElMain, ElMenuItem, ElIcon, ElHeader, ElRow, ElAside, ElScrollbar } from 'element-plus';
function reSizeCommonLayout(): void {
    let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
    let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
    console.log(headerHeight)
    let container = <HTMLElement>window.document.documentElement.getElementsByClassName("common-layout")[0]
    container.style.height = offsetHeight_ - headerHeight + "px"
    console.log(container.style.height)
}


onMounted((): void => {
    setTimeout(reSizeCommonLayout, 100)

})
window.onresize = reSizeCommonLayout

</script>

<style>
@media screen and (min-width:765px) {
    .el-container {
        height: 100%;

    }

    .el-main {
        height: 100%;
    }

    .el-aside {
        height: 100%;
        margin-right: 8%;
    }

    .scrollbar-demo-item {
        display: flex;
        align-items: center;
        justify-content: center;
        /* height: 50px; */
        margin: 10px;
        text-align: center;
        border-radius: 4px;
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }

    p {
        word-break: break-all;
    }
    .input{
        
    }
    .el-textarea {
        display: block;
        width: 50%;
        /* height: 300px; */
        font-size: 24px;
        font-family: 'Times New Roman', Times, serif;
        font-weight: 900;
    }

    .el-textarea__inner {
        font-weight: 900;
    }
}

@media screen and (max-width:764px) {
    .el-container {
        height: 100%;

    }

    .el-main {
        height: 100%;
    }

    .el-aside {
        height: 100%;
        margin-right: 8%;
        width: 100px;
    }

    .scrollbar-demo-item {
        display: flex;
        align-items: center;
        justify-content: center;
        /* height: 50px; */
        margin: 10px;
        text-align: center;
        border-radius: 4px;
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }

    p {
        word-break: break-all;
        font-size: 16px;
    }

    .el-textarea {
        width: 100%;
        /* height: 300px; */
        font-size: 20px;
        font-family: 'Times New Roman', Times, serif;
        font-weight: 900;
        display: block;
    }

    .el-textarea__inner {
        font-weight: 900;
    }
}
</style>
