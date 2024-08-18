<template>
  <el-container>
    <el-main>
      <template v-for="item in totalList" :key="item.id">
        <el-card v-if="item.id===thisId || showAll">
          <img :style="isPC? 'width: 405px;height:500px':'width: 202px;height:250px' " :src="item.src" :alt="item.name">
          <template #footer>
            <el-text type="warning" v-if="!showAll">共{{ totalList.length }}题，还剩{{ testList.length }}题<br></el-text>

              <el-text>姓名：
                <el-text type="primary">{{ isChecked || allChecked ? item.name : '?' }}</el-text>
              </el-text><br>
              <!--              <el-text>派系：-->
              <!--                <el-text v-if="!isChecked && !allChecked">?</el-text>-->
              <!--                <el-text v-else-if="item.group===0">习派</el-text>-->
              <!--                <el-text v-else-if="item.group===1">江派</el-text>-->
              <!--                <el-text v-else-if="item.group===2">团派</el-text>-->
              <!--                 <el-text v-else>{{item.group}}</el-text>-->
              <!--              </el-text>-->
              <el-text>担任第
                <el-text type="primary">{{ isChecked || allChecked ? item.year : '?' }}</el-text>
                届中央政治局常委
              </el-text>
          </template>
        </el-card>
      </template>
    </el-main>
    <el-footer>
      <el-button-group type="primary" v-if="!showAll">
        <el-button type="warning" plain @click="allChecked=!allChecked">{{
            (!allChecked ? '' : '取消')+'默认显示答案'
          }}
        </el-button>
        <el-button @click="isChecked=true" v-if="!allChecked" :disabled="isChecked">查看答案</el-button>
        <el-button @click="selectImg" :disabled="!isChecked && !allChecked">下一个</el-button>
      </el-button-group>
      <el-button v-else @click="reload" type="success">重新开始</el-button>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import useResponsive from "@/hooks/useResponsive";
import hjt from '@/assets/workTest/胡锦涛.png'
import wbg from '@/assets/workTest/吴邦国.png'
import jql from '@/assets/workTest/贾庆林.png'
import wjb from '@/assets/workTest/温家宝.png'
import lcc from '@/assets/workTest/李长春.png'
import xjp from '@/assets/workTest/习近平.png'
import lkq from '@/assets/workTest/李克强.png'
import hgq from '@/assets/workTest/贺国强.png'
import zyk from '@/assets/workTest/周永康.png'
import zdj from '@/assets/workTest/张德江.png'
import yzs from '@/assets/workTest/俞正声.png'
import lys from '@/assets/workTest/刘云山.png'
import wqs from '@/assets/workTest/王岐山.png'
import zgl from '@/assets/workTest/张高丽.png'
import lzs from '@/assets/workTest/栗战书.png'
import wy from '@/assets/workTest/汪洋.png'
import whn from '@/assets/workTest/王沪宁.png'
import zlj from '@/assets/workTest/赵乐际.png'
import hz from '@/assets/workTest/韩正.png'
import lq from '@/assets/workTest/李强.png'
import cq from '@/assets/workTest/蔡奇.png'
import dxx from '@/assets/workTest/丁薛祥.png'
import lx from '@/assets/workTest/李希.png'
const {isPC} = useResponsive()

//答案合集
const totalList = reactive([
  {
    id: 0,
    name: '胡锦涛',
    group: 2,
    year: [17,],
    src: hjt
  },
  {
    id: 1,
    name: '吴邦国',
    group: '',
    year: [17,],
    src: wbg
  }, {
    id: 2,
    name: '温家宝',
    group: 2,
    year: [17,],
    src: wjb
  }, {
    id: 3,
    name: '贾庆林',
    group: 1,
    year: [17,],
    src: jql
  }, {
    id: 4,
    name: '李长春',
    group: '',
    year: [17,],
    src: lcc
  }, {
    id: 5,
    name: '习近平',
    group: 0,
    year: [17, 18, 19, 20],
    src: xjp
  }, {
    id: 6,
    name: '李克强',
    group: 2,
    year: [17, 18, 19],
    src: lkq
  }, {
    id: 7,
    name: '贺国强',
    group: '',
    year: [17,],
    src: hgq
  }, {
    id: 8,
    name: '周永康',
    group: 1,
    year: [17,],
    src: zyk
  }, {
    id: 9,
    name: '张德江',
    group: 1,
    year: [18,],
    src: zdj
  }, {
    id: 10,
    name: '俞正声',
    group: '',
    year: [18,],
    src: yzs
  }, {
    id: 11,
    name: '刘云山',
    group: 1,
    year: [18],
    src: lys
  }, {
    id: 12,
    name: '王岐山',
    group: '太子党',
    year: [18,],
    src: wqs
  }, {
    id: 13,
    name: '张高丽',
    group: '',
    year: [18,],
    src: zgl
  }, {
    id: 14,
    name: '栗战书',
    group: 0,
    year: [18,],
    src: lzs
  }, {
    id: 15,
    name: '汪洋',
    group: 0,
    year: [18,],
    src: wy
  }, {
    id: 16,
    name: '王沪宁',
    group: '',
    year: [18, 20],
    src: whn
  }, {
    id: 17,
    name: '赵乐际',
    group: '',
    year: [18, 20],
    src: zlj
  }, {
    id: 18,
    name: '韩正',
    group: '',
    year: [19,],
    src: hz
  }, {
    id: 19,
    name: '李强',
    group: 0,
    year: [20],
    src: lq
  }, {
    id: 20,
    name: '蔡奇',
    group: 0,
    year: [20],
    src: cq
  }, {
    id: 21,
    name: '丁薛祥',
    group: 0,
    year: [20],
    src: dxx
  }, {
    id: 22,
    name: '李希',
    group: 0,
    year: [20],
    src: lx
  }
])

//显示当前答案
const isChecked = ref(false)
//显示全部答案
const allChecked = ref(false)
//显示全部题目
const showAll = ref(false)
//剩余题目
let testList = totalList
//当前题目的ID
const thisId = ref<number>(Math.floor(Math.random() * testList.length))


//下一题
const selectImg = () => {
  isChecked.value = false
  thisId.value = Math.floor(Math.random() * testList.length)
  testList = testList.filter((item, index) => index !== thisId.value)
  console.log(`删除第${thisId.value}个，剩余数量：`, testList.length)
  console.log('剩余的人：', testList)
  if (testList.length === 0) {
    ElMessage.success('题目已完成')
    showAll.value = true
  }
}

const reload = () => location.reload()

</script>

<style scoped>
.el-card {
  padding: 0;
}

.el-card__body {
  padding: 0;
}
</style>
