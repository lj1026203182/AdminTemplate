<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="(item,index) in breadCrumbItems" :to="item.path" :key="index">
        {{ item.title }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'BreadCrumb',
  props: {
    fontSize: {
      type: Number,
      default: 14
    },
  },
  data () {
    return {
      breadCrumbItems: []
    }
  },
  created () {
    this.initBreadCrumbItems(this.$route)
  },
  methods: {
    initBreadCrumbItems (router) {
      // console.log(router);
      // 根路由title
      let breadCrumbItems = [{ path: "/", title: "后台管理系统" }];
      // 遍历父级到当前子路由的页面的title和path 存储到数组里
      for (const index in router.matched) {
        if (router.matched[index].meta && router.matched[index].meta.title) {
          breadCrumbItems.push({
            path: router.matched[index].path ? router.matched[index].path : "/",
            title: router.matched[index].meta.title
          });
        }
      }
      this.breadCrumbItems = breadCrumbItems;
    },
  },
  watch: {
    $route () {
      this.initBreadCrumbItems(this.$route)
    }
  },
}
</script>

<style lang="less" scoped>
.custom-bread-crumb {
  display: inline-block;
  vertical-align: top;
}
</style>
