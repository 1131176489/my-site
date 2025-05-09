<template>

  <div class="container">
    <div class="calendar-container">
      <div class="item-container">
        <div class="left" v-if="active==='left'" >
          <h3 @click="onClickSelectDate" style="cursor: pointer">{{getNowString()}}</h3>
<!--          <el-button type="primary" class="add" @click="onClickSelectDate">选择日期</el-button>-->
<!--          <el-button type="primary" class="add" @click="onClickUncompletedAll">全部</el-button>-->
<!--          <el-button type="primary" class="add" @click="item.onClickUncompletedFun" v-for="item in option">-->
<!--            {{ item.label }}-->
<!--          </el-button>-->
          <Collapse v-model="activeNames">
            <CollapseItem title="每天" name="1">
              <div class="items">
                <div v-for="item in items.filter(value => value.type===EVERY_DAY)"
                     :class="{complete:item.completedDate.includes(getNowString())}"
                     @click="onClickComplete(item.id)"
                     :key="item.id"
                     class="item">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </CollapseItem>
            <CollapseItem title="每星期" name="2">
              <div class="items">
                <div v-for="item in items.filter(value => value.type===WEEK)" class="item"
                     :class="{complete:item.completedDate.includes(getNowString())}"
                     @click="onClickComplete(item.id)"
                     :key="item.id">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </CollapseItem>
            <CollapseItem title="每个月" name="3">
              <div class="items">
                <div v-for="item in items.filter(value => value.type===MONTH)" class="item"
                     :class="{complete:item.completedDate.includes(getNowString())}"
                     @click="onClickComplete(item.id)"
                     :key="item.id">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </CollapseItem>
          </Collapse>
<!--          <div class="items">-->

<!--            <div v-for="item in uncompletedItem" class="item">-->
<!--              <span>{{ item.name }}</span>-->
<!--              <div class="btns">-->
<!--                <el-button type="primary" @click="onClickEdit(item.id,item.name)">编辑</el-button>-->
<!--                <el-button type="primary" @click="onClickStatistics(item.id)">完成情况</el-button>-->
<!--                <el-button type="primary" @click="onClickComplete(item.id)">完成</el-button>-->
<!--                <el-button type="danger" @click="onClickDelete(item.id)">删除</el-button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div class="right" v-else-if="active==='right'">
          <h3>全部</h3>
          <el-button type="primary" class="add" @click="onClickAdd">添加</el-button>
          <div class="items">
            <div v-for="item in items" class="item">
              <RouterLink  :to="{name:'plan-detail',query:{id:item.id}}">{{ item.name }}</RouterLink>

              <div class="btns">
                <el-button type="primary" @click="onClickEdit(item.id,item.name)">编辑</el-button>
                <el-button type="danger" @click="onClickDelete(item.id)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="other" v-else-if="active==='other'">
          <RouterLink :to={}  >归档习惯</RouterLink>
          <RouterLink :to={}  >数据概览</RouterLink>
        </div>
      </div>
      <Tabbar v-model="active">
        <TabbarItem name="left" @click="onClickTabbarItem" icon="home-o">未完成</TabbarItem>
        <TabbarItem name='right' @click="onClickTabbarItem" icon="search">已完成</TabbarItem>
        <TabbarItem name='other' @click="onClickTabbarItem" icon="search">其他功能</TabbarItem>
      </Tabbar>
    </div>
  </div>
  <div class="calendar">
    <el-dialog v-model="dialogFormVisible" title="事项" width="500">
      <el-form :model="form" ref="refForm">
        <el-form-item label="事项名" :label-width="formLabelWidth">
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

    <el-dialog v-model="dialogCompleteRecordVisible" title="完成记录" width="500">
      <el-form>
        <el-form-item>
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
import {onMounted, reactive, ref} from 'vue';
import type {FormInstance} from 'element-plus'
import moment from "moment";
import axios from "axios";
import { Tabbar, TabbarItem } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import { showConfirmDialog } from 'vant';
import type {Item} from "../declare";
import {EVERY_DAY_PATH} from "../assets/CONSTANT";
const EVERY_DAY = "everyDay"
const WEEK = "week"
const MONTH = "month"
const ONE_DAY = "oneDay"
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
  },
  {
    key: WEEK,
    value: WEEK,
    label: "每个星期",
  },
  {
    key: MONTH,
    value: MONTH,
    label: "每个月",
  },
  {
    key: ONE_DAY,
    value: ONE_DAY,
    label: "具体某天",
  },
]
let items =  reactive<Item[]>([])
const dialogFormVisible = ref(false)
const dialogDateSelect = ref(false)
const dialogEditVisible = ref(false)
const dialogCompleteRecordVisible = ref(false)
const selectedDate = ref(new Date())
const refForm = ref<FormInstance>()
const active = ref('left')
const completeRecord = ref('')
const activeNames = ref(['1','2','3']);
let form = reactive({
  name: '',
  date: EVERY_DAY,
  startDate: new Date(),
  endDate: new Date(),
})
let editId = 0
const onClickTabbarItem = ()=>{
  localStorage.setItem('active',active.value)
}
const  removeFirstOccurrence = (arr: Array<string>, value: string)=>{
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
const updateAndSave = async () => {
  await window.postForm({
    dest: 'd:/',
    filename: "everyday.json",
    blob: JSON.stringify(items)
  })
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
// 选择日期----------------------------------------------------
const onClickSelectDate = () => {
  dialogDateSelect.value = true
}
const dialogDateSelectConfirm = () => {
  const timestamp = new Date(selectedDate.value).getTime()
  console.log(timestamp);
  console.log(selectedDate.value);
  moment(selectedDate.value)

  // if (timestamp > Date.now()) {
  //   ElMessage.error('请选择之前的日期')
  //   return
  // }
  currentSelectedDate = timestamp
  // uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
  // completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
  // Object.assign(items,items)
  const pop = items.pop()
  if (pop){
    items.push(pop)
  }
  dialogDateSelect.value = false
}
// const onClickUncompletedAll = () => {
//   uncompletedItem.value = items.filter(value => !value.completedDate.includes(getNowString()))
// }
// const onClickCompletedAll = () => {
//   completedItem.value = items.filter(value => value.completedDate.includes(getNowString()))
// }

const onClickConfirm = () => {
  dialogFormVisible.value = false
  console.log(form)
  const obj: Item = {
    id: Date.now(),
    name: form.name,
    completedDate: [],
    checkInDate:[],
    type: form.date,
    startDate: moment(form.startDate).format('YYYY-MM-DD'),
    endDate: "",
    commentObj: {},
    isArchive:false,
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

const onClickEdit = (id: number, name: string) => {
  editId = id
  form.name = name
  dialogEditVisible.value = true
}
// 点击完成
const onClickComplete = (id: number) => {
  const el = items.find(value => value.id===id) as Item
  if (el.completedDate.includes(getNowString())){
    onClickRecover(id)
    return
  }
  dialogCompleteRecordVisible.value = true
  editId = id
}
// 点击完成弹出的对话框点确定
const onClickCompleteRecordConfirm = () => {
  let el = items[0];
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === editId) {
      el = items[i]
      break
    }
  }

  if (el.type === EVERY_DAY) {
    el.completedDate.push(getNowString())
  } else if (el.type === WEEK) {
    const array = getFormattedWeekDates()
    for (let i = 0; i < array.length; i++) {
      el.completedDate.push(array[i])
    }
  } else if (el.type === MONTH) {
    const array = getFormattedDatesInMonth()
    for (let i = 0; i < array.length; i++) {
      el.completedDate.push(array[i])
    }
  } else if (el.type === ONE_DAY) {

  }
  el.checkInDate.push(getNowString())
  el.commentObj[getNowString()] = completeRecord.value
  updateAndSave()
  editId = 0
  dialogCompleteRecordVisible.value = false
}
// 点击删除一个计划
const onClickDelete = (id: number) => {
  showConfirmDialog({
    title: '提示',
    message: '是否要删除这条计划？',
  }).then(() => {
    const index = items.findIndex(value => value.id === id)
    items.splice(index, 1)
    console.log(items)
    updateAndSave()
  }).catch(() => {

  });

}
// 点击恢复
const onClickRecover = (id: number) => {
  let el = items[0];
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      el = items[i]
      break
    }
  }

  if (el.type === EVERY_DAY) {
    removeFirstOccurrence(el.completedDate, getNowString())
  } else if (el.type === WEEK) {
    const array = getFormattedWeekDates()
    for (let i = 0; i < array.length; i++) {
      removeFirstOccurrence(el.completedDate, array[i])
    }
  } else if (el.type === MONTH) {
    const array = getFormattedDatesInMonth()
    for (let i = 0; i < array.length; i++) {
      removeFirstOccurrence(el.completedDate, array[i])
    }
  } else if (el.type === ONE_DAY) {
  }
  removeFirstOccurrence(el.checkInDate,getNowString())
  delete el.commentObj[getNowString()]
  console.log(items)
  updateAndSave()
}
onMounted(async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: EVERY_DAY_PATH
    },
    responseType: "text"
  })
  if (res.data) {
    const array = JSON.parse(res.data) as Item[]
    Object.assign(items,array.filter(value => !value.isArchive))
  }
  active.value = (localStorage.getItem('active')?localStorage.getItem('active'):'left') as string
})


</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  .calendar-container{
    flex: 1;
    position: relative;
    max-width: 1025px;
    height: 100%;
    border: #cccccc solid 1px;
    .item-container{
      height:calc(100% - var(--van-tabbar-height));
      border-bottom-color: #a8abb2;
      overflow: auto;
      .left,.right {
        padding: 5px;
        overflow: auto;
        height: 100%;
      }
      .left{
        .items {
          display: grid;
          grid-template-columns: repeat(auto-fill ,minmax(120px,1fr));
          .item {
            cursor: pointer;
            border: #cccccc 1px solid;
            padding: 20px;
            border-radius: 50px;
            margin: 0 5px 5px 5px;
          }
          .complete{
            background-color: rgb(209.4, 236.7, 195.9);
          }
        }
      }
      .right{
        position: relative;
        .items {
          display: flex;
          flex-direction: column;
          .item {
            position: relative;
            cursor: pointer;
            border: #cccccc 1px solid;
            padding: 20px;
            border-radius: 50px;
            margin: 0 5px 5px 5px;
            .btns{
              position: absolute;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);           /* 仅 Y 轴 */
            }
          }
          .complete{
            background-color: rgb(209.4, 236.7, 195.9);
          }
        }
        h3 {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
        }
        .add {
          margin: 5px 0 5px 5px;
          position: absolute;
          right: 0;
          top: 0;
        }

      }
      .other{
        display: flex;
        align-items: center;
        flex-direction: column;
        a{
          text-align: center;
          margin: 20px 0 0 0 ;
        }
      }
    }
    .van-tabbar{
      border-top-color: red;
      position: absolute;
      max-width: 1025px;
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
.calendar {
  .el-input {
    width: 250px !important;
  }
  .el-dialog{
    width: 80%;
    max-width: 500px;
  }
}
</style>