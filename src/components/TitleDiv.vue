<template>
  <!--PC端标题-->
  <el-row class="title show">
    <!--左上角-->
    <el-col :lg="5" :md="6" :sm="8" class="title-left ">
      <!--更换背景-->
      <el-button class="bgBtn" @click="changeBG(0)">更换背景</el-button>
      <!--下载背景-->
      <el-button class="bgBtn">
        <el-link :href="bgUrl" target="_blank" :underline="false">下载背景</el-link>
      </el-button>
      <!--日夜切换-->
      <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日" class="isDark">
        <template #active-action>
          <el-icon>
            <Moon/>
          </el-icon>
        </template>
        <template #inactive-action>
          <el-icon>
            <Sunny/>
          </el-icon>
        </template>
      </el-switch>
    </el-col>
    <!--中间导航-->
    <el-col :lg="14" :md="12" :sm="8" class="bar">
      <el-space spacer="">
        <!--        首页-->
        <router-link :to="{name:'home'}" replace>
          <el-button plain :icon="HomeFilled">
            首页
          </el-button>
        </router-link>
        <!--        论坛-->
        <router-link :to="{name:'center'}" replace>
          <el-button plain :icon="Comment">
            论坛
          </el-button>
        </router-link>
      </el-space>
    </el-col>
    <!--右上角登录窗口-->
    <el-col :lg="5" :md="6" :sm="8" class="title-right">
      <el-space>
        <el-button class="username " type="primary" v-if="isLogin" @click="goCenter">{{ username }}
          <el-image class="headIcon" :src="headImgUrl" alt="" :onerror="errorImage"/>
        </el-button>
        <!--登录按钮-->
        <el-button @click="drawer = true" v-if="!isLogin">登录
          <svg type="primary" style="margin-left: 16px" class="headIcon" viewBox="0 0 1024 1024">
            <path
                d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
                fill=""></path>
            <path
                d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
                fill=""></path>
          </svg>
        </el-button>
        <!--选项菜单-->
        <el-dropdown>
          <el-button class="option" :icon="Operation">
            选项
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!--管理中心-->
              <el-dropdown-item v-if="isAdmin" :icon="Avatar" @click="goCenter">
                管理中心
              </el-dropdown-item>
              <!--用户中心-->
              <el-dropdown-item v-else-if="isLogin" :icon="UserFilled" @click="goCenter">
                用户中心
              </el-dropdown-item>
              <!--退出登录-->
              <el-dropdown-item v-if="isLogin" @click="exit" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
              <!--公告-->
              <el-dropdown-item :icon="Comment" @click="showNotice=!showNotice">
                公告
              </el-dropdown-item>
              <!--设置-->
              <el-dropdown-item @click="showSetting=!showSetting" :icon="Tools">
                设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </el-col>
  </el-row>

  <!--  移动端标题-->
  <div class="title hide">
    <!--手机的选项下拉菜单-->
    <div class="title-left">
      <el-dropdown class="option">
        <el-button :icon="Switch">
          目录
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item index="0" active-class="active"
                              @click="emitter.emit('getListNum',0);emitter.emit('showContent')">
              <svg t="1712740370355" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                   p-id="5814">
                <path
                    d="M387.264 479.68l-192 0c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l192 0c52.928 0 96 43.072 96 96l0 192C483.264 436.64 440.192 479.68 387.264 479.68zM195.264 159.68c-17.632 0-32 14.368-32 32l0 192c0 17.632 14.368 32 32 32l192 0c17.632 0 32-14.368 32-32l0-192c0-17.632-14.368-32-32-32L195.264 159.68z"
                    fill="#FFF" p-id="5815"></path>
                <path
                    d="M387.264 927.68l-192 0c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l192 0c52.928 0 96 43.072 96 96l0 192C483.264 884.64 440.192 927.68 387.264 927.68zM195.264 607.68c-17.632 0-32 14.336-32 32l0 192c0 17.664 14.368 32 32 32l192 0c17.632 0 32-14.336 32-32l0-192c0-17.664-14.368-32-32-32L195.264 607.68z"
                    fill="#FFF" p-id="5816"></path>
                <path
                    d="M832.128 479.68l-192 0c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l192 0c52.928 0 96 43.072 96 96l0 192C928.128 436.64 885.056 479.68 832.128 479.68zM640.128 159.68c-17.664 0-32 14.368-32 32l0 192c0 17.632 14.336 32 32 32l192 0c17.664 0 32-14.368 32-32l0-192c0-17.632-14.336-32-32-32L640.128 159.68z"
                    fill="#FFF" p-id="5817"></path>
                <path
                    d="M832.128 927.68l-192 0c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l192 0c52.928 0 96 43.072 96 96l0 192C928.128 884.64 885.056 927.68 832.128 927.68zM640.128 607.68c-17.664 0-32 14.336-32 32l0 192c0 17.664 14.336 32 32 32l192 0c17.664 0 32-14.336 32-32l0-192c0-17.664-14.336-32-32-32L640.128 607.68z"
                    fill="#FFF" p-id="5818"></path>
              </svg>
              软件下载
            </el-dropdown-item>
            <el-dropdown-item index="1" active-class="active"
                              @click="emitter.emit('getListNum',1);emitter.emit('showContent')">
              <svg t="1712740609200" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                   p-id="10503">
                <path
                    d="M10.24 1018.88l107.52-327.68 163.84-163.84h-5.12C153.6 527.36 40.96 414.72 35.84 291.84c0-20.48 10.24-30.72 30.72-51.2l35.84-40.96 40.96 30.72 25.6 25.6c10.24 10.24 20.48 20.48 30.72 25.6h20.48c10.24-5.12 46.08-35.84 46.08-51.2v-10.24-10.24c-10.24 5.12-20.48-5.12-35.84-20.48L168.96 133.12l40.96-40.96c15.36-15.36 25.6-25.6 46.08-25.6 122.88 0 235.52 112.64 240.64 235.52L773.12 15.36l235.52 235.52-286.72 281.6c122.88-5.12 240.64 112.64 240.64 235.52v10.24c-5.12 15.36-5.12 15.36-30.72 40.96l-35.84 35.84-61.44-61.44c-10.24-10.24-20.48-25.6-30.72-25.6h-20.48c-10.24 5.12-46.08 35.84-46.08 51.2v20.48l30.72 30.72 61.44 61.44-35.84 35.84c-20.48 20.48-30.72 30.72-51.2 30.72-128 0-240.64-112.64-240.64-240.64v-5.12l-148.48 148.48-5.12 10.24-337.92 107.52zM204.8 742.4l-35.84 117.76 112.64-40.96 168.96-163.84-81.92-81.92L204.8 742.4z m394.24-87.04l30.72 30.72-15.36 35.84c-10.24 15.36-10.24 25.6-10.24 30.72 0 30.72 10.24 56.32 30.72 81.92v-25.6c0-66.56 81.92-148.48 148.48-148.48h20.48c-25.6-20.48-51.2-30.72-81.92-30.72-10.24 0-20.48 5.12-30.72 10.24l-30.72 15.36-291.84-286.72 15.36-30.72c10.24-20.48 10.24-30.72 10.24-35.84 0-30.72-10.24-56.32-30.72-81.92v25.6c0 66.56-81.92 148.48-148.48 148.48h-20.48c25.6 20.48 51.2 30.72 81.92 30.72 10.24 0 20.48-5.12 30.72-10.24l30.72-15.36 261.12 256z m-56.32-261.12l81.92 81.92 235.52-235.52L773.12 153.6l-230.4 240.64z"
                    fill="#FFF" p-id="10504"></path>
              </svg>
              在线工具
            </el-dropdown-item>
            <el-dropdown-item index="2" active-class="active"
                              @click="emitter.emit('getListNum',2);emitter.emit('showContent')">
              <svg t="1712740316505" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                   p-id="4699">
                <path
                    d="M853.333333 640v85.333333H170.666667v-85.333333H85.333333v-213.333333h85.333334V341.333333h682.666666v85.333334h85.333334v213.333333h-85.333334z m-85.333333 0v-213.333333H256v213.333333h512zM554.666667 213.333333v85.333334h-85.333334V213.333333h85.333334z m-149.333334 384c-34.133333 0-64-29.866667-64-64S371.2 469.333333 405.333333 469.333333s64 29.866667 64 64-29.866667 64-64 64z m213.333334 0c-34.133333 0-64-29.866667-64-64s29.866667-64 64-64 64 29.866667 64 64-29.866667 64-64 64z"
                    fill="#FFF" p-id="4700"></path>
              </svg>
              机器人
            </el-dropdown-item>
            <el-dropdown-item index="3" active-class="active"
                              @click="emitter.emit('getListNum',3);emitter.emit('showContent')">
              <svg t="1712740428321" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                   p-id="6913">
                <path
                    d="M145 96l66 746.6L511.8 928l299.6-85.4L878.7 96H145z m610.9 700.6l-244.1 69.6-245.2-69.6-56.7-641.2h603.8l-57.8 641.2z"
                    p-id="6914"></path>
                <path
                    d="M281 249l1.7 24.3 22.7 253.5h206.5v-0.1h112.9l-11.4 118.5L511 672.9v0.2h-0.8l-102.4-27.7-6.5-73.2h-91l11.3 144.7 188.6 52h1.7v-0.4l187.7-51.7 1.7-16.3 21.2-242.2 3.2-24.3H511v0.2H389.9l-8.2-94.2h352.1l1.7-19.5 4.8-47.2L742 249H511z"
                    p-id="6915" data-spm-anchor-id="a313x.search_index.0.i16.2ca13a81IftKnS"
                    class="selected"></path>
              </svg>
              HTML
            </el-dropdown-item>
            <el-dropdown-item index="4" active-class="active"
                              @click="emitter.emit('getListNum',4);emitter.emit('showContent')">
              <svg t="1716391588246" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg"
                   p-id="1655" width="200" height="200">
                <path
                    d="M488 208c-57.6 0-104 46.4-104 104s46.4 104 104 104 104-46.4 104-104-46.4-104-104-104z m0 144c-22.4 0-40-17.6-40-40s17.6-40 40-40 40 17.6 40 40-17.6 40-40 40zM311.9 432.1c-57.6 0-104 46.4-104 104s46.4 104 104 104 104-46.4 104-104c0.1-57.6-46.3-104-104-104z m0 144c-22.4 0-40-17.6-40-40s17.6-40 40-40 40 17.6 40 40-17.6 40-40 40zM536 608.1c-57.6 0-104 46.4-104 104s46.4 104 104 104 104-46.4 104-104-46.4-104-104-104z m0 144.1c-22.4 0-40-17.6-40-40s17.6-40 40-40 40 17.6 40 40-17.6 40-40 40zM712.1 384c-57.6 0-104 46.4-104 104s46.4 104 104 104 104-46.4 104-104c0-57.5-46.4-104-104-104z m0 144.1c-22.4 0-40-17.6-40-40s17.6-40 40-40 40 17.6 40 40-17.6 40-40 40z"
                    p-id="1656" fill="#FFF"></path>
                <path
                    d="M928.1 960.2H512c-246.5 0-448.1-201.7-448.1-448.1C63.9 265.6 265.5 63.9 512 63.9c246.5 0 448.1 201.7 448.1 448.1 0 121.6-48 235.3-134.4 320.1-12.8 12.8-33.6 12.8-44.8 0-12.8-12.8-12.8-33.6 0-44.8 73.6-73.6 115.2-171.2 115.2-275.3 0-211.2-172.8-384-384.1-384S127.9 300.9 127.9 512.1c0 211.3 172.9 384.1 384.1 384.1h416.1c17.6 0 32 14.4 32 32s-14.4 32-32 32z"
                    p-id="1657" fill="#FFF"></path>
              </svg>
              <template #title>&ensp;观影</template>
            </el-dropdown-item>
            <el-dropdown-item index="5" active-class="active"
                              @click="emitter.emit('getListNum',5);emitter.emit('showContent')">
              <svg t="1716391718743" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg"
                   p-id="2741" width="200" height="200">
                <path
                    d="M511.8 886.8c-24-9-48.7-16.8-73.6-23.4-79.9-21.4-172.9-33.5-276.5-36.2l-23.2-0.4V140.9c100.1 1.2 190.7 11.1 269.6 29.6V241c-58.4-14.8-123.9-24.4-195.4-28.7l-8.8-0.5v548.4l7.8 0.4c89.1 4.9 170.7 17.1 242.6 36.3 18.6 4.9 37 10.5 54.7 16.5l2.7 0.9 2.7-0.9c16.9-5.8 34.8-11.2 54.7-16.5 72.2-19.2 153.8-31.4 242.6-36.3l7.8-0.4V211.6l-36.9 2.6c-64.4 5.3-123.9 15.1-177.1 29.3-15.3 4.1-30.3 8.6-44.4 13.4l-5.6 1.9V534H490V212.8c83.1-43.2 205.5-64.5 394.9-68.8v682.8l-23.1 0.4c-103.6 2.7-196.7 14.8-276.6 36.2-25.7 6.8-50.4 14.7-73.4 23.4z"
                    fill="#FFF" p-id="2742"></path>
              </svg>
              <template #title>&ensp;电子书</template>
            </el-dropdown-item>
            <el-dropdown-item index="6" active-class="active"
                              @click="emitter.emit('getListNum',6);emitter.emit('showContent')">
              <svg t="1712740489529" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                   p-id="8315">
                <path
                    d="M853.333333 106.666667c11.776 0 21.333333 9.088 21.333334 20.266666v770.133334a20.821333 20.821333 0 0 1-21.333334 20.266666H170.666667a20.821333 20.821333 0 0 1-21.333334-20.266666V126.933333c0-11.178667 9.557333-20.266667 21.333334-20.266666h682.666666z m-64 85.333333h-554.666666v640h554.666666v-640z"
                    fill="#FFF" p-id="8316"></path>
                <path
                    d="M723.712 106.666667v378.282666l-142.250667-49.664-142.208 49.664V106.666667h284.458667z m-85.376 85.333333h-113.749333v172.714667l56.874666-19.797334 56.874667 19.797334V192z"
                    fill="#FFF" p-id="8317"></path>
              </svg>
              教程
            </el-dropdown-item>
            <el-dropdown-item index="7" active-class="active"
                              @click="emitter.emit('getListNum',7);emitter.emit('showContent')">
              <svg t="1716392093657" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="6684" width="200" height="200">
                <path
                    d="M923.562667 0H71.936A71.936 71.936 0 0 0 0 72.021333v879.957334c0 39.850667 32.170667 72.021333 72.021333 72.021333h851.541334a71.936 71.936 0 0 0 72.021333-72.021333V72.021333A71.936 71.936 0 0 0 923.562667 0z m0 698.965333v244.053334H71.936V698.88c0 0.512 0.426667 1.024 1.024 1.024h849.578667a1.024 1.024 0 0 0 1.024-1.024zM341.333333 785.066667H193.450667c-22.016 0-39.850667 16.213333-39.850667 36.352 0 20.053333 17.834667 36.266667 39.850667 36.266666H341.333333c22.016 0 39.850667-16.213333 39.850667-36.266666S363.264 785.066667 341.333333 785.066667z m582.229334-156.074667a1.024 1.024 0 0 0-1.024-1.024H72.96a1.024 1.024 0 0 0-0.938667 1.024v-244.053333c0 0.597333 0.341333 1.024 0.938667 1.024h849.578667a1.024 1.024 0 0 0 1.024-0.938667v244.053333zM341.333333 472.149333c22.016 0 39.850667 16.213333 39.850667 36.352 0 20.053333-17.92 36.266667-39.850667 36.266667H193.450667c-22.016 0-39.850667-16.213333-39.850667-36.266667s17.834667-36.352 39.850667-36.352H341.333333z m582.229334-400.213333v243.029333a1.024 1.024 0 0 0-1.024-0.938666H72.96a1.024 1.024 0 0 0-0.938667 0.938666V72.021333h851.541334zM341.333333 153.6H193.450667c-22.016 0-39.850667 16.213333-39.850667 36.352 0 20.053333 17.834667 36.266667 39.850667 36.266667H341.333333c22.016 0 39.850667-16.213333 39.850667-36.266667S363.264 153.6 341.333333 153.6z"
                    fill="#ffffff" p-id="6685"></path>
              </svg>
              虚拟机
            </el-dropdown-item>
            <el-dropdown-item index="8" active-class="active"
                              @click="emitter.emit('getListNum',8);emitter.emit('showContent')">
              <svg t="1716392175783" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="10535" width="200" height="200">
                <path
                    d="M85.333333 213.333333a85.333333 85.333333 0 0 1 85.333334-85.333333h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v85.333334c0 31.872-17.493333 59.669333-43.370667 74.325333 0.469333 3.605333 0.704 7.274667 0.704 11.008v426.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V384c0-3.733333 0.234667-7.402667 0.704-11.008A85.312 85.312 0 0 1 85.333333 298.666667v-85.333334z m768 85.333334v-85.333334H170.666667v85.333334h682.666666z m-640 85.333333v426.666667h597.333334V384H213.333333z m128 128a42.666667 42.666667 0 0 1 42.666667-42.666667h256a42.666667 42.666667 0 1 1 0 85.333334H384a42.666667 42.666667 0 0 1-42.666667-42.666667z"
                    fill="#ffffff" p-id="10536"></path>
              </svg>
              杂项
            </el-dropdown-item>
            <el-dropdown-item index="9" active-class="active"
                              @click="emitter.emit('getListNum',9);emitter.emit('showContent')">
              <svg t="1716391950190" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg"
                   p-id="5595" width="200" height="200">
                <path
                    d="M762.453333 162.005333H261.546667a166.229333 166.229333 0 0 0-165.845334 158.250667l-18.858666 380.586667a153.258667 153.258667 0 0 0 135.082666 159.957333 170.154667 170.154667 0 0 0 117.461334-29.269333l8.234666-6.016c29.44-22.997333 52.010667-55.466667 65.706667-94.378667l3.072-9.386667h216.448l1.237333 4.309334c13.653333 45.141333 40.106667 87.509333 72.533334 108.202666a176.213333 176.213333 0 0 0 115.456 26.538667 153.258667 153.258667 0 0 0 135.082666-159.914667l-18.816-380.672a166.229333 166.229333 0 0 0-165.888-158.208zM261.546667 221.994667h500.906666a106.24 106.24 0 0 1 105.941334 101.205333l18.816 380.629333a93.269333 93.269333 0 0 1-82.133334 97.365334 116.224 116.224 0 0 1-76.16-17.493334c-23.125333-14.762667-45.781333-56.96-52.650666-96.981333a29.994667 29.994667 0 0 0-29.568-24.917333H383.189333a29.994667 29.994667 0 0 0-29.354666 23.893333c-8.96 43.093333-29.909333 76.672-58.581334 96.554667a110.165333 110.165333 0 0 1-76.373333 18.944 93.269333 93.269333 0 0 1-82.133333-97.365334l18.858666-380.629333A106.24 106.24 0 0 1 261.546667 221.994667z"
                    fill="#ffffff" p-id="5596"></path>
                <path d="M667.434667 393.130667m-45.696 0a45.696 45.696 0 1 0 91.392 0 45.696 45.696 0 1 0-91.392 0Z"
                      fill="#ffffff" p-id="5597"></path>
                <path d="M758.869333 502.869333m-45.696 0a45.696 45.696 0 1 0 91.392 0 45.696 45.696 0 1 0-91.392 0Z"
                      fill="#ffffff" p-id="5598"></path>
                <path
                    d="M420.565333 416a32 32 0 0 1 4.352 63.701333l-4.352 0.298667H274.346667a32 32 0 0 1-4.352-63.701333l4.352-0.298667h146.261333z"
                    fill="#ffffff" p-id="5599"></path>
                <path
                    d="M347.434667 342.869333a32 32 0 0 1 31.701333 27.648l0.298667 4.352v146.261334a32 32 0 0 1-63.701334 4.352l-0.298666-4.352V374.869333a32 32 0 0 1 32-32z"
                    fill="#ffffff" p-id="5600"></path>
              </svg>
              娱乐
            </el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!--中间导航-->
    <div class="bar">
      <el-space>
        <!--首页-->
        <router-link :to="{name:'home'}">
          <el-button plain :icon="HomeFilled"/>
        </router-link>
        <!--论坛-->
        <router-link :to="{name:'center'}">
          <el-button plain :icon="Comment"/>
        </router-link>
      </el-space>
    </div>
    <!--右上角登录和选项-->
    <div class="title-right">
      <el-space>
        <el-button class="username " type="primary" v-if="isLogin" @click="goCenter">
          <!--{{ username }}太窄了不够显示-->
          <el-image class="headIcon" :src="headImgUrl" alt="" :onerror="errorImage"/>
        </el-button>
        <!--登录按钮-->
        <el-button @click="drawer = true" v-if="!isLogin">
          <svg type="primary" class="headIcon" viewBox="0 0 1024 1024">
            <path
                d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
                fill=""></path>
            <path
                d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
                fill=""></path>
          </svg>
        </el-button>
        <!--选项下拉菜单-->
        <el-dropdown>
          <el-button class="option" :icon="Operation"/>
          <template #dropdown>
            <el-dropdown-menu>
              <!--管理中心-->
              <el-dropdown-item v-if="isAdmin" :icon="Avatar" @click="goCenter">
                管理中心
              </el-dropdown-item>
              <!--用户中心-->
              <el-dropdown-item v-else-if="isLogin" :icon="UserFilled" @click="goCenter">
                用户中心
              </el-dropdown-item>

              <!--退出登录-->
              <el-dropdown-item v-if="isLogin" @click="exit" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
              <!--更换背景-->
              <el-dropdown-item class="bgBtn" @click="changeBG(1)">更换背景</el-dropdown-item>
              <!--下载背景-->
              <el-dropdown-item class="bgBtn">
                <el-link :href="bgUrl" target="_blank" :underline="false">下载背景</el-link>
              </el-dropdown-item>
              <!--日夜切换-->
              <el-switch v-model="isDark" inline-prompt active-text="夜" inactive-text="日"
                         :inactive-action-icon="Sunny" :active-action-icon="Moon" class="isDark"/>
              <!--公告-->
              <el-dropdown-item :icon="Comment" @click="showNotice=!showNotice">
                公告
              </el-dropdown-item>
              <!--设置-->
              <el-dropdown-item :icon="Tools" @click="showSetting=!showSetting">
                设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>
  </div>


  <!--登录和注册窗口-->
  <el-drawer v-model="drawer" class="login" :before-close="isClose" :show-close="true" :size="drawerWidth"
             destroy-on-close="destroy-on-close">
    <template #header="{titleClass }">
      <el-button v-show="isShow" @click="isShow=!isShow" class="backBtn" :icon="ArrowLeftBold">
        返回
      </el-button>

      <h4 :class="titleClass">{{ title }}</h4>

      <div/>
    </template>

    <div>
      <el-image class="headImg" :src="headImgUrl" v-if="showHeadImg" alt="" :onerror="errorImage"/>
      <svg class="headImg" v-if="!showHeadImg" viewBox="0 0 1024 1024">
        <path
            d="M511.333 63.333c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 832c-51.868 0-102.15-10.144-149.451-30.15-36.011-15.231-69.123-35.67-98.812-60.897 12.177-31.985 42.226-63.875 84.223-88.903C396.189 686.243 456.222 669.53 512 669.53c55.631 0 115.416 16.658 164.026 45.703 41.762 24.953 71.689 56.812 83.863 88.804-29.764 25.342-62.976 45.865-99.106 61.146-47.299 20.006-97.582 30.15-149.45 30.15z m296.268-139.658c-20.493-35.937-54.353-68.855-98.747-95.381C649.75 624.979 579.839 605.53 512 605.53c-67.964 0-138.094 19.488-197.471 54.875-44.644 26.606-78.656 59.594-99.195 95.586-23.835-28.755-43.234-60.652-57.85-95.208-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.3-20.006 97.583-30.15 149.451-30.15 51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-14.563 34.429-33.869 66.22-57.583 94.892z"
            fill=""></path>
        <path
            d="M512 220.223c-88.224 0-160 71.776-160 160s71.776 160 160 160c88.225 0 160-71.775 160-160s-71.775-160-160-160z m0 256c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z"
            fill=""></path>
      </svg>
      <Login v-if="isShow" :flag="flag" :toLogin="toLogin"/>
      <br>
      <div v-show="!isShow">
        <el-button class="bt2" @click="toLogin">登录</el-button>
        <el-button class="bt2" @click="toSubmit">注册</el-button>
      </div>
    </div>

  </el-drawer>
  <!--  公告界面-->
  <el-dialog v-model="showNotice" :width="dialogWidth" :before-close="closeNotice" :show-close="false" destroy-on-close>
    <template #header><span style="font-size: 24px">公告</span></template>
    <!--  Notice组件-->
    <Notice/>
  </el-dialog>


  <!--  设置界面-->
  <el-dialog class="setting" v-model="showSetting" title="设置界面" :show-close="false">
    <el-space>
      <el-card>点击下方按钮会清除所有本地存储的token和账号信息,并且退出账号
        <template #footer>
          <el-button @click="clearAll" type="danger">清除本地缓存信息</el-button>
        </template>
      </el-card>
    </el-space>

  </el-dialog>


</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import Login from "@/pages/Login.vue";
import {
  ArrowLeftBold, Avatar,
  Comment,
  HomeFilled,
  Moon, Operation,
  Sunny, Switch, SwitchButton,
  Tools,
  UserFilled
} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useBGUrlStore} from '@/store/1999BG'
import Notice from "@/components/Notice.vue";
import useUserInfo from '@/hooks/useUserInfo'
import {useRouter} from "vue-router";
import emitter from "@/utils/emitter";

const router = useRouter()

const {isLogin, isAdmin, username, headImgUrl, bgUrl, errorImage} = useUserInfo()

//获取背景图,有用户的且选择使用则使用用户的图，没有则使用默认图
if (localStorage.getItem('useUserBGUrl') !== '1') bgUrl.value = ''
if (bgUrl.value === '') bgUrl.value = localStorage.getItem('bgUrl')

//控制头像的显示
let showHeadImg = ref(false)
//控制公告界面的显示
let showNotice = ref(true)
//控制设置界面的显示
let showSetting = ref(false)
//下拉按钮里面的字，暂时用不上
// let darkStr = ref('夜间模式')
//控制日夜模式切换
let isDark = ref(sessionStorage.getItem('isDark') === '1' || false)
//视口宽度
let screenWidth = ref(1080)
//控制PC和手机的dialog宽度
let dialogWidth = ref('60%')
//控制PC和手机的登录抽屉宽度
let drawerWidth = ref('30%')
//登录和注册界面的判断
const drawer = ref(false)
//登录和注册界面的标题——————待修改，需要响应式
let title = ref('登录/注册')
//登录和注册按钮的显示和隐藏
let flag = ref(true)
//登录相关，控制页面多个组件的显示与隐藏
let isShow = ref(false)
//本地默认存的背景图地址
const {pcBGList, phoneBGList} = reactive(useBGUrlStore())
const bgList = [pcBGList, phoneBGList]

const html = (document.querySelector('html') as HTMLElement)
const body = (document.querySelector('body') as HTMLElement)

//网页初次渲染函数
onMounted(() => {
  screen()
  window.addEventListener('resize', () => {
    screen()
  })
  //如果本地壁纸为空
  if (bgUrl.value === null || bgUrl.value === '') {
    //响应式布局,判断是手机则用手机背景图
    if (screenWidth.value <= 980) changeBG(1)
    else changeBG(0)
  } else {
    body.style.backgroundImage = `url(${bgUrl.value})`
    console.log('当前背景图片地址是：' + bgUrl.value)
    if (localStorage.getItem('useUserBGUrl') !== '1') console.log('如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
  }
  //判断是否显示头像
  if (localStorage.getItem('userInfo') !== null) showHeadImg.value = true
  //登陆之后不默认显示公告
  if (isLogin.value) showNotice.value = false
  light()
})


function screen() {
  //获取当前屏幕宽度
  screenWidth.value = document.body.clientWidth
  //修改dialog框和登录抽屉的宽度
  if (screenWidth.value <= 980) {
    dialogWidth.value = '90%'
    drawerWidth.value = '100%'
  } else {
    dialogWidth.value = '60%'
    drawerWidth.value = '30%'
  }
}

//日夜模式切换逻辑
function light() {
  if (isDark.value === false) {
    html.classList.remove('dark')
    body.style.backgroundImage = `url(${bgUrl.value})`
    // darkStr.value = '日间模式'
    sessionStorage.setItem('isDark', '0')
    // console.log('当前为日间模式')
  } else {
    html.classList.add('dark')
    body.style.backgroundImage = ''
    // darkStr.value = '夜间模式'
    sessionStorage.setItem('isDark', '1')
    // console.log('当前为夜间模式')
  }
}


//监视日夜模式切换
watch(isDark, (newValue, oldValue) => {
  if (newValue === oldValue) {
    return
  } else {
    // console.log('isDark变化了,当前为：', newValue)
    light()
  }
})


//更换背景
function changeBG(number: number) {
  //bgList[0]是横屏壁纸，bgList[1]是竖屏壁纸
  const list = bgList[number]
  const num = Number((Math.random() * list.length).toFixed())
  console.log(`一共有${list.length}张图。现在是第${num}张图`)
  console.log('当前背景图片地址是：' + list[num] + '\r\n如需更多壁纸请前往重返未来1999官网：' + 'https://re.bluepoch.com/home/detail.html#wallpaper')
  bgUrl.value = list[num]
  body.style.backgroundImage = `url(${list[num]})`
  localStorage.setItem('bgUrl', list[num])
}

//前往管理中心
function goCenter() {
  if (isAdmin.value) router.push({name: 'adminUsersManagement'})
  else if (isLogin.value) router.push({name: 'userInfo'})
}


//退出登录
function exit() {
  sessionStorage.clear()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('userEngines')
  localStorage.removeItem('useUserBGUrl')
  localStorage.removeItem('userBGUrl')
// 调用函数清除所有sessionStorage
  ElMessage.info('已退出登录,本地的用户数据已清除')
  ElMessage.info('部分本地信息会保留，如需清除请在右上角选择“选项“→”设置”→“清除全部本地缓存信息”')
  setTimeout(() => {
    location.href = '/'
  }, 2500)
}

//清除全部本地缓存信息
function clearAll() {
  localStorage.clear()
  sessionStorage.clear()
  ElMessage.success('本地信息已全部清除')
  location.reload()
}


//关闭登录和注册窗口时的提示
const isClose = (done: Function) => {
  ElMessageBox.confirm('你想退出登录/注册吗?关闭窗口后已填信息不会保留。', {
    confirmButtonText: '关闭',
    cancelButtonText: '取消',
    showClose: false,
  })
      .then(() => {
        setTimeout(() => {
          done()
          // 动画关闭需要一定的时间
        }, 200)
      })
      .catch(err => {
        //什么都不选
        // ElMessage.error(err)
      })
}


//点击登录按钮
function toLogin() {
  isShow.value = true
  flag.value = true
  console.log(flag.value)
}

//点击注册按钮
function toSubmit() {
  isShow.value = true
  flag.value = false
  console.log(flag.value)
}

//关闭公告时调用
function closeNotice() {
  ElMessage.info('公告可在右上角查看。登录后将不会默认加载')
  showNotice.value = false
}


</script>

<style scoped>
.title {
  margin-top: 10px;
  justify-content: space-between;
}


.isDark {
  margin-left: 10px;
}

.hide {
  display: none;
}


.username {
  display: inline;
  /*图片从button里面移除就需要这个调整位置
margin-top: -20px ;
  */
  margin-top: -5px;
  background-color: transparent;
  border: transparent;
  font: 20px bold, '华文行楷', serif;
  text-align: center;
  color: gray
}

.username:hover {
  background-color: transparent;
  color: #CFB53B;
}

/*导航栏头像*/
.headIcon {
  margin-left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 15px;
}

/*登录界面的头像图片大小*/
.headImg {
  width: 200px;
}

.bt2 {
  margin-top: 100px;
  width: 120px;
  height: 50px;
  font-size: 18px;
}

.backBtn {
  left: 0;
  position: absolute;
}


.setting {
  display: flex;
  margin: 5% 20%;
  z-index: 999;
  width: 60%;
  height: 70%;
  opacity: 0.9;
}


@media (max-width: 980px) {
  .show {
    display: none;
  }

  .hide {
    display: block;
  }

  .icon {
    width: 18px;
    height: 18px;
  }

  .title-left {
    position: absolute;
    top: 10px;
    left: 0;
  }

  .title-right {
    position: absolute;
    top: 10px;
    right: 0;
  }

  .headIcon {
    margin-left: 0;
  }

  /*
    .loginBtn {
      position: absolute;
      background-color: transparent;
      border: none;
      right: 0;
    }

    .loginBtn:active {
      background-color: transparent;
      border: none;
    }


  */
  .bar {
    display: flex;
    justify-content: center;
  }
}
</style>