<!--专辑封面-->
<template>
  <div class="card">
    <div class="img" :style="'--bgImage:' + `url(${musicListInfo.pic_url || defaultAlbumArt})`">
      <div class="save" @click="toggleLike()">
        <LikeHeart :isLike="isLike" />
      </div>
    </div>
    <div class="text">
      <p class="title">{{ musicListInfo.name }}</p>
      <p class="info" v-if="isPC"><span>上次更新：{{ formatDate(musicListInfo.lastTime) }}</span><span>{{
        musicListInfo.songsCount
          }}首</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAlbumArt from "@/assets/music/music.svg";
import { ref } from 'vue'
import useResponsive from "@/hooks/useResponsive";
import LikeHeart from "@/components/smallComp/LikeHeart.vue";
import useTimestamp from "@/hooks/useTimestamp";
const { formatDate } = useTimestamp()
const { isPC } = useResponsive()
const isLike = ref(false)


const { musicListInfo } = defineProps(['musicListInfo'])

const toggleLike = () => {
  isLike.value = !isLike.value
}

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


.text .title {
  font-family: 'Lucida Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: black;
}

.text .info {
  font-family: 'Lucida Sans', sans-serif;
  color: #999;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
}

/*支持hover才触发*/
@media (hover: hover) {
  .save:hover {
    transform: scale(1.1) rotate(10deg);
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

  .text .title {
    font-size: 13px;
  }

  .text .info {
    display: none;
    /*    font-size: 10px;
        margin-left: 5px;*/
  }
}
</style>
