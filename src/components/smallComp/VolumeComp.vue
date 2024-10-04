<template>
  <label class="slider">
    <input type="range" class="level" v-model="volumeNum" :min="min" :max="max" @change="changeVolume(volumeNum/100)">
    <span class="volume">
         <svg v-if="volumeNum==='0'" class="icon small_icon" viewBox="0 0 1024 1024"><path
             d="M128 420.576v200.864h149.12l175.456 140.064V284.288l-169.792 136.288H128z m132.256-64l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM752 458.656L870.4 300.8a32 32 0 1 1 51.2 38.4L792 512l129.6 172.8a32 32 0 0 1-51.2 38.4l-118.4-157.856-118.4 157.856a32 32 0 0 1-51.2-38.4l129.6-172.8-129.6-172.8a32 32 0 0 1 51.2-38.4l118.4 157.856z"/></svg>
               <svg v-else class="icon small_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="512"
                    height="512"
                    x="0"
                    y="0"
                    viewBox="0 0 24 24"
                    xml:space="preserve"
               >
    <g>
      <path
          d="M18.36 19.36a1 1 0 0 1-.705-1.71C19.167 16.148 20 14.142 20 12s-.833-4.148-2.345-5.65a1 1 0 1 1 1.41-1.419C20.958 6.812 22 9.322 22 12s-1.042 5.188-2.935 7.069a.997.997 0 0 1-.705.291z"
          fill="currentColor"
          data-original="#000000"
      ></path>
      <path
          d="M15.53 16.53a.999.999 0 0 1-.703-1.711C15.572 14.082 16 13.054 16 12s-.428-2.082-1.173-2.819a1 1 0 1 1 1.406-1.422A6 6 0 0 1 18 12a6 6 0 0 1-1.767 4.241.996.996 0 0 1-.703.289zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z"
          fill="currentColor"
          data-original="#000000"
      ></path>
    </g>
  </svg>
<span>{{ volumeNum }}</span>
      </span>
  </label>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useMusicPlayStore} from "@/store/music/useMusicPlayStore";

const musicPlayStore = useMusicPlayStore()

const {min, max, value,changeVolume} = defineProps(['min', 'max', 'value','changeVolume'])
// const {changeVolume} = musicPlayStore

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
