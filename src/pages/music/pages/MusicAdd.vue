<template>
    <div class="musicAdd">
        <div class="bar">
            <el-button class="button" @click="ElMessage.info('功能开发中')"><el-icon>
                    <Upload />
                </el-icon>上传</el-button>
            <el-button class="button" @click="musicSearchStore.isShowSearchPanel = true"><el-icon>
                    <Search />
                </el-icon>搜索网易云音乐曲库</el-button>
            <el-button class="button" @click="getCustomMusicList()"><el-icon>
                    <Refresh />
                </el-icon>刷新</el-button>
        </div>
        <el-form v-model="newMusic" label-width="auto" label-position="top" style="width: 100%;margin-top:20px">
            <el-form-item>
                <template #label>输入歌单id&ensp;<el-icon @click="">
                        <InfoFilled />
                    </el-icon>
                    <Transition name="horizontal_slide">
                        <el-text v-show="true">
                            用户自行上传的歌曲不可见
                        </el-text>
                    </Transition>
                </template>
                <el-row :gutter="24">
                    <el-col :span="18">
                        <el-input v-model.trim.number="cloudMusicListID" placeholder="输入网易云歌单ID或分享链接" />
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="search_song_or_list(cloudMusicListID, false)" type="success" plain>
                            搜索
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="输入音乐ID获取音频链接(仅支持网易云免费音乐)">
                <el-row :gutter="24">
                    <el-col :span="18">
                        <el-input v-model.trim.number="cloudMusicID" placeholder="输入网易云音乐ID或分享链接"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="search_song_or_list(cloudMusicID, true)" type="primary" plain>添加并播放
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="src" label="输入音频链接">
                <el-row :gutter="24">
                    <el-col :span="18">
                        <el-input v-model="musicUrl" placeholder="输入音频链接"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="addMusic(musicUrl)" type="primary" plain>添加并播放</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <!-- <el-text type="danger">用户上传的音乐(此页面高度待调整)</el-text> -->
        <!-- 用户上传的音乐 -->
        <h2>用户上传的音乐</h2>
        <MusicListSongsList :songs-list="customMusicList" :height="350" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from 'element-plus';
import { InfoFilled, Refresh, Search, Upload } from "@element-plus/icons-vue";
//stores
import { useMainPanelConfigStore } from "@/store/useMainPanelConfigStore";
import { useMusicSearchStore } from '@/store/music/useMusicSearchStore';
//hooks
import useMusicPlay from "@/hooks/music/useMusicPlay";
import useMusicList from "@/hooks/music/useMusicList";
//components
import MusicListSongsList from '@/pages/music/components/MusicListSongsList.vue';
//utils
import musicList from '@/utils/music/musicList';
import regex from '@/utils/regexRules';
import musicPlay from '@/utils/music/musicPlay'
//types
import type { CloudSongInfo, SongInfo } from "@/types/music";


const musicSearchStore = useMusicSearchStore()
const mainPanelConfigStore = useMainPanelConfigStore()

const { changePanelIndex } = mainPanelConfigStore

const { addMusicToPlay, addMusic } = useMusicPlay()
const { getCloudMusicList } = useMusicList()
/**
 * 用户上传的公开音乐列表
 */
const customMusicList = ref<CloudSongInfo[]>([])


const newMusic = ref<SongInfo>({
    name: '',
    artists: [{ name: '', pic_url: '' }],
    album: { name: '', pic_url: '' },
    src: ''
})

const cloudMusicListID = ref()
const cloudMusicID = ref()
const musicUrl = ref('')



//校验分享链接或歌单、歌曲id，进行搜索
const search_song_or_list = async (str: string, isSong: boolean) => {
    const id = await musicPlay.getMusicIdByLink(str, isSong)

    //判断id是不是一个正常的正整数
    if (Number.isInteger(id) && id > 0) {
        console.log(isSong ? '检查歌曲' : '检查歌单', ',ID为：', id)
        if (isSong) await addMusicToPlay(id, true)
        else {
            const { status } = await getCloudMusicList({ cloud_music_list_id: id })
            if (status === 0) return
        }
        changePanelIndex(isSong ? 3 : 2)
    } else ElMessage.error(`请输入有效的${isSong ? '歌曲' : '歌单'}id或分享链接`)
}
const getCustomMusicList = async () => {
    customMusicList.value = await musicList.getCustomMusicList() || []
    ElMessage.success('刷新成功')
}
onMounted(async () => {
    customMusicList.value = await musicList.getCustomMusicList() || []
})


</script>
<style scoped>
.musicAdd .bar {
    display: flex;
    justify-content: space-between;
}

/*region 按钮样式 */
.dark .button {
    background-color: transparent;
}

.button {
    --color: #00A97F;
    padding: 0.8em 1.7em;
    background-color: #e9dee7;
    border-radius: .3em;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: .5s;
    font-weight: 400;
    font-size: 17px;
    border: 1px solid;
    font-family: inherit;
    text-transform: uppercase;
    color: var(--color);
    z-index: 1;
}

.button::before,
.button::after {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%);
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    background-color: var(--color);
    transition: 1s ease;
}

.button::before {
    top: -2em;
    left: -2em;
}

.button::after {
    left: calc(100% + 2em);
    top: calc(100% + 2em);
}

.button:hover::before,
.button:hover::after {
    height: 410px;
    width: 410px;
}

.button:hover,
.button:hover .el-icon {
    color: rgb(10, 25, 30)
}

.button:active {
    filter: brightness(.8);
}

/*endregion*/

@media (max-width:780px) {
    .button {
        font-size: 15px;
    }
}
</style>
