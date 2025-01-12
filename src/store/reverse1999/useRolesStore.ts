// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from "vue";

import { useUserInfoStore } from '../user/useUserInfoStore';
import myFunction from '@/utils/myFunction';


// 定义并暴露一个store
export const useRolesStore = defineStore('1999_roles', () => {
    const userInfoStore = useUserInfoStore()
    const { isLogin, uid } = toRefs(userInfoStore)
    const { deepClone } = myFunction


    const isLoading = ref(false)

    /**true编辑状态，false是增加角色*/
    const isEdit = ref(false)

    /**要是否显示面板*/
    const isShowAddRoleDrawer = ref(false)

    /**如果是编辑，保留编辑前的信息*/
    const oldFormData = ref<Role>({
        id: 1999,
        name: "",
        camp: "",
        race: "",
        otherTags: "",
    })

    /**当前编辑的角色信息*/
    const formData = ref<Role>({
        id: 1999,
        name: "",
        camp: "",
        race: "",
        otherTags: "",
    })

    /** 重置formData和编辑标记*/
    const reSetFormData = () => {
        oldFormData.value = {
            id: 1999,
            name: "",
            camp: "",
            race: "",
            otherTags: "",
        }
        formData.value = oldFormData.value
        isEdit.value = false
    }

    /**显示和隐藏添加角色的抽屉*/
    const toggleAddRoleDrawer = (isShow = true, editRole?: Role) => {
        isShowAddRoleDrawer.value = isShow
        //如果传递了角色信息，则赋值
        if (isShow && editRole) {
            const { id, name, camp, race, otherTags } = editRole
            //先保留编辑前的信息
            oldFormData.value = {
                id,
                name,
                camp,
                race,
                otherTags
            }
            formData.value = deepClone(oldFormData.value)
            isEdit.value = true
        }
    }



    return { isLoading, isEdit, isShowAddRoleDrawer, oldFormData, formData, reSetFormData, toggleAddRoleDrawer }
})
