<!--
 * @Descripttion:  
 * @version: 
 * @Author: Lj
 * @Date: 2019-07-25 17:51:16
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 16:02:46
 -->
<template>
  <div class="sidemenu">
    <Menu
      theme="dark"
      ref="menu"
      :active-name="activeName"
      :open-names="openedNames"
      :accordion="accordion"
      width="auto"
      @on-select="handleSelect"
    >
      <template
        v-for="(item, index) in menuList"
        v-if="item.visible && item.children && item.children.length > 0"
      >
        <!-- 只有一个children -->
        <MenuItem
          :name="getName(item, true)"
          v-if="item.children.length == 1"
          :index="item.children[0].path"
          :key="item.name"
        >
          <Icon :type="item.children[0].meta.icon" />
          {{ item.children[0].meta.title }}
        </MenuItem>
        <!-- 多个children -->
        <Submenu :name="item.name" v-else v-show="item.show">
          <template slot="title">
            <Icon :type="item.meta.icon" />
            <span>{{ showTitle(item) }}</span>
          </template>
          <MenuItem
            :name="getName(it)"
            v-for="(it, i) in item.children"
            :key="i"
          >
            <span>{{ showTitle(it) }}</span>
          </MenuItem>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
import serverApi from '../../axios/index';
import { getUnion } from '../../util/tool'
import { showTitle } from '../../util/util'
export default {
  name: "SideMenu",
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: ''
    },
    accordion: Boolean,
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    }
  },
  components: {},
  watch: {
    activeName (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames (newNames) {
      this.openedNames = newNames
    },
    openedNames () {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
        this.$refs.menu.updateActiveName()
      })
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item)
    },
    handleSelect (name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    },
    getName (item, children0) {
      return children0 ? item.children[0].name : item.name
    },
    getOpenedNamesByMounted () {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    }
  }
}
</script>

<style lang="less" scoped>
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>