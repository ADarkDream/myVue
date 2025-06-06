<!--歌单列表-->
<template>
  <div class="musicList">
    <el-empty v-if="!musicList?.length && !musicListInfo" class="emptyDiv" description=" ">
      <template #default>
        <p>请先搜索或选择歌单</p>
        <el-link type="primary" @click="changePanelIndex(1)">前往歌单广场</el-link>
      </template>
    </el-empty>
    <div v-else :class="{ hide: isHidden }">
      <div class="infoDiv">
        <div
          class="cover"
          :style="'--coverImg:' + `url(${musicListInfo?.pic_url || musicListInfo?.default_cover_url || defaultAlbumArt})`"
        ></div>
        <div class="music_list_info">
          <p class="title">
            <el-text>{{ musicListInfo?.name }}</el-text>
            <el-button v-show="!isHidden" :icon="ArrowUpBold" link type="warning" @click="toggleInfoVisible">
              {{ "收起" }}
            </el-button>
          </p>
          <div class="info">
            <p>
              歌单状态：
              <el-text :type="musicListInfo?.status === 1 ? 'primary' : 'success'"
                >{{ musicListInfo?.status === 1 ? "私有" : "公开" }}
              </el-text>
            </p>
            <p>
              歌曲数：{{ musicListInfo?.songsCount
              }}<el-button link plain size="small" type="primary" @click="refresh()">刷新</el-button>
            </p>
            <p>
              介绍：<el-text class="description" :line-clamp="isPC ? 3 : 1" truncated type="info">{{
                musicListInfo?.description || "暂无介绍"
              }}</el-text>
            </p>
            <p>
              上次更新时间：
              <el-text type="info">{{ getTime(musicListInfo!.updated_time) }}</el-text>
            </p>
          </div>

          <el-button-group v-if="isPC && !isHidden" class="btnGroup" size="small" type="primary">
            <el-button @click="addTheList(true)">播放</el-button>
            <el-button @click="addTheList()">添加</el-button>
            <el-button v-show="isOwner" @click="connectMusicList()">收藏</el-button>
            <el-button v-if="isOwner" @click="showEditMusicListInfoDrawer(false, musicListInfo)">编辑</el-button>
            <el-button @click="shareMusicListLink()">分享</el-button>
            <el-button
              v-if="musicListInfo.cloud_music_list_id"
              @click="musicListUtils.goToCloudMusicList(musicListInfo.cloud_music_list_id)"
              >前往网易云</el-button
            >
          </el-button-group>
          <el-button v-show="isHidden" :icon="ArrowDownBold" link type="warning" @click="toggleInfoVisible()">
            {{ "显示" }}
          </el-button>
        </div>
      </div>
      <el-button-group v-if="!isPC && !isHidden" class="btnGroup" size="small" style="margin: 5px 0" type="primary">
        <el-button @click="addTheList(true)">播放</el-button>
        <el-button @click="addTheList()">添加</el-button>
        <el-button :disabled="!isOwner">收藏</el-button>
        <el-button v-if="isOwner" @click="showEditMusicListInfoDrawer(false, musicListInfo)">编辑</el-button>
        <el-button @click="shareMusicListLink()">分享</el-button>
        <el-button
          v-if="musicListInfo.cloud_music_list_id"
          @click="musicListUtils.goToCloudMusicList(musicListInfo.cloud_music_list_id)"
          >前往网易云</el-button
        >
      </el-button-group>
    </div>
    <music-list-songs-list
      v-show="musicList.length"
      :height="mainPanelContentHeight - (isPC ? 100 : 70)"
      :is-owner
      :songs-list="musicList"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue"
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue"
//stores
import { useMusicListStore } from "@/store/music/useMusicListStore"
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
//hooks
import useTimestamp from "@/hooks/useTimestamp"
import { useResponsiveStore } from "@/store/useResponsiveStore"
import useMusicPlay from "@/hooks/music/useMusicPlay"
import useMusicList from "@/hooks/music/useMusicList"
import useMusic from "@/hooks/music/useMusic"
//components
import MusicListSongsList from "@/pages/music/components/MusicListSongsList.vue"
//utils
import myFunction from "@/utils/myFunction"
import musicListUtils from "@/utils/music/musicList"
//files
import defaultAlbumArt from "@/assets/music/music.svg"

const musicListStore = useMusicListStore()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { getTime } = useTimestamp()

const musicList = computed(() => musicListStore.musicList)
const musicListInfo = computed(() => musicListStore.musicListInfo!)
const { addMusicList } = musicListStore
const { changePanelIndex } = mainPanelConfigStore
const { uid, isLogin } = toRefs(userInfoStore)
const { drawerSize, mainPanelContentHeight, isPC } = toRefs(responsiveStore)
const { toggleMusic } = useMusicPlay()
const { getCloudMusicList, getMusicList } = useMusicList()
const { showEditMusicListInfoDrawer } = useMusic()

const { copyText } = myFunction

const isHidden = ref(false)

const isOwner = computed(() => musicListInfo.value?.uid === uid.value)

const height = ref(isPC.value ? 200 : 125)

//歌单信息的显示与隐藏
const toggleInfoVisible = () => {
  if (isHidden.value) {
    isHidden.value = false
    height.value = isPC.value ? 200 : 125
  } else {
    isHidden.value = true
    height.value = 30
  }
}

//刷新歌单
const refresh = async () => {
  const { music_list_id, cloud_music_list_id } = musicListInfo.value
  let result
  if (isOwner.value) result = await getMusicList({ music_list_id, is_login: isLogin.value }, true)
  else
    result = await getCloudMusicList({
      cloud_music_list_id: cloud_music_list_id!,
      latest: 1,
    })
  const { status, msg } = result

  if (status === 1) ElMessage.success("刷新成功")
  else ElMessage.info(msg)
}

/**
 * 分享歌单链接
 */
const shareMusicListLink = () => {
  if (musicListInfo.value?.status !== 2) return ElMessage.info("当前歌单为私有歌单，请先修改为公开歌单再分享")
  else copyText("https://muxidream.cn/music?ml_id=" + musicListInfo.value?.music_list_id, "歌单链接")
}

/**
 * 收藏歌单
 */
const connectMusicList = async () => {
  if (isOwner.value) return ElMessage.info("无法收藏自己的歌单")
  else return ElMessage.info("功能开发中")
}
// ! 收藏功能不完善
//将歌曲添加到播放列表，剔除会员歌曲
const addTheList = async (isCover = false) => {
  const newList = musicList.value //.filter(songInfo => songInfo.fee !== 1)
  // ElMessage.warning('已过滤会员歌曲并添加到播放列表')

  await addMusicList(newList, { isCover })
  //如果要播放，跳转到这个歌单的第一首歌
  if (isCover) {
    await toggleMusic({ index: 0 })
  }
  //面板激活序号
}
</script>

<style scoped>
.musicList {
  --coverImg: url("@/assets/music/music.svg");

  .el-empty {
    margin-top: 50px;
    font-size: 18px;

    .el-link {
      padding-top: 10px;
      font-size: 18px;
    }
  }

  .infoDiv {
    display: flex;
    text-align: left;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 5px;
    border-radius: 15px;
  }
}

.cover {
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background: var(--coverImg) no-repeat center center/cover;
  flex: 0 0 200px;
}

/*歌单信息*/
.music_list_info {
  padding-left: 20px;
  position: relative;
  flex-grow: 1;

  .title {
    display: flex;
    justify-content: space-between;

    .el-text {
      font-size: 20px;
      color: var(--el-color-primary);
    }
  }

  p {
    display: flex;
    padding: 3px 0;

    .description {
      white-space: pre-wrap;
      /*识别\n换行 */
      flex: 1;
      /*占据这一行的剩余空间 */
    }
  }

  .toggleBtn {
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-top: 10px;
  }
}

.hide {
  height: 30px;

  .cover,
  .info {
    display: none;
  }

  .music_list_info {
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 30px;

    .title {
      padding: 0;
    }

    .toggleBtn {
      position: relative;
      margin: 0;
    }
  }
}

/*移动端布局*/
@media (max-width: 780px) {
  /*歌单信息*/
  .infoDiv {
    justify-content: space-around;

    .cover {
      width: 115px;
      height: 115px;
      flex: 0 0 115px;
    }
  }

  .music_list_info {
    padding-left: 5px;

    .title .el-text {
      font-size: 16px;
    }

    .btnGroup {
      margin: 3px 0;
    }

    p {
      padding: 0;
      font-size: 14px;
    }
  }
}
</style>
