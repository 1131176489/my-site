
<template>
  <div class="container">
    <div class="year-statistics-container">
      <div class="title"><span style="font-weight: bolder">{{ item.name+'     ' }}</span>
        <span> 的年度统计</span>
      </div>
      <div class="statistics-container">
        <div class="header">
          <Icon @click="currentYear = currentYear - 1" name="arrow-double-left" />
          <span style="margin: 0 25px 0 25px">{{currentYear}}</span>
          <Icon @click="currentYear = currentYear + 1" name="arrow-double-right" />
        </div>
        <div class="body">
          <div v-for="month in 12">
            <span style="">{{month.toString().length===1?0:''}}</span>{{month}}月
            <span :class="['square',{'isActive':item.completedDate.includes(squ.format('YYYY-MM-DD'))}]" v-for="(squ,index) in getDatesInMonthWithMoment(currentYear,month)">
            </span>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, reactive, ref} from "vue";
import axios from "axios";
import {Item} from "../declare";
import {EVERY_DAY_PATH} from "../assets/CONSTANT";
import {useRoute} from "vue-router";
import { Icon } from 'vant';
import moment from "moment"; // 或在浏览器中通过<script>引入


const route = useRoute()
const id = parseInt(route.query.id as string)
const item = reactive<Item>({
  id:0,
  completedDate: [],
  name:'',
  type:'',
  startDate:'',
  endDate:'',
  commentObj:{}
})
const currentYear = ref(new Date().getFullYear())
console.log(currentYear.value)
onBeforeMount(async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: EVERY_DAY_PATH
    },
    responseType: "text"
  })
  if (res.data) {
    const items: Item[] = JSON.parse(res.data)
    Object.assign(item, items.find(value => value.id === id))
    console.log(item)
    // Object.assign(defaultDate, item.completedDate.map(value => new Date(value)))
    // defaultDate.value =  item.completedDate.map(value => new Date(value))
    // console.log(defaultDate)
  }
})

const getDatesInMonthWithMoment = (year:number, month:number)=>{
  const startDate = moment([year, month - 1]); // 月份从0开始
  const endDate = moment(startDate).endOf('month');

  const dates = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    dates.push(currentDate.clone());
    currentDate.add(1, 'day');
  }

  return dates;
}

// 使用示例
const dates = getDatesInMonthWithMoment(2025, 4);
console.log(dates.map(d => d.format('YYYY-MM-DD')));
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100%;

  .year-statistics-container {
    background-color: rgb(247, 248, 250);
    max-width: 1025px;
    flex: 1;
    border: 1px solid darkgray;
    .title {
      text-align: center;
    }
    .statistics-container{
      .header{
        display: flex;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 30px;
        .van-icon{
          cursor: pointer;
        }
      }
      .body{
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;
        .square{
          display: inline-block;
          width: 8px;
          height: 15px;
          background-color: #eeeeee;
          margin-right: 2px;
          &.isActive{
            background-color: coral;
          }
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