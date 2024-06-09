<template>
  <!--  侧边栏-->
  <el-aside direction="vertical">
    <Aside/>
  </el-aside>

  <Main :showRecord="showRecord"/>

  <el-footer>
    <el-button :class="{'footer':true,'sticky':isSticky}" type="primary" link id="jinrishici-sentence">命里有时终须有，命里无时梦里有。
    </el-button>
    <div :class="{'footer':true,'sticky':isSticky}">

      <el-space spacer="|">
        <el-button link tag="a" type="info"
                   @click="copyText('50011502001039','备案号','https://beian.mps.gov.cn/#/query/webSearch?code=50011502001039')">
          <img src="https://beian.mps.gov.cn/favicon.ico" style="width: 20px" alt="图片加载失败">
          &ensp;渝公网安备50011502001039
        </el-button>
        <el-button link tag="a" type="info"
                   @click="copyText('渝ICP备2024030473号','备案号','http://beian.miit.gov.cn/')">
          渝ICP备2024030473号
        </el-button>
      </el-space>

    </div>

  </el-footer>

</template>

<script setup lang="ts">
import Main from "@/components/Main.vue";
import Aside from "@/components/Aside.vue";
import useFunction from "@/hooks/useFunction";
import {ref} from "vue";


const {copyText} = useFunction()
const isSticky = ref(false)

function showRecord(flag: boolean) {
  if (flag) isSticky.value = true
  else setTimeout(() => {
    isSticky.value = false
  }, 200)
}


</script>

<style scoped>

Aside {
  position: absolute;
  bottom: 0;
  top: 50px;
  left: 0;
  width: 8%;
  height: 100%;
  z-index: 100;
}


Main {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.footer {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
}

#jinrishici-sentence {
  font-size: 20px;
  bottom: 20px;
}

.sticky {
  position: sticky;
}

@media (max-width: 980px) {
  .el-footer {

    padding: 0;
  }

  /*
 .footer {

    display: none;
   position: fixed;
   bottom: 30px;

 }
*/
  /*
  #jinrishici-sentence {
    font-size: 10px;
    position: absolute;
    bottom: 0;
  }

  Aside {
    position: fixed;
    top: 0;
    width: 60px;
    height: 10%;
  }
*/
  Aside{
    width: 0;
  }
}

</style>