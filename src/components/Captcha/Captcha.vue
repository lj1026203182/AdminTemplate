<!--
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-07 09:32:26
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 14:39:31
 -->
<!-- 验证码 -->
<template>
  <div class="box">
    <Spin fix v-if="url === ''">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <img :src="url" alt @click="onClickRefresh" />
  </div>
</template>

<script>
import serverApi from '../../axios/index'
export default {
  name: "Captcha",
  data () {
    return {
      url: ''
    }
  },
  components: {},
  created () {
    this.url = 'http://aq.fangshaokj.com/app/admin/login/captcha'
  },
  computed: {},
  methods: {
    onClickRefresh () {
      this.url = ''
      setTimeout(() => {
        this.url = 'http://aq.fangshaokj.com/app/admin/login/captcha'
      }, 100)
      let d = {
        data: {}
      }
      serverApi('/login/captcha', d,
        res => {
        },
        err => {
          this.$Message.warning('请重新点击以刷新')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 56px;
  text-align: center;
}
</style>

