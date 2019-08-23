<!--
 * @Descripttion: 导出
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-13 15:50:23
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 09:26:32
 -->
<!--  -->
<template >
  <Row type="flex" justify="start" align="middle">
    <Col span="6">
      <span>导出数量</span>
    </Col>
    <Col span="6">
      <RadioGroup v-model="isInput">
        <Radio v-for="item in statusList" :label="item.value" :key="item.value">
          <span>{{ item.label }}</span>
        </Radio>
      </RadioGroup>
    </Col>

    <Col span="12" v-if="isInput === 2">
      <Select v-model="excel" placeholder="选择导出数量" clearable filterable>
        <Option
          v-for="(item, index) in excelList"
          :key="index"
          :value="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </Col>
    <Col span="12" v-else>
      <Input
        placeholder="请输入导出数量..."
        v-model.number="excel"
        clearableExport
      />
    </Col>
  </Row>
</template>

<script>
export default {
  name: "Export",
  props: {
    limit: Number
  },
  data () {
    return {
      excel: 10,
      isInput: 1,
      statusList: [
        {
          label: '手动输入',
          value: 1
        },
        {
          label: '下拉选择',
          value: 2
        }],
      excelList: [
        {
          label: '20',
          value: 20
        },
        {
          label: '50',
          value: 50
        },
        {
          label: '100',
          value: 100
        }
      ],
    }
  },
  watch: {
    limit () {
      this.excel = this.limit
    }
  },
}
</script>

<style lang="less" scoped>
</style>