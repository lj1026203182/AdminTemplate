/*
 * @Description: 
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-24 14:58:18
 * @LastEditors: Lj
 * @LastEditTime: 2019-09-05 09:42:39
 */
const Error404 = r => require.ensure([], () => r(require('./views/Error/404.vue')))
const Main = r => require.ensure([], () => r(require('./views/Main/Main.vue')))
const Login = r => require.ensure([], () => r(require('./views/Login/Login.vue')))
const Home = r => require.ensure([], () => r(require('./views/Home/Home.vue')))
const AccountData = r => require.ensure([], () => r(require('./views/UserManager/AccountData.vue')))
const UserInfo = r => require.ensure([], () => r(require('./views/UserManager/UserInfo.vue')))
const UserManage = r => require.ensure([], () => r(require('./views/UserManager/UserManage.vue')))
const LoginLog = r => require.ensure([], () => r(require('./views/System/LoginLog.vue')))
const OperationLog = r => require.ensure([], () => r(require('./views/System/OperationLog.vue')))
const TypeManage = r => require.ensure([], () => r(require('./views/Linkage/TypeManage.vue')))
const MenuManage = r => require.ensure([], () => r(require('./views/Linkage/MenuManage.vue')))
const User = r => require.ensure([], () => r(require('./views/User/User.vue')))
const UserType = r => require.ensure([], () => r(require('./views/User/UserType.vue')))

/**
* hidden: true                   如果hidden为true则在左侧菜单栏展示，否则不显示
* name:'router-name'             路由名称，必须填写
* meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'           对应路由在左侧菜单栏的图标样式
  }
**/

const routes = [
  {
    path: '/404',
    name: '404',
    visible: false,
    component: Error404
  },
  {
    path: '/login',
    visible: false,
    name: 'Login',
    meta: { title: '系统登录' },
    component: Login
  },
  {
    path: '/',
    visible: true,
    component: Main,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        visible: true,
        meta: { title: '首页', icon: 'ios-home' },
        component: Home
      }
    ]
  },
  {
    path: '/admin',
    name: '/admin/User',
    visible: true,
    component: Main,
    meta: { title: '用户管理', icon: 'ios-ribbon' },
    redirect: '/admin/User/index',
    children: [
      {
        path: 'User/index',
        name: '/admin/User/index',
        visible: true,
        meta: { title: '用户管理', keepAlive: true },
        component: User
      },
      {
        path: 'Usertype/index',
        name: '/admin/Usertype/index',
        visible: true,
        meta: { title: '用户类型管理', keepAlive: true },
        component: UserType
      }
    ]
  },

  {
    path: '/admin',
    name: '/admin/Manager',
    visible: true,
    component: Main,
    meta: { title: '管理员管理', icon: 'ios-person' },
    redirect: '/admin/Manager/index',
    children: [
      {
        path: 'Manager/index',
        name: '/admin/Manager/index',
        visible: true,
        meta: { title: '管理员管理', keepAlive: true },
        component: AccountData
      },
      {
        path: 'Role/index',
        name: '/admin/Role/index',
        visible: true,
        meta: { title: '角色管理', keepAlive: true },
        component: UserManage
      }
    ]
  },
  {
    path: '/admin',
    name: '/admin/Linkage',
    visible: true,
    component: Main,
    meta: { title: '联动管理', icon: 'md-link' },
    redirect: '/linkage/typeManage',
    children: [
      {
        path: 'Linkagetype/index',
        name: '/admin/Linkagetype/index',
        visible: true,
        meta: { title: '联动类型管理', keepAlive: false },
        component: TypeManage
      },
      {
        path: 'Linkage/index',
        name: '/admin/Linkage/index',
        visible: true,
        meta: { title: '联动菜单管理', keepAlive: false },
        component: MenuManage
      }
    ]
  },
  {
    path: '/admin',
    name: '/admin/Config',
    visible: true,
    component: Main,
    meta: { title: '系统设置', icon: 'md-settings' },
    redirect: '/admin/App/index',
    children: [
      // {
      //   path: 'Config/index',
      //   name: '/admin/Config/index',
      //   visible: true,
      //   meta: { title: '系统配置', keepAlive: true },
      //   component: Setting
      // },
      {
        path: 'Log/login',
        name: '/admin/Log/login',
        visible: true,
        meta: { title: '后台登陆日志', keepAlive: true },
        component: LoginLog
      },
      {
        path: 'Log/log',
        name: '/admin/Log/log',
        visible: true,
        meta: { title: '后台操作日志', keepAlive: true },
        component: OperationLog
      }
    ]
  },
  {
    path: '/user',
    component: Main,
    visible: false,
    redirect: '/userInfo',
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        visible: false,
        meta: { title: '个人中心' },
        component: UserInfo
      }
    ]
  },
  {
    path: '*',
    visible: false,
    component: Error404
  },
]

export default routes
