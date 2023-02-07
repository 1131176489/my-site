<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { StudyStore } from '../assets/Study'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage, ElMessageBox, ElTree, TreeNode } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { update } from 'lodash';
import { da } from 'element-plus/es/locale';
const treeRef = ref<InstanceType<typeof ElTree>>()
const modifydisabled = ref(true)
const isexpand = ref(true)
const removeManydisabled = ref(true)
const { key, value, info, data, node, checkNodeRemove } = storeToRefs(StudyStore())

interface Tree {
        id: number,
        label: string,
        timestamp?: number,
        children?: Tree[],
        value?: string,
        parent?: string,
        pic?: string
}
interface Info {
        _id: string,
        insertId: number,
        useremail: string,
        data: Tree[]
}
function reSizeCommonLayout(): void {
        let offsetHeight_ = (window.document.documentElement as HTMLElement).offsetHeight
        let headerHeight = (window.document.documentElement.getElementsByClassName("header")[0] as HTMLElement).scrollHeight
        let container = <HTMLElement>window.document.documentElement.getElementsByClassName("common-layout")[0]
        container.style.height = offsetHeight_ - headerHeight + "px"
}

const init = async () => {
        setTimeout(reSizeCommonLayout, 100)
        const { data: res }: { data: { msg: string, status: number, info: Info } } = await axios.get("/api/studylist")
        info.value = res.info
        data.value.push(...info.value.data)

        console.log(info)
        // data.value.push(...res.data)
}
onMounted(() => {
        init()
})
window.onresize = reSizeCommonLayout


const modifyClick = (node_: Tree) => {
        console.log(node_)
        node.value = node_
        modifydisabled.value = false
        key.value = node_.label
        value.value = node_.value as string

}
const append = async (data: Tree) => {
        if (key.value == "") {
                ElMessage({
                        message: '描述不能为空',
                        type: 'warning',
                })
                return
        }
        const newChild = { id: info.value.insertId++, label: key.value, value: value.value }
        if (!data.children) {
                data.children = []
        }
        data.children.push(newChild)
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
                id: info.value.insertId++
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
const remove = (node: Node, data1: Tree) => {
        ElMessageBox.confirm(
                '确定要删除吗？',
                '警告',
                {
                        distinguishCancelAndClose: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning',
                }
        ).then(async () => {

                console.log(node)
                console.log(data1.id)
                treeRef.value?.remove(node)
                info.value.data = data.value
                console.log(data.value)
                console.log(info.value)
                try {
                        const r = await axios.post("/api/studyDel", {
                                info: info.value
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
                                message: '删除失败！',
                                type: 'error',
                        })
                }
                finally {
                        key.value = ""
                        value.value = ""
                }
        }).catch(() => {

        })

}
const update = async () => {

        node.value.label = key.value
        node.value.value = value.value
        console.log(node.value)
        console.log(info.value)
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
const nodeclick = async (node: Tree) => {
        key.value = node.label
        if (!node.value) {
                value.value = node.value as string
        }

        console.log()
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
                                        ElMessage({
                                                message: '删除成功！',
                                                type: 'success',
                                        })
                                        removeManydisabled.value = true
                                }
                        }
                        catch (err) {
                                ElMessage({
                                        message: '删除失败！',
                                        type: 'error',
                                })
                        }
                        finally {
                                key.value = ""
                                value.value = ""
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


const imageUrl = ref('')
const actionUrl = ref("http://192.168.0.106:9000/api/pic")
const auth = reactive({ Authorization: "Bearer " + localStorage.getItem("token") })
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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
        return true
}
const upload = ref<UploadInstance>()
const submitUpload = () => {
        upload.value!.submit()
}
</script>


<template>


        <div class="common-layout">
                <el-container>

                        <el-main>
                                <!-- <el-form>
                                        <el-input v-model="key" :rows="10" type="textarea"
                                                  placeholder="请输入描述"
                                                  :autosize="{ minRows: 5, maxRows: 8 }" resize="none" />
                                        <el-input v-model="value" :rows="10" type="textarea"
                                                  placeholder="请输入解答"
                                                  :autosize="{ minRows: 5, maxRows: 8 }" resize="none" />
                                        <el-button type="primary" v-bind:disabled="modifydisabled"
                                                   v-on:click="update">确认修改</el-button>
                                        <el-button type="primary" v-bind:disabled="removeManydisabled"
                                                   v-on:click="removeMany">批量删除</el-button>
                                        <el-button type="primary"
                                                   v-on:click="append1">增加分类</el-button>
                                </el-form> -->
                                <el-form label-position="top">
                                        <el-form-item label="描述">
                                                <el-input v-model="key" :rows="10" type="textarea"
                                                          placeholder="请输入描述"
                                                          :autosize="{ minRows: 3, maxRows: 6 }" resize="none" />
                                        </el-form-item>
                                        <el-form-item label="解答">
                                                <el-input v-model="value" :rows="10" type="textarea"
                                                          placeholder="请输入解答"
                                                          :autosize="{ minRows: 8, maxRows: 8 }" resize="none" />
                                        </el-form-item>
                                        <el-form-item>
                                                <el-button type="primary" v-bind:disabled="modifydisabled"
                                                           v-on:click="update">确认修改</el-button>
                                                <el-button type="primary" v-bind:disabled="removeManydisabled"
                                                           v-on:click="removeMany">批量删除</el-button>

                                        </el-form-item>
                                        <el-form-item>
                                                <el-button type="primary"
                                                           v-on:click="append1">增加分类</el-button>

                                        </el-form-item>
                                        <el-form-item>
                                                <el-upload
                                                           :auto-upload="false"
                                                           name="pic"
                                                           v-bind:headers="auth"
                                                           ref="upload"
                                                           class="avatar-uploader"
                                                           v-bind:action="actionUrl"
                                                           :show-file-list="false"
                                                           :on-success="handleAvatarSuccess"
                                                           :before-upload="beforeAvatarUpload">
                                                        <template #trigger>
                                                                <el-button type="primary">选择文件</el-button>
                                                        </template>
                                                        <el-button type="success" @click="submitUpload">
                                                                点击上传
                                                        </el-button>
                                                </el-upload>
                                        </el-form-item>
                                </el-form>
                        </el-main>
                        <el-aside>
                                <el-scrollbar>
                                        <div class="custom-tree-container">
                                                <el-tree
                                                         v-on:node-click="nodeclick"
                                                         v-on:check="clickCheck"
                                                         v-bind:expand-on-click-node="isexpand"
                                                         v-bind:data="data"
                                                         show-checkbox
                                                         node-key="id"
                                                         default-expand-all
                                                         ref="treeRef">
                                                        <template #default="{ node, data }">
                                                                <span class="custom-tree-node">
                                                                        <span>{{ node.label }}</span>
                                                                        <span>
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
                                                                        </span>
                                                                </span>
                                                        </template>
                                                </el-tree>
                                        </div>
                                </el-scrollbar>
                        </el-aside>
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

.el-aside {
        width: 500px;
}

.common-layout,
.el-container {
        height: 100%;
}

/* .el-form{
        display: inline;
} */
.el-scrollbar {
        height: 100%;
        display: inline;
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

/* @media screen and (min-width:765px) {
        .el-container {
                height: 100%;
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
        }
        .el-textarea {
                display: block;
                width: 100%; 
                font-size: 24px;
                font-family: 'Times New Roman', Times, serif;
                font-weight: 900;
        }
        .el-textarea__inner {
                font-weight: 900;
        }
} */

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
