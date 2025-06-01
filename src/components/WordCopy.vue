<script setup lang="ts">
import {ElMessage} from "element-plus";

const data = [
  {
    title: '白龙账号',
    text: 's4c6912845'
  }, {
    title: '白龙密码',
    text: 'n10feed8'
  },
  {
    title: '炎兽账号',
    text: 'dqv41_vuwjhxfucvx4yt'
  }, {
    title: '炎兽密码',
    text: 'ukig11kr98'
  }, {
    title: '蛇眼账号',
    text: 'Sr2Wv6Av1Mv6'
  }, {
    title: '蛇眼密码',
    text: 'Ok0Hj7Fo3Qv6'
  }
]
const onClickCopy = async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log(navigator.clipboard)
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: err as string,
      type: 'error',
    })
  }
}

function onClickCopy2(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (err) {
    console.error('无法复制文本: ', err);
    ElMessage({
      message: err as string,
      type: 'error',
    })
  }

  document.body.removeChild(textarea);
}
</script>

<template>
  <div class="item" v-for="item in data" @click="onClickCopy2(item.text)">
    {{ item.title }}
  </div>
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  height: 50px;
  align-items: center;
  border: solid 1px blue;
  padding: 5px;
  // text-align: center;
}
</style>