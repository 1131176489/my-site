
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElTree } from 'element-plus'
import axios from 'axios';
interface Tree {
        label: string
        children?: Tree[]
}
const s = ref("")
const url = ref("")
const labelParent = ref("")
const treeRef = ref<InstanceType<typeof ElTree>>()
const node_ = ref<Tree>({ label: "" })
const elAside1 = reactive({
        display: "block"
})
const ball = reactive({
        display: "block"
})
const defaultProps = {
        children: 'children',
        label: 'label',
}
const data = ref<Tree[]>([])
onMounted(() => {
        if (import.meta.env.MODE == 'development') {
                s.value = "http://localhost:9000/"
        }
        else {
                s.value = "/"
        }
        axios.get("/api/imgList").then((res) => {
                data.value = res.data.msg
        }).catch(() => {
        })
        axios.get("/api/imgInfo").then((res) => {
                labelParent.value = res.data.lastImgParent
                node_.value.label = res.data.lastImg
                url.value = s.value + res.data.lastImg
        })
})
const nodeClickHandle = (node: Tree, treenode: any) => {
        if (node.children == undefined || node.children.length == 0) {
                if (treenode.parent == undefined) {
                        labelParent.value = treenode
                } else {
                        labelParent.value = treenode.parent.data.label
                }
                node_.value = node
                url.value = s.value + node.label
                axios.post("/api/imgInfo", {
                        data: {
                                label: node.label,
                                labelParent: labelParent.value
                        }
                })
        } else {
                console.log(123)
        }
}
const tmove = (e: TouchEvent) => {
        axios.post("/api/touch", {
                x: e.touches.length
        })
}
const ts = (e: TouchEvent) => {
        const X = e.touches[0].clientX
        const htmlWidth = document.documentElement.clientWidth
        console.log(node_.value)
        console.log(labelParent.value)
        if (X > htmlWidth / 2) {
                data.value.some((v, i, a) => {
                        if (v.label == labelParent.value) {
                                v.children?.some((v1, i1, a1) => {
                                        if (v1.label == node_.value.label) {
                                                if (i1 == a1.length - 1) {
                                                        node_.value = a1[0]
                                                } else {
                                                        node_.value = a1[++i1]
                                                }
                                                url.value = s.value + node_.value.label
                                                console.log(node_.value)
                                                nodeClickHandle(node_.value, labelParent.value)
                                                return true
                                        }
                                })
                                return true
                        }
                })
        } else {
                data.value.some((v, i, a) => {
                        if (v.label == labelParent.value) {
                                v.children?.some((v1, i1, a1) => {
                                        if (v1.label == node_.value.label) {
                                                if (i1 == 0) {
                                                        node_.value = a1[a1.length - 1]
                                                } else {
                                                        node_.value = a1[--i1]
                                                }
                                                url.value = s.value + node_.value.label
                                                console.log(node_.value)
                                                nodeClickHandle(node_.value, labelParent.value)
                                                return true
                                        }
                                })
                                return true
                        }
                })
        }
}
const ts1 = () => {
        // if (elAside1.display != "none") {
        //         elAside1.display = "none"
        // } else {
        //         elAside1.display = "block"
        // }
}

</script>

<template>
        <div class="common-layout">
                <el-container>

                        <el-aside v-bind:style="elAside1">
                                <el-scrollbar>
                                        <el-tree
                                                 ref="treeRef"
                                                 v-on:node-click="nodeClickHandle"
                                                 v-bind:data="data"
                                                 v-bind:props="defaultProps"
                                                 v-bind:default-expand-all="false"
                                                 highlight-current />
                                </el-scrollbar>

                        </el-aside>
                        <el-main

                                 v-on:touchstart="ts1">
                                <el-image
                                          v-on:touchstart.stop="ts"

                                          v-bind:src="url"
                                          v-bind:fit="'fill'" />
                        </el-main>
                </el-container>
        </div>
</template>

<style scoped>
@media screen and (min-width: 765px) {

        .el-aside,
        .el-main {
                border: 1px solid #d9ecff;
        }

        .el-image {
                height: 100%;
                border: 1px solid #d9ecff;
                display: block;
                background-color: #000;
        }
}

@media screen and (max-width: 764px) {

        .el-aside,
        .el-main {
                border: 1px solid #d9ecff;

        }

        .el-main {
                padding: 0;
        }

        .el-aside {
                width: 100px;
                position: absolute;
                /* height: 40px; */
                z-index: 5;
                /* display: none; */
        }

        .el-container {
                position: relative;
        }

        .el-image {
                height: 100%;
                border: 1px solid #d9ecff;
                display: block;
        }
}
</style>