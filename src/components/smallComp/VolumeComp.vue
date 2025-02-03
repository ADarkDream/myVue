<template>
  <label class="slider">
    <input type="range" class="level" v-model="volumeNum" :min="min" :max="max" @change="changeVolume(volumeNum / 100)" />
    <span class="volume">
      <SVG_volume_mute v-if="volumeNum === '0'" class="icon small_icon" />
      <SVG_volume_fill v-else class="icon small_icon" />
      <span>{{ volumeNum }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useMusicPlayStore } from "@/store/music/useMusicPlayStore"
//files
import SVG_volume_mute from "@/assets/music/volume_mute.svg?component"
import SVG_volume_fill from "@/assets/music/volume_fill.svg?component"

const musicPlayStore = useMusicPlayStore()

const { min, max, value } = defineProps(["min", "max", "value"])
const { changeVolume } = musicPlayStore

const volumeNum = ref(value)
</script>

<style scoped>
.slider {
  /* slider */
  --slider-width: 100%;
  --slider-height: 50px;
  --slider-bg: rgb(82, 82, 82);
  --slider-border-radius: 9px;
  /* level */
  --level-color: #fff;
  --level-transition-duration: 0.1s;
  /* icon */
  --icon-margin: 15px;
  --icon-color: var(--slider-bg);
  --icon-size: 25px;
}

.slider {
  /*  position: relative;*/
  cursor: pointer;
  /*  display: -webkit-inline-box;*/
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  -webkit-box-align: center;
  -ms-flex-align: center;
  position: fixed;
  z-index: 999;
  right: 0;
  top: 100px;
  animation: all 1s linear;
}

.slider .volume {
  display: inline-block;
  vertical-align: top;
  margin-right: var(--icon-margin);
  color: black;
  width: var(--icon-size);
  height: auto;
  position: absolute;
  right: 40px;
  top: 10px;
  pointer-events: none;
  font-size: 13px;
}

.slider .volume svg {
  margin-right: var(--icon-margin);
  width: var(--icon-size);
  height: auto;
}

.slider .level {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--slider-width);
  height: var(--slider-height);
  background: var(--slider-bg);
  overflow: hidden;
  border-radius: var(--slider-border-radius);
  -webkit-transition: height var(--level-transition-duration);
  -o-transition: height var(--level-transition-duration);
  transition: height var(--level-transition-duration);
  cursor: inherit;
  transform: rotate(270deg);
}

.slider .level::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  -webkit-box-shadow: -200px 0 0 200px var(--level-color);
  box-shadow: -200px 0 0 200px var(--level-color);
}

.slider .level::-moz-range-thumb {
  width: 0;
  height: 0;
  border-radius: 0;
  border: none;
  box-shadow: -200px 0 0 200px var(--level-color);
}
</style>
