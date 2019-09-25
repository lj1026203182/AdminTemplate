/*
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-23 15:52:58
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 17:06:16
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/css/atom.css'
import VueParticles from 'vue-particles' // 粒子效果
import config from './config/config'
import TreeTable from 'tree-table-vue'

Vue.prototype.$config = config

Vue.use(iView)
// Vue.use(VueParticles)
Vue.use(TreeTable)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach(route => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
