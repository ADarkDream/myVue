<template>
  <el-drawer
    class="updateMusicDrawer"
    v-model="a"
    :with-header="false"
    :size="drawerSize - (isPC ? 39 : 39) + 'px'"
    @touchstart="(e: TouchEvent) => e.stopPropagation()"
    @touchend="(e: TouchEvent) => e.stopPropagation()"
    direction="btt"
    show-close
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
