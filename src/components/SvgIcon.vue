<!-- <template>
  <svg :id="`#${id}`" class="custom-svg-icon" aria-hidden="true" :style="style">
    <use :xlink:href="`#${id}`" />
  </svg>
</template>
<script setup>
defineOptions({ name: "SvgIcon", inheritAttrs: false })
const props = defineProps({
  name: { type: String, required: true },
  color: { type: String, default: "currentColor" },
  width: { type: String, default: "1rem" },
  height: { type: String, default: "1rem" },
})

const id = computed(() => `icon-${props.name}`)
const style = computed(() => ({
  [`--${id.value}-color`]: props.color || "currentColor",
  width: props.width,
  height: props.height,
}))

// 在组件挂载后手动获取 <use> 引用的 symbol 内容
onMounted(() => {
  const useEl = document.querySelector(".custom-svg-icon use")
  if (useEl) {
    const href = useEl.getAttribute("xlink:href") || useEl.getAttribute("href")
    const symbolId = href?.replace(/^#/, "")
    const symbol = document.getElementById(symbolId)
    console.log(111)

    if (symbol) {
      console.log("展开后的 symbol 内容：", symbol.innerHTML)
    }
  }
})
</script>

<style scoped>
.custom-svg-icon {
  vertical-align: middle;
  /* 先尝试使用传入的 color，如果没有，再尝试使用配置的主题色，若没有最后使用currentColor */
  /* color: var(--stroke-color, var(--theme-color, currentColor)); */
}
</style> -->
<template>
  <svg :id="`#${id}`" class="custom-svg-icon" aria-hidden="true" :style="style">
    <use :xlink:href="`#${id}`" />
  </svg>
</template>
<script setup>
defineOptions({ name: "SvgIcon", inheritAttrs: false })
const props = defineProps({
  name: { type: String, required: true },
  color: { type: String, default: "currentColor" },
  width: { type: String, default: "1rem" },
  height: { type: String, default: "1rem" },
})

const id = computed(() => `icon-${props.name}`)
const style = computed(() => ({
  color: props.color,
  width: props.width,
  height: props.height,
}))

// 在组件挂载后手动获取 <use> 引用的 symbol 内容
onMounted(() => {
  const useEl = document.querySelector(".custom-svg-icon use")
  if (useEl) {
    const href = useEl.getAttribute("xlink:href") || useEl.getAttribute("href")
    const symbolId = href?.replace(/^#/, "")
    const symbol = document.getElementById(symbolId)
    console.log(111)

    if (symbol) {
      console.log("展开后的 symbol 内容：", symbol.innerHTML)
    }
  }
})
</script>

<style scoped>
.custom-svg-icon {
  vertical-align: middle;
  /* 先尝试使用传入的 color，如果没有，再尝试使用配置的主题色，若没有最后使用currentColor */
  /* color: var(--stroke-color, var(--theme-color, currentColor)); */
}
</style>
