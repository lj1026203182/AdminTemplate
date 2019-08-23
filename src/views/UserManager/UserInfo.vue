<template>
  <div class="userinfo">
    <Card :bordered="false">
            <p slot="title">No border title</p>
            <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>
  </div>
</template>

<script>
export default {
  name:'UserInfo' ,
  data () {
    return {
    }
  },
  methods:{
  },
}

</script>
<style lang="less" scoped>
</style>
