<!--
 * @Descripttion: 联动类型管理
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-06 13:36:33
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 11:08:16
 -->
<template>
  <div class="box">
    <Card
      :bordered="false"
      class="mb10"
      v-if="$store.state.varMap.userUsertypeAdd"
    >
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem style="margin-bottom:0">
              <Button type="primary" @click="onClickAdd">添加类型</Button>
              <!-- <Button
                type="primary"
                style="margin-left:12px"
                @click="exportData()"
              >
                <Icon type="ios-download-outline" />导出
              </Button> -->
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <tree-table
          expand-key="name"
          :expand-type="false"
          :selectable="false"
          :columns="columns"
          :data="tableData"
          :is-fold="false"
        >
          <template slot="id" slot-scope="scope">
            <span>{{ scope.rowIndex + 1 }}</span>
          </template>
          <template slot="type" slot-scope="scope">
            <span v-if="scope.row.type === 1">工区</span>
            <span v-else-if="scope.row.type === 2">整改单位</span>
            <span v-else>基层</span>
          </template>
          <template slot="status" slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-else>禁用</span>
          </template>
          <template slot="is_login" slot-scope="scope">
            <span v-if="scope.row.is_login === 1">允许</span>
            <span v-else>禁止</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <Button
              type="primary"
              size="small"
              @click="onClickEdit(scope.row)"
              style="marginRight:5px"
              :disabled="!$store.state.varMap.userUsertypeEdit"
              >编辑</Button
            >
            <Button
              type="error"
              size="small"
              @click="onClickDel(scope.row)"
              :disabled="!$store.state.varMap.userUsertypeDel"
              >删除</Button
            >
          </template>
        </tree-table>
      </div>
    </Card>

    <!-- 新增 -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增类型</span>
      </p>
      <Form :model="addData" ref="form" :label-width="100" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="name">
              <Input
                v-model="addData.name"
                placeholder="请输入类型名称..."
              ></Input>
            </FormItem>
            <FormItem label="上级" prop="parentid">
              <treeselect
                v-model="addData.parentid"
                :options="userType"
                placeholder="请选择上级..."
              />
            </FormItem>
            <FormItem label="类型描述" prop="mark">
              <Input
                v-model="addData.mark"
                placeholder="请输入类型描述..."
              ></Input>
            </FormItem>
            <FormItem label="用户类别" prop="type">
              <RadioGroup v-model="addData.type">
                <Radio
                  v-for="item in typeList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <RadioGroup v-model="addData.status">
                <Radio
                  v-for="item in radioList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否允许登陆" prop="status">
              <RadioGroup v-model="addData.is_login">
                <Radio
                  v-for="item in loginList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveAdd"
          >保存</Button
        >
      </div>
    </Modal>

    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增类型</span>
      </p>
      <Form :model="editData" ref="formEidt" :label-width="100" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="name">
              <Input
                v-model="editData.name"
                placeholder="请输入类型名称..."
              ></Input>
            </FormItem>
            <FormItem label="上级" prop="parentid">
              <treeselect
                v-model="editData.parentid"
                :options="userType"
                placeholder="请选择上级..."
              />
            </FormItem>
            <FormItem label="类型描述" prop="mark">
              <Input
                v-model="editData.mark"
                placeholder="请输入类型描述..."
              ></Input>
            </FormItem>
            <FormItem label="用户类别" prop="type">
              <RadioGroup v-model="editData.type">
                <Radio
                  v-for="item in typeList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <RadioGroup v-model="editData.status">
                <Radio
                  v-for="item in radioList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否允许登陆" prop="status">
              <RadioGroup v-model="editData.is_login">
                <Radio
                  v-for="item in loginList"
                  :label="item.value"
                  :key="item.value"
                >
                  <span>{{ item.label }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave"
          >保存</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import serverApi from '../../axios/index';
import { exportExcelData } from '../../util/util';
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "TypeManage",
  data () {
    return {
      tableList: [],
      userType: [],
      typeList: [
        {
          label: '工区',
          value: 1
        },
        {
          label: '整改单位',
          value: 2
        },
        {
          label: '基层',
          value: 3
        }],
      loginList: [
        {
          label: '允许',
          value: 1
        }, {
          label: '禁止',
          value: 0
        }
      ],
      radioList: [
        {
          label: '启用',
          value: 1
        }, {
          label: '不启用',
          value: 0
        }
      ],
      addModal: false,
      addData: {
        name: '',
        mark: '',
        level: '',
        status: 1,
        type: 1,
        is_login: 1
      },
      modal_loading: false,
      editData: {},
      editModal: false,
      columns: [
        {
          title: '序号',
          align: 'center',
          minWidth: 80,
          type: 'template',
          template: 'id',
        },
        {
          title: '用户类型名称',
          key: 'name',
          minWidth: 300
        },
        {
          title: '用户类型描述',
          // align: 'center',
          key: 'mark',
          minWidth: 210
        },
        {
          title: '类别',
          minWidth: 120,
          type: 'template',
          template: 'type',
          // render: (h, params) => {
          //   return h('div', [
          //     params.row.type === 1 ? '工区' : params.row.type === 2 ? '整改单位' : '基层'
          //   ])
          // }
        },
        {
          title: '等级',
          key: 'level',
          minWidth: 120
        },
        {
          title: '是否启用',
          minWidth: 100,
          type: 'template',
          template: 'status',
          // render: (h, params) => {
          //   return h('span', params.row.status === 1 ? '启用' : '禁用')
          // }
        },
        {
          title: '是否允许登陆',
          minWidth: 100,
          align: 'center',
          type: 'template',
          template: 'is_login',
          // render: (h, params) => {
          //   return h('span', params.row.is_login === 1 ? '启用' : '禁用')
          // }
        },
        {
          title: '添加日期',
          key: 'add_time',
          // align: 'center',
          minWidth: 200
        },
        {
          title: '操作',
          width: 200,
          // fixed: 'right',
          type: 'template',
          template: 'operation'
          // render: (h, params) => {
          //   let edit = h('Button', {
          //     props: {
          //       type: 'primary',
          //       size: 'small',
          //       disabled: !this.$store.state.varMap.userUsertypeEdit
          //     },
          //     style: {
          //       marginRight: '5px'
          //     },
          //     on: {
          //       click: () => {
          //         this.onClickEdit(params.row)
          //       }
          //     }
          //   }, '编辑')
          //   let del = h('Button', {
          //     props: {
          //       type: 'error',
          //       size: 'small',
          //       disabled: !this.$store.state.varMap.userUsertypeDel
          //     },
          //     on: {
          //       click: () => {
          //         this.onClickDel(params.row)
          //       }
          //     }
          //   }, '删除')
          //   return h('div', [edit, del])
          // }
        }
      ],
      tableData: [],
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        mark: [{ required: true, message: '不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
        parentid: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }]
      },
      i: 0,
      dataList: []
    }
  },
  components: { Treeselect },
  created () {
    this.getTableData()
  },
  computed: {
    typeText () {

    }
  },
  methods: {
    getCas (arr) {
      arr.forEach(item => {
        item.label = item.name
        item.align = 'center'
        item.headerAlign = 'center'
        item.isDefaultExpanded = true
        if (item.children) {
          this.getCas(item.children)
        }
      });
    },
    getTableData () {
      let d = {
        data: {}
      }
      this.$store.commit('pageLoading', true)
      serverApi(`/usertype/index`, d,
        res => {
          if (res.code === 1) {
            this.tableData = res.data
            let tree = res.data
            this.getCas(tree)
            let newTree = tree.concat({ label: '作为一级', parentid: 0, isDisabled: false, id: 0, })
            this.userType = newTree
          } else if (res.url) {
            this.$Message.warning(res.msg);
            this.$router.push({ name: '404' })
          } else {
            this.$Message.warning(res.msg);
          }
          this.$store.commit('pageLoading', false)
        },
        err => {
          this.$store.commit('pageLoading', false)
          this.$Message.error('获取失败');
          console.log(err);
        }
      )
    },
    // 添加类型
    onClickAdd () {
      this.addModal = true
    },
    onSaveAdd () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let d = {
            data: this.addData
          }
          this.modal_loading = true
          serverApi('/usertype/add', d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.getTableData()
                this.addData = {
                  name: '',
                  mark: '',
                  level: '',
                  status: 1,
                  type: 1
                },
                  this.addModal = false
              } else {
                this.$Message.warning(res.msg);
              }
              this.modal_loading = false
            },
            err => {
              console.log(err);
              this.$Message.warning('新增失败!');
              this.modal_loading = false
            })
        }
      })
    },
    onClickEdit (row) {
      this.editData = {
        name: row.name,
        id: row.id,
        mark: row.mark,
        status: row.status,
        level: row.level,
        parentid: row.parentid,
        type: row.type,
        is_login: row.is_login
      }
      this.editModal = true
    },
    // 保存修改
    onSave () {
      this.$refs.formEidt.validate(valid => {
        if (valid) {
          let d = {
            data: this.editData
          }
          serverApi('/usertype/edit', d,
            res => {
              console.log(res);
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.editModal = false
                this.getTableData()
              } else {
                this.$Message.warning(res.msg);
              }
            },
            err => {
              console.log(err);
              this.$Message.error('修改失败');
            })
        }
      })
    },
    // 删除
    onClickDel (row) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除此信息？",
        onOk: () => {
          let d = {
            data: {
              id: row.id
            }
          }
          serverApi(`/usertype/del`, d,
            res => {
              if (res.code === 1) {
                this.getTableData()
              } else {
                this.$Message.warning(res.msg);
              }
            },
            err => {
              console.log(err);
              this.$Message.error('获取失败');
            })
        }
      })
    },
    formateExport (arr) {
      arr.forEach(item => {
        this.tableList.push(item)
        if (item.children) {
          this.formateExport(item.children)
        }
      })
    },
    exportData () {
      let d = {
        data: {}
      }
      let tableData = []
      serverApi(`/usertype/index`, d,
        res => {
          if (res.code === 1) {
            this.formateExport(res.data)
            exportExcelData(this.columns, this.tableList, '用户类型管理')
          } else {
            this.$Message.warning('导出失败');
          }
        },
        err => {
          this.$Message.warning('导出错误');
        }
      )
    },
  }
}
</script>

<style lang="less" scoped>
</style>