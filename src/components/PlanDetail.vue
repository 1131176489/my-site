<script setup lang="ts">
import {useRoute,useRouter} from "vue-router";
import {reactive, ref, computed, onBeforeMount} from "vue";
import SimpleCalendar from './SimpleCalendar.vue';
import axios from "axios";
import type {Item} from "../declare"
import {Popup, Button, showToast} from 'vant';
import {EVERY_DAY_PATH} from "../assets/CONSTANT";
const route = useRoute()
const router = useRouter()
const id = parseInt(route.query.id as string)
const isCompleted=ref(true)
const show=ref(false)
const isArchive=ref(true)
const item = reactive<Item>({
  id:0,
  completedDate: [],
  checkInDate:[],
  name:'',
  type:'',
  startDate:'',
  endDate:'',
  commentObj:{},
  isArchive:false,
})
const items = reactive<Item[]>([])
const CheckInDayNumber = computed(()=>{
  // const keys = Object.keys(item.commentObj)

  return Object.keys(item.commentObj).length
})
const CheckInDay = computed(()=>{
  const keys = Object.keys(item.commentObj)
  const day :string[]= []
  for (let i = 0; i < keys.length; i++) {
    day.push(keys[i])
  }
  return day
})
const updateAndSave = async () => {
  await window.postForm({
    dest: 'd:/',
    filename: "everyday.json",
    blob: JSON.stringify(items)
  })
}
const onClickArchive = async () => {
  console.log(items)
  if (isArchive.value){
    items.find(value => value.id===id)!.isArchive = false
    await updateAndSave()
    showToast({
      message:'激活成功',
      type:'success',
    })
    isArchive.value = false
  }else {
    items.find(value => value.id===id)!.isArchive = true
    await updateAndSave()
    showToast({
      message:'归档成功',
      type:'success',
    })
    isArchive.value = true
  }

}
const getComment = ()=>{
  const keys = Object.keys(item.commentObj)
  return keys.map(value => {
    return {
      date:value ,
      text:item.commentObj[value]
    }
  })
}
const yearStatistics = ()=>{
  router.push({
    name:'YearStatistics',
    query:{
      id
    }
  })
}
onBeforeMount(async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: EVERY_DAY_PATH
    },
    responseType: "text"
  })
  if (res.data) {
    const items_: Item[] = JSON.parse(res.data)
    Object.assign(items, items_)
    Object.assign(item, items_.find(value => value.id === id))
    isArchive.value = item.isArchive
    console.log(item)
  }
})

</script>

<template>
  <div class="container">
    <div class="plan-detail-container">
      <h3>{{ item.name }}</h3>
      <div class="day-number">
        <div :class="['day-number-item',{isCompleted}]" @click="isCompleted=true" >
          <div class="day-number-item-text day">{{ item.completedDate.length }}</div>
          <div class="day-number-item-text title">完成天数</div>
        </div>
        <div :class="['day-number-item',{isCompleted:!isCompleted}]" @click="isCompleted=false">
          <div class="day-number-item-text day">{{ CheckInDayNumber }}</div>
          <div class="day-number-item-text title">打卡天数</div>
        </div>
      </div>
      <div class="calendar-container">
        <SimpleCalendar  :highlight-date="isCompleted?item.completedDate:CheckInDay"></SimpleCalendar>
      </div>
      <div class="btns">
        <Button plain type="primary" @click="yearStatistics">年度统计</Button>
        <Button plain type="primary" @click="show = true">所有日志</Button>
        <Button plain type="primary" @click="onClickArchive">{{ isArchive?'激活':'归档' }}</Button>
        <Button plain type="danger">删除</Button>
      </div>
      <Popup v-model:show="show"
             position="bottom"
             :style="{ height: '80%' }">
        <div style="margin: 0 0 10px 0" v-for="comment in getComment()">
          {{comment.date}}:
          {{comment.text}}
        </div>
      </Popup>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100%;

  .plan-detail-container {
    background-color: rgb(247, 248, 250);
    max-width: 1025px;
    flex: 1;
    border: 1px solid darkgray;

    h3 {
      text-align: center;
    }

    .day-number {
      display: flex;
      justify-content: space-around;

      .day-number-item {
        height: 100px;
        width: 100px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .day-number-item-text {
          text-align: center;
        }

        .day-number-item-text.title {
          color: #979696;
          font-size: 12px;
        }

        .day-number-item-text.day {
          color: black;
          font-weight: bolder;
          font-size: 16px;
        }
      }
      .day-number-item.isCompleted{
        background-color: skyblue;
      }
    }

    .calendar-container{
      display: flex;
      justify-content: center;

      .van-calendar{
        height: 40%;
        max-width: 500px;
        .van-calendar__day{
          background-color: #a8abb2;
        }
      }
    }

    .btns{
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
<style>
:root {
  --van-calendar-day-height: 32px;
  --van-calendar-selected-day-size: 32px;
}
</style>