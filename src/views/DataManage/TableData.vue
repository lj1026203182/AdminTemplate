<template>
  <div class="tabledata">
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table :columns="columns" size="small" height="550" :data="tableData"></Table>
      </div>
    </Card>
  </div>
</template>

<script>
import serverApi from '../../axios/index';
export default {
  name: 'TableData',
  data () {
    return {
      columns: [{
        title: '小区名称',
        key: 'areaname',
        minWidth: 130
      },
      {
        title: '商户名称',
        key: 'name',
        minWidth: 130
      },
      {
        title: '设备ID',
        key: 'equipmentid',
        align: 'center',
        minWidth: 130
      },
      {
        title: '创建日期',
        key: 'createtime',
        minWidth: 130
      },
      {
        title: '操作',
        key: 'id',
        align: 'center',
        width: 90,
        fixed: 'right',
        render: (h, params) => {
          return h('Button', {
            props: {
              type: 'text',
              size: 'small',
              icon: 'md-create'
            },
            on: {
              click: () => {
                this.onClickEdit(params.row)
              }
            }
          }, '编辑')
        }
      }
      ],
      tableData: [],
      page: 1,
      size: 5
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {

    }
  },
}

</script>
<style lang="less" scoped>
</style>
