<template>
  <el-header class="header1">
    文章编辑
  </el-header>
  <el-form :inline="true" class="form" :model="data">
    <el-form-item label="文章标题" required>
      <el-input v-model="data.title" placeholder="填写文章标题" clearable />
    </el-form-item>
    <el-form-item label="发布板块" required >
      <el-select
          v-model="data.area"
          placeholder="选择发布板块"
          clearable
      >
        <el-option label="文章" value="文章"/>
        <el-option label="教程" value="教程"/>
      </el-select>
    </el-form-item>
    <el-form-item label="标签设置" required >
      <el-select
          v-model="data.tags"
          placeholder="选择文章标签"
          clearable
      >
        <el-option label="散文" value="散文"/>
        <el-option label="小说" value="小说"/>
        <el-option label="前端" value="前端"/>
        <el-option label="教程" value="教程"/>
        <el-option label="其他" value="其他"/>
      </el-select>
    </el-form-item>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height:400px; overflow-y: hidden;text-align: initial"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />

    <div style="margin-top: 20px">
      <el-button @click="addDraft">保存为草稿</el-button>
      <el-button @click="submit" type="primary">发布文章</el-button>
    </div>
  </el-form>


</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, reactive, shallowRef} from 'vue'
import {ElMessage,ElLoading} from "element-plus";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import emitter from "@/utils/emitter";


//region 表单
const data = reactive({
  id: '',
  title: '',
  area: '',
  tags: '',
  text: '',
})

function check(val: string) {
  // console.log(typeof val.trim().length)
  if (val===undefined) {
    ElMessage.error('文章标题、发布板块、标签设置不能为空')
    return false
  } else if (val.trim().length < 2 || val.trim().length > 30) {
    ElMessage.error('请输入2-30位字符')
    return false
  } else return true
}


//endregion


//region富文本编辑器

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML,初始文本
// const valueHtml = ref('<p>有bug，刷新时路由没变，标题变了</p>')
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = {placeholder: '请输入要发布的内容...'}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

//endregion上面是模板
let mode = ref('')


//编辑器中的文本
let text = ref()
//获取文本内容
const insertText = () => {
  const editor = editorRef.value // 获取 editor ，必须等待它渲染完之后
  if (editor == null) return false  //下面 执行 editor API
  // text.value = editor.getText()
  text.value = editor.getHtml()
  if (editor.isEmpty() || text.value.trim() === '') {
    ElMessage.error('文章内容不能为空！')
    return false
  }
  return true
  // console.log(text.value)//文本内容
}

//需要去除的菜单
toolbarConfig.excludeKeys = ['todo',
  'uploadImage',
  'group-video',
  'fullScreen',
  'headerSelect',
  'italic',
  'group-more-style' // 排除菜单组，F12检查元素，写菜单组 key 的值即可
]


//文章传参类型声明
interface Article {
  id: number,
  title: string,
  text: string,
  html: string,
  area: string,
  tags: string,
  isDraft: string,
}


//编辑文章或草稿
const route = useRoute()
const router = useRouter()
// console.log(route.params.id)
const {id, title, area, tags, html, isDraft} = route.query as unknown as Article
if (isDraft !== null) {
  data.title = title
  data.area = area
  data.tags = tags
  valueHtml.value = html
}


//发布文章
function submit() {
  if (insertText() && check(data.title) && check(data.area) && check(data.tags)) {
    // console.log(text.value)
    if (id !== null && isDraft === '0') data.id = id.toString()
    data.text = text.value
    console.log(data)
//控制全屏加载动画的显示
    const loading = ElLoading.service({
      lock: true,
      text: '正在审核中，请稍后...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    axios({
      url: '/submitArticle',
      method: 'post',
      data
    }).then(result => {
      const {status, msg} = result.data
      loading.close()
      if (status === 200) {
        ElMessage.success(msg)
        setTimeout(() => {
          emitter.emit('pageRender', 2)
          router.push({name: 'userManagement'})
        }, 1500)
      }
    }).catch(error => {
      loading.close()
      console.log('发生错误：')
      console.log(error)
      ElMessage.error('发生错误：' + error.message)

    })
  }

}

//保存到草稿
function addDraft() {
  if (!insertText()) {
    ElMessage.error('文章不能为空')
  } else {
    if (id !== null && isDraft === '1') data.id = id.toString()
    data.text = text.value
    console.log(data)
    axios({
      url: '/addDraft',
      method: 'post',
      data
    }).then(result => {
      const {status, msg} = result.data
      if (status === 200) {
        ElMessage.success(msg)
        setTimeout(() => {
          sessionStorage.setItem('activeNumber', '2')
          location.href = '#/userCenter/userManagement'
        }, 1500)
      }
      console.log(result)
    }).catch(error => {
      ElMessage.error('发生错误：' + error.message)
      console.dir('发生错误：' + error)
    })
  }
}
</script>

<style scoped>
.form {
  margin-top: 20px;
}

.form .el-input {
  --el-input-width: 220px;
}

.form .el-select {
  --el-select-width: 220px;
}
</style>