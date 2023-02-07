<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { StudyStore } from '../assets/Study'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage, ElMessageBox, ElTree, TreeNode } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile, ElAside } from 'element-plus'
import type { Tree } from "../assets/Study"

const treeRef = ref<InstanceType<typeof ElTree>>()
const modifydisabled = ref(true)
const isexpand = ref(false)
const removeManydisabled = ref(true)
const showCheckbox = ref(false)
const defaultEexpandAll = ref(true)
const upload = ref<UploadInstance>()
const uploadData = ref({})

let { key, value, info, data, node, checkNodeRemove } = storeToRefs(StudyStore())
console.log("--------------------------------------------")
StudyStore().$subscribe((mutation, state) => {
        console.log(mutation)
        console.log(state)

},{keep:true})
const elAsideStyle = reactive({
        border: "1px solid #d9ecff",
        width: "200px"
})

interface Info {
        _id: string,
        insertId: number,
        useremail: string,
        data: Tree[]
}
onMounted(() => {
        init()
})
onUnmounted(() => {
        console.log("onUnmounted",info)
})
function reSizeCommonLayout(): void {
        let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
        let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
        let container = <HTMLElement>window.document.documentElement.getElementsByClassName("common-layout")[0]
        container.style.height = offsetHeight_ - headerHeight + "px"
}
window.onresize = reSizeCommonLayout

const init = async () => {
        // setTimeout(reSizeCommonLayout, 100)
        const { data: res }: { data: { msg: string, status: number, info: Info } } = await axios.get("/api/studylist")
        console.log(123, info)
        info.value = res.info
        data.value.push(...info.value.data)
        console.log(456, info)
}

const ondrag = (e: DragEvent) => {
        elAsideStyle.width = e.x - 27 + "px"
}

const append = async () => {
        if (key.value == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                modifydisabled.value = true
                return
        }
        const newChild = { id: info.value.insertId++, label: key.value, value: value.value }
        if (!node.value.children) {
                node.value.children = []
        }
        node.value.children.push(newChild)
        info.value.data = data.value
        try {
                const r = await axios.post("/api/studyAdd", {
                        info: info.value
                })
                if (r.data.status == 0) {
                        ElMessage({
                                message: '添加成功！',
                                type: 'success',
                        })
                }
        }
        catch (err) {
                ElMessage({
                        message: '添加失败！',
                        type: 'error',
                })
        }
}
const append1 = async () => {
        if (key.value == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                return
        }
        data.value.push({
                label: key.value,
                id: info.value.insertId++,
                children: []
        })
        info.value.data = data.value
        try {
                const r = await axios.post("/api/studyUpdate", {
                        info: info.value
                })
                if (r.data.status == 0) {
                        ElMessage({
                                message: '添加成功！',
                                type: 'success',
                        })
                        key.value = ""
                        value.value = ""
                }
        }
        catch (err) {
                ElMessage({
                        message: '添加失败！',
                        type: 'error',
                })
        }
        // info.value.data = data.value
}
const remove = () => {
        ElMessageBox.confirm('确定要删除吗？', '警告', {
                distinguishCancelAndClose: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
        }
        ).then(async () => {
                console.log(node.value)
                treeRef.value?.remove(node.value)
                console.log(data.value)
                info.value.data = data.value
                try {
                        const r = await axios.post("/api/studyDel", {
                                info: info.value
                        })
                        if (r.data.status == 0) {
                                key.value = ""
                                value.value = ""
                                modifydisabled.value = true

                                ElMessage({
                                        message: '删除成功！',
                                        type: 'success',
                                })
                        }
                }
                catch (err) {
                        ElMessage({
                                message: '删除失败！',
                                type: 'error',
                        })
                }
                finally {

                }
        }).catch(() => {

        })

}
const update = async () => {
        if (key.value == "") {
                ElMessage({
                        message: '描述不能为空！',
                        type: 'warning',
                })
                modifydisabled.value = true
                return
        }
        node.value.label = key.value
        node.value.value = value.value
        try {
                const r = await axios.post("/api/studyUpdate", {
                        info: info.value
                })
                if (r.data.status == 0) {
                        ElMessage({
                                message: '修改成功！',
                                type: 'success',
                        })
                        modifydisabled.value = true
                        key.value = ""
                        value.value = ""
                }
        }
        catch (err) {
                console.log(err)
                ElMessage({
                        message: '修改失败！',
                        type: 'error',
                })
        }

}
const nodeclick = async (node_: Tree) => {
        node.value = node_
        modifydisabled.value = false
        if (node_.children != undefined) {
                key.value = ""
                value.value = ""
                return
        }
        key.value = node_.label
        value.value = node_.value as string
}
const clickCheck = (f1: any, f2: any) => {
        // removeManydisabled.value = !removeManydisabled.value
        // console.log(f1)
        console.log(treeRef)
        console.log(f2)
        if ((f2.checkedNodes).length == 0) {
                removeManydisabled.value = true
        }
        else {
                removeManydisabled.value = false
                checkNodeRemove.value = f2.checkedNodes
        }

        // treeRef.value?.remove(f1)
}
const removeMany = async () => {
        ElMessageBox.confirm(
                '确定要删除全部所选内容吗？',
                '警告',
                {
                        distinguishCancelAndClose: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning',
                }
        ).then(async () => {

                try {

                        for (let i of checkNodeRemove.value) {
                                treeRef.value?.remove(i as unknown as Node)
                                info.value.data = data.value
                        }
                        try {
                                const r = await axios.post("/api/studyDel", {
                                        info: info.value
                                })
                                if (r.data.status == 0) {
                                        key.value = ""
                                        value.value = ""
                                        showCheckbox.value = false
                                        removeManydisabled.value = true
                                        ElMessage({
                                                message: '删除成功！',
                                                type: 'success',
                                        })
                                }
                        }
                        catch (err) {
                                ElMessage({
                                        message: '删除失败！',
                                        type: 'error',
                                })
                                location.reload()
                        }
                        finally {

                        }
                }
                catch (err) {
                        ElMessage({
                                message: '删除失败！',
                                type: 'error',
                        })
                }
        }).catch(() => {

        })


}

const selectMany = () => {
        showCheckbox.value = true
}


const imageUrl = ref('')
const actionUrl = ref("http://192.168.0.106:9000/api/pic")
const auth = reactive({ Authorization: "Bearer " + localStorage.getItem("token") })
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        uploadFiles.splice(0)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile) => {
        if (key.value == "") {
                ElMessage({
                        message: '描述不能为空！',
                        type: 'warning',
                })
                return false
        }
        if (rawFile.type.includes("image") === false) {
                ElMessage.error('请上传图片类型文件')
                return false
        } else if (rawFile.size / 1024 / 1024 > 10) {
                ElMessage.error('文件大小不能超过10M')
                return false
        }
        console.log(rawFile.name)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const src_ = "pic" + '-' + uniqueSuffix + "." + rawFile.name.split(".").reverse()[0]
        if (!node.value.pic) {
                node.value.pic = []
        }
        node.value.pic?.push({
                src: src_
        })
        info.value.data = data.value
        uploadData.value = {
                info: JSON.stringify(info.value),

        }
        return true
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
}
const submitUpload = () => {
        upload.value!.submit()
}

const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>


<template>


        <div class="common-layout">
                <el-container>
                        <el-aside v-bind:style="elAsideStyle">
                                <el-scrollbar>
                                        <div class="custom-tree-container">
                                                <el-tree
                                                         v-on:node-click="nodeclick"
                                                         v-on:check="clickCheck"
                                                         v-bind:expand-on-click-node="isexpand"
                                                         v-bind:data="data"
                                                         v-bind:show-checkbox="showCheckbox"
                                                         node-key="id"
                                                         v-bind:default-expand-all="defaultEexpandAll"
                                                         ref="treeRef">
                                                        <template #default="{ node, data }">
                                                                <span class="custom-tree-node">
                                                                        <span>{{ node.label }}</span>
                                                                        <!-- <span>
                                                                                <a @click.stop="modifyClick(data)"
                                                                                   style="font-size: 16px;">
                                                                                        修改
                                                                                </a>
                                                                                <a @click.stop="append(data)"
                                                                                   style="font-size: 16px;">
                                                                                        添加
                                                                                </a>
                                                                                <a style="margin-left: 8px;font-size: 16px;"
                                                                                   @click.stop="remove(node, data)">
                                                                                        删除 </a>
                                                                        </span> -->
                                                                </span>
                                                        </template>
                                                </el-tree>
                                        </div>
                                </el-scrollbar>
                        </el-aside>
                        <div class="drag" draggable="true" v-on:drag="ondrag">
                                |||
                        </div>
                        <el-main>
                                <el-form label-position="top">
                                        <el-form-item>
                                                <el-button type="primary" v-bind:disabled="modifydisabled"
                                                           v-on:click="update">确认修改</el-button>
                                                <el-button type="primary" v-bind:disabled="modifydisabled"
                                                           v-on:click="append">添加项目</el-button>
                                                <el-button type="primary" v-bind:disabled="modifydisabled"
                                                           v-on:click="remove">删除项目</el-button>
                                                <el-button type="primary" v-bind:disabled="removeManydisabled"
                                                           v-on:click="removeMany">批量删除</el-button>
                                                <el-button type="primary"
                                                           v-on:click="selectMany">批量选择</el-button>
                                                <el-button type="primary"
                                                           v-on:click="append1">增加分类</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                                <el-upload
                                                           v-bind:on-change="handleChange"
                                                           v-bind:auto-upload="false"
                                                           v-bind:action="actionUrl"
                                                           v-bind:show-file-list="true"
                                                           v-bind:on-success="handleAvatarSuccess"
                                                           v-bind:before-upload="beforeAvatarUpload"
                                                           v-bind:headers="auth"
                                                           v-bind:data="uploadData"
                                                           name="pic"
                                                           ref="upload"
                                                           class="avatar-uploader"
                                                           multiple>

                                                        <template #trigger>
                                                                <el-button type="primary">添加图片</el-button>
                                                        </template>

                                                        <el-button type="success" @click="submitUpload"
                                                                   v-bind:disabled="modifydisabled">
                                                                点击上传
                                                        </el-button>

                                                </el-upload>
                                        </el-form-item>
                                        <el-form-item label="描述">
                                                <el-input v-model="key" :rows="10" type="textarea"
                                                          placeholder="请输入描述"
                                                          :autosize="{ minRows: 3, maxRows: 6 }" />
                                        </el-form-item>

                                        <el-form-item label="解答">
                                                <el-row v-bind:gutter="20" :style="{ width: '100%' }">
                                                        <el-col :span="12">
                                                                <el-input v-model="value" v-bind:rows="10"
                                                                          type="textarea"
                                                                          placeholder="请输入解答" />
                                                        </el-col>
                                                        <el-col :span="12" style="height: 100%;">
                                                                <el-scrollbar height="400px"
                                                                              style="padding: 20px;border: 1px solid  #d9ecff;">
                                                                        <el-image v-bind:src="url" fit='none' />
                                                                        <el-image
                                                                                  src="http://192.168.0.106:9000/bunny.jpg" />
                                                                </el-scrollbar>


                                                        </el-col>
                                                </el-row>
                                        </el-form-item>
                                </el-form>
                        </el-main>
                </el-container>
        </div>


        <!-- <div style="height: 100%; display: flex;">


        </div> -->

</template>


<style scoped>
.custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 8px;
        margin: 8px 0;
}

.el-tree {
        font-size: 20px;
}

.drag {
        margin: auto;
        margin-left: 5px;
        font-size: 16px;
        cursor: pointer;
}

.common-layout,
.el-container {
        height: 100%;
}

.el-scrollbar {
        height: 100%;
}

.el-textarea {
        width: 100%;
        font-size: 24px;
        font-family: 'Times New Roman', Times, serif;
        font-weight: 900;
}

.el-textarea__inner {
        font-weight: 900;
}

/* .el-tree-node {
        margin: 10px 0 0;
} */
@media screen and (max-width:764px) {
        .el-aside {
                width: 200px;
                /* background-color: ; */
        }
}

@media screen and (min-width:765px) {}

/* @media screen and (max-width:764px) {
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
               
                font-size: 20px;
                font-family: 'Times New Roman', Times, serif;
                font-weight: 900;
                display: block;
        }

        .el-textarea__inner {
                font-weight: 900;
        }
} */
</style>
