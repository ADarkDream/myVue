<template>
 <el-row :gutter="24">
                <el-col :span="16">
                  <el-input v-model="newMusic.name" placeholder="输入歌曲名"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="searchMusic" type="success" plain>搜索</el-button>
                </el-col>
              </el-row>
</template>

<script setup lang="ts">

import axios from "axios";
//import {ElMessage} from "element-plus";
const searchMusic = async () => {
  try {
    const result = await axios({
      url: '',
      params: {},
      //method: 'post',
      //data: {}
    })
    console.log(result)
    const {status, msg, data} = result.data

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}
</script>

<style scoped>

</style>
