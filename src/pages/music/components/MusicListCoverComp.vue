<!--专辑封面-->
<template>
  <div class="card">
    <div class="img"
      :style="'--bgImage:' + `url(${musicListInfo.pic_url || musicListInfo.default_cover_url || defaultAlbumArt})`">
      <div class="save" @click.stop>
        <LikeHeart class="likeHeart" :isLike="isLike" @click="toggleLike()" v-if="!isOwner" />
        <el-dropdown v-else class="optionBtn" :trigger="isPC ? 'hover' : 'click'">
          <span>
            <el-icon>
              <MoreFilled />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a" :icon="Edit"
                @click="showEditMusicListInfoDrawer(false, musicListInfo)">修改</el-dropdown-item>
              <el-dropdown-item command="b" :icon="Delete" @click="deleteMusicList(musicListInfo)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="text">
      <p class="title"><el-text truncated>{{ musicListInfo.name }}</el-text></p>
      <p class="info"><span><span v-if="isPC">上次更新：</span> {{ formatDate(new Date(musicListInfo.updated_time))
          }}</span><span>{{
            musicListInfo.songsCount }}首</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Delete, Edit, MoreFilled } from '@element-plus/icons-vue';
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks
import useTimestamp from "@/hooks/useTimestamp";
import useMusicList from '@/hooks/music/useMusicList';
import useMusic from '@/hooks/music/useMusic';
//components
import LikeHeart from "@/components/smallComp/LikeHeart.vue";
//types
import type { MusicListInfo } from "@/types/music";
//files
import defaultAlbumArt from "@/assets/music/music.svg";


const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const { uid } = toRefs(userInfoStore)

const { formatDate } = useTimestamp()
const { isPC } = toRefs(responsiveStore)
const { deleteMusicList } = useMusicList()
const { showEditMusicListInfoDrawer } = useMusic()

const isLike = ref(false)

const { musicListInfo } = defineProps(['musicListInfo']) as { musicListInfo: MusicListInfo }

const isOwner = ref(musicListInfo.uid === uid.value)

const toggleLike = () => {
  isLike.value = !isLike.value
  ElMessage.info('功能开发中')
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

/* 菜单 */
.optionBtn {
  border: none;
  color: rgb(255, 91, 137);
  padding: 10px;
  border-radius: 5px;
  transform: scale(1.5)
}

.optionBtn:hover {
  border: none;
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
  .save:hover .likeHeart {
    transform: scale(1.1) rotate(10deg);
  }

  .save:hover .optionBtn {
    transform: scale(1.8);
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
    margin: 0;
    height: 30px;
  }

  .text .title {
    font-size: 13px;
  }

  .text .info {
    /* display: none; */
    padding: 0 10px;
    font-size: 11px;
    /*    margin-left: 5px;*/
  }
}
</style>
