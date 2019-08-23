<!--
 * @Descripttion: 权限判断优化
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-07 09:32:26
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 16:44:30
 -->
<!-- 首页 -->
<template>
  <div class="layout">
    <Layout style="height:100%">
      <Header :style="{ padding: 0 }" class="layout-header-bar">
        <div class="logo">
          <!-- <img src="../../assets/image/nav_logo.png" alt /> -->
          此处为LOGO
        </div>
        <!-- 面包屑 -->
        <BreadCrumb class="breadwrapper"></BreadCrumb>

        <div class="user-dropdown-menu-con">
          <Row
            type="flex"
            justify="end"
            align="middle"
            class="user-dropdown-innercon"
          >
            <Dropdown
              transfer
              trigger="click"
              @on-click="handleClickUserDropdown"
            >
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ userName }}</span>
                <Icon type="md-arrow-dropdown" />
              </a>
              <Avatar
                style="background: #619fe7;text-align:center"
                icon="ios-person"
              ></Avatar>
              <DropdownMenu slot="list">
                <DropdownItem name="ownSpace">个人中心</DropdownItem>
                <DropdownItem name="loginout" divided>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
        </div>
      </Header>

      <Layout style="height:100%">
        <Sider>
          <!-- 侧边栏 -->
          <side-menu
            accordion
            ref="sideMenu"
            :active-name="$route.name"
            @on-select="turnToPage"
            :menu-list="menuList"
          ></side-menu>
        </Sider>
        <Content
          :style="{ height: '100%', minHeight: '260px', position: 'relative' }"
        >
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <div style="padding: 10px">
            <Spin
              v-show="pageLoading"
              size="large"
              fix
              style="zIndex:1000"
            ></Spin>
            <keep-alive>
              <!--使用keep-alive会将页面缓存-->
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import SideMenu from "./SideMenu"
import BreadCrumb from "../../components/Main/BreadCrumb"
import TagsNav from '../../components/Main/TagsNav';
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '../../util/util'
import routes from '../../router.config'
import serverApi from "../../axios/index"
export default {
  name: "Main",
  data () {
    return {
      tree: [],
      isCollapsed: false,
      routesList: [],
      ruleList: [],
      num: 0,
      menuList: []
    };
  },
  components: {
    SideMenu,
    BreadCrumb,
    TagsNav
  },
  created () {
    this.getMenuList()
  },
  mounted () {
    /**
    * @description 初始化设置标签导航
    */
    this.setTagNavList()
    this.setHomeRoute(routes)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  },
  computed: {
    userName () {
      return this.$store.getters.user.username
    },
    tagNavList () {
      return this.$store.state.tagNavList
    },
    pageLoading () {
      return this.$store.getters.pageLoading
    }
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  methods: {
    ...mapMutations([
      'setTagNavList',
      'addTag',
      'setHomeRoute',
      'closeTag',
      'ClearAccessRule',
      'SetAccessRule'
    ]),
    // 退出登录
    handleClickUserDropdown (e) {
      if (e === 'loginout') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认退出当前登录账号？</p>',
          onOk: () => {
            sessionStorage.clear()
            this.ClearAccessRule()
            this.$store.dispatch('setUser', '')
            this.$router.replace({ name: 'Login' })
          }
        })
      } else {
        this.$router.push({ name: 'userInfo' })
      }
    },
    // 跳转
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    getMenuList () {
      let d = {
        data: {}
      }
      serverApi('/comm/getmenurules', d,
        res => {
          if (res.code === 1) {
            this.getCas(res.data)
            // console.log(this.ruleList); // 所有权限列表
            this.SetAccessRule(this.ruleList)
            let list = this.$store.getters.menuList
            this.getList(list)
            this.menuList = list
            this.$refs.sideMenu.getOpenedNamesByMounted()
          }
        },
        err => {
          console.log(err);
          this.$Message.error(err.msg);
        }
      )
    },
    getList (arr) {
      arr.forEach((items, index) => {
        if (items.children) {
          let num = 0
          items.children.forEach((item, i) => {
            if (this.ruleList.includes(item.name)) {
              item.show = true
              num++
            }
          });
          if (num > 0) {
            items.show = true
          } else if (this.ruleList.includes(items.name)) {
            items.show = true
          }
        }
      });
    },
    getCas (arr) {
      arr.forEach(item => {
        if (!this.ruleList.includes(this.formatName(item.name))) {
          this.ruleList.push(this.formatName(item.name))
        }
        if (item.list && item.list.length > 0) {
          this.getCas(item.list)
        }
      })
    },
    formatName (name) {
      return "/" + name
    }
  }
};
</script>

<style lang='less' scoped>
.layout {
  background: #f5f7f9;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  overflow: auto;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.logo {
  height: 100%;
  width: 220px;
  margin-left: 15px;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}

.breadwrapper {
  margin: 0 0;
  position: absolute;
  left: 250px;
  top: 0;
  height: 100%;
}
.user-dropdown {
  &-menu-con {
    position: absolute;
    right: 0;
    top: 0;
    width: 150px;
    height: 100%;
    .main-user-name {
      display: inline-block;
      // width: 90px;
      word-break: keep-all;
      white-space: nowrap;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
    }
  }
  &-innercon {
    height: 100%;
    padding-right: 14px;
  }
}
.tag-nav-wrapper {
  padding: 0;
  height: 40px;
  background: #f0f0f0;
}
.header-avator-con {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  .switch-theme-con {
    display: inline-block;
    width: 40px;
    height: 100%;
  }
  .message-con {
    display: inline-block;
    width: 30px;
    padding: 18px 0;
    text-align: center;
    cursor: pointer;
    i {
      vertical-align: middle;
    }
  }
  .change-skin {
    font-size: 14px;
    font-weight: 500;
    padding-right: 5px;
  }
  .switch-theme {
    height: 100%;
  }
  .full-screen-btn-con {
    display: inline-block;
    width: 30px;
    padding: 18px 0;
    text-align: center;
    cursor: pointer;
    i {
      vertical-align: middle;
    }
  }
  .lock-screen-btn-con {
    display: inline-block;
    width: 30px;
    padding: 18px 0;
    text-align: center;
    cursor: pointer;
    i {
      vertical-align: middle;
    }
  }
}
</style>