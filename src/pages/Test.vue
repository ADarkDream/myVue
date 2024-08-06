<template>
  <el-container>
    <!--  <el-form ref="formRef" style="max-width: 600px;background-color: white" :model="form" label-width="auto" class="demo-dynamic">-->
    <!--    <el-form-item prop="email" label="Email" :rules="[-->
    <!--        {-->
    <!--          required: true,-->
    <!--          message: 'Please input email address',-->
    <!--          trigger: 'blur',-->
    <!--        },-->
    <!--        {-->
    <!--          type: 'email',-->
    <!--          message: 'Please input correct email address',-->
    <!--          trigger: ['blur', 'change'],-->
    <!--        }, ]">-->
    <!--      <el-input v-model="form.email" />-->
    <!--    </el-form-item>-->
    <!--    <el-form-item-->
    <!--      v-for="(domain, index) in form.domains"-->
    <!--      :key="domain.key"-->
    <!--      :label="'Domain' + index"-->
    <!--      :prop="'domains.' + index + '.value'"-->
    <!--      :rules="{-->
    <!--        required: true,-->
    <!--        message: 'domain can not be null',-->
    <!--        trigger: 'blur',-->
    <!--      }"-->
    <!--    >-->
    <!--      <el-input v-model="domain.value" />-->
    <!--      <el-button class="mt-2" @click.prevent="removeDomain(domain)">-->
    <!--        Delete-->
    <!--      </el-button>-->
    <!--    </el-form-item>-->

    <!--    <el-form-item>-->
    <!--      <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>-->
    <!--      <el-button @click="addDomain">New domain</el-button>-->
    <!--      <el-button @click="resetForm(formRef)">Reset</el-button>-->
    <!--    </el-form-item>-->
    <!--  </el-form>-->
    <el-header >
      多选树状测试
      <el-tree-select
          v-model="value"
          :data="data"
          multiple
          :render-after-expand="false"
          :filter-node-method="filterNodeMethod"
          filterable
          show-checkbox
          style="width: 240px"
      />
      <el-button @click="getList">打印</el-button>
      <br>
      <el-input placeholder="请输入房间号" v-model.trim="roomNum"/>
      <el-input placeholder="请输入昵称" v-model.trim="playerName"/>
    </el-header>
    <el-main v-if="false" style="padding-top: 50px">
      <div v-if="false">
        <h2>websocket测试</h2>
        <div style="display: flex;justify-content:space-between;width: 95%;min-height: 300px; ">
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">发送的信息</el-text>
            </template>
            <el-input placeholder="输入要发送的信息" v-model="msg" type="textarea"></el-input>
            <br>
            <template #footer>
              <el-button-group>
                <el-button type="success" @click="openConnection()">开启链接</el-button>
                <el-button type="primary" @click="sendMsg()">发送</el-button>
                <el-button type="danger" @click="closeConnection()">关闭连接</el-button>
              </el-button-group>
            </template>
          </el-card>
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">ws 收到的信息</el-text>
            </template>
            <el-text type="warning" v-if="list.length===0">暂无返回的消息</el-text>
            <div v-else v-for="(item,index) in list" :key="index">
              <el-text type="success">第{{ index }}条</el-text>
              ：{{ item }}
            </div>
          </el-card>
        </div>
      </div>
      <div >
        <h2>socket.io测试</h2>
        <div style="display: flex;justify-content:space-between;width: 95%;min-height: 300px; ">
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">发送的信息</el-text>
            </template>
            <el-input placeholder="输入要发送的信息" v-model="msg2" type="textarea"></el-input>
            <br>
            <template #footer>
              <el-button-group>
                <el-button type="success" @click="enterTheRoom()">加入房间</el-button>
                <el-button type="primary" @click="sendMsg2()">发送</el-button>
                <el-button type="danger" @click="closeConnection2()">关闭连接</el-button>
                <el-button type="danger" @click="">断开连接</el-button>
              </el-button-group>
            </template>
          </el-card>
          <el-card style="width: 50%">
            <template #header>
              <el-text type="primary">socket.io 收到的信息</el-text>
            </template>
            <el-text type="warning" v-if="list2.length===0">暂无返回的消息</el-text>
            <div v-else v-for="(item,index) in list2" :key="index">
              <el-text type="success">第{{ index }}条</el-text>
              ：{{ item }}
            </div>
          </el-card>
        </div>
      </div>
    </el-main>
    <el-footer style="margin-top: 300px">
      {{testArr1}}<br>{{testArr2}}<br>{{testArr3}}<br>

      <el-button @click="add1">添加1</el-button>
      <el-button @click="add2">添加2</el-button>
      <el-button @click="add3">添加3</el-button>
    </el-footer>

  </el-container>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter,useRoute} from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";
import {io} from "socket.io-client";


import {useTestStore} from "@/store/useTestStore";
const {testArr1,testArr2,testArr3,playerInfo} =useTestStore()
console.log(testArr1)
const add1=()=>{
  testArr1.push({key:123,value:123})
}

const add2=()=>{
  testArr2.push({key:123,value:123})
}
const add3=()=>{
  testArr3.push({key:123,value:123})
}


const router = useRouter();
const route=useRoute()
const {isAdmin} = useUserInfo()

onMounted(() => {
  //管理员登录判断
  // if (!isAdmin.value) {
  //   if (document.referrer.includes('muxidream')) return router.back()
  //   return router.push({name: 'home'})
  // }
})


let token = sessionStorage.getItem('token') || localStorage.getItem('token')
const baseUrl = 'ws://localhost:9999'
const roomNum = ref<string>('')//房间号
const playerName = ref<string>('')//玩家昵称

//region wss  websocket

let ws
//信息内部全部可改
const msg = ref<string>('')
//收到的信息
const list = reactive<string[]>([])

//开启链接，首次发送信息
const openConnection = () => {
  ws = new WebSocket(baseUrl, token)
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message) list.push(message)
    console.log('得到的数据', message)
  }
}


//发送信息
const sendMsg = () => {
  ws.send(JSON.stringify(msg.value))//有格式要求
}


//关闭连接
/*
1000:正常关闭;
1001:客户端离开;
1006:连接关闭异常;
1002:协议错误;
1003:数据类型错误;
1007:数据错误;
1008:消息过大;
1009:消息过长;
1011:服务器内部错误*/
const closeConnection = () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close(1000, '关掉了')
  }
}


//endregion


//region Socket.io
// const socket = io('http://192.168.1.194:9999')
//信息内部全部可改
const msg2 = ref<string>('')
//收到的信息
const list2 = reactive<string[]>([])

//开启链接，首次发送信息
const enterTheRoom = () => {
  if (roomNum.value && playerName.value) {
    // socket.emit('room-join', {roomNum: roomNum.value, playerName: playerName.value})
    // playerName.value = ''
    // roomNum.value = ''
  }


}


//发送信息
const sendMsg2 = () => {
  if (msg2.value) {
    // socket.emit('room-message', msg2.value)
    msg2.value = ''
  }
}


// socket.on('room-message', msg => {
//   console.log('socket.io收到消息：', msg)
//   list2.push(msg)
// })

// //监听加入房间的信息
// socket.on('room-join', res => {
//   console.log('room-join收到消息：', res)
//   const {status, msg,data} = res
//   ElMessage.info(msg)
//   list2.push(msg)
//   history.pushState(null,'房间',route.path+'/room='+data.roomNum)//要保留的当前页面的参数,标题栏名,新的网址
//   console.log('route.path',route.path)
// })
//
//
// //监听离开房间的信息
// socket.on('room-leave', msg => {
//   console.log('socket.io收到消息：', msg)
//   list2.push(msg)
// })
//

//关闭连接
const closeConnection2 = () => {
  // if (server.readyState === WebSocket.OPEN) {
  //   server.close(1000, '关掉了')
  // }
}

//退出,删除全部监听
onUnmounted(() => {
  // socket.removeAllListeners()
})


//endregion
const formRef = ref<FormInstance>()
const form = reactive<{
  domains: DomainItem[]
  email: string
}>({
  domains: [
    {
      key: 1,
      value: '',
    },
  ],
  email: '',
})


interface DomainItem {
  key: number
  value: string
}

const removeDomain = (item: DomainItem) => {
  const index = form.domains.indexOf(item)
  if (index !== -1) {
    form.domains.splice(index, 1)
  }
}

const addDomain = () => {
  form.domains.push({
    key: Date.now(),
    value: '',
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


//region  树状选择框


const value = ref()


const sourceData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          }, {
            value: '1-1-2',
            label: 'Level three 1-1-2',
          }, {

            value: '1-1-3',
            label: 'Level three 1-1-3',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
const data = ref(sourceData)

const filterMethod = (value) => {
  data.value = [...sourceData].filter((item) => item.label.includes(value))
}

const filterNodeMethod = (value, data) => data.label.includes(value)

const getList = () => {
  console.log(value.value instanceof Array)
  console.log(Object.values(value.value))
}
//endregion
</script>
<style scoped>
.el-container {
  background-color: var(--el-bg-color)
}
</style>
