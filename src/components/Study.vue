<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useStudyStore } from '../assets/Study'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, ElAside } from 'element-plus'
import type { Tree, Info } from "../assets/Study"
import axios from 'axios'
import type Node from 'element-plus/es/components/tree/src/model/node'
import 'element-plus/theme-chalk/display.css'

const treeRef = ref<InstanceType<typeof ElTree>>()
const upload = ref<UploadInstance>()
//树状组件
const modifydisabled = ref(true)
const isexpand = ref(false)
const removeManydisabled = ref(true)
const showCheckbox = ref(false)
const defaultEexpandAll = ref(true)
const checkStrictly = ref(true)
const checkOnClickNode = ref(false)
const selectOneKey = ref(false)
const selectOneMsg = ref("选择一个项目")
const selectManyKey = ref(false)
const selectManyMsg = ref("选择多个项目")
const appendOneKey = ref(false)
//上传文件组件
const uploadData = ref({})
const uploadDisabled = ref(true)
const imageUrl = ref('')
const actionUrl = ref("http://192.168.0.106:9000/api/pic")
const auth = reactive({ Authorization: "Bearer " + localStorage.getItem("token") })
const StudyStore = useStudyStore()
const count = ref(0)
const filename :string[]= reactive([])
//其他
const havePic = ref(true)
const elAsideStyle = ref({
        border: "1px solid #d9ecff",
        width: "200px"
})
const formAside = ref({
        // width: "100%",
        // border: "1px solid #d9ecff",
        "flex-grow": "1"
})
const scrollbarMain = ref({
        width: "200px"
})
onMounted(() => {
        getData()
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
const getData = async () => {
        const { data: res }: { data: { msg: string, status: number, info: Info } } = await axios.get("/api/studylist")
        StudyStore.info = res.info
}
//树状组件
const selectOne = () => {
        if (selectOneKey.value == false) {
                selectOneMsg.value = "取消选择"
                showCheckbox.value = true
                checkOnClickNode.value = true
                selectOneKey.value = true

        }
        else if (selectOneKey.value == true) {
                selectOneMsg.value = "选择一个项目"
                showCheckbox.value = false
                checkOnClickNode.value = false
                selectOneKey.value = false
                appendOneKey.value = false
                uploadDisabled.value = true
                if (StudyStore.node) {
                        treeRef.value?.setChecked(StudyStore.node!.id, false, false)
                }
                StudyStore.clearKeyValue()
                StudyStore.node = null
        }
}
const updateOne = async () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        else if (StudyStore.key == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
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
                        getData()
                        selectOne()
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
const appendPic = () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        uploadDisabled.value = false
        if (!StudyStore.node.pic) {
                StudyStore.node.pic = []
        }
}
const handlePicProgress: UploadProps['onProgress'] = (evt, uploadFile, uploadFiles) => {
        console.log(evt)
        console.log( count.value++)
}
const handlePicSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        uploadFiles.splice(0)
        console.log("handlePicSuccess", response)
        filename.splice(0)
//        console.log( count.value++)
}
const beforePicUpload: UploadProps['beforeUpload'] = async (rawFile) => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
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
        StudyStore.node!.pic?.push({
                src: src_
        })
        filename.push(src_)
        uploadData.value = {
                info: JSON.stringify(StudyStore.info),
                filename: JSON.stringify(filename),
                flag:uniqueSuffix,
        }
        console.log(uploadData.value)
        return true
}
const submit = () => {
        upload.value?.submit()
}
const removeOne = () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        ElMessageBox.confirm('确定要删除吗？', '警告', {
                distinguishCancelAndClose: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
        }
        ).then(async () => {
                treeRef.value?.remove(StudyStore.node as any)
                try {
                        const r = await axios.post("/api/studyDel", {
                                info: StudyStore.info
                        })
                        if (r.data.status == 0) {
                                ElMessage({
                                        message: '删除成功！',
                                        type: 'success',
                                })
                                getData()
                                selectOne()
                        }
                }
                catch (err) {
                        ElMessage({
                                message: '删除失败！',
                                type: 'error',
                        })
                }
        }).catch(() => { })

}
const appendOne = () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        StudyStore.clearKeyValue()
        ElMessage({
                message: '请输入描述和解答，可添加图片',
                type: 'success',
        })
        appendOneKey.value = true
        // const newChild = { id: StudyStore.info.insertId++, label: StudyStore.key, value: StudyStore.value }
        // if (!StudyStore.node!.children) {
        //         StudyStore.node.children = []
        // }
        // StudyStore.node!.children.push(newChild)
        // try {
        //         const r = await axios.post("/api/studyAdd", {
        //                 info: StudyStore.info
        //         })
        //         if (r.data.status == 0) {
        //                 ElMessage({
        //                         message: '添加成功！',
        //                         type: 'success',
        //                 })
        //         }
        // }
        // catch (err) {
        //         ElMessage({
        //                 message: '添加失败！',
        //                 type: 'error',
        //         })
        // }
}

const selectMany = () => {
        if (selectManyKey.value == false) {
                StudyStore.clearKeyValue()
                selectManyMsg.value = "取消选择"
                selectManyKey.value = true
                showCheckbox.value = true
                checkOnClickNode.value = true
        }
        else if (selectManyKey.value == true) {
                selectManyMsg.value = "选择多个项目"
                selectManyKey.value = false

                showCheckbox.value = false
                checkOnClickNode.value = false
                for (let i of StudyStore.checkNode) {
                        treeRef.value?.setChecked(i, false, false)
                }
                StudyStore.clearKeyValue()
                StudyStore.node = null
        }
}
const nodeclick = async (node_: Tree) => {

        if (selectOneKey.value == true) {
                StudyStore.node = node_
                StudyStore.checkNode = treeRef.value?.getCheckedKeys() as number[]
                for (let i of StudyStore.checkNode) {
                        treeRef.value?.setChecked(i, false, false)
                }
                treeRef.value?.setChecked(StudyStore.node.id, true, false)
                StudyStore.setKeyValue(StudyStore.node.label, StudyStore.node.value as string)
        }
        else if (selectManyKey.value == true) {
                // StudyStore.node = node_

                StudyStore.checkNode = treeRef.value?.getCheckedKeys() as number[]
                // StudyStore.setKeyValue(StudyStore.node.label, StudyStore.node.value as string)
        }
        else {
                StudyStore.setKeyValue(node_.label, node_.value as string)
                StudyStore.node = node_
        }
}
const currentChange = () => {
        // current-change
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
                        for (let i of StudyStore.checkNode) {
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


const clickCheck = (f1: any, f2: any) => {
        if ((f2.checkedNodes).length == 0) {
                removeManydisabled.value = true
        }
        else {
                removeManydisabled.value = false
                StudyStore.checkNode = f2.checkedNodes
        }
}



const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
}
</script>
<template>
        <div class="common-layout">
                <el-container>
                        <el-aside v-bind:style="elAsideStyle">
                                <el-scrollbar>
                                        <div class="custom-tree-container">
                                                <el-tree
                                                         v-bind:default-expand-all="defaultEexpandAll"
                                                         v-bind:check-on-click-node="checkOnClickNode"
                                                         v-bind:indent="20"
                                                         v-bind:check-strictly="checkStrictly"
                                                         v-bind:expand-on-click-node="isexpand"
                                                         v-bind:data="StudyStore.info.data"
                                                         v-bind:show-checkbox="showCheckbox"
                                                         v-on:node-click="nodeclick"
                                                         v-on:check="clickCheck"
                                                         v-on:current-change=""
                                                         node-key="id"
                                                         highlight-current
                                                         ref="treeRef">
                                                        <template #default="{ node }">
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
                        <el-main style="border: 1px solid #d9ecff;">
                                <div class="common-layout">
                                        <el-container> 
                                                <el-aside v-bind:style="formAside">
                                                        <el-form label-position="top">
                                                                <el-form-item>
                                                                        <el-button-group>
                                                                                <el-button
                                                                                           type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="selectManyKey"
                                                                                           v-on:click="selectOne">
                                                                                        {{ selectOneMsg }}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="warning"
                                                                                           plain
                                                                                           v-bind:disabled="!selectOneKey"
                                                                                           v-on:click="updateOne">
                                                                                        {{ "修改项目" }}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="danger"
                                                                                           plain
                                                                                           v-bind:disabled="!selectOneKey"
                                                                                           v-on:click="removeOne">
                                                                                        {{ "删除项目" }}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="!selectOneKey"
                                                                                           v-on:click="appendOne">
                                                                                        {{ "添加子项目"}}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="!appendOneKey || !selectOneKey"
                                                                                           v-on:click="appendOne">
                                                                                        {{ "确认添加"}}
                                                                                </el-button>
                                                                        </el-button-group>
                                                                </el-form-item>
                                                                <el-form-item>
                                                                        <el-upload
                                                                                v-bind:on-progress="handlePicProgress"
                                                                                   v-bind:on-change="handleChange"
                                                                                   v-bind:auto-upload="true"
                                                                                   v-bind:action="actionUrl"
                                                                                   v-bind:show-file-list="true"
                                                                                   v-bind:on-success="handlePicSuccess"
                                                                                   v-bind:before-upload="beforePicUpload"
                                                                                   v-bind:headers="auth"
                                                                                   v-bind:data="uploadData"
                                                                                   v-bind:disabled="uploadDisabled"
                                                                                   name="pic"
                                                                                   ref="upload"
                                                                                   multiple>
                                                                                <template #trigger>
                                                                                        <el-button
                                                                                                   plain
                                                                                                   v-bind:disabled="!selectOneKey"
                                                                                                   v-on:click="appendPic"
                                                                                                   type="primary">
                                                                                                {{ "添加图片(可选)"}}
                                                                                        </el-button>
                                                                                </template>
                                                                        </el-upload>
                                                                </el-form-item>
                                                                <el-form-item>
                                                                        
                                                                                <el-button type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="selectOneKey"
                                                                                           v-on:click="selectMany">
                                                                                        {{ selectManyMsg }}
                                                                                </el-button>
                                                                        
                                                                </el-form-item>

                                                                <el-form-item label="描述">
                                                                        <el-input v-model="StudyStore.key"
                                                                                  v-bind:rows="10"
                                                                                  type="textarea"
                                                                                  placeholder="请输入描述"
                                                                                  v-bind:autosize="{ minRows: 3, maxRows: 6 }" />
                                                                </el-form-item>
                                                                <el-form-item label="解答">
                                                                        <el-input v-model="StudyStore.value"
                                                                                  v-bind:rows="10" type="textarea"
                                                                                  placeholder="请输入解答" />
                                                                </el-form-item>
                                                        </el-form>
                                                </el-aside>
                                                <el-main v-if="StudyStore.node && StudyStore.node!.pic"
                                                         v-bind:style="scrollbarMain">
                                                        <el-scrollbar style="padding: 20px;border: 1px solid  #d9ecff;">
                                                                <el-image v-for="( item, index ) in StudyStore.node!.pic"
                                                                          v-bind:key="index"
                                                                          fit='scale-down'
                                                                          v-bind:src="'http://192.168.0.106:9000/'+item.src" style="position: relative;">
                                                                          
                                                                          <el-icon>
                                                                                删除
                                                                                <CircleClose />
                                                                        </el-icon>
                                                                </el-image>
                                                        </el-scrollbar></el-main>
                                        </el-container>
                                </div>

                        </el-main>
                </el-container>
        </div>
</template> 
<style scoped>
.common-layout,
.el-container {
        height: 100%;
}

.el-main {}

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
        font-size: 16px;
        cursor: pointer;
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
