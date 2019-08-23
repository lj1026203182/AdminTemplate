<!--
 * @Descripttion: wangeditor富文本 this.$refs.editor.setHtml('<p><br></p>')  // 清空富文本内容
 * @version: 
 * @Author: Lj
 * @Date: 2019-08-12 11:07:22
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-23 17:10:36
 -->
<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '../../util/tool'
export default {
  name: 'Editor',
  data() {
    return {
      //我自己的上传地址
      upload: this.$config.baseUrl + '/app/admin/login/upload',
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editorId() {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml(val) {
      this.editor.txt.html(val)
    }
  },
  mounted() {
    let _this = this
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024  //控制图片大小 
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.uploadFileName = 'file'  //上传参数 自定义
    this.editor.customConfig.uploadImgServer = this.upload   //上传图片
    this.editor.customConfig.uploadImgHooks = {  //监听
      before: function (xhr, editor, files) {
        // 图片上传之前触发
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
      },
      fail: function (xhr, editor, result) {
        this.$Message.error('插入图片失败！')
      },
      error: function (xhr, editor) {
        this.$Message.error('插入图片失败！')
      },
      timeout: function (xhr, editor) {
        this.$Message.error('插入图片超时！')
      },
      customInsert(insertImg, result, editor) { // 插入图片,闭包
        let url = _this.$config.baseUrl + result.data
        insertImg(url)
      }
    }
    this.editor.create()
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>