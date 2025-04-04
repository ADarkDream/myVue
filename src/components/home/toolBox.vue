<template>
  <!--  时钟区域-->
  <div class="tool-box" @click="jumpToUrl">
    <div class="tool-icon disSelect">
      <img :src="props.toolInfo.img" :alt="props.toolInfo.title" :draggable="false" loading="lazy" />
    </div>
    <div class="tool-info">
      <div class="tool-title">{{ props.toolInfo.title || props.toolInfo.name }}</div>
      <div class="tool-desc">{{ props.toolInfo.desc || props.toolInfo.detail }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ToolInfo = {
  title?: string
  name?: string
  desc?: string
  detail?: string
  img: string
  url: string
}

const props = defineProps({
  toolInfo: {
    type: Object as () => ToolInfo,
    required: true,
  },
})
const jumpToUrl = () => {
  window.open(props.toolInfo.url, "_blank")
}
</script>

<style scoped>
.tool-box {
  box-sizing: border-box;
  width: 100%;
  min-width: 100px;
  padding: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3); /* 半透明背景 */
  backdrop-filter: blur(5px); /* 模糊效果 */
  display: flex;
  align-items: center;
  gap: 10px;
  color: currentColor;
  font-family: Arial, sans-serif;
  overflow: hidden; /* 隐藏溢出的内容 */
}
.tool-box:hover {
  cursor: pointer;
}
.tool-box:hover .tool-icon::before {
  transform: rotate(360deg);
}
.tool-box:hover img {
  transform: scale(1.2);
}

.tool-icon {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover; /* 让图片填充整个区域，保持比例，超出的部分裁切 */
    transition: transform 0.5s ease;
  }
}
.tool-icon::before {
  content: "";
  position: absolute;
  background: #fff;
  border-radius: 30%;
  opacity: 0.2;
  width: 46px;
  height: 46px;
  z-index: -1;
  left: 12px;
  top: 12px;
  transition: transform 0.5s;
}

.tool-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
  overflow: hidden;
}
.tool-title {
  font-size: 16px;
  font-weight: bold;
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 文本不换行 */
}
.tool-desc {
  font-size: 12px;
  opacity: 0.8;
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 文本不换行 */
}
</style>
