<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
//stores
import { useUserInfoStore } from '@/store/user/useUserInfoStore';
//utils
import titleDiv from '@/utils/titleDiv';
import oauth from '@/utils/user/oauth';
//types
import { CallbackOAuth, QQOAuthCheck, PostMessageCheck, Step_0 } from '@/types/oauth'
import config from '@/config';


const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const { updateLocalUserInfo } = userInfoStore

//全屏加载窗口
const loading = ref()


const OAuthCheck = reactive<QQOAuthCheck>({ origin: import.meta.env.VITE_HOST, type: '', key: '' })


/**
 * 开关全屏加载界面
 * @param is_loading -控制开关
 */
const toggle_loading = (is_loading = true) => {
    if (is_loading) {
        loading.value = ElLoading.service({
            lock: true,
            text: 'QQ登录中...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        //设置超时返回倒计时
        // setTimeout(() => {
        //     ElMessage.warning('登录超时')
        //     loading.value.close()
        //     router.replace({ name: 'home' })
        // }, 5000)
    } else loading.value.close()
}




/**
 * 判断是否是登录跳转
 */
onMounted(() => {
    const { reffer } = route.query

    if (reffer) {
        toggle_loading()
        window.addEventListener("message", receiveMessage, false)
    }
    else {
        ElMessage.warning('未检测到登录信息')
        setTimeout(() => router.replace({ name: 'home' }), 1000)
    }

    // setTimeout(() => {
    //     ElMessage.warning('登录超时')
    //     router.replace({ name: 'home' })
    // }, 1000)
})


/**
 * 出错，关闭窗口或返回
 */
const is_error = () => {
    try {
        window.postMessage({ role: 'verifier', step: 1, data: { verify: 0, msg: '登录出错' } }, import.meta.env.VITE_HOST)
        router.back()
        toggle_loading(false)
    } catch (err) {
        console.error('is_error出错了:')
        console.error(err)
    }
}


/**
 * reffer=qq
 * 窗口通信验证并登录/绑定
 */
const to_qq_oauth = async () => {
    try {
        console.log('当前是QQ鉴权')
        console.log('获取地址栏信息')
        //清洗地址栏数据
        const { access_token, expired_time, type, key } = oauth.clean_qq_path(route.fullPath)

        if (OAuthCheck.type === type && OAuthCheck.key === key) {//验证发信源

            console.log('发送到服务器,前往' + config.oauth_type[type])
            //登录、绑定或注册
            const { flag, userInfo, msg } = await oauth.qq_oauth(access_token, expired_time, type)
            //登录
            if (flag && userInfo) {
                updateLocalUserInfo(userInfo)
                //成功提示信息
                ElMessage.success(`用户 ${userInfo.username} 登录成功`)
            } else if (flag) ElMessage.success(msg)
            window.postMessage({ role: 'verifier', step: 1, data: { verify: flag ? 1 : 0, msg: config.oauth_type[type] + (flag ? '成功' : '失败') } }, import.meta.env.VITE_HOST)
        }
    } catch (err) {
        console.error('to_qq_oauth出错了:')
        console.error(err)
        is_error()
    }
}


/*postMessage跨域*/

/**
 * 监听窗口通信
 */
const receiveMessage = async (event: MessageEvent) => {
    try {
        if (!titleDiv.isURLFromDomain(event.origin, import.meta.env.VITE_HOST)) return

        const { role, step, data } = event.data as PostMessageCheck
        if (!event.source || role !== 'visitor') return  //请求者属于visitor，本页面属于 verifier，防止同站循环发送接收



        if (step === 0) {//初次接收验证信息
            const { type, key } = data as Step_0
            console.log(event.data)
            OAuthCheck.key = key
            OAuthCheck.type = type
            console.log('验证成功')
            window.postMessage({ role: 'verifier', step: 0, data: { msg: '已接受到验证' } }, import.meta.env.VITE_HOST)
            //移除窗口通信监听
            removeEventListener('message', receiveMessage)
            if (route.query.reffer === 'qq') await to_qq_oauth()
        }
    } catch (err) {
        console.error('receiveMessage出错了:')
        console.error(err)
        is_error()
    }
}
</script>

<style scoped>
.el-container {
    /*  background-color: rgba(176, 163, 149, 255)*/
    background: var(--el-color-primary-light-9);
}
</style>