import axios from "axios";
import {ResultData} from "@/types/global";
import {SearchResult} from "@/types/music";


const cloudMusic = {
    //搜索
    search: async (s: string, limit = 5, offset = 0) => {
        try {
            const result = await axios<ResultData<SearchResult>>({
                url: '/searchCloudMusic',
                params: {
                    s,//搜索关键词
                    limit,//限制条数
                    offset//偏移量，是5则去掉前5条，是limit的N倍数则为第N页
                }
            })
            console.log(result)
            const {status, msg, data} = result.data
            return data
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
        }
    },


}

export default cloudMusic
