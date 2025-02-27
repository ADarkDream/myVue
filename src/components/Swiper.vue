<template>
  <div class="carousel-wrapper">
    <button class="control-btn left-btn" @click="rotate('clockwise')">&lt;</button>

    <div class="circle-container">
      <div class="center-point"></div>
      <div v-for="(card, index) in visibleCards" :key="card.frontId" class="card-container" :style="getCardStyle(index)">
        <div class="card">
          <div class="card-front">
            <img :src="card.front.src" :alt="`photo ${card.frontId}`" />
          </div>
          <div class="card-back">
            <img :src="card.back.src" :alt="`photo ${card.backId}`" />
          </div>
        </div>
      </div>
    </div>

    <button class="control-btn right-btn" @click="rotate('counterclockwise')">&gt;</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"

const images = ref([
  { src: "/photos/photo0.webp", id: 0 },
  { src: "/photos/photo1.webp", id: 1 },
  { src: "/photos/photo2.webp", id: 2 },
  { src: "/photos/photo3.webp", id: 3 },
  { src: "/photos/photo4.webp", id: 4 },
  { src: "/photos/photo5.webp", id: 5 },
  { src: "/photos/photo6.webp", id: 6 },
  { src: "/photos/photo7.webp", id: 7 },
  { src: "/photos/photo8.webp", id: 8 },
])

const currentIndex = ref(0)
const isAnimating = ref(false)
const rotateDirection = ref(1)

const visibleCards = computed(() => {
  const cards = []
  for (let i = 0; i < 3; i++) {
    const frontIndex = (currentIndex.value + i) % images.value.length
    const backIndex =
      rotateDirection.value === 1
        ? (frontIndex - 3 + images.value.length) % images.value.length // 顺时针时显示末尾三张
        : (frontIndex + 3) % images.value.length // 逆时针时显示后面三张

    cards.push({
      front: images.value[frontIndex],
      back: images.value[backIndex],
      frontId: frontIndex,
      backId: backIndex,
    })
  }
  return cards
})

const getCardStyle = (index: number) => {
  const baseAngle = -60
  const angle = baseAngle + index * 60

  return {
    transform: `rotateZ(${angle}deg) ${isAnimating.value ? `rotateY(${180 * rotateDirection.value}deg)` : "rotateY(0)"}`,
  }
}

const rotate = (direction: "clockwise" | "counterclockwise") => {
  if (isAnimating.value) return

  isAnimating.value = true
  rotateDirection.value = direction === "clockwise" ? 1 : -1

  setTimeout(() => {
    if (direction === "clockwise") {
      currentIndex.value = (currentIndex.value - 3 + images.value.length) % images.value.length
    } else {
      currentIndex.value = (currentIndex.value + 3) % images.value.length
    }
    isAnimating.value = false
  }, 1500)
}
</script>

<style scoped>
.carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: absolute;
  z-index: 999;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.circle-container {
  position: relative;
  width: 600px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.center-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #333;
  border-radius: 50%;
  z-index: 10;
}

.card-container {
  position: absolute;
  width: 100px;
  height: 150px;
  transform-origin: bottom center;
  transition: transform 1.5s ease;
  bottom: 50%;
  transform-style: preserve-3d;
  will-change: transform;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card-front {
  transform: translateZ(5px); /* 添加正面厚度 */
}

.card-back {
  transform: rotateY(180deg) translateZ(5px); /* 添加背面厚度，并旋转180度 */
}

.card-front img,
.card-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 添加卡片边缘效果 */
.card::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #999;
  transform: rotateY(90deg) translateZ(5px);
  transform-origin: left;
}

@media (max-width: 700px) {
  .circle-container {
    transform: scale(0.8);
  }

  .carousel-wrapper {
    gap: 10px;
  }
}
</style>
