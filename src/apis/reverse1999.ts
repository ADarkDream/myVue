import { ResultData } from "@/types/global";
import axios from "axios";

//获取版本列表或角色列表
export async function api_getVersion(params: { version?: boolean, role?: 'all' | 'diff' }) {
    const result = await axios<ResultData<{ versionList: VersionInfo[], roleList: Role[] }>>({
        url: '/getVersion',
        params
    })
    console.log('/返回的数据为：', result.data)
    return result.data
}
