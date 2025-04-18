<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, reactive, ref, computed, onBeforeMount} from "vue";
import SimpleCalendar from './SimpleCalendar.vue';
import axios from "axios";
import type {Item} from "../declare"
const route = useRoute()
const id = parseInt(route.query.id as string)
const jsonPath = "d:/everyday.json"
const isCompleted=ref(true)
const item = reactive<Item>({
  id:0,
  completedDate: [],
  name:'',
  type:'',
  startDate:'',
  endDate:'',
  commentObj:{}
})
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
onBeforeMount(async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: jsonPath
    },
    responseType: "text"
  })
  if (res.data) {
    const items: Item[] = JSON.parse(res.data)
    // item =  items.find(value => value.id === id)
    Object.assign(item, items.find(value => value.id === id))
    console.log(item)
    // Object.assign(defaultDate, item.completedDate.map(value => new Date(value)))
    // defaultDate.value =  item.completedDate.map(value => new Date(value))
    // console.log(defaultDate)
  }
})


// onMounted()
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
<!--        <Calendar :show="false"-->
<!--                  :poppable="false"-->
<!--                  switch-mode="year-month"-->
<!--                  :show-mark="false"-->
<!--                  :show-title="false"-->
<!--                  :show-confirm="false"-->
<!--                  :show-subtitle="false"-->
<!--                  :default-date="defaultDate"-->
<!--                  type="multiple"-->
<!--        ></Calendar>-->
      </div>
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
  }
}
</style>
<style>
:root {
  --van-calendar-day-height: 32px;
  --van-calendar-selected-day-size: 32px;
}
</style>