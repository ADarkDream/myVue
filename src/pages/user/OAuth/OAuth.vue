<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useOAuth from '@/hooks/user/useOAuth';
//utils
import titleDiv from '@/utils/titleDiv';
import oauth from '@/utils/user/oauth';
//types
import { PostMessageCheck, Step_0 } from '@/types/oauth'


const route = useRoute()
const router = useRouter()
const { to_login_by_qq } = useOAuth()
//全屏加载窗口
const loading = ref()

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
onMounted(async () => {
    const { reffer, display, pathname } = route.query
    console.log(reffer, display);

    if (reffer) {
        toggle_loading()
    } else {//直接访问登录验证地址
        ElMessage.warning('未检测到登录信息')
        setTimeout(() => router.replace({ name: 'home' }), 1000)
    }

    if (reffer === 'qq' && display === 'mobile') {
        //清洗地址栏数据
        const data = oauth.clean_qq_path(route.fullPath)
        //刷新之前需要先清除地址栏参数，否则会重复返回当前页面
        await to_login_by_qq({ ...data, pathname: pathname as string })
        toggle_loading(false)
        // window.postMessage({ role: 'verifier', step: 1, msg: '已通过验证', data: { ...data, reffer } }, import.meta.env.VITE_BASE_IP)
        // window.close()
    }
    window.addEventListener("message", receiveMessage, false)
})

/*postMessage跨域*/
const is_receive = ref(false)
/**
 * 监听窗口通信
 */
const receiveMessage = async (event: MessageEvent) => {
    try {
        console.log('origin', event.origin)
        if (is_receive.value) return
        //非开发环境下，检测来源链接是否属于项目主域名下
        if (!import.meta.env.DEV && !titleDiv.isURLFromDomain(event.origin, import.meta.env.VITE_HOST)) return
        console.log('子窗口收到', event.data)
        const { role, step, data } = event.data as PostMessageCheck
        if (!event.source || role !== 'visitor' || step !== 0) return  //请求者属于visitor，本页面属于 verifier，防止同站循环发送接收

        console.log('获取地址栏信息')
        console.log('origin', event.origin);

        //清洗地址栏数据
        const { access_token, expired_time, type, key } = oauth.clean_qq_path(route.fullPath)

        if (data.type === type && (data as Step_0).key === key) {//验证发信源
            //定时器发送验证信息
            is_receive.value = true
            console.log('验证成功，返回验证', import.meta.env.VITE_BASE_IP)

            //打开父窗口
            const opener = window.opener
            if (opener) opener.postMessage({ role: 'verifier', step: 1, msg: '已通过验证', data: { access_token, expired_time, type, reffer: route.query.reffer } }, import.meta.env.VITE_BASE_IP)
            else console.log('父窗口不存在')
        }
        //移除窗口通信监听
        // removeEventListener('message', receiveMessage)
    } catch (err) {
        console.error('receiveMessage出错了:')
        console.error(err)

        //打开父窗口
        const opener = window.opener
        if (opener) opener.postMessage({ role: 'verifier', step: 1, data: { verify: 0, msg: '登录出错' } }, import.meta.env.VITE_BASE_IP)
        else console.log('父窗口不存在')
        router.back()
        toggle_loading(false)
    }
}
</script>

<style scoped></style>