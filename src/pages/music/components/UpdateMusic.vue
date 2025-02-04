<template>
  <el-drawer
    v-model="a"
    class="updateMusicDrawer"
    direction="btt"
    show-close
    :size="drawerSize - (isPC ? 39 : 39) + 'px'"
    :with-header="false"
    @touchend="(e: TouchEvent) => e.stopPropagation()"
    @touchstart="(e: TouchEvent) => e.stopPropagation()"
  >
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue"
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore"

const responsiveStore = useResponsiveStore()
const { isPC, drawerSize } = toRefs(responsiveStore)

const a = ref(false)
</script>
<style scoped></style>
