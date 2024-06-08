<template>
  <!--  侧边栏-->
  <el-aside direction="vertical">
    <Aside/>
  </el-aside>

  <Main :showRecord="showRecord"/>

  <el-footer>
    <el-button :class="classList" type="primary" link id="jinrishici-sentence">命里有时终须有，命里无时梦里有。
    </el-button>
    <div :class="classList">


      <!--  <el-card class="footer" shadow="none">-->
      <!--      <el-button link type="success">本网站暂时用作毕业设计</el-button>-->
      <!--    备案信息-->
      <div>
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
      <!--    </el-card>-->
    </div>

  </el-footer>

</template>

<script setup lang="ts">
import Main from "@/components/Main.vue";
import Aside from "@/components/Aside.vue";
import useResponsive from "@/hooks/useResponsive";
import useFunction from "@/hooks/useFunction";
import {ref} from "vue";

const {isPC} = useResponsive()
const {copyText} = useFunction()
const isShow = ref(true)
const classList = ref('footer')

function showRecord(flag: boolean) {
  if (flag) setTimeout(() => {
    classList.value = 'footer'
  }, 200)
  else classList.value = 'footer sticky'
  // isShow.value = flag
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
  z-index: 1000;
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
*/
  Aside {
    /*
    display: none;
    */
    position: fixed;
    top: 0;
    width: 50px;
    height: 10%;
  }

}

</style>