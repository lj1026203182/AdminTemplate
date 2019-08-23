<!--
 * @Descripttion: 联动类型管理
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-06 13:36:33
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-21 10:10:20
 -->
<template>
  <div class="box">
    <Card
      :bordered="false"
      class="mb10"
      v-if="$store.state.varMap.userLinkageAdd"
    >
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem style="margin-bottom:0">
              <Button type="primary" @click="onClickAdd">添加菜单</Button>
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
        <span>新增菜单</span>
      </p>
      <Form :model="addData" ref="formAdd" :label-width="85" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="所属类型" prop="catid">
              <Select v-model="addData.catid" placeholder="选择所属类型...">
                <Option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item.id"
                  >{{ item.catname }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="菜单名称" prop="name">
              <Input
                v-model="addData.name"
                placeholder="请输入菜单名称..."
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
        <span>修改菜单</span>
      </p>
      <Form :model="editData" ref="form" :label-width="85" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="所属类型" prop="catid">
              <Select v-model="editData.catid" placeholder="选择所属类型...">
                <Option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item.id"
                  >{{ item.catname }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="菜单名称" prop="name">
              <Input
                v-model="editData.name"
                placeholder="请输入菜单名称..."
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
      typeList: [],
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
        catid: '',
        name: '',
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
          title: '所属类型',
          key: 'catname',
          align: 'center',
          minWidth: 130,
          // render: (h, params) => {
          //   let text = ""
          //   this.typeList.forEach(element => {
          //     if (element.id === params.row.catid) {
          //       text = element.catname
          //     }
          //   });
          //   return h('div', text)
          // }
        },
        {
          title: '菜单名称',
          key: 'name',
          align: 'center',
          minWidth: 130
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
            let edit = h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: !this.$store.state.varMap.userLinkageEdit
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
                disabled: !this.$store.state.varMap.userLinkageDel
              },
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              }
            }, '删除')
            return h('div', [edit, del])
          }
        }
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      rules: {
        catid: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur', type: 'string' }],
        status: [{ required: true, message: '不能为空', type: 'number' }],
        listorder: [{ required: true, message: '不能为空', type: 'number' }]
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
          limit: this.limit,
          catid: this.$route.params.type || ''
        }
      }
      this.$store.commit('pageLoading', true)
      serverApi(`/linkage/index?page=${page}`, d,
        res => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
            this.typeList = res.data.linkagetype
            if (this.$route.params.type) {
              this.addData.catid = this.$route.params.type
            }
          } else if (res.url) {
            this.$Message.warning(res.msg);
            this.$router.push({ name: '404' })
          } else {
            this.$Message.warning(res.msg);
          }
          this.$store.commit('pageLoading', false)
          this.tableLoading = false
        },
        err => {
          this.$store.commit('pageLoading', false)
          this.$Message.error(res.msg);
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
          serverApi('/linkage/add', d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.getTableData(this.page)
                this.addModal = false
                this.addData = {
                  listorder: 0,
                  status: 1,
                  name: '',
                  catid: ''
                }
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
      delete this.editData.icon
      delete this.editData.value
      delete this.editData.catname
      this.$refs.form.validate(valid => {
        if (valid) {
          let d = {
            data: this.editData
          }
          serverApi('/linkage/edit', d,
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
          serverApi(`/linkage/del`, d,
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