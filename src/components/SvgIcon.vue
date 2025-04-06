<template>
  <!-- 自定义SVG组件 -->
  <svg :class="['custom-svg-icon', $attrs.class]" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup>
defineProps({
  // src/assets/icons目录下的svg图标名称，支持动态切换
  name: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.custom-svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor; /* 允许用 CSS 控制颜色 */
  vertical-align: middle;
}
</style>
