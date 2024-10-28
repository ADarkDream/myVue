import { ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import type { Token } from "@/types/user";
import { jwtDecode } from "jwt-decode";

export default function () {
    const userInfoStore = useUserInfoStore()
    const { token, token_admin, token_user } = toRefs(userInfoStore)

    //检查newToken是管理员的还是用户的
    function setTokenByType(newToken: string) {
        console.log('得到了newToken', newToken);
        if (!newToken) return ElMessage.info('newToken不存在')
        if (newToken === token.value) return
        const tokenInfo: Token = jwtDecode(newToken)
        if (tokenInfo.value.isAdmin === '1') {
            token_admin.value = newToken
        } else token_user.value = newToken
    }

    return { setTokenByType }
}
