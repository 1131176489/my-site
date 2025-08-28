<template>
  <div class="transmit">
    <div class="multi-select-button">
      <button @click="onClickMultiSelect">多选</button>
      <button @click="onClickMultiDelete">删除</button>
      <button @click="onClickAll">全选</button>
    </div>
    <div class="room" ref="roomDiv">
      <div v-for="(item,index) in renderData"
           :class="[item.user === 'pc'? 'pc':'','renderItem']"
           @click="onClickMultiSelectItem(index)"
      >
        <div class="text">
          {{ item.content }}
        </div>
        <div class="time">
          {{ item.time }}
        </div>
        <div class="button">
          <button @click="onClickCopy(index)">复制</button>
          <button @click="onClickDeleteOne(index)">删除</button>
        </div>

        <div :class="[multiSelect?'':'none','multi-select',multiSelectDeleteData.includes(index)?'green':'']">
          o
        </div>
      </div>

    </div>
    <textarea class="chat-box" v-model="text"></textarea>
    <button @click="onClickSend">
      发送
    </button>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";
import {FilesTransmitItem} from "../declare";
import moment from "moment";
import {ElMessage} from "element-plus";

const roomDiv = ref<Element>()
const text = ref("")
const multiSelect = ref(false)
const multiSelectDeleteData = ref<number[]>([])
let renderData = ref<FilesTransmitItem[]>([])
const onClickSend = async () => {
  if (text.value === "") {
    return
  }
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: "D:/BackUpDictionary/FilesTransmit/record.json"
    }
  })
  const data: FilesTransmitItem[] = res.data
  data.push({
    user: "pc",
    time: moment(Date.now()).format(("YYYY年MM月DD日HH时mm分SS秒")),
    content: text.value
  })
  await window.postForm({
    dest: "D:/BackUpDictionary/FilesTransmit/",
    filename: "record.json",
    blob: JSON.stringify(data)
  })
  await getData()
  text.value = ""
  // const el = document.querySelector(".room")
  // el!.scrollTop = el!.scrollHeight
  roomDiv.value!.scrollTop = roomDiv.value!.scrollHeight
}
const getData = async () => {
  const res = await axios.get("/file/getFileByAbsolutePath", {
    params: {
      path: "D:/BackUpDictionary/FilesTransmit/record.json"
    }
  })
  renderData.value = res.data
}
const sendData = async () => {
  await window.postForm({
    dest: "D:/BackUpDictionary/FilesTransmit/",
    filename: "record.json",
    blob: JSON.stringify(renderData.value)
  })
}
const onClickMultiSelect = async () => {
  if (multiSelect) {
    multiSelectDeleteData.value = []
  }
  multiSelect.value = !multiSelect.value
}
const onClickMultiSelectItem = (index_: number) => {
  if (multiSelectDeleteData.value.includes(index_)) {
    multiSelectDeleteData.value = multiSelectDeleteData.value.filter((value, index, array) => {
      return value != index_
    })
  } else {
    multiSelectDeleteData.value.push(index_);
  }

  console.log(multiSelectDeleteData.value);

}
const onClickMultiDelete = async () => {
  if (multiSelect.value === false) {
    return
  }
  renderData.value = renderData.value.filter((value, index, array) => {
    return !multiSelectDeleteData.value.includes(index)
  })
  multiSelectDeleteData.value = []
  multiSelect.value = !multiSelect.value
  await window.postForm({
    dest: "D:/BackUpDictionary/FilesTransmit/",
    filename: "record.json",
    blob: JSON.stringify(renderData.value)
  })
  await getData()
}
const onClickAll = () => {
  if (multiSelect.value === false) {
    return
  }
  if (multiSelectDeleteData.value.length === renderData.value.length) {
    multiSelectDeleteData.value = []
  } else {
    renderData.value.forEach((value, index, array) => {
      multiSelectDeleteData.value.push(index)
    })
  }

}
const onClickCopy = async (index: number) => {
  await navigator.clipboard.writeText(renderData.value[index].content)
  ElMessage({
    message: '复制成功',
    type: 'success',
  })
}
const onClickDeleteOne = async (index_: number) => {
  renderData.value = renderData.value.filter((value, index, array) => {
    return index != index_
  })
  await sendData()
}
onMounted(async () => {
  await getData()
  roomDiv.value!.scrollTop = roomDiv.value!.scrollHeight
  console.log(renderData.value)
})
</script>
<style lang="scss">
.transmit {
  font-size: 24px;
  border: solid 2px rgb(128, 128, 128);
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100%;
  margin: 0 auto;

  .multi-select-button {
    position: fixed;
    top: 50px;
    left: 50px;
    display: flex;
    flex-direction: column;

    button {
      margin-bottom: 20px;
      cursor: pointer;
    }
  }

  .room {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 70%;
    flex-grow: 1;

    .renderItem {
      margin: 10px 0;
      border: 1px solid #aaa;
      padding: 5px;
      width: 50%;
      height: fit-content;
      word-break: break-all;

      .time {
        margin-top: 20px;
        font-size: 16px;
        color: #a8abb2;
      }

      .button {
        margin-top: 10px;
      }

      button {
        font-size: 16px;
        margin-right: 10px;
        cursor: pointer;

      }

      .multi-select {
        color: #a8abb2;
        font-size: 28px;
      }
    }

    .pc {
      transform: translateX(100%);
    }
  }

  .chat-box {
    padding: 5px;
    border: 1px solid #aaa;
    height: 30%;
    flex-shrink: 0;
    flex-grow: 1;
    width: 100%;

    overflow: auto;
    resize: none;
  }
}

.none {
  display: none;
}

.green {
  background-color: green;
}
</style>