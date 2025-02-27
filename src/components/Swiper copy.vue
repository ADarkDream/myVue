<template>
  <div class="container">
    <div class="poker poker1">
      <img src="/photos/photo (4).webp" />
    </div>
    <div class="poker poker2">
      <img src="/photos/photo (3).webp" />
    </div>
    <div class="poker poker3">
      <img src="/photos/photo (2).webp" />
    </div>
    <div class="poker poker4">
      <img src="/photos/photo (1).webp" />
    </div>
    <div class="poker poker5">
      <img src="/photos/photo (0).webp" />
    </div>
    <div class="poker_top poker5" @click="move()"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
// JIEJOE produce
// b站主页：https://space.bilibili.com/3546390319860710
const imgs = ref([])
const img_index = ref(0)
const poker_eles = ref([])
const transform_datas = [
  "rotate(-10deg)",
  "rotate(-6deg) translate(35%, -12%)",
  "rotate(-2deg) translate(65%, -19%)",
  "rotate(2deg) translate(95%, -26%)",
  "rotate(6deg) translate(125%, -23%)",
]

const init = () => {
  for (let i = 0; i < 9; i++) {
    let img = new Image()
    img.src = `/photos/photo (${i}).webp`
    imgs.value.push(img)
  }
  poker_eles.value = [...document.getElementsByClassName("poker")]
  poker_eles.value.forEach((obj, index) => {
    obj.nums = index
  })

  img_index.value = poker_eles.value.length
}
const move = () => {
  poker_eles.value.map((ele) => {
    let nums = ele.nums
    if (nums + 1 >= poker_eles.value.length) {
      nums = 0
      ele.style.transition = "opacity 0.3s ease"
      ele.style.opacity = "0"
      ele.querySelector("img").src = imgs.value[img_index.value].src
      img_index.value++
      if (img_index.value >= imgs.value.length) img_index.value = 0
      setTimeout(() => {
        ele.style.opacity = "1"
        ele.style.transition = "none"
        ele.style.transform = transform_datas[nums]
      }, 300)
    } else {
      nums += 1
      ele.style.transition = "transform 0.3s ease, opacity 0.3s ease"
      ele.style.opacity = "1"
      ele.style.transform = transform_datas[nums]
    }
    ele.style.zIndex = nums
    ele.nums = nums
  })
}

onMounted(() => {
  init()
})
</script>

<style>
div {
  user-select: none;
}

* {
  font-size: 2vmin;
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
}

.container {
  position: absolute;
  width: 45rem;
  height: 25rem;
  margin-bottom: 1rem;
}

.poker,
.poker_top {
  position: absolute;
  width: 20rem;
  height: 26rem;
  border: 0.15rem solid #fff;
  border-radius: 1.5rem;
  background-color: #17f700;
  transform-origin: bottom left;
  overflow: hidden;
}

.poker img {
  position: relative;
  width: 100%;
}

.poker_top {
  background-color: #fff;
  transition: 0.3s ease;
  cursor: pointer;
  z-index: 1000;
}

.poker_top:hover {
  background-color: #aaa;
}

.poker1 {
  transform: rotate(-10deg);
}

.poker2 {
  transform: rotate(-6deg) translate(35%, -12%);
}

.poker3 {
  transform: rotate(-2deg) translate(65%, -19%);
}

.poker4 {
  transform: rotate(2deg) translate(95%, -26%);
}

.poker5 {
  transform: rotate(6deg) translate(125%, -23%);
}
</style>
