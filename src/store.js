/*
 * @Descripttion:
 * @version:
 * @Author: Lj
 * @Date: 2019-08-07 09:32:26
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 16:24:10
 */
import Vue from 'vue'
import Vuex from 'vuex'
import routes from './router.config'
import router from './router'
import {
  setTagNavListInSessionstorage,
  getTagNavListFromSessionstorage,
  routeHasExist,
  getHomeRoute,
  getNextRoute,
  routeEqual,
  getMenuByRouter
} from './util/util'
import * as api from './util/access'

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  console.log(nextRoute);
  router.push(nextRoute)
}

Vue.use(Vuex)

const types = {
  SET_USER: 'SET_USER',
  SET_ROUTERS: 'SET_ROUTERS'
}

const state = {
  user: '', // 用户信息
  routers: routes, // 动态路由
  pageLoading: false, // 页面加载
  tagNavList: [], // 导航
  homeRoute: {},
  varMap: api.varMap,
  URL_MAP: api.URL_MAP
}

const getters = {
  user: state => state.user,
  routers: state => state.routers,
  pageLoading: state => state.pageLoading,
  menuList: (state, getters, rootState) => getMenuByRouter(routes, rootState.user.access)
}

const mutations = {
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.SET_ROUTERS] (state, routers) {
    state.routers = routers
  },
  pageLoading (state, n) {
    state.pageLoading = !!n
  },
  setTagNavList (state, list) {
    let tagList = []
    if (list) {
      tagList = [...list]
    } else tagList = getTagNavListFromSessionstorage() || []
    if (tagList[0] && tagList[0].name !== 'Home') tagList.shift()
    let homeTagIndex = tagList.findIndex(item => item.name === 'Home')
    if (homeTagIndex > 0) {
      let homeTag = tagList.splice(homeTagIndex, 1)[0]
      tagList.unshift(homeTag)
    }
    state.tagNavList = tagList
    setTagNavListInSessionstorage([...tagList])
  },
  addTag (state, { route, type }) {
    if (!routeHasExist(state.tagNavList, route)) {
      if (type === 'push') state.tagNavList.push(route)
      else {
        if (route.name === 'Home') state.tagNavList.unshift(route)
        else state.tagNavList.splice(1, 0, route)
      }
      setTagNavListInSessionstorage([...state.tagNavList])
    }
  },
  setHomeRoute (state, routes) {
    state.homeRoute = getHomeRoute(routes, 'Home')
  },
  closeTag (state, route) {
    let tag = state.tagNavList.filter(item => routeEqual(item, route))
    route = tag[0] ? tag[0] : null
    if (!route) return
    closePage(state, route)
  },
  SetAccessRule (state, urlList) {
    api.SetAccessRule(urlList, state.URL_MAP, state.varMap)
  },
  ClearAccessRule (state) {
    for (let index in state.varMap) {
      state.varMap[index] = false
    }
  }
}

const actions = {
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
