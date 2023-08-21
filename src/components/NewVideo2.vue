<template>
        <el-dialog
                   v-model="dialogVisible"
                   :title="'当前路径：' + currentDir"
                   width="30%">
                <el-scrollbar style="height:300px;">
                        <el-tree
                                 v-bind:data="mydata"
                                 v-bind:render-after-expand=true
                                 v-on:node-click="dirselect" />
                </el-scrollbar>
                <el-form
                         ref="ruleFormRef"
                         :model="ruleForm"
                         style="margin-top: 30px;"
                         :rules="rules">
                        <el-form-item label="文件夹名称" prop="dirname">
                                <el-input v-model="ruleForm.dirname" type="text" autocomplete="off" />
                        </el-form-item>
                        <el-form-item>
                                <el-button type="primary" @click="submit(ruleFormRef)">确定</el-button>
                                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                        </el-form-item>
                </el-form>
        </el-dialog>
        <el-dialog
                   v-model="dialogVisibleUpload"
                   :title="'当前路径：' + currentDir"
                   width="30%">
                <el-scrollbar style="height:300px;">
                        <el-tree
                                 v-bind:data="mydata"
                                 v-bind:render-after-expand=true
                                 v-on:node-click="dirselect" />
                </el-scrollbar>
                <el-button type="primary" @click="submitUploadConfirm">
                        确定
                </el-button>
                <el-button @click="() => { dialogVisibleUpload = false; }">取消</el-button>
        </el-dialog>
        <el-dialog
                   v-model="dialogVisibleDel"
                   :title="'选择文件夹，当前文件夹：' + currentDir"
                   width="30%">
                <el-scrollbar style="height:300px;">
                        <el-tree
                                 v-bind:data="mydata"
                                 v-bind:render-after-expand=true
                                 v-on:node-click="dirselect" />
                </el-scrollbar>
                <template #footer>
                        <span class="dialog-footer">
                                <el-button @click="() => { dialogVisibleDel = false; }">取消</el-button>
                                <el-button type="primary" @click="comfirmDel">
                                        确定
                                </el-button>
                        </span>
                </template>
        </el-dialog>
        <el-drawer v-model="drawer" :with-header="false" :direction="'ltr'"
                   :size="'90%'">
                <el-scrollbar>
                        <el-tree
                                 v-bind:data="mydata"
                                 v-bind:render-after-expand=true
                                 v-on:node-click="handleClick" />
                </el-scrollbar>
        </el-drawer>
        <el-drawer v-model="drawer1" :with-header="false" :direction="'ltr'"
                   :size="'90%'">
                <el-link style="margin:20px 20px 20px 20px;" @click="dialogVisible = true">
                        新建文件夹
                </el-link>
                <el-link style="margin:20px 20px 20px 20px;" @click="dialogVisibleDel = true">
                        删除文件夹
                </el-link>
                <el-upload
                           :data="uploadData"
                           ref="upload"
                           class="upload-demo"
                           :action="baseUrl + 'uploads2'"
                           :limit="1"
                           :on-exceed="handleExceed"
                           :auto-upload="false"
                           :before-upload="beforeUpload"
                           style="display: flex;flex-wrap: wrap;align-items: center;">
                        <template #trigger>
                                <el-button type="primary" style="margin-left: 20px;">选择文件</el-button>
                        </template>
                        <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left: 20px;">
                                上传至服务器
                        </el-button>
                </el-upload>
        </el-drawer>
        <div class="common-layout hidden-xs-only">
                <el-container style="overflow: hidden;">
                        <el-header>
                                <el-link :href="'/#/'">
                                        my-site
                                </el-link>
                                <el-link style="margin-left: 20px;" @click="dialogVisible = true">
                                        新建文件夹
                                </el-link>
                                <el-link style="margin-left: 20px;" @click="dialogVisibleDel = true">
                                        删除文件夹
                                </el-link>
                                <el-upload
                                           :data="uploadData"
                                           ref="upload"
                                           class="upload-demo"
                                           :action="baseUrl + 'uploads2'"
                                           :limit="1"
                                           :on-exceed="handleExceed"
                                           :auto-upload="false"
                                           :before-upload="beforeUpload"
                                           style="display: flex;flex-wrap: wrap;align-items: center;">
                                        <template #trigger>
                                                <el-button type="primary" style="margin-left: 20px;">选择文件</el-button>
                                        </template>
                                        <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left: 20px;">
                                                上传至服务器
                                        </el-button>
                                </el-upload>
                        </el-header>
                        <el-container>
                                <el-aside width="300px" style="border: 1px solid blue;">
                                        <el-scrollbar>
                                                <el-tree
                                                         v-bind:data="mydata"
                                                         v-bind:render-after-expand=true
                                                         v-on:node-click="handleClick" />
                                        </el-scrollbar>
                                </el-aside>
                                <el-main>
                                        <el-scrollbar>
                                                <el-row>
                                                        <div class="renderdata_container">
                                                                <div class="renderdata_item" v-for="item in renderdata" alt="">
                                                                        <el-image
                                                                                  :src='baseUrl + userEmail + videoData.currentVideoList + "/" + item + ".jpg"'
                                                                                  :fit="'scale-down'"
                                                                                  v-on:click="linkclick(item)">
                                                                        </el-image>
                                                                        <div class="renderdata_item_title" :title="item">
                                                                                {{ item }}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </el-row>
                                        </el-scrollbar>
                                </el-main>
                        </el-container>
                </el-container>
        </div>
        <div class="common-layout hidden-sm-and-up">
                <el-container>
                        <el-header>
                                <div v-on:click="drawer = true"
                                     class="hidden-sm-and-up openList">
                                        |||
                                </div>
                                <div v-on:click="drawer1 = true"
                                     class="hidden-sm-and-up openFile">
                                        |||
                                </div>
                        </el-header>
                        <el-main>
                                <div class="renderdata_container">
                                        <div class="renderdata_item" v-for="item in renderdata" alt="">
                                                <el-image
                                                          :src='baseUrl + userEmail + videoData.currentVideoList + "/" + item + ".jpg"'
                                                          :fit="'scale-down'"
                                                          v-on:click="linkclick(item)">
                                                </el-image>
                                                <div class="renderdata_item_title" :title="item">
                                                        {{ item }}
                                                </div>
                                        </div>
                                </div>
                        </el-main>
                </el-container>
        </div>
        <!-- <el-main>
                <el-row class="hidden-sm-and-up" style="height: 48px;">
                        <div v-on:click="drawer = true">
                                |||
                        </div>
                </el-row>
                <el-row>
                        <el-col :sm="{ span: 6 }" class="hidden-xs-only">
                                <el-scrollbar>
                                        <el-tree
                                                 v-bind:data="mydata"
                                                 v-bind:render-after-expand=true
                                                 v-on:node-click="handleClick" />
                                </el-scrollbar>
                        </el-col>
                        <el-col :sm="{ span: 18 }">
                                <el-scrollbar>
                                        <el-row>
                                                <div class="renderdata_container">
                                                        <div class="renderdata_item" v-for="item in renderdata" alt="">
                                                                <el-image
                                                                          :src='baseUrl + userEmail + current_index + "/" + item + ".jpg"'
                                                                          :fit="'scale-down'"
                                                                          v-on:click="linkclick(item)">
                                                                </el-image>
                                                                <div class="renderdata_item_title" :title="item">
                                                                        {{ item }}
                                                                </div>
                                                        </div>
                                                </div>
                                        </el-row>
                                </el-scrollbar>
                        </el-col>
                </el-row>
        </el-main> -->
</template>
<script lang="ts" setup>
import axios from 'axios';
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types';
import { ref, onMounted, reactive } from 'vue';
import { useVideoStore } from '../assets/Video'
import { ElMessage, ElMessageBox, UploadInstance, type FormInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus';
interface Tree {
        label: string
        children?: Tree[]
}
let drawer1 = ref(false)
const uploadData = ref()
const dialogVisibleUpload = ref(false)
const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
        upload.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        upload.value!.handleStart(file)
}


const currentDir = ref("/")
const ruleForm = reactive({
        dirname: '',
})
const ruleFormRef = ref<FormInstance>()
const userEmail = ref("")
const mydata = ref()
const drawer = ref(false)
const dialogVisible = ref(false)
const dialogVisibleDel = ref(false)
let videoData = useVideoStore()
let renderdata = ref<Array<string>>()
let baseUrl = ""
if (import.meta.env.MODE == 'development') {
        baseUrl = "http://192.168.0.106:9000/"
}
else {
        baseUrl = "/"
}
onMounted(async () => {

        const { data }: { data: Array<Tree> } = await axios.get('/video/VideoIndex')
        mydata.value = data
        axios.get("/video/getInfo").then((res) => {
                userEmail.value = res.data
        })
        if (videoData.currentVideoList) {
                axios.get("/video/VideoData", {
                        params: {
                                p: videoData.currentVideoList
                        }
                }).then((res) => {
                        let temp = []
                        for (let index = 0; index < res.data.length; index++) {
                                const element = res.data[index] as string;
                                temp.push(element.replace(".jpg", ""))
                        }
                        renderdata.value = temp
                })
        }
})
const beforeUpload = (rawFile: UploadRawFile) => {
        uploadData.value = {
                dest: `D:\\static\\userdata\\${userEmail.value}\\videodata` +currentDir.value,
                filename: rawFile.name
        }
}
const submitUpload = () => {
        dialogVisibleUpload.value = true
        // upload.value!.submit()
}
const submitUploadConfirm= () => {
        // dialogVisibleUpload.value = true
        upload.value!.submit()
        dialogVisibleUpload.value = false
}
const handleClick = (f1: Tree, f2: TreeNode, f3: any, f4: any) => {
        if (f2.data.children.length == 0) {
                drawer.value = false
                const label = f2.data.label
                let url_path = ""
                url_path = "/" + label
                let clicknode = f2
                while (true) {
                        let parent_label = clicknode.parent?.data.label
                        if (parent_label == undefined) {
                                break
                        }
                        url_path = "/" + parent_label + url_path
                        clicknode = (clicknode.parent as any)
                }

                axios.get("/video/VideoData", {
                        params: {
                                p: url_path
                        }
                }).then((res) => {
                        let temp = []
                        for (let index = 0; index < res.data.length; index++) {
                                const element = res.data[index] as string;
                                temp.push(element.replace(".jpg", ""))
                        }
                        videoData.currentVideoList = url_path
                        renderdata.value = temp
                })
        }
}
const dirselect = (f1: Tree, f2: TreeNode) => {
        const label = f2.data.label
        let url_path = ""
        url_path = "/" + label
        let clicknode = f2
        while (true) {
                let parent_label = clicknode.parent?.data.label
                if (parent_label == undefined) {
                        break
                }
                url_path = "/" + parent_label + url_path
                clicknode = (clicknode.parent as any)
        }

        currentDir.value = url_path
        console.log(currentDir.value)
}
const linkclick = (itemname: string) => {
        videoData.currentVideoPath = `${videoData.currentVideoList + "/" + itemname}`

        localStorage.setItem("currentVideoPath", `${videoData.currentVideoList + "/" + itemname}`)
        localStorage.setItem("currentVideoList", videoData.currentVideoList)
        // router.push({
        //         name: "NewVideo",
        // })
        window.open("/#/newvideo")
}

const validateDirname = (rule: any, value: string, callback: any) => {
        if (value === '') {
                callback(new Error('名称不能为空'))
        } else if (value.match(/[\\/:\*\?"<>|]/g)) {
                callback(new Error('名称不能包含特殊字符'))
        } else {
                callback()
        }
}
const rules = reactive({
        dirname: [{ validator: validateDirname, trigger: 'blur' }],
})
const submit = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
                if (valid) {
                        console.log(currentDir.value)
                        debugger
                        axios.post(baseUrl + "video/newdir", {
                                p: currentDir.value + "/" + ruleForm.dirname
                        }).then(async (res) => {
                                if (res.data == "exist") {
                                        ElMessage({
                                                type: "error",
                                                message: "文件夹已存在"
                                        })
                                } else if (res.data == "ok") {
                                        ElMessage({
                                                type: "success",
                                                message: "创建成功"
                                        })
                                        dialogVisible.value = false
                                        currentDir.value = "/"
                                        const { data }: { data: Array<Tree> } = await axios.get('/video/VideoIndex')
                                        mydata.value = data
                                        ruleForm.dirname = ""
                                }

                        }).finally(() => {
                                currentDir.value = "/"
                        })

                } else {
                        // console.log('error submit!')
                        return false
                }
        })
        // dialogVisible.value = false

}
const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
}
const comfirmDel = () => {
        ElMessageBox.confirm('确定要删除吗？删除后数据不可恢复', "警告", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'warning',
        })
                .then(() => {
                        axios.post(baseUrl + "video/deldir", {
                                p: currentDir.value
                        }).then(async (res) => {
                                if (res.data == "ok") {
                                        ElMessage({
                                                message: "删除成功",
                                                type: "success"
                                        })
                                        dialogVisibleDel.value = false
                                        currentDir.value = "/"
                                        const { data }: { data: Array<Tree> } = await axios.get('/video/VideoIndex')
                                        mydata.value = data
                                        ruleForm.dirname = ""
                                } else if (res.data == "notexist") {
                                        ElMessage({
                                                message: "删除失败，文件夹不存在",
                                                type: "error"
                                        })
                                } else {
                                        ElMessage({
                                                message: "删除失败",
                                                type: "error"
                                        })
                                }
                        })
                })
                .catch(() => {

                })
}
</script>
<style scoped>
@media only screen and (min-width: 766px) {
        .renderdata_container {
                display: flex;
                flex-wrap: wrap;
        }

        .el-header {
                height: 55px;
                display: flex;

        }

        .renderdata_item {
                margin: 5px;
                width: 200px;
                height: 150px;
        }

        .el-image {
                width: 100%;
                height: 100px;
        }

        .renderdata_item_title {
                overflow: hidden;
                height: 50px;
        }

        .el-row,
        .el-col {
                padding: 0 !important;
                margin: 0 !important;
                height: 100%;
        }

        .el-scrollbar {
                border: 1px solid black;
        }

        .el-image:hover {
                cursor: pointer;
        }
}

@media only screen and (max-width: 765px) {
        .el-header {
                display: flex;
                justify-content: start;
                align-items: center;
                border-bottom: 1px solid black;

        }

        .openFile,
        .openList {
                cursor: pointer;
                margin-right: 25px;
        }

        .renderdata_container {
                display: flex;
                flex-wrap: wrap;
                overflow: hidden;
        }

        .renderdata_item_title {
                overflow: hidden;
                height: 50px;
        }

        .el-scrollbar {
                border: 1px solid black;
        }

        .renderdata_container {
                /* overflow: hidden; */
        }

        .renderdata_item {
                margin: 0;
                padding: 2.5vw;
                width: 50%;
                height: 150px;
        }

        .el-image {
                width: 150px;
                height: 100px;
        }
}
</style>