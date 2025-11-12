
<template>
        <div id="App">
          <div id="return">
            <router-link to="/" id="return-link">返回主页</router-link>
          </div>
          <div id="router-view">
            <router-view >
            </router-view>
          </div>
        </div>

</template>
<script setup lang="ts">
// function setHeight() {
//   const vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
//   console.log(document.documentElement.style)
// }
//
// window.addEventListener('resize', setHeight);
// setHeight();
</script>
<style scoped lang="scss">
#App{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  #return{
    #return-link{
      height: 50px;
      background-color: #eeeeee;
    }
  }
  #router-view{
    flex: 1 1 0; /* 可放大、可缩小、自动基准 */
    overflow-y: auto;
  }
}
</style>
