<template>
    <el-drawer class="updateMusicDrawer" v-model="a" :with-header="false" :size="drawerSize - (isPC ? 39 : 39) + 'px'"
        @touchstart="(e: TouchEvent) => e.stopPropagation()" @touchend="(e: TouchEvent) => e.stopPropagation()"
        direction="btt" show-close>


    </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from "vue";
//hooks
import useResponsive from '@/hooks/useResponsive';



const { isPC, drawerSize, containerHeight, touchstart, positionComputed } = useResponsive()
const a = ref(false)

</script>
<style scoped></style>