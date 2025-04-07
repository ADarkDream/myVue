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
// 在组件挂载后手动获取 <use> 引用的 symbol 内容
// onMounted(() => {
//   const useEl = document.querySelector(".custom-svg-icon use")
//   if (useEl) {
//     const href = useEl.getAttribute("xlink:href") || useEl.getAttribute("href")
//     const symbolId = href?.replace(/^#/, "")
//     const symbol = document.getElementById(symbolId)
//     console.log(111)

//     if (symbol) {
//       console.log("展开后的 symbol 内容：", symbol.innerHTML)
//     }
//   }
// })
</script>

<style scoped>
.custom-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>
