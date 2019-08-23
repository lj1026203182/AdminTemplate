/*
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-23 15:52:58
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 14:43:47
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './router.config'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next()
  } else {
    sessionStorage.userInfo ? next() : next('/login')
  }
})
export default router
