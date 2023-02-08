<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useStudyStore } from '../assets/Study'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, ElAside } from 'element-plus'
import type { Tree, Info } from "../assets/Study"
import axios from 'axios'
import type Node from 'element-plus/es/components/tree/src/model/node'
const treeRef = ref<InstanceType<typeof ElTree>>()
const upload = ref<UploadInstance>()
//树状组件
const modifydisabled = ref(true)
const isexpand = ref(false)
const removeManydisabled = ref(true)
const showCheckbox = ref(false)
const defaultEexpandAll = ref(true)
const checkStrictly = ref(true)
const checkOnClickNode = ref(true)
//上传文件组件
const uploadData = ref({})
const imageUrl = ref('')
const actionUrl = ref("http://192.168.0.106:9000/api/pic")
const auth = reactive({ Authorization: "Bearer " + localStorage.getItem("token") })
const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
const StudyStore = useStudyStore()
//其他
const elAsideStyle = ref({
        border: "1px solid #d9ecff",
        width: "200px"
})
onMounted(() => {
        init()
})
const reSizeCommonLayout = (): void => {
        let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
        let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
        let container = <HTMLElement>window.document.documentElement.getElementsByClassName("common-layout")[0]
        container.style.height = offsetHeight_ - headerHeight + "px"
}
const ondrag = (e: DragEvent) => {
        elAsideStyle.value.width = e.x - 27 + "px"
}
window.onresize = reSizeCommonLayout
const init = async () => {
        const { data: res }: { data: { msg: string, status: number, info: Info } } = await axios.get("/api/studylist")
        StudyStore.info = res.info
}
const append = async () => {
        if (StudyStore.key == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                modifydisabled.value = true
                return
        }
        const newChild = { id: StudyStore.info.insertId++, label: StudyStore.key, value: StudyStore.value }
        if (!StudyStore.node.children) {
                StudyStore.node.children = []
        }
        StudyStore.node.children.push(newChild)
        try {
                const r = await axios.post("/api/studyAdd", {
                        info: StudyStore.info
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
        if (StudyStore.key == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                return
        }
        StudyStore.info.data.push({
                label: StudyStore.key,
                id: StudyStore.info.insertId++,
                children: []
        })
        try {
                const r = await axios.post("/api/studyUpdate", {
                        info: StudyStore.info
                })
                if (r.data.status == 0) {
                        ElMessage({
                                message: '添加成功！',
                                type: 'success',
                        })
                        StudyStore.key = ""
                        StudyStore.value = ""
                }
        }
        catch (err) {
                ElMessage({
                        message: '添加失败！',
                        type: 'error',
                })
        }
}
const remove = () => {
        ElMessageBox.confirm('确定要删除吗？', '警告', {
                distinguishCancelAndClose: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
        }
        ).then(async () => {
                treeRef.value?.remove(StudyStore.node)
                try {
                        const r = await axios.post("/api/studyDel", {
                                info: StudyStore.info
                        })
                        if (r.data.status == 0) {
                                StudyStore.key = ""
                                StudyStore.value = ""
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
        if (StudyStore.key == "") {
                ElMessage({
                        message: '描述不能为空！',
                        type: 'warning',
                })
                modifydisabled.value = true
                return
        }
        StudyStore.node.label = StudyStore.key
        StudyStore.node.value = StudyStore.value
        try {
                const r = await axios.post("/api/studyUpdate", {
                        info: StudyStore.info
                })
                if (r.data.status == 0) {
                        ElMessage({
                                message: '修改成功！',
                                type: 'success',
                        })
                        modifydisabled.value = true
                        StudyStore.key = ""
                        StudyStore.value = ""
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
        StudyStore.node = node_
        modifydisabled.value = false
        if (node_.children != undefined) {
                StudyStore.key = ""
                StudyStore.value = ""
                return
        }
        StudyStore.key = node_.label
        StudyStore.value = node_.value as string
}
const clickCheck = (f1: any, f2: any) => {
        console.log(treeRef)
        console.log(f2)
        if ((f2.checkedNodes).length == 0) {
                removeManydisabled.value = true
        }
        else {
                removeManydisabled.value = false
                StudyStore.checkNodeRemove = f2.checkedNodes
        }
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
                        for (let i of StudyStore.checkNodeRemove) {
                                treeRef.value?.remove(i as unknown as Node)

                        }
                        try {
                                const r = await axios.post("/api/studyDel", {
                                        info: StudyStore.info
                                })
                                if (r.data.status == 0) {
                                        StudyStore.key = ""
                                        StudyStore.value = ""
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
        showCheckbox.value = !showCheckbox.value
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        uploadFiles.splice(0)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile) => {
        if (StudyStore.key == "") {
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const src_ = "pic" + '-' + uniqueSuffix + "." + rawFile.name.split(".").reverse()[0]
        if (!StudyStore.node.pic) {
                StudyStore.node.pic = []
        }
        StudyStore.node.pic?.push({
                src: src_
        })
        uploadData.value = {
                info: JSON.stringify(StudyStore.info),
        }
        return true
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
}
const submitUpload = () => {
        upload.value!.submit()
}
</script>
<template>
        <div class="common-layout">
                <el-container>
                        <el-aside v-bind:style="elAsideStyle">
                                <el-scrollbar>
                                        <div class="custom-tree-container">
                                                <el-tree
                                                         highlight-current
                                                         v-bind:check-on-click-node="checkOnClickNode"
                                                         v-bind:indent="20"
                                                         v-bind:check-strictly="checkStrictly"
                                                         v-on:node-click="nodeclick"
                                                         v-on:check="clickCheck"
                                                         v-bind:expand-on-click-node="isexpand"
                                                         v-bind:data="StudyStore.info.data"
                                                         v-bind:show-checkbox="showCheckbox"
                                                         node-key="id"
                                                         v-bind:default-expand-all="defaultEexpandAll"
                                                         ref="treeRef">
                                                        <template #default="{ node, data }">
                                                                <span class="custom-tree-node">
                                                                        <span>{{ node.label }}</span>
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
                                                <el-input v-model="StudyStore.key" :rows="10" type="textarea"
                                                          placeholder="请输入描述"
                                                          :autosize="{ minRows: 3, maxRows: 6 }" />
                                        </el-form-item>
                                        <el-form-item label="解答">
                                                <el-row v-bind:gutter="20" :style="{ width: '100%' }">
                                                        <el-col :span="12">
                                                                <el-input v-model="StudyStore.value" v-bind:rows="10"
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

@media screen and (max-width:764px) {
        .el-aside {
                width: 200px;
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
