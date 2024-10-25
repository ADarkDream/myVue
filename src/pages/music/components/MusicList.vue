<!--歌单列表-->
<template>
  <div class="musicList">
    <el-empty v-if="!musicList?.length" class="emptyDiv" description=" ">
      <template #default>
        <p>请先搜索或选择歌单</p>
        <el-link type="primary" @click="changePanelIndex(1)">前往歌单广场</el-link>
      </template>
    </el-empty>
    <div v-else class="infoDiv" :class="{ hide: isHidden }">
      <img :src="musicListInfo?.pic_url" class="cover">
      <div class="music_list_info">
        <p class="title">
          {{ musicListInfo?.name }}
          <el-button link type="warning" :icon="ArrowUpBold" v-show="!isHidden" @click="toggleInfoVisible">
            {{ '收起' }}
          </el-button>
        </p>
        <div class="info">
          <p>歌单状态：
            <el-text :type="musicListInfo?.status === 1 ? 'primary' : 'success'">{{
              musicListInfo?.status === 1 ? '私有' : '公开'
            }}
            </el-text>
          </p>
          <p>歌曲数：{{ musicListInfo?.songsCount }}<el-button link size="small" plain type="primary"
              @click="refresh({ cloud_music_list_id: musicListInfo?.cloud_music_list_id! })">刷新</el-button></p>
          <p>介绍：
            <el-text type="info" v-html="musicListInfo?.description || '暂无介绍'"></el-text>
          </p>
          <p>上次更新时间：
            <el-text type="info">{{ getTime(musicListInfo!.updated_time) }}</el-text>
          </p>
        </div>

        <el-button-group class="btnGroup" size="small" type="primary" v-if="isPC || !isHidden">
          <el-button @click="addTheList(true)">播放</el-button>
          <el-button @click="addTheList()">添加</el-button>
          <el-button disabled>收藏</el-button>
          <el-button @click="copyText('https://muxidream.cn/music?ml_id=' + musicListInfo?.music_list_id, '播放链接')">
            分享
          </el-button>
        </el-button-group>

        <el-button link type="warning" :icon="ArrowDownBold" v-show="isHidden" @click="toggleInfoVisible">
          {{ '显示' }}
        </el-button>
      </div>
    </div>
    <music-list-songs-list :songsList="musicList" :height="drawerSize - 80 - height" v-show="musicList.length !== 0" />
  </div>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import MusicListSongsList from "@/pages/music/components/MusicListSongsList.vue";
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useMusicConfigStore } from "@/store/music/useMusicConfigStore";
import useTimestamp from "@/hooks/useTimestamp";
import useFunction from "@/hooks/useFunction";
import useResponsive from "@/hooks/useResponsive";
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusicList from "@/hooks/music/useMusicList";

const musicListStore = useMusicListStore()
const musicConfigStore = useMusicConfigStore()
const { getTime } = useTimestamp()
const { copyText } = useFunction()

const musicList = computed(() => musicListStore.musicList)
const musicListInfo = computed(() => musicListStore.musicListInfo)
const { addMusicList } = musicListStore
const { changePanelIndex } = musicConfigStore
const { toggleMusic } = useMusicPlay()
const { getCloudMusicList } = useMusicList()
const { drawerSize, isPC } = useResponsive()

const isHidden = ref(false)


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
const refresh = async ({ cloud_music_list_id }: { cloud_music_list_id: number }) => {
  const { status, msg } = await getCloudMusicList({ cloud_music_list_id: cloud_music_list_id, latest: 1 })
  if (status === 1) ElMessage.success('刷新成功')
  else ElMessage.info(msg)
}



//将歌曲添加到播放列表，剔除会员歌曲
const addTheList = async (isPlay = false) => {
  const newList = musicList.value.filter(songInfo => songInfo.fee !== 1)
  ElMessage.warning('已过滤会员歌曲并添加到播放列表')

  const index = await addMusicList(newList, { isReplace: true })
  //如果要播放，跳转到这个歌单的第一首歌
  if (isPlay) {
    await toggleMusic({ index: index - newList.length + 1 })
  }
  //面板激活序号

}


</script>

<style scoped>
.musicList {
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
}

/*歌单信息*/
.music_list_info {
  padding-left: 20px;
  position: relative;

  .title {
    font-size: 20px;
    color: var(--el-color-primary);
  }

  p {
    padding: 3px 0;
  }

  .toggleBtn {
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-top: 10px
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
    }
  }

  .music_list_info {
    padding-left: 5px;

    .title {
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
