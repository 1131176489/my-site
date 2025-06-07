<script setup lang="ts">
async function selectFolder() {
//   try {
//     const directoryHandle = await window.showDirectoryPicker();
//     console.log('选择的文件夹:', directoryHandle.name);
//
// // // 遍历文件夹内容
// //     for await (const entry of directoryHandle.values()) {
// //       console.log(entry.kind, entry.name);
// //     }
//   } catch (error) {
//     console.error('用户取消了选择或发生错误:', error);
//   }
}

// 调用函数
selectFolder();
</script>

<template>
<input type="file" webkitdirectory directory multiple>
  <button @click="selectFolder">测试</button>
</template>

<style scoped>

</style>