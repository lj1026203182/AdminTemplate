<!--
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-25 09:53:19
 * @LastEditors: Lj
 * @LastEditTime: 2019-07-25 09:53:19
 -->
<!-- 登陆 -->
<template>
  <div class="login" @keydown.enter="handleSubmit">
    <!-- <vue-particles color="#c7f0db"></vue-particles> -->
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title"><Icon type="log-in"></Icon>欢迎登录</p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input
                v-model="form.username"
                placeholder="请输入用户名"
                autofocus
              >
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              >
                <span slot="prepend">
                  <Icon :size="14" type="ios-lock"></Icon>
                </span>
              </Input>
            </FormItem>

            <FormItem prop="captcha">
              <Input
                v-model="form.captcha"
                placeholder="点击图片刷新验证码"
                size="large"
              >
                <span slot="prepend">
                  <Icon :size="14" type="md-code-working"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Captcha></Captcha>
            </FormItem>
            <FormItem>
              <Button
                :loading="loading"
                shape="circle"
                @click="handleSubmit"
                type="primary"
                long
                >登录</Button
              >
            </FormItem>
          </Form>
          <p class="login-tip">- 登录安全隐患管理平台 -</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import serverApi from '../../axios/index'
import Captcha from '../../components/Captcha/Captcha';
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
    }
  },
  components: {
    Captcha
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let d = {
            data: this.form
          }
          serverApi('/login/login', d,
            res => {
              this.loading = false
              if (res.code === 1) {
                this.$Message.success(res.msg)
                sessionStorage.setItem('userInfo', JSON.stringify(res.data))
                this.$store.dispatch('setUser', res.data)
                this.$router.push('/')
              } else {
                this.$Message.error(res.msg)
              }
            },
            err => {
              this.loading = false
              this.$Message.warning('连接失败！')
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/image/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  &-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}
</style>