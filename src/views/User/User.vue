<!--
 * @Descripttion: 导出优化
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-08 14:43:35
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 09:49:40
 -->
<!-- 登陆日志 -->
<template>
  <div class="box" @keydown.enter="onClickSearch">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row :gutter="16">
          <Col span="4">
            <FormItem label="用户账号" style="margin-bottom:0">
              <Input
                placeholder="搜索用户名称..."
                v-model="searchkey.username"
                clearable
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="用户手机" style="margin-bottom:0">
              <Input
                placeholder="搜索手机..."
                v-model="searchkey.phone"
                clearable
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="用户姓名" style="margin-bottom:0">
              <Input
                placeholder="搜索姓名..."
                v-model="searchkey.nickname"
                clearable
              />
            </FormItem>
          </Col>

          <Col span="4">
            <FormItem label="搜索状态" style="margin-bottom:0">
              <Select v-model="searchkey.status" placeholder="选择状态">
                <Option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="6">
            <FormItem label="搜索岗位" style="margin-bottom:0">
              <treeselect
                v-model="searchkey.position_id"
                :options="userType"
                placeholder="请选择类别..."
              />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="8" style="marginTop:12px">
          <Col span="6">
            <FormItem label="注册日期" style="margin-bottom:0">
              <Row>
                <Col span="11">
                  <DatePicker
                    type="date"
                    placeholder="开始时间"
                    @on-change="searchkey.start_time = $event"
                    v-model="searchkey.start_time"
                  ></DatePicker>
                </Col>
                <Col span="2" class="tac">-</Col>
                <Col span="11">
                  <DatePicker
                    type="date"
                    placeholder="结束时间"
                    v-model="searchkey.end_time"
                    @on-change="searchkey.end_time = $event"
                  ></DatePicker>
                </Col>
              </Row>
            </FormItem>
          </Col>

          <Col :lg="9" :xl="8" :xxl="6">
            <Button
              type="primary"
              style="margin-left:12px"
              @click="onClickSearch"
              >搜索</Button
            >
            <Button
              type="primary"
              style="margin-left:12px"
              @click="onClickReset()"
              >重置</Button
            >
            <Button
              type="primary"
              style="margin-left:12px"
              @click="onClickAdd"
              v-if="$store.state.varMap.userUserAdd"
              >添加用户</Button
            >
            <Button
              type="primary"
              style="margin-left:12px"
              @click="exportData()"
            >
              <Icon type="ios-download-outline" />导出
            </Button>
          </Col>

          <Col :lg="8" :xl="7" :xxl="6">
            <Export ref="export" :limit="limit"> </Export>
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
          ref="table"
        ></Table>
        <div style="float: right; padding-top:12px">
          <Page
            transfer
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

    <!-- 添加 -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增用户</span>
      </p>
      <Form :model="addData" ref="formAdd" :rules="rules" :label-width="85">
        <Row>
          <Col span="24">
            <FormItem label="账号" prop="username">
              <Input
                v-model="addData.username"
                placeholder="请输入用户名..."
              ></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input
                v-model="addData.password"
                placeholder="请输入密码..."
                type="password"
              ></Input>
            </FormItem>
            <FormItem label="确认密码" prop="addPasswordcheck">
              <Input
                v-model="addPassword"
                placeholder="请再次输入密码..."
                type="password"
              ></Input>
            </FormItem>
            <FormItem label="用户类别" prop="position_id">
              <treeselect
                v-model="addData.position_id"
                :options="userType"
                placeholder="请选择类别..."
              />
            </FormItem>
            <FormItem label="真实姓名" prop="nickname">
              <Input
                v-model="addData.nickname"
                placeholder="请输入真实姓名..."
              ></Input>
            </FormItem>
            <FormItem label="手机号码" prop="phone">
              <Input
                v-model="addData.phone"
                placeholder="请输入手机号码..."
              ></Input>
            </FormItem>
            <FormItem label="岗位" prop="jobs">
              <Input v-model="addData.jobs" placeholder="请输入岗位..."></Input>
            </FormItem>
            <FormItem label="工号" prop="jobnumber">
              <Input
                v-model="addData.jobnumber"
                placeholder="请输入工号..."
              ></Input>
            </FormItem>

            <FormItem label="是否启用" prop="status">
              <RadioGroup v-model="addData.status">
                <Radio
                  v-for="item in statusList"
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

    <!-- 编辑 -->
    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增用户</span>
      </p>
      <Form :model="editData" ref="form" :rules="rules" :label-width="85">
        <Row>
          <Col span="24">
            <FormItem label="账号" prop="username">
              <Input
                v-model="editData.username"
                placeholder="请输入用户名..."
              ></Input>
            </FormItem>

            <FormItem label="密码">
              <Input
                v-model="editData.password"
                placeholder="不修改密码请置空..."
                type="password"
              ></Input>
            </FormItem>
            <FormItem label="确认密码" prop="editPasswordcheck">
              <Input
                v-model="editPassword"
                placeholder="请再次输入密码..."
                type="password"
              ></Input>
            </FormItem>
            <FormItem label="用户类别" prop="position_id">
              <treeselect
                v-model="editData.position_id"
                :options="userType"
                placeholder="请选择类别..."
              />
            </FormItem>
            <FormItem label="真实姓名" prop="nickname">
              <Input
                v-model="editData.nickname"
                placeholder="请输入真实姓名..."
              ></Input>
            </FormItem>
            <FormItem label="手机号码" prop="phone">
              <Input
                v-model="editData.phone"
                placeholder="请输入手机号码..."
              ></Input>
            </FormItem>
            <FormItem label="岗位" prop="jobs">
              <Input
                v-model="editData.jobs"
                placeholder="请输入岗位..."
              ></Input>
            </FormItem>
            <FormItem label="工号" prop="jobnumber">
              <Input
                v-model="editData.jobnumber"
                placeholder="请输入工号..."
              ></Input>
            </FormItem>

            <FormItem label="是否启用" prop="status">
              <RadioGroup v-model="editData.status">
                <Radio
                  v-for="item in statusList"
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
import { isLogined, isIPLogined } from '../../util/tool';
import { exportExcelData } from '../../util/util';
import Export from '../../components/Export/Export';
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "LoginLog",
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (this.editPassword !== this.editData.password) {
        callback(new Error('俩次密码不一致'));
      } else {
        callback();
      }
    };
    const validateAddPassCheck = (rule, value, callback) => {
      if (this.addPassword !== this.addData.password) {
        callback(new Error('俩次密码不一致'));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (this.addData.phone && !(/^1[3456789]\d{9}$/.test(this.addData.phone))) {
        callback(new Error('手机号码格式错误'));
      } else if (this.editData.phone && !(/^1[3456789]\d{9}$/.test(this.editData.phone))) {
        callback(new Error('手机号码格式错误'));
      } else {
        callback();
      }
    };
    return {
      isInput: false,
      excel: 10,
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
      editPassword: '',
      editModal: false,
      editData: {
        password: ''
      },
      list: [],
      editData: {},
      addPassword: '',
      modal_loading: false,
      addData: {
        status: 1
      },
      userType: [],
      addModal: false,
      statusList: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 2
        }],
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
          title: '账号',
          key: 'username',
          align: 'center',
          minWidth: 130
        },
        {
          title: '用户类别',
          key: 'position_name',
          align: 'center',
          minWidth: 500
        },
        {
          title: '岗位',
          key: 'jobs',
          align: 'center',
          minWidth: 130
        },
        {
          title: '真实姓名',
          key: 'nickname',
          align: 'center',
          minWidth: 130
        },
        {
          title: '电话',
          key: 'phone',
          align: 'center',
          minWidth: 130
        },
        {
          title: '工号',
          key: 'jobnumber',
          align: 'center',
          minWidth: 130
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            return h('span', params.row.status === 1 ? '启用' : '禁用')
          }
        },
        {
          title: '注册时间',
          key: 'add_time',
          align: 'center',
          minWidth: 160
        },
        {
          title: '最后登录时间',
          key: 'lastlogin_time',
          align: 'center',
          minWidth: 160,
          render: function (h, params) {
            return h('div', isLogined(params.row.lastlogin_time))
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 200,
          fixed: 'right',
          render: (h, params) => {
            let edit = h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: !this.$store.state.varMap.userUserEdit
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
                size: 'small',
                type: 'error',
                disabled: !this.$store.state.varMap.userUserDel
              },
              style: {
                // color: '#f60',
                // display: (params.row.id === 1) ? "none" : "inline-block"
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
      total: 0,
      page: 1,
      limit: 10,
      searchkey: {
        start_time: '',
        end_time: '',
        username: '',
        status: '',
        phone: '',
        nickname: '',
        position_id: null
      },
      rules: {
        editPasswordcheck: [{ validator: validatePassCheck, trigger: 'blur' }],
        addPasswordcheck: [{ required: true, validator: validateAddPassCheck, trigger: 'blur' }],
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        group_id: [{ required: true, message: '不能为空' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        jobs: [{ required: true, message: '不能为空', trigger: 'blur' }],
        jobnumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
        position_id: [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }]
      }
    }
  },
  components: { Treeselect, Export },
  created () {
    this.getTableData(this.page)
  },
  computed: {},
  methods: {
    getTableData (page) {
      this.searchkey.status = this.searchkey.status || ''
      this.searchkey.position_id = this.searchkey.position_id || null
      let data = Object.assign({}, { limit: this.limit }, this.searchkey)
      let d = {
        data: data
      }
      this.$store.commit('pageLoading', true)
      serverApi(`/user/index?page=${page}`, d,
        res => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
            let tree = res.data.usertype
            this.getCas(tree)
            this.userType = tree
          } else if (res.url) {
            this.$Message.warning(res.msg);
            this.$router.push({ name: '404' })
          } else {
            this.$Message.warning(res.msg);
          }
          this.$store.commit('pageLoading', false)
        },
        err => {
          console.log(err);
          this.$Message.error('请重置后搜索');
          this.$store.commit('pageLoading', false)
        })
    },
    // 搜索
    onClickSearch () {
      this.getTableData(this.page)
    },
    // 添加
    onClickAdd () {
      this.addModal = true
    },
    exportData () {
      exportExcelData(this.columns, this.tableData, '登录日志')
    },
    onClickEdit (row) {
      this.editModal = true
      this.editData = {
        username: row.username,
        status: row.status,
        position_id: row.position_id,
        id: row.id,
        nickname: row.nickname,
        jobnumber: row.jobnumber,
        jobs: row.jobs,
        phone: row.phone,
        password: ''
      }
    },
    onSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let d = {
            data: this.editData
          }
          serverApi(`/user/edit`, d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.getTableData(this.page)
                this.editModal = false
                this.editData = {
                  username: '',
                  status: '',
                  position_id: '',
                  id: '',
                  nickname: '',
                  jobnumber: '',
                  jobs: '',
                  phone: ''
                }
                this.editPassword = ""
              } else {
                this.$Message.warning(res.msg);
              }
              this.modal_loading = false
              this.editPassword = ""
            },
            err => {
              console.log(err);
              this.editPassword = ""
              this.$Message.warning('修改失败');
              this.modal_loading = false
            })
        }
      })
    },
    // 保存修改
    onSaveAdd () {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          let d = {
            data: this.addData
          }
          this.modal_loading = true
          serverApi('/user/add', d,
            res => {
              if (res.code === 1) {
                this.$Message.success(res.msg);
                this.getTableData(this.page)
                this.addData = {}
                this.addModal = false
              } else {
                this.$Message.warning(res.msg);
              }
              this.modal_loading = false
              this.addPassword = ""
            },
            err => {
              console.log(err);
              this.addPassword = ""
              this.$Message.warning('新增失败!');
              this.modal_loading = false
            })
        }
      })
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除此条角色信息？",
        onOk: () => {
          let d = {
            data: {
              id: row.id
            }
          }
          serverApi(
            "/user/del", d,
            res => {
              if (res.code === 1) {
                this.getTableData(this.page)
                this.$Message.success(res.msg);
              } else {
                this.$Message.warning(res.msg);
              }
            },
            err => {
              this.$Message.error('删除失败');
            }
          );
        }
      });
    },
    onClickReset () {
      this.searchkey = {
        start_time: '',
        end_time: '',
        username: '',
        status: '',
        phone: '',
        nickname: '',
        position_id: null
      }
      this.getTableData(this.page)
    },
    // 导出
    exportData () {
      this.searchkey.status = this.searchkey.status || ''
      this.searchkey.position_id = this.searchkey.position_id || null
      let data = Object.assign({}, { limit: this.$refs.export.excel }, this.searchkey)
      let d = {
        data: data
      }
      let tableData = []
      serverApi(`/user/index?page=1`, d,
        res => {
          if (res.code === 1) {
            this.formateExport(res.data.list)
            tableData = res.data.list
            exportExcelData(this.columns, tableData, '用户管理')
          } else {
            this.$Message.warning('导出失败');
          }
        },
        err => {
          this.$Message.warning('导出错误');
        }
      )
    },
    formateExport (arr) {
      arr.forEach(item => {
        item.lastlogin_time = isLogined(item.lastlogin_time)
        if (item.status === 1) {
          item.status = '成功'
        } else {
          item.status = '失败'
        }
      });
    },
    changePage (e) {
      this.page = e
      this.getTableData(this.page)
    },
    onChangeSize (e) {
      this.limit = e
      this.excel = e
      this.getTableData(this.page)
    },
    getCas (arr) {
      arr.forEach(item => {
        item.label = item.name
        item.isDefaultExpanded = true
        if (item.children && item.children.length > 0) {
          this.getCas(item.children)
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
</style>