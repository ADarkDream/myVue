<template>
  <div class="card">
    <div class="img" :style="'--bgImage:'+`url(${musicListInfo.pic_url || defaultAlbumArt})`">
      <div class="save" >
        <div class="heart-container" title="Like">
          <input type="checkbox" class="checkbox" id="Give-It-An-Id">
          <div class="svg-container">
            <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
              </path>
            </svg>
            <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
              </path>
            </svg>
            <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="10,10 20,20"></polygon>
              <polygon points="10,50 20,50"></polygon>
              <polygon points="20,80 30,70"></polygon>
              <polygon points="90,10 80,20"></polygon>
              <polygon points="90,50 80,50"></polygon>
              <polygon points="80,80 70,70"></polygon>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="text">
      <p class="h3">{{ musicListInfo.name }}</p>
      <p class="p"> 6 Video - 40 min </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAlbumArt from "@/assets/music/music.svg";
import {ElMessage} from "element-plus";
import useResponsive from "@/hooks/useResponsive";

const {isPC} = useResponsive()

const {musicListInfo} = defineProps(['musicListInfo'])
</script>

<style scoped>
.card {
  width: 252px;
  height: 265px;
  background: white;
  box-shadow: 2px 2px 5px #bebebe,
  -2px -2px 5px #bebebe;
  transition: 0.2s ease-in-out;
  --bgImage: url('@/assets/music/music.svg');
  --borderRadius: 30px;
  border-radius: var(--borderRadius);
}

.img {
  position: relative;
  width: 100%;
  height: 75%;
  border-top-left-radius: var(--borderRadius);
  border-top-right-radius: var(--borderRadius);
  background: linear-gradient(#e66465, #9198e5);
  display: flex;
  justify-content: right;
}

.img::before {
  content: '';
  border-top-left-radius: var(--borderRadius);
  border-top-right-radius: var(--borderRadius);
  background: var(--bgImage) no-repeat center center/cover;
  position: absolute;
  width: 100%;
  height: 100%;
}

.save {
  transition: 0.2s ease-in-out;
  border-radius: 10px;
  margin: 20px;
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.text {
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}


.text .h3 {
  font-family: 'Lucida Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: black;
}

.text .p {
  font-family: 'Lucida Sans', sans-serif;
  color: #999999;
  font-size: 13px;
}

.save:hover {
  transform: scale(1.1) rotate(10deg);
}

.save:hover .svg {
  fill: #ced8de;
}

/*region爱心动画*/
.heart-container {
  --heart-color: rgb(255, 91, 137);
  position: relative;
  width: 50px;
  height: 50px;
  transition: .3s;
}

.heart-container .checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 20;
  cursor: pointer;
}

.heart-container .svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heart-container .svg-outline,
.heart-container .svg-filled {
  fill: var(--heart-color);
  position: absolute;
}

.heart-container .svg-filled {
  animation: keyframes-svg-filled 1s;
  display: none;
}

.heart-container .svg-celebrate {
  position: absolute;
  animation: keyframes-svg-celebrate .5s;
  animation-fill-mode: forwards;
  display: none;
  stroke: var(--heart-color);
  fill: var(--heart-color);
  stroke-width: 2px;
}

.heart-container .checkbox:checked ~ .svg-container .svg-filled {
  display: block
}

.heart-container .checkbox:checked ~ .svg-container .svg-celebrate {
  display: block
}

@keyframes keyframes-svg-filled {
  0% {
    transform: scale(0);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1);
    filter: brightness(1.5);
  }
}

@keyframes keyframes-svg-celebrate {
  0% {
    transform: scale(0);
  }

  50% {
    opacity: 1;
    filter: brightness(1.5);
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
    display: none;
  }
}

/*endregion*/

/*移动端布局*/
@media (max-width: 780px) {
  .card {
    width: 126px;
    height: 132px;
    --borderRadius: 15px
  }

  .save {
    margin: 5px;
  }

  .text {
    margin: 2px 5px 0 5px;
  }

  .text .h3 {
    font-size: 13px;
  }

  .text .p {
    display: none;
/*    font-size: 10px;
    margin-left: 5px;*/
  }
}

</style>
