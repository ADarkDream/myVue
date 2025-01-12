// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive, ref, toRef, toRefs, watch } from "vue";

import { useUserInfoStore } from '../user/useUserInfoStore';
import { useReverse1999Store } from './useReverse1999Store'
import myFunction from '@/utils/myFunction';


// 定义并暴露一个store
export const useVersionsStore = defineStore('1999_versions', () => {
    const userInfoStore = useUserInfoStore()
    const reverse1999Store = useReverse1999Store()
    const { isLogin, uid } = toRefs(userInfoStore)
    const { versionInfo } = toRefs(reverse1999Store)
    const { deepClone } = myFunction


    const isLoading = ref(false)

    /**最新版本号*/
    const latestVersionIndex = computed(() => (versionInfo.value[versionInfo.value.length - 1].version + 1))

    /**true编辑状态，false是增加版本*/
    const isEdit = ref(false)

    /**要是否显示面板*/
    const isShowAddVersionDrawer = ref(false)

    /**如果是编辑，保留编辑前的信息*/
    const oldFormData = ref<AddVersionParams>({
        index: 0,
        versionName: '',
        halfText: '',
        halfName: '',
        version: latestVersionIndex.value,
        time: []
    })

    /**当前编辑的版本信息*/
    const formData = ref<AddVersionParams>({
        index: 0,
        versionName: '',
        halfText: '',
        halfName: '',
        version: latestVersionIndex.value,
        time: []
    })


    /**修改版本数值时触发，修改版本信息formData*/
    const handleChange = (currentVersion = formData.value.version) => {
        const info = versionInfo.value.find(item => item.version === currentVersion)
        formData.value.halfText = "V" + (currentVersion / 10).toFixed(1) + "_"
        //还未添加的版本信息
        if (!info) {
            isEdit.value = false
            formData.value.versionName = ''
            return
        }
        //已存在的版本信息
        const { versionName, time } = info

        formData.value.versionName = versionName || ''
        formData.value.halfName = versionName.split('_')[1] || ''
        formData.value.time = time || []
        isEdit.value = true
    }

    /** 重置formData和编辑标记*/
    const reSetFormData = () => {
        oldFormData.value = {
            index: 0,
            versionName: '',
            halfText: '',
            halfName: '',
            version: latestVersionIndex.value,
            time: []
        }
        formData.value = { ...oldFormData.value }
        isEdit.value = false
    }

    /**显示和隐藏添加版本的抽屉*/
    const toggleAddVersionDrawer = (isShow = true, editVersion?: VersionInfo) => {
        isShowAddVersionDrawer.value = isShow
        //如果传递了版本信息，则赋值
        if (isShow && editVersion) {
            const { index, versionName, version, time } = editVersion
            //先保留编辑前的信息
            oldFormData.value = { index, versionName, halfText: '', halfName: '', version, time }
            formData.value = { ...oldFormData.value }
            isEdit.value = true
        }
        if (isShow) handleChange(formData.value.version)
    }


    return { isLoading, isEdit, isShowAddVersionDrawer, oldFormData, formData, reSetFormData, toggleAddVersionDrawer, handleChange }
})
