<!--
 * @Descripttion: 首页柱状图,饼状图,折线图
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-07 09:32:26
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 17:18:22
 -->
<!-- 主页 -->
<template>
  <div class="home">
    <Row :gutter="20" style="margin-top: 10px;">
      <!-- 饼状图 -->
      <Col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie
            style="height: 300px;"
            :value="pieData"
            text="用户访问来源"
          ></chart-pie>
        </Card>
      </Col>
      <!-- 柱状图 -->
      <Col :md="24" :lg="16" style="margin-bottom: 20px;">
        <!-- <Card shadow>
          <chart-bar
            style="height: 300px;"
            :value="barData"
            text="每周用户活跃量"
          />
        </Card> -->
        <CountTo
          :end="9999"
          count-class="count-style"
          :decimals="4"
          unit-class="count-style"
        ></CountTo>
      </Col>
    </Row>
    <!-- 折线图 -->
    <Row>
      <!-- <Card shadow>
        <chart-line style="height: 310px;"></chart-line>
      </Card> -->
    </Row>
  </div>
</template>

<script>
import serverApi from '../../axios/index'
import ChartPie from '../../components/Charts/Pie'
import ChartBar from '../../components/Charts/Bar'
import ChartLine from '../../components/Charts/Line'
import CountTo from '../../components/CountTo/CountTo'
export default {
  name: 'Home',
  data () {
    return {
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  components: {
    ChartPie,
    ChartBar,
    ChartLine,
    CountTo
  },
  created () { },
  computed: {},
  methods: {}
}
</script>

<style lang='less' scoped>
</style>