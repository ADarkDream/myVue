<template>
  <div>
    <p>面板设置(夜间模式下无效)</p>
    <el-form v-model="bgSettings" class="mainPanelSettings">
      <el-form-item label="背景色" style="text-align: left">
        <v-swatches
          v-model="bgSettings['--main-panel-bg-color']"
          fallback-input-type="color"
          popover-x="left"
          show-fallback
        ></v-swatches>
        <el-icon @click="noticeNum = noticeNum === 0 ? 999 : 0">
          <InfoFilled />
        </el-icon>
        <Transition name="horizontal_slide">
          <el-text v-show="noticeNum === 0"> 可以选择预设颜色或自行调色 </el-text>
        </Transition>
      </el-form-item>
      <el-form-item label="透明度">
        <el-input-number v-model="bgSettings['--main-panel-bg-opacity']" :max="1" :min="0" :step="0.01" type="number" />
        <el-icon @click="noticeNum = noticeNum === 1 ? 999 : 1">
          <InfoFilled />
        </el-icon>
        <Transition name="horizontal_slide">
          <el-text v-show="noticeNum === 1"> 面板透明度，范围[0~1]，0为全透明，1为不透明 </el-text>
        </Transition>
      </el-form-item>
      <el-form-item label="模糊度">
        <el-input-number v-model="bgSettings['--main-panel-bg-filter']" :min="0" :step="0.01" type="number" />
        <el-icon @click="noticeNum = noticeNum === 2 ? 999 : 2">
          <InfoFilled />
        </el-icon>
        <Transition name="horizontal_slide">
          <el-text v-show="noticeNum === 2"> 面板模糊度，范围[0&lt;=x]，0为不模糊 </el-text>
        </Transition>
      </el-form-item>
      <el-form-item label="饱和度">
        <el-input-number v-model="bgSettings['--main-panel-bg-saturate']" :min="0" :step="0.01" type="number" />
        <el-icon @click="noticeNum = noticeNum === 3 ? 999 : 3">
          <InfoFilled />
        </el-icon>
        <Transition name="horizontal_slide">
          <el-text v-show="noticeNum === 3"> 面板饱和度，范围[0&lt;=x]，1为正常值 </el-text>
        </Transition>
      </el-form-item>
    </el-form>
  </div>
  <el-divider />
  <div style="height: 200px">
    <p>播放器设置</p>
    <div style="text-align: left">播放前显示播放器<el-switch v-model="is_show_player_before_play" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { VSwatches } from "vue3-swatches"
import { InfoFilled } from "@element-plus/icons-vue"
//stores
import { useMusicConfigStore } from "@/store/music/useMusicConfigStore"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"

const musicConfigStore = useMusicConfigStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { is_show_player_before_play } = toRefs(musicConfigStore)
const { bgSettings } = mainPanelConfigStore

const noticeNum = ref(0)
</script>
<style scoped>
.mainPanelSettings {
  font-weight: 600;
}

.mainPanelSettings .el-icon {
  margin: 0 5px;
  fill: #bdc3c8;
}
</style>
<style>
/*调色盘会被遮挡*/
/*.vue-swatches__container:not(.vue-swatches--inline){
  position: relative;
}*/
</style>
