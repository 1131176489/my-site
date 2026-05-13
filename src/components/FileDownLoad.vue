<template>
  <div class="SpecialFileDownload">
    <el-button @click="onClickDownloadAll">
      全部下载
    </el-button>
    <div class="file-list-parent">

      <div v-for="(item,index) in fileList" class="filename-list">
        {{ item.filename }}
        <el-button type="primary" @click="onClickDownload(index)">
          点击下载
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { downloadFile, getDirectoryListByAbsolutePath, getFileByAbsolutePath, mySleep , filePathToUrlPath} from "../assets/utils"
import { DirectoryListItem } from "../declare";
import { onMounted, ref } from "vue";

const fileList = ref<Array<DirectoryListItem>>()
const onClickDownload = async (index: number) => {
  ElMessage.warning({ message: "开始下载" })
  console.log(fileList.value[index])

  try {
    console.log()
    const res = await getFileByAbsolutePath(fileList.value[index].path,{
      responseType:"blob"
    })
    const blob = res.data
    downloadFile(blob, fileList.value[index].filename)
    ElMessage.success("下载完成")
  } catch (e) {
    ElMessage.error(e.message)
  }
}
const onClickDownloadAll = async () => {
  for (let index = 0; index < fileList.value.length; index++) {
    try {
      const res = await getFileByAbsolutePath(fileList.value[index].path,{
        responseType:"blob"
      })
      const blob = res.data
      downloadFile(blob, fileList.value[index].filename)
      ElMessage.success("下载完成")
    } catch (e) {
      ElMessage.error(e.message)
    }
  }
}
onMounted(async () => {
  const res = await getDirectoryListByAbsolutePath("D:/static/中转站")

  fileList.value = res.data as Array<DirectoryListItem>
})
</script>
<style scoped>

.SpecialFileDownload {
  height: 100%;
  overflow: auto;

  .filename-list {
    border: 1px solid gainsboro;
    margin: 10px 0 10px 0;
    padding: 10px;
    font-size: 20px;
    background-color: #fff;

    .el-icon {
      vertical-align: bottom;
      display: none;
    }
  }

  .file-list-parent {
    /* 关键CSS：绝对定位 */
    background-color: #f0f0f0;
    /* 出现滚动条的关键 */
    overflow-y: auto; /* 垂直方向溢出时出现滚动条 */
  }

  .el-button {
    display: block;
    margin: 0 auto;
  }
}
</style>