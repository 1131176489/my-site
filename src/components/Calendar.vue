<template>
        <el-dialog
                   v-model="dialogVisible"
                   title="添加事项"
                   width="30%"
                   :before-close="handleClose">
                <div class="m-4">

                        <el-cascader v-model="value1" :options="options" @change="handleChange" />
                        <el-form :model="form" label-width="120px" :label-position="'left'">
                                <el-form-item label="事项">
                                        <el-input v-model="form.item" />
                                </el-form-item>
                        </el-form>
                </div>

                <template #footer>
                        <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="comfirm">
                                        确定
                                </el-button>
                        </span>
                </template>
        </el-dialog>
        <el-calendar>
                <template #header="{ date }">
                        <span>{{ date }}</span>

                </template>
                <template #date-cell="{ data }">
                        <p :class="data.isSelected ? 'is-selected' : ''" @click="myclick(data)" style="height: 100%;">
                                {{ data.day.split('-').slice(2).join('') }}
                        </p>
                </template>
        </el-calendar>
        <el-card class="box-card">
                <template #header>
                        <div class="card-header">
                                <span>今日事项</span>
                                <el-button v-on:click="addItem">
                                        添加事项
                                </el-button>

                        </div>
                </template>
                <div v-for="(item, index) in renderData" :key="index" class="text item">
                        {{ item.word }}
                        <span v-if="isDone(item.isDone)" @click="">✔️</span>
                        <span v-else style="cursor: pointer;">❌</span>
                        <el-button v-on:click="delItem(item.word)">
                                删除事项
                        </el-button>
                        <el-button v-on:click="alreadyDone(item.word)">
                                设为已完成
                        </el-button>
                        <el-button v-on:click="notDone(item.word)">
                                设为未完成
                        </el-button>
                </div>
        </el-card>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import moment from "moment"
interface Item {
        word: string
        date: string
        isDone: Array<string>
}
const value1 = ref("")
const form = reactive({
        item: "123"
})
const dialogVisible = ref(false)
const items = ref<Array<Item>>([])
const renderData = ref<Array<Item>>([])
const selectDate = ref("")
const toady = ref("")
const options = [
        {
                value: 'unique',
                label: '特定日期',
        },
        {
                value: 'every',
                label: '每个日期',
        },
]
onMounted(() => {
        axios.get("/api/getItem").then((res) => {
                console.log(res.data)
                if (res.data) {
                        items.value = res.data
                }
                else {
                        items.value = []
                }
                console.log(items.value)
                toady.value = moment().format("yyyy-MM-DD")
                selectDate.value = toady.value
                myclick({ day: selectDate.value })
        })
})
const isDone = (input: Array<string>) => {
        for (let index = 0; index < input.length; index++) {
                const element = input[index];
                if (selectDate.value == element)
                        return true
        }
        return false
}
const handleChange = (value: any) => {
        value1.value = value[0]
        console.log(value1.value)
}
const comfirm = () => {
        let data
        if (value1.value == "every") {
                data = {
                        date: "every",
                        word: form.item,
                        isDone: []
                }
        } else {
                return
        }
        items.value.push(data)
        axios.post("/api/addItem", {
                items: items.value
        }).then((res) => {
                axios.get("/api/getItem").then((res) => {
                        items.value = res.data
                        myclick({ day: selectDate.value })
                })
                dialogVisible.value = false
        })
}
const addItem = () => {
        dialogVisible.value = true
}
const delItem = (input: string) => {
        for (let index = 0; index < items.value.length; index++) {
                const element = items.value[index];
                if (element.word == input) {
                        items.value.splice(index, 1)
                        axios.post("/api/addItem", {
                                items: items.value
                        }).then((res) => {
                                axios.get("/api/getItem").then((res) => {
                                        items.value = res.data
                                        myclick({ day: selectDate.value })
                                })
                                dialogVisible.value = false
                        })
                        return
                }
        }
}
const alreadyDone = (input: string) => {
        for (let index = 0; index < items.value.length; index++) {
                const element = items.value[index];
                if (element.word == input) {

                        items.value[index].isDone.push(selectDate.value)
                        let s = new Set(items.value[index].isDone)
                        items.value[index].isDone = [...s]
                        axios.post("/api/addItem", {
                                items: items.value
                        }).then((res) => {
                                axios.get("/api/getItem").then((res) => {
                                        items.value = res.data
                                        myclick({ day: selectDate.value })
                                })
                                dialogVisible.value = false
                        })
                        return
                }
        }
}
const notDone = (input: string) => {
        for (let index = 0; index < items.value.length; index++) {
                const element = items.value[index];
                if (element.word == input) {
                        console.log(items.value[index].isDone)
                        for (let index1 = 0; index1 < items.value[index].isDone.length; index1++) {
                                const element = items.value[index].isDone[index1];
                                if (element == selectDate.value) {
                                        items.value[index].isDone.splice(index1, 1)
                                }
                        }
                        axios.post("/api/addItem", {
                                items: items.value
                        }).then((res) => {
                                axios.get("/api/getItem").then((res) => {
                                        items.value = res.data
                                        myclick({ day: selectDate.value })
                                })
                                dialogVisible.value = false
                        })
                        return
                }
        }
}
const handleClose = () => {
        dialogVisible.value = false
}
let myclick = (data: any) => {
        console.log(data.day)
        selectDate.value = data.day
        renderData.value = []
        for (let index = 0; index < items.value.length; index++) {
                const element = items.value[index];
                if (element.date == "every") {
                        renderData.value.push(element)
                } else if (element.date == data.day) {
                        renderData.value.push(element)
                }
        }
}
</script>
<style>
.is-selected {
        color: #1989fa;
}
</style>