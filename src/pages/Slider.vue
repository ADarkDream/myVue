<template>
  <div class="container">
    <!-- 左边侧边栏 -->
    <div class="sidebar">
      <div class="slides-list">
        <div v-for="(item, index) in imgList" :key="index" :class="{ isChecked: imgIndex === index }" @click="selectSlide(index)">
          幻灯片 {{ index + 1 }} <button @click="viewImg(index)">浏览</button>
          <button @click="edit(index)">编辑</button>
        </div>
      </div>
      <div class="controls">
        <button @click="addSlide(false)">add</button>
        <input ref="inputRef" style="display: none" type="file" @change="handleImageUpload" />

        <button @click="removeSlide">del</button>
        <button @click="play">{{ isPlaying ? "pause" : "play" }}</button>
      </div>
    </div>

    <div class="editor">
      <h3>{{ isEdit ? "编辑" : "预览" }}</h3>
      <div v-if="imgList?.length !== 0">
        <TransitionGroup name="list">
          <img alt="Image Preview" :src="imgList[imgIndex].src" @click="addSlide(true)" />
        </TransitionGroup>
        <p v-if="!isEdit">{{ imgList[imgIndex].desc }}</p>
        <textarea v-else v-model="imgList[imgIndex].desc" placeholder="填写备注..."></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, TransitionGroup } from "vue"

//幻灯片信息
interface imgInfo {
  src: string
  desc: string
}

const inputRef = ref<HTMLInputElement>()

//幻灯片列表
const imgList = ref<imgInfo[]>([])

//当前幻灯片序号
const imgIndex = ref(0)

const isEdit = ref(false)
const isUpdated = ref(false)

const isPlaying = ref(false)

// 添加幻灯片
const addSlide = (isEdit: boolean) => {
  isUpdated.value = isEdit
  inputRef.value?.click()
}

// 删除幻灯片
const removeSlide = () => {
  if (imgList.value.length > 0) {
    imgList.value.splice(imgIndex.value, 1)
    if (imgIndex.value !== 0) imgIndex.value--
  }
}

// 上传图片
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement // 将目标类型断言为 HTMLInputElement
  const file = target.files?.[0] // 使用可选链操作符
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const img = e.target?.result as string
    if (img) {
      if (isUpdated.value) {
        //更新图片
        imgList.value[imgIndex.value].src = img
        isUpdated.value = false
      } else {
        //新增图片
        imgList.value.push({ src: img, desc: "" })
        imgIndex.value = imgList.value.length - 1
      }
    }
  }
  if (file) {
    reader.readAsDataURL(file)
    if (inputRef.value) inputRef.value.value = ""
  }
}

// 选择幻灯片
const selectSlide = (index: number) => {
  imgIndex.value = index
}

//浏览幻灯片
const viewImg = (index: number) => {
  isEdit.value = false
  imgIndex.value = index
}

//编辑幻灯片
const edit = (index: number) => {
  isEdit.value = true
  imgIndex.value = index
}

//计时器
const timer = ref<ReturnType<typeof setInterval>>()

//循环播放幻灯片
const play = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    timer.value = setInterval(() => {
      const length = imgList.value.length
      if (length === 0 || length === 1) clearInterval(timer.value)
      else if (length > 1) {
        if (imgIndex.value === length - 1) imgIndex.value = 0
        else imgIndex.value++
      }
    }, 1000)
  } else {
    clearInterval(timer.value)
  }
}
</script>

<style>
.container {
  display: flex;
  flex: 1;
  border: 1px solid #ccc;
}

.sidebar {
  width: 25%;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.slides-list {
  flex: 1;
  border: 1px solid #000;
  margin-bottom: 10px;
}

.slides-list div {
  width: 100%;
  height: 60px;
  border: 1px solid #000;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.controls {
  display: flex;
  justify-content: space-between;
}

.controls button {
  width: 30%;
  padding: 5px;
  font-size: 18px;
  cursor: pointer;
}

.editor {
  flex: 1;
  padding: 20px;
  position: relative;
}

.editor img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.editor textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

/* 选中样式 */
.isChecked {
  background-color: skyblue;
}

/* 动画 */
.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
