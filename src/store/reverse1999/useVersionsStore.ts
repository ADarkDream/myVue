// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { ref, toRefs } from "vue";
import { useReverse1999Store } from './useReverse1999Store'


// 定义并暴露一个store
export const useVersionsStore = defineStore('1999_versions', () => {
    const reverse1999Store = useReverse1999Store()
    const { versionInfo } = toRefs(reverse1999Store)

    const isLoading = ref(false)

    /**最新版本号*/
    const latestVersionIndex = computed(() => {
        const v_arr = versionInfo.value
        const num = v_arr[v_arr.length - 1]?.version
        return num + 1 //? num + 1 : 10
    })

    /**true编辑状态，false是增加版本*/
    const isEdit = ref(false)
    const isDisabled = ref(false)

    /**要是否显示面板*/
    const isShowAddVersionDrawer = ref(false)

    /**如果是编辑，保留编辑前的信息*/
    const oldFormData = ref<AddVersionParams>({
        id: 0,
        versionName: '',
        halfText: '',
        halfName: '',
        version: latestVersionIndex.value,
        time: [],
        status: 1
    })

    /**当前编辑的版本信息*/
    const formData = ref<AddVersionParams>({
        id: 0,
        versionName: '',
        halfText: '',
        halfName: '',
        version: latestVersionIndex.value,
        time: [],
        status: 1
    })


    /**修改版本数值时触发，修改版本信息formData*/
    const handleChange = (currentVersion = formData.value.version) => {
        const info = versionInfo.value.find(item => item.version === currentVersion)

        //存在版本信息时，不允许添加
        isDisabled.value = !!info && !isEdit.value

        if (info && isEdit.value) {
            //编辑已存在的版本信息
            const { id, versionName, time, status } = info
            formData.value.id = id || 0
            formData.value.versionName = versionName || ''
            formData.value.halfName = versionName.split('_')[1] || ''
            formData.value.time = time || [],
                formData.value.status = status || 1
            oldFormData.value = { ...formData.value }
            // isEdit.value = true
        }
        // else {
        //     currentVersion = oldFormData.value.version
        //     formData.value.version = currentVersion
        // }

        formData.value.halfText = currentVersion ? ("V" + (currentVersion / 10).toFixed(1) + "_") : ''
    }

    /** 重置formData和编辑标记*/
    const reSetFormData = () => {
        oldFormData.value = {
            id: 0,
            versionName: '',
            halfText: '',
            halfName: '',
            version: latestVersionIndex.value,
            time: [],
            status: 1
        }
        formData.value = { ...oldFormData.value }
        // isEdit.value = false
    }

    /**显示和隐藏添加版本的抽屉*/
    const toggleAddVersionDrawer = (isShow = true, editVersion?: VersionInfo) => {
        isShowAddVersionDrawer.value = isShow
        //如果传递了版本信息，则赋值
        if (isShow && editVersion) {
            const { id, versionName, version, time } = editVersion
            //先保留编辑前的信息
            oldFormData.value = { id, versionName, halfText: '', halfName: '', version, time }
            formData.value = { ...oldFormData.value }
            isEdit.value = true
        } else isEdit.value = false
        if (isShow) handleChange(formData.value.version)
    }


    return { isLoading, isEdit, isDisabled, isShowAddVersionDrawer, oldFormData, formData, reSetFormData, toggleAddVersionDrawer, handleChange }
})
