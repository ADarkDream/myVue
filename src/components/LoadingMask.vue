<template>
  <!--    以下是网站加载动画的样式-->
  <div id="loading-mask" v-show="show" :style="{ backgroundColor: isDark ? '#000' : '#FFF' }">
    <svg viewBox="0 0 400 200">
      <text x="200" y="100">MOMO</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { useResponsiveStore } from "@/store/useResponsiveStore"

const responsiveStore = useResponsiveStore()
const { isDark } = toRefs(responsiveStore)

defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
/*#region 以下是网站加载动画的样式*/
#loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  user-select: none;
  z-index: 9999;
  overflow: hidden;
  opacity: 0.8;
  transition: 0.5s ease-in-out;
}

#loading-mask > svg {
  height: 30%;
  width: 100%;
  margin: 20% 0;
  overflow: hidden;
}

#loading-mask > svg > text {
  text-anchor: middle;
  dominant-baseline: middle;
  text-transform: uppercase;
  animation: stroke 2s infinite alternate;
  letter-spacing: 10px;
  font-size: 150px;
}

@keyframes stroke {
  0% {
    fill: rgba(72, 138, 20, 0);
    stroke: rgba(54, 95, 160, 1);
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 0.8;
  }

  50% {
    fill: rgba(72, 138, 20, 0);
    stroke: rgba(54, 95, 160, 1);
    stroke-width: 1.2;
  }

  70% {
    fill: rgba(72, 138, 20, 0);
    stroke: rgba(54, 95, 160, 1);
    stroke-width: 1.5;
  }

  90%,
  100% {
    fill: rgba(72, 138, 204, 1);
    stroke: rgba(54, 95, 160, 0);
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}

@media (max-width: 780px) {
  #loading-mask > svg > text {
    font-size: 100px;
  }

  #loading-mask > svg {
    width: 80%;
    margin: 20% 10%;
  }
}

/*#endregion*/
</style>
