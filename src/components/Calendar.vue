<template>

  <div class="container">
    <div class="left">
      <h3>{{'待完成事项，当前日期'+getNowString()}}</h3>
      <el-button type="primary" class="add" @click="onClickAdd">添加</el-button>
      <el-button type="primary" class="add" @click="onClickSelectDate">选择日期</el-button>
      <el-button type="primary" class="add" @click="onClickUncompletedAll">全部</el-button>
      <el-button type="primary" class="add" @click="item.onClickUncompletedFun" v-for="item in option">
        {{ item.label }}
      </el-button>
      <div class="items">
        <div v-for="item in uncompletedItem" class="item">
          <span>{{ item.name }}</span>
          <div class="btns">
            <el-button type="primary" @click="onClickEdit(item.id,item.name)">编辑</el-button>
            <el-button type="primary" @click="onClickStatistics(item.id)">完成情况</el-button>
            <el-button type="primary" @click="onClickComplete(item.id)">完成</el-button>
            <el-button type="danger" @click="onClickDelete(item.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <h3>已完成</h3>
      <el-button type="primary" class="add" @click="onClickCompletedAll">全部</el-button>
      <el-button type="primary" class="add" @click="item.onClickCompletedFun" v-for="item in option">
        {{ item.label }}
      </el-button>
      <div class="items">
        <div v-for="item in completedItem" class="item">
          <span>{{ item.name }}</span>
          <span>{{ item.commentObj[getNowString()] }}</span>
          <div class="btns">
            <el-button type="primary" @click="onClickStatistics(item.id)">完成情况</el-button>
            <el-button type="primary" @click="onClickRecover(item.id)">恢复</el-button>
            <el-button type="danger" @click="onClickDelete(item.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="calendar">
    <el-dialog v-model="dialogFormVisible" title="事项" width="500">
      <el-form :model="form" ref="refForm">
        <el-form-item label="事项名" :label-width="formLabelWidth" >
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="事项重复周期" :label-width="formLabelWidth">
          <el-select v-model="form.date" placeholder="请选择一个日期">
            <el-option v-for="item in option"
                       :key="item.key"
                       :label="item.label"
                       :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onClickConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog class="test" v-model="dialogStatisticsVisible" title="统计" top="50px">
      <el-calendar :key="calendarKey">
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
          </p>
          <p>
            {{ render(data.day) }}
          </p>
        </template>
      </el-calendar>
    </el-dialog>

    <el-dialog v-model="dialogDateSelect" title="选择日期" width="500">
      <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Select date"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogDateSelect = false">取消</el-button>
          <el-button type="primary" @click="dialogDateSelectConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogEditVisible" title="编辑" width="500">
      <el-form :model="form" ref="refForm">
        <el-form-item label="事项名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="onClickConfirmEdit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogCompleteRecordVisible" title="完成记录" width="500">
      <el-form>
        <el-form-item >
<!--          <el-input v-model="completeRecord" autocomplete="off"/>-->
          <el-input v-model="completeRecord" type="textarea" rows="10"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCompleteRecordVisible = false">取消</el-button>
          <el-button type="primary" @click="onClickCompleteRecordConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref, UnwrapRef} from 'vue';
import type {FormInstance} from 'element-plus'
import moment from "moment";
import axios from "axios";
import {ElMessage} from "element-plus";

type Item = {
  id: number,
  name: string,
  completedDate: string[]
  type: string,
  startDate: string,
  endDate: string,
  commentObj:{[key:string]:string},
}
const EVERY_DAY = "everyDay"
const WEEK = "week"
const MONTH = "month"
const ONE_DAY = "oneDay"
const jsonPath = "d:/everyday.json"
const formLabelWidth = '140px'
let currentSelectedDate = Date.now()
const getNowString = () => {
  return moment(currentSelectedDate).format('YYYY-MM-DD')
}
const option = [
  {
    key: EVERY_DAY,
    value: EVERY_DAY,
    label: "每天",
    onClickUncompletedFun: () => {
      uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString())).filter(value => value.type === EVERY_DAY)
    },
    onClickCompletedFun: () => {
      completedItem.value = items.filter(value => value.completedDate.includes(getNowString())).filter(value => value.type === EVERY_DAY)
    },
  },
  {
    key: WEEK,
    value: WEEK,
    label: "每个星期",
    onClickUncompletedFun: () => {
      uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString())).filter(value => value.type === WEEK)
    },
    onClickCompletedFun: () => {
      completedItem.value = items.filter(value => value.completedDate.includes(getNowString())).filter(value => value.type === WEEK)
    },
  },
  {
    key: MONTH,
    value: MONTH,
    label: "每个月",
    onClickUncompletedFun: () => {
      uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString())).filter(value => value.type === MONTH)
    },
    onClickCompletedFun: () => {
      completedItem.value = items.filter(value => value.completedDate.includes(getNowString())).filter(value => value.type === MONTH)
    },
  },
  {
    key: ONE_DAY,
    value: ONE_DAY,
    label: "具体某天",
    onClickUncompletedFun: () => {
      uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString())).filter(value => value.type === ONE_DAY)
    },
    onClickCompletedFun: () => {
      completedItem.value = items.filter(value => value.completedDate.includes(getNowString())).filter(value => value.type === ONE_DAY)
    },
  },
]
let items: Item[] = []
const dialogFormVisible = ref(false)
const dialogStatisticsVisible = ref(false)
const dialogDateSelect = ref(false)
const dialogEditVisible = ref(false)
const dialogCompleteRecordVisible = ref(false)
const selectedDate = ref(new Date())
const refForm = ref<FormInstance>()
const calendarKey = ref(0)
const completeRecord = ref('')
let form = reactive({
  name: '',
  date: EVERY_DAY,
  startDate: new Date(),
  endDate: new Date(),
})
const uncompletedItem = ref<Item[]>([])
const completedItem = ref<Item[]>([])
let statisticsItem = ref<Item>();
let editId = 0
const updateAndSave = async () => {
  await window.postForm({
    dest: 'd:/',
    filename: "everyday.json",
    blob: JSON.stringify(items)
  })
  uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
  completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
}
function getFormattedDatesInMonth() {
  const date = new Date(currentSelectedDate)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  // @ts-ignore
  const daysInMonth = Math.floor((nextMonthFirstDay - firstDay) / (1000 * 60 * 60 * 24));

  const dates = [];
  for (let i = 0; i < daysInMonth; i++) {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + i);

    // 格式化日期为 YYYY-MM-DD
    const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    dates.push(formattedDate);
  }

  return dates;
}
function getFormattedWeekDates() {
  const date = new Date(currentSelectedDate)
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);

    // 格式化日期为 YYYY-MM-DD
    const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    weekDates.push(formattedDate);
  }

  return weekDates;
}
const onClickAdd = () => {
  Object.assign(form, {name: "", date: EVERY_DAY, startDate: new Date(), endDate: new Date()})
  dialogFormVisible.value = true
}
const onClickSelectDate = ()=>{
  dialogDateSelect.value = true
}
const onClickUncompletedAll = () => {
  uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
}
const onClickCompletedAll = () => {
  completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
}

const onClickConfirm = () => {
  dialogFormVisible.value = false
  console.log(form)
  const obj: Item = {
    id: Date.now(),
    name: form.name,
    completedDate: [],
    type: form.date,
    startDate: moment(form.startDate).format('YYYY-MM-DD'),
    endDate: "",
    commentObj:{},
  }
  if (form.date === EVERY_DAY) {

  } else if (form.date === WEEK) {

  } else if (form.date === MONTH) {

  } else if (form.date === ONE_DAY) {

  }
  items.push(obj)
  console.log(items)
  updateAndSave()
}

const onClickEdit = (id: number, name: string)=>{
  editId = id
  form.name = name
  dialogEditVisible.value = true
}
// 点击完成
const onClickComplete = (id: number) => {
  dialogCompleteRecordVisible.value = true
  editId = id
}
// 点击完成弹出的对话框点确定
const onClickCompleteRecordConfirm = ()=>{
  let el = items[0];
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === editId) {
      el = items[i]
      break
    }
  }

  if (el.type === EVERY_DAY) {
    el.completedDate.push(getNowString())
    el.commentObj[getNowString()] = completeRecord.value
  } else if (el.type === WEEK) {
    const array = getFormattedWeekDates()
    for (let i = 0; i < array.length; i++) {
      el.completedDate.push(array[i])
      el.commentObj[array[i]] = completeRecord.value
    }
  } else if (el.type === MONTH) {
    const array = getFormattedDatesInMonth()
    for (let i = 0; i < array.length; i++) {
      el.completedDate.push(array[i])
      el.commentObj[array[i]] = completeRecord.value
    }
  } else if (el.type === ONE_DAY) {

  }

  console.log(items)
  updateAndSave()
  editId = 0
  dialogCompleteRecordVisible.value = false
}
// 点击删除一个计划
const onClickDelete = (id: number) => {
  const index = items.findIndex(value => value.id === id)
  items.splice(index, 1)
  console.log(items)
  updateAndSave()
}
// 点击恢复
const onClickRecover = (id: number) => {
  function removeFirstOccurrence(arr:Array<string>, value:string) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  let el = items[0];
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      el = items[i]
      break
    }
  }


  if (el.type === EVERY_DAY) {
    removeFirstOccurrence(el.completedDate,getNowString())
    el.commentObj[getNowString()] = ''
  } else if (el.type === WEEK) {
    const array = getFormattedWeekDates()
    for (let i = 0; i < array.length; i++) {
      removeFirstOccurrence(el.completedDate,array[i])
      el.commentObj[array[i]] = ''
    }
  } else if (el.type === MONTH) {
    const array = getFormattedDatesInMonth()
    for (let i = 0; i < array.length; i++) {
      removeFirstOccurrence(el.completedDate,array[i])
      el.commentObj[array[i]] = ''
    }
  } else if (el.type === ONE_DAY) {

  }
  console.log(items)
  updateAndSave()
}
// 选择日期对话框点确定
const dialogDateSelectConfirm = () => {
  const timestamp = new Date(selectedDate.value).getTime()
  console.log(timestamp);
  console.log(selectedDate.value);
  moment(selectedDate.value)

  if (timestamp>Date.now()){
    ElMessage.error('请选择之前的日期')
    return
  }
  currentSelectedDate = timestamp
  uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
  completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
  dialogDateSelect.value = false
}
// 点击确定编辑按钮
const onClickConfirmEdit = ()=>{
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === editId){
      items[i].name = form.name
      break
    }
  }
  form.name = ''
  editId = 0
  updateAndSave()
  dialogEditVisible.value = false
}
// 点击统计按钮
const onClickStatistics = (id: number) => {
  calendarKey.value++
  statisticsItem.value = items.find(value => value.id === id) as Item
  console.log(statisticsItem.value)
  dialogStatisticsVisible.value = true
}
// 日历渲染函数
const render = (day: string) => {
  const now = Date.now()
  const timeStamp = new Date(day).getTime() - 8 * 60 * 60 * 1000
  const startDate = new Date(statisticsItem.value!.startDate).getTime()  - 8 * 60 * 60 * 1000
  console.log(timeStamp < startDate || timeStamp > now)
  console.log('timeStamp:',timeStamp )
  console.log('startDate:',startDate )
  console.log('now      :' ,now)
  if (statisticsItem.value!.completedDate.includes(day)){
    return '✔️'
  }
  if ( timeStamp < startDate || timeStamp > now) {
    return ''
  }
  return '✘'
}

onMounted(async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: jsonPath
    },
    responseType: "text"
  })
  if (res.data) {
    items = JSON.parse(res.data)
    for (let i = 0; i < items.length; i++) {
      if (!items[i].commentObj){
        items[i].commentObj = {}
      }
    }
    uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
    completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
  }
})


</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow-y: hidden;

  & > div {
    border: #cccccc solid 1px;
    flex: 1;
    margin: 5px;
    overflow: auto;
  }

  h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }

  .add {
    margin: 5px 0 5px 5px;
  }

  .items {
    .item {
      border: #cccccc 1px solid;
      padding: 20px;
      border-radius: 50px;
      margin: 0 5px 5px 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.calendar{

    .el-input{
      width: 250px !important;
    }

}
</style>