<template>
  <!--  侧边栏-->
  <el-aside direction="vertical">
    <Aside/>
  </el-aside>

  <Main/>

  <el-footer class="footer">
    <el-button type="primary" link id="jinrishici-sentence">命里有时终须有，命里无时梦里有。
    </el-button>
  </el-footer>

</template>

<script setup lang="ts">
import Main from "@/components/Main.vue";
import Aside from "@/components/Aside.vue";





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
  bottom: 5px;
}

#jinrishici-sentence {
  font-size: 20px;
}

@media (max-width: 980px) {
  .footer {
    display: none;
    /*
    position: fixed;
    bottom: 30px;
    */
  }

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
    width: 20%;
    height: 10%;
  }

}

</style>