<template>
    <el-drawer class="MusicListDrawer" v-model="isShowMusicListDrawer" :size="drawerSize - (isPC ? 39 : 39) + 'px'"
        @touchstart="(e: TouchEvent) => e.stopPropagation()" @touchend="(e: TouchEvent) => e.stopPropagation()"
        direction="btt" show-close>
        <template #header>
            <div class="title">123</div>
        </template>
        <template v-for="(item, index) in musicListInfo" :key="index">
            <div class="musicDiv" @click="connectMusicToList(item.music_list_id)">
                <div class="img"
                    :style="'--coverImage:' + `url(${item.pic_url || item.default_cover_url || defaultAlbumArt})`">
                </div>
                <div>
                    <p> <el-text>{{ item.name }} -
                            {{ item.songsCount }}
                        </el-text></p>

                    <el-text>{{ item.status }}</el-text>
                    <el-text>{{ formatDate(new Date(item.updated_time)) }}</el-text>
                </div>
            </div>
        </template>
    </el-drawer>
</template>
<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { ElMessage } from "element-plus";
//stores
import { useMusicListDrawerStore } from '@/store/music/useMusicListDrawerStore'
import { useMusicListStore } from "@/store/music/useMusicListStore";
//hooks
import useResponsive from '@/hooks/useResponsive';
import useTimestamp from "@/hooks/useTimestamp";
import useMusicList from "@/hooks/music/useMusicList";
//types
import type { MusicListInfo } from "@/types/music";
//files
import defaultAlbumArt from "@/assets/music/music.svg";



const musicListDrawerStore = useMusicListDrawerStore()
const musicListStore = useMusicListStore()
const { isShowMusicListDrawer } = toRefs(musicListDrawerStore)
const { myMusicIdList, musicListInfoObj } = toRefs(musicListStore)
const { connectMusicToList } = useMusicList()

const { isPC, drawerSize, containerHeight, touchstart, positionComputed } = useResponsive()
const { formatDate } = useTimestamp()

//歌单信息
const musicListInfo = computed<MusicListInfo[]>(() => {
    //歌单按id升序排列
    const newMusicIdList = myMusicIdList.value.sort((a, b) => a - b)
    return newMusicIdList.map(id => musicListInfoObj.value[id.toString()]
    ).filter(info => info !== undefined)
})



</script>
<style scoped>
.MusicListDrawer {
    --coverImage: url('../assets/music/music.svg');
}

.title {
    font-size: 18px;
}

.musicDiv {
    padding: 10px 15px;
    text-align: left;

}

.img {
    background-image: var(--coverImage);
    width: 50px;
    height: 50px;
}
</style>
<style>
.el-drawer__header {
    padding: 10px 10px 0 10px;
}
</style>