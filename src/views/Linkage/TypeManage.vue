<!--
 * @Descripttion: 联动类型管理
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-06 13:36:33
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-21 10:10:17
 -->
<template>
  <div class="box">
    <Card
      :bordered="false"
      class="mb10"
      v-if="$store.state.varMap.userLinkagetypeAdd"
    >
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem style="margin-bottom:0">
              <Button type="primary" @click="onClickAdd">添加类型</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table
          :columns="columns"
          size="small"
          height="500"
          :data="tableData"
        ></Table>
        <div style="float: right; padding-top:12px">
          <Page
            :total="total"
            show-total
            :current="page"
            @on-change="changePage"
            show-sizer
            @on-page-size-change="onChangeSize"
          ></Page>
        </div>
        <div style="clear:both"></div>
      </div>
    </Card>

    <!-- 新增 -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增类型</span>
      </p>
      <Form :model="addData" ref="formAdd" :label-width="85" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="catname">
              <Input
                v-model="addData.catname"
                placeholder="请输入类型名称..."
              ></Input>
            </FormItem>
            <FormItem label="类型描述" prop="description">
              <Input
                v-model="addData.description"
                placeholder="请输入类型描述..."
              ></Input>
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
            <FormItem label="排序" prop="listorder">
              <InputNumber v-model="addData.listorder" :min="0" />
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

    <!-- 编辑 -->
    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>修改类型</span>
      </p>
      <Form :model="editData" ref="form" :label-width="85" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="catname">
              <Input
                v-model="editData.catname"
                placeholder="请输入类型名称..."
              ></Input>
            </FormItem>
            <FormItem label="类型描述" prop="description">
              <Input
                v-model="editData.description"
                placeholder="请输入类型描述..."
              ></Input>
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
            <FormItem label="排序" prop="listorder">
              <InputNumber v-model="editData.listorder" :min="0" />
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
export default {
  name: "TypeManage",
  data () {
    return {
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
        catname: '',
        description: '',
        listorder: 0,
        status: 1
      },
      modal_loading: false,
      editData: {},
      editModal: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          minWidth: 80,
          indexMethod: row => {
            return (row._index + 1) + (this.limit * this.page) - this.limit;
          }
        },
        {
          title: '类型名称',
          key: 'catname',
          align: 'center',
          minWidth: 130
        },
        {
          title: '类型描述',
          key: 'description',
          align: 'center',
          minWidth: 220
        },
        {
          title: '是否启用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', params.row.status === 1 ? '启用' : '禁用')
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 360,
          render: (h, params) => {
            let menu = h('Button', {
              props: {
                type: 'warning',
                size: 'small',
                disabled: !this.$store.state.varMap.userLinkagetypeEdit
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.onClickMenu(params.row)
                }
              }
            }, '管理子菜单')
            let addmenu = h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: !this.$store.state.varMap.userLinkagetypeEdit
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '添加子菜单')
            let edit = h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: !this.$store.state.varMap.userLinkagetypeEdit
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            let del = h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: !this.$store.state.varMap.userLinkagetypeDel
              },
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              }
            }, '删除')
            return h('div', [menu, edit, del])
          }
        }
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      rules: {
        catname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
        listorder: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
      }
    }
  },
  components: {},
  created () {
    this.getTableData(this.page)
  },
  computed: {},
  methods: {
    getTableData (page) {
      let d = {
        data: {
          limit: this.limit
        }
      }
      this.$store.commit('pageLoading', true)
      serverApi(`/linkagetype/index?page=${page}`, d,
        res => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
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
        })
    },
    // 添加类型
    onClickAdd () {
      this.addModal = true
    },
    onSaveAdd () {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          let d = {
            data: this.addData
          }
          this.modal_loading = true
          serverApi('/linkagetype/add', d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.getTableData(this.page)
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
      this.editData = row
      this.editModal = true
    },
    // 保存修改
    onSave () {
      delete this.editData._index
      delete this.editData._rowKey
      this.$refs.form.validate(valid => {
        if (valid) {
          let d = {
            data: this.editData
          }
          serverApi('/linkagetype/edit', d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.editModal = false
                this.getTableData(this.page)
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
          serverApi(`/linkagetype/del`, d,
            res => {
              if (res.code === 1) {
                this.getTableData(this.page)
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
    // 管理子菜单
    onClickMenu (row) {
      this.$router.push({ name: '/admin/Linkage/index', params: { type: row.id } })
    },
    changePage (e) {
      this.page = e
      this.getTableData(this.page)
    },
    onChangeSize (e) {
      this.limit = e
      this.getTableData(this.page)
    }
  }
}
</script>

<style lang="less" scoped>
</style>