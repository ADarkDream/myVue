import { ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "@/store/user/useUserInfoStore";


export default function () {
    const userInfoStore = useUserInfoStore()
    const { token, token_admin, token_user } = toRefs(userInfoStore)


    return {}
}
