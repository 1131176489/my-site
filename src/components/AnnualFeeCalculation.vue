
<template>
  <div class="container">
    <div class="container-2">
      <input v-model="inputName" type="text" placeholder="请输入名字">
      <select>
        <option v-for="month in months" v-bind:value="month.key">{{month.value}}</option>
      </select>
      <input v-model="inputPrice" type="number" placeholder="金额">

      <button>111</button>
      <button>222</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
const inputName = ref("")
const inputPrice = ref()

const months:any = []
for (let i = 0; i < 12; i++) {
  months.push({
    key: i + 1,
    value:i + 1 + "个月"
  })
}
</script>



<style lang="scss" scoped>
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .container-2{
      min-width: 800px;
      height: 500px;
      background-color: #cccccc;
      input,select{
        height: 50px;
        font-size: 24px;
        padding: 5px;
      }
    }
  }
</style>