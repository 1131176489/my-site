<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue';
import { useStudyStore } from '../assets/Study'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, ElAside } from 'element-plus'
import type { Tree, Info } from "../assets/Study"
import { globalStore } from "../assets/Global"
import axios from 'axios'
import type Node from 'element-plus/es/components/tree/src/model/node'
import 'element-plus/theme-chalk/display.css'

const treeRef = ref<InstanceType<typeof ElTree>>()
const upload = ref<UploadInstance>()
//树状组件
const isexpand = ref(false)
const showCheckbox = ref(false)
const defaultEexpandAll = ref(false)
const checkStrictly = ref(true)
const checkOnClickNode = ref(false)
const selectManyKey = ref(false)
const selectManyMsg = ref("选择多个项目")
const appendChildrenKey = ref(false)
//上传文件组件
const uploadData = ref({})
const uploadDisabled = ref(true)
const imageUrl = ref('')
const actionUrl = ref("http://192.168.0.106:9000/api/pic")
const auth = reactive({ Authorization: "Bearer " + localStorage.getItem("token") })
const StudyStore = useStudyStore()
const show = ref(true)
const filename: string[] = reactive([])
const vrow = computed(() => {
        return document.getElementsByTagName("html")[0].clientWidth >500? 5:3
})
//其他
const value1 = ref(true)//是否显示解答
const globalStoreData = globalStore()
const imgShow = computed(() => {
        return StudyStore.node && StudyStore.node!.pic && StudyStore.node!.pic.length != 0 && show
})
const elAsideStyle = ref({
        border: "1px solid #d9ecff",
        width: "12.5rem"
})
const formAside = ref({
        "flex-grow": "1"
})
const scrollbarMain = ref({
        width: "12.5rem"
})
onMounted(() => {
        getData()
        axios.get("/api/userinfo", {}).then((res) => {
                globalStoreData.userinfo = res.data.userinfo
                if (globalStoreData.userinfo.Study_value1 != undefined) {
                        value1.value = globalStoreData.userinfo.Study_value1
                }
                if (globalStoreData.userinfo.Study_defaultEexpandAll != undefined) {
                        defaultEexpandAll.value = globalStoreData.userinfo.Study_defaultEexpandAll
                }
                console.log(defaultEexpandAll.value)
                setTimeout(defaultEexpandAllHandle, 500)
        }).catch((err) => {
                ElMessage({ "type": "error", message: "获取数据失败" + "错误信息：" + err.message })
        })
})
// onUpdated(() => {
//         defaultEexpandAllHandle()
// })
const sendUserInfo = () => {
        axios.post("/api/userinfo", {
                userinfo: globalStoreData.userinfo
        })
}
const ondrag = (e: DragEvent) => {
        elAsideStyle.value.width = e.x - 27 + "px"
}
const tm = (e: TouchEvent) => {
        console.log("666")
}
const ts = (e: TouchEvent) => {
        alert(666)
}
// window.onresize = reSizeCommonLayout
const getData = async () => {
        const { data: res }: { data: { msg: string, status: number, info: Info } } = await axios.get("/api/studylist")
        StudyStore.info = res.info
}
//点击解答与否的回调
const elSwitchChange = () => {
        console.log(value1.value)
        if (value1.value) {
                if (StudyStore.node == null) {
                        StudyStore.setKeyValue("", "")
                }
                else {
                        StudyStore.setKeyValue(StudyStore.node.label, StudyStore.node.value)
                }
        }
        else {
                if (StudyStore.node == null) {
                        StudyStore.setKeyValue("", "")
                } else {
                        StudyStore.setKeyValue(StudyStore.node.label, "不显示解答")
                }
        }
        globalStoreData.userinfo.Study_value1 = value1.value
        sendUserInfo()
}
const defaultEexpandAllHandle = () => {
        console.log("qq:", defaultEexpandAll.value)
        const childrenNode = treeRef.value?.store.nodesMap
        if (defaultEexpandAll.value) {
                console.log(666)
                for (let i in childrenNode) {
                        childrenNode[i].expanded = true
                        console.log(childrenNode[i].expanded)
                }
        }
        else {
                console.log(777)
                for (let i in childrenNode) {
                        childrenNode[i].expanded = false
                }
        }
        // console.log(childrenNode)
        globalStoreData.userinfo.Study_defaultEexpandAll = defaultEexpandAll.value
        sendUserInfo()
}
//点击项目的回调
const nodeclick = async (node_: Tree) => {
        StudyStore.node = node_
        if (!selectManyKey.value) {
                if (value1.value) {
                        StudyStore.setKeyValue(StudyStore.node.label, StudyStore.node.value as string)

                }
                else {
                        StudyStore.setKeyValue(StudyStore.node.label, "不显示解答")

                }
        }
        else if (selectManyKey.value) {
                StudyStore.checkNode = treeRef.value?.getCheckedKeys() as number[]
        }
        appendChildrenKey.value = false
}
//修改一个项目的回调
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
        else if (value1.value == false) {
                ElMessage({
                        message: '请先把按钮调整到显示解答',
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
                }
        }
        catch (err) {
                console.log(err)
                ElMessage({
                        message: '修改失败！失败原因：' + (err as Error).message,
                        type: 'error',
                })
        }
}
//删除一个项目的回调
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
                        }
                }
                catch (err) {
                        ElMessage({
                                message: '删除失败！失败原因：' + (err as Error).message,
                                type: 'error',
                        })
                }
        }).catch(() => { })

}
//添加一个子项目的回调
const appendChildren = () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        StudyStore.clearKeyValue()
        ElMessage({ message: '请输入描述和解答', type: 'success', })
        appendChildrenKey.value = true
}
//确认添加子项目
const appendChildrenConfirm = async () => {
        if (!StudyStore.node) {
                ElMessage({
                        message: '请选择一个项目',
                        type: 'warning',
                })
                return
        }
        if (!StudyStore.key) {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                return
        }

        const newChild = { id: StudyStore.info.insertId++, label: StudyStore.key, value: StudyStore.value }
        if (!StudyStore.node!.children) {
                StudyStore.node.children = []
        }
        StudyStore.node!.children.push(newChild)
        try {
                const r = await axios.post("/api/studyAdd", {
                        info: StudyStore.info
                })
                if (r.data.status == 0) {
                        ElMessage({ message: '添加成功！', type: 'success', })
                        StudyStore.clearKeyValue()
                }
        }
        catch (err) {
                ElMessage({
                        message: '添加失败！失败原因：' + (err as Error).message,
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
const imageError = () => {
        show.value = false
        setTimeout(() => {
                show.value = true
                console.log(999)
        }, 1000)
}
const handlePicSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
        uploadFiles.splice(0)
        filename.splice(0)
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
                flag: uniqueSuffix,
        }
        console.log(uploadData.value)
        return true
}
const delPic = (item: string) => {
        for (let i = 0; i < (StudyStore.node!.pic as { src: string }[]).length; i++) {
                if ((StudyStore.node!.pic as { src: string }[])[i].src == item) {
                        StudyStore.node!.pic?.splice(i, 1)
                        break
                }
        }
        axios.post("/api/picDel", {
                delFileName: item,
                info: StudyStore.info
        }).then(() => {
                ElMessage({ type: "success", message: "删除成功" })
        }).catch((err) => {
                ElMessage({ type: "error", message: "删除失败，失败原因：" + err.message })
        }).finally(() => {
        })
}
//批量选择
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
//批量删除
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
                                        ElMessage({
                                                message: '删除成功！',
                                                type: 'success',
                                        })
                                }
                        }
                        catch (err) {
                                ElMessage({
                                        message: '删除失败！失败原因：' + (err as Error).message,
                                        type: 'error',
                                })
                        }
                }
                catch (err) {
                        ElMessage({
                                message: '删除失败！失败原因：' + (err as Error).message,
                                type: 'error',
                        })
                }
        }).catch(() => {

        })
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
                children: [],
                value: ""
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
                        <div class="drag" draggable="true" v-on:drag="ondrag" v-on:touchmove="tm" v-on:touchstart="ts">
                                |||
                        </div>
                        <el-scrollbar style="width: 100%;height:100%" v-bind:height="'100%'"
                                      v-bind:view-style="{ height: '100%' }">
                                <el-main style="border: 1px solid #d9ecff;">
                                        <div class="common-layout">
                                                <el-container>
                                                        <el-aside v-bind:style="formAside">
                                                                <el-form label-position="top">
                                                                        <el-form-item>
                                                                                <el-button
                                                                                           type="warning"
                                                                                           plain
                                                                                           v-bind:disabled="selectManyKey"
                                                                                           v-on:click="updateOne">
                                                                                        {{ "修改项目" }}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="danger"
                                                                                           plain
                                                                                           v-bind:disabled="selectManyKey"
                                                                                           v-on:click="removeOne">
                                                                                        {{ "删除项目" }}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="selectManyKey"
                                                                                           v-on:click="appendChildren">
                                                                                        {{ "添加子项目"}}
                                                                                </el-button>
                                                                                <el-button
                                                                                           type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="!appendChildrenKey || selectManyKey"
                                                                                           v-on:click="appendChildrenConfirm">
                                                                                        {{ "确认添加"}}
                                                                                </el-button>
                                                                                <el-button type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="selectManyKey"
                                                                                           v-on:click="append1">
                                                                                        {{ "添加一个分类" }}
                                                                                </el-button>

                                                                        </el-form-item>
                                                                        <el-form-item>
                                                                                <el-upload
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
                                                                                                           v-bind:disabled="appendChildrenKey || selectManyKey"
                                                                                                           v-on:click="appendPic"
                                                                                                           type="primary">
                                                                                                        {{ "添加图片"}}
                                                                                                </el-button>
                                                                                        </template>
                                                                                        <el-switch
                                                                                                   v-on:change="elSwitchChange"
                                                                                                   v-model="value1"
                                                                                                   style="margin-left: 10px;"
                                                                                                   active-text="显示解答"
                                                                                                   inactive-text="不显示解答" />
                                                                                        <el-switch
                                                                                                   v-on:change="defaultEexpandAllHandle"
                                                                                                   v-model="defaultEexpandAll"
                                                                                                   style="margin-left: 10px;"
                                                                                                   active-text="全部展开"
                                                                                                   inactive-text="全部收起" />
                                                                                </el-upload>
                                                                        </el-form-item>
                                                                        <el-form-item>
                                                                                <el-button type="primary"
                                                                                           plain
                                                                                           v-bind:disabled="!selectManyKey"
                                                                                           v-on:click="removeMany">
                                                                                        {{ "批量删除" }}
                                                                                </el-button>

                                                                                <el-button type="primary"
                                                                                           plain

                                                                                           v-on:click="selectMany">
                                                                                        {{ selectManyMsg }}
                                                                                </el-button>
                                                                        </el-form-item>

                                                                        <el-form-item label="描述">
                                                                                <el-input v-model="StudyStore.key"
                                                                                          v-bind:rows="2"
                                                                                          type="textarea"
                                                                                          placeholder="请输入描述" />
                                                                        </el-form-item>
                                                                        <el-form-item label="解答">
                                                                                <el-input v-model='StudyStore.value'
                                                                                          v-bind:rows="vrow"
                                                                                          type="textarea"
                                                                                          placeholder="请输入解答" />
                                                                        </el-form-item>
                                                                </el-form>
                                                        </el-aside>
                                                        <el-main v-if="imgShow"
                                                                 v-bind:style="scrollbarMain" class="img">
                                                                <el-scrollbar
                                                                              style="padding: 20px;border: 1px solid  #d9ecff;">
                                                                        <div v-for="( item, index ) in StudyStore.node!.pic"
                                                                             style="position: relative;">
                                                                                <el-image

                                                                                          v-bind:key="index"
                                                                                          fit='scale-down'
                                                                                          v-bind:src="'http://192.168.0.106:9000/' + item.src" />
                                                                                <div title="点击删除"
                                                                                     style="cursor: pointer;"
                                                                                     v-on:click="delPic(item.src,)">
                                                                                        <svg viewBox="0 0 1024 1024"
                                                                                             xmlns="http://www.w3.org/2000/svg"
                                                                                             data-v-029747aa=""
                                                                                             style="position: absolute;top: 0px;right: 0px;width: 20px;height: 20px;z-index:5 ;">
                                                                                                <path fill="currentColor"
                                                                                                      d="m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z">

                                                                                                </path>
                                                                                                <path fill="currentColor"
                                                                                                      d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z">
                                                                                                </path>
                                                                                        </svg>
                                                                                </div>

                                                                        </div>
                                                                </el-scrollbar></el-main>
                                                </el-container>
                                        </div>

                                </el-main>
                        </el-scrollbar>

                </el-container>
        </div>
</template> 
<style scoped>
.common-layout,
.el-container {
        height: 100%;
}

.el-main {
        height: 100%;
}

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
        .el-container {
                flex-direction: column;

        }

        .common-layout,
        .el-container {
                height:auto
        }

        .el-tree {
                font-size: 16px;
        }

        .el-aside {
                width: 100% !important;
        }

        .drag {
                display: none;
        }

        .img {
                width: 100% !important;
        }

        .el-textarea {
                font-size: 16px;
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
