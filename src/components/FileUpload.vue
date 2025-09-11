<template>
  <div class="FileUpload">
    <input
        @change="onChange"
        multiple
        type="file"
        id="fileInput"/>
    <el-button type="danger" @click="uploadFile">
      上传文件
    </el-button>
    <div class="file-list-parent">
      <div v-for="(item,index) in fileList" class="filename-list">
        {{ (item as File).name }}
        <el-icon :class="[`success-icon-${index}`]" color="rgb(149, 212, 117)"><CircleCheckFilled /></el-icon>
        <el-icon :class="[`fail-icon-${index}`]" color="rgb(196, 86, 86)"><CircleCloseFilled/></el-icon>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import axios from "axios";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";

const fileList = ref<FileList>()
const onChange = () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const file = fileInput.files;
  console.log(file)
  fileList.value = file
  console.log("onchange")
}
const uploadFile = async () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const file = fileInput.files; // files 是一个FileList数组，这里取第一个文件
  console.log(file)
  if (file.length===0){
    ElMessage({
      type: "error",
      message: "文件列表为空"
    })
    return
  }
  ElMessage({
    type: "warning",
    message: "开始上传"
  })
  for (let i = 0; i < file.length; i++) {
    const file = fileInput!.files[i]
    try {
      await axios.postForm("/file/upload", {
        dest: "D:/BackUpDictionary/FilesTransmit/Files",
        filename: file.name,
        file
      })
      const element = document.querySelector(`.success-icon-${i}`) as HTMLDivElement;
      element.style.display = "inline-flex"
    }catch (e) {
      const element = document.querySelector(`.fail-icon-${i}`) as HTMLDivElement;
      element.style.display = "inline-flex"
    }
  }
  ElMessage({
    type: "success",
    message: "上传完成"
  })
}
onMounted(()=>{
  window.addEventListener("resize",()=>{
    console.log(document.documentElement.clientWidth)
  })
  1163+776
})
</script>
<style lang="scss">
.FileUpload {
  height: 100%;
  overflow: auto;
  .filename-list{
    border: 1px solid gainsboro;
    margin: 10px 0 10px 0;
    padding: 10px;
    font-size: 20px;
    background-color: #fff;
    .el-icon{
      vertical-align: bottom;
      display: none;
    }
  }
  .file-list-parent{
    /* 关键CSS：绝对定位 */
    background-color: #f0f0f0;
    position: absolute;
    top: 50px; /* top值 = 第一个div高度(60px) + 第二个div高度(40px) */
    left: 0;
    right: 0; /* 左右拉满宽度 */
    bottom: 0; /* 底部贴紧父容器底部 */
    /* 出现滚动条的关键 */
    overflow-y: auto; /* 垂直方向溢出时出现滚动条 */
  }
}

@media screen and (min-width:777px){
  .FileUpload {
    width: 50%;
    transform: translateX(50%);
  }
}
@media screen and (min-width:0px){
  .FileUpload {
    input{
      width: 270px;
    }
  }
}
</style>