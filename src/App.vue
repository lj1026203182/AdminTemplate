<!--
 * @Description: 解决刷新vuex丢失
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-23 15:52:58
 * @LastEditors: Lj
 * @LastEditTime: 2019-09-05 10:15:37
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created () {
    sessionStorage.userInfo && this.$store.dispatch("setUser", JSON.parse(sessionStorage.userInfo));
  }
};
</script>


<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  background: #f5f6f9;
  overflow: hidden;
}
html {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
.smooth-dnd-container {
  min-height: 0 !important;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
</style>