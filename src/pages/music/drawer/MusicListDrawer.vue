<template>
    <el-drawer class="MusicListDrawer" v-model="isShowMusicListDrawer" :size="drawerSize - (isPC ? 39 : 39) + 'px'"
        @touchstart="(e: TouchEvent) => e.stopPropagation()" @touchend="(e: TouchEvent) => e.stopPropagation()"
        direction="btt" show-close>
        <template #header>
            <div class="title">收藏到歌单</div>
        </template>
        <div class="musicDiv" @click="showEditMusicListInfoDrawer(true)">
            <div class="img"><el-icon>
                    <Plus />
                </el-icon>
            </div>
            <div>
                新建歌单
            </div>
        </div>
        <template v-for="item in myMusicListInfo" :key="index">
            <div class="musicDiv" @click="connectMusicToList(item.music_list_id)">
                <div class="img"
                    :style="'--coverImage:' + `url(${item.pic_url || item.default_cover_url || defaultAlbumArt})`">
                </div>
                <div>
                    <p> <el-text>{{ item.name }}——共{{ item.songsCount }}首</el-text></p>

                    <el-text :type="item.status === 1 ? 'primary' : 'success'">{{ item.status === 1 ? '私有' : '公开'
                        }}</el-text>
                    <el-text>——{{ formatDate(new Date(item.updated_time)) }}</el-text>
                </div>
            </div>
        </template>
    </el-drawer>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
import { Plus } from '@element-plus/icons-vue'
//stores
import { useMusicListDrawerStore } from '@/store/music/useMusicListDrawerStore'
import { useMusicListStore } from "@/store/music/useMusicListStore";
import { useResponsiveStore } from '@/store/useResponsiveStore';
//hooks

import useTimestamp from "@/hooks/useTimestamp";
import useMusicList from "@/hooks/music/useMusicList";
import useMusic from "@/hooks/music/useMusic";
//files
import defaultAlbumArt from "@/assets/music/music.svg";



const musicListDrawerStore = useMusicListDrawerStore()
const musicListStore = useMusicListStore()
const { isShowMusicListDrawer } = toRefs(musicListDrawerStore)
const { myMusicListInfo } = toRefs(musicListStore)
const { connectMusicToList } = useMusicList()
const responsiveStore = useResponsiveStore()
const { isPC, drawerSize } = toRefs(responsiveStore)
const { formatDate } = useTimestamp()
const { showEditMusicListInfoDrawer } = useMusic()





</script>
<style scoped>
.MusicListDrawer {
    --coverImage: url('@/assets/music/music.svg');
}

.title {
    font-size: 18px;
}

.musicDiv {
    display: flex;
    flex-wrap: nowrap;
    padding: 10px 0;
    text-align: left;
    align-items: center;
    font-size: 16px;

    div {
        margin-left: 25px
    }

    div .el-text {
        font-size: 16px;
    }

    .img {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid rgba(141, 139, 139, 0.8);
    }
}

.musicDiv:hover {
    background: rgba(86, 85, 85, 0.25);
    transition: all 0.2s linear;
    cursor: pointer;
}

.dark .musicDiv:hover {
    background: rgba(255, 255, 255, 0.25);
}

.img {
    background-image: var(--coverImage);
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-size: contain;
}
</style>
<style>
.el-drawer__header {
    padding: 10px 10px 0 10px;
}
</style>