<template>

</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useOAuth from '@/hooks/user/useOAuth';

import titleDiv from '@/utils/titleDiv';
import config from '@/config';
import { CallbackOAuth, QQOAuthCheck } from '@/types/oauth'
import oauth from '@/utils/user/oauth';

const route = useRoute()
const router = useRouter()

const loading = ref()


const OAuthCheck = reactive<QQOAuthCheck>({ origin: config.host, type: '', key: '' })


/**
 * 开关全屏加载界面
 * @param is_loading 
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
 * 窗口通信验证并登录/绑定
 * @param param0 
 */
const to_login_qq = async ({ access_token, expired_time, type }: CallbackOAuth) => {
    try {
        console.log('to_login_qq');

        if (type === 'login') {//通过OAuth 登录
            const flag = await oauth.login_by_qq(access_token, expired_time)

            window.postMessage({ role: 'verifier', step: 1, data: { verify: flag ? 1 : 0, msg: '登录' + flag ? '成功' : '失败' } }, config.host)

        } else if (type === 'connect') {//通过OAuth 绑定邮箱
            ElMessage.info('绑定')
            // Todo 绑定函数


        }
    } catch (err) {
        throw Error('to_login_qq出错了:')
    }
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
        ElMessage.warning('未检测到登录信息，即将返回主页')
        setTimeout(() => router.replace({ name: 'home' }), 1500)
    }
})






/*postMessage跨域*/

/**
 * 监听窗口通信
 */
const receiveMessage = (event: MessageEvent) => {
    try {
        if (!titleDiv.isURLFromDomain(event.origin, config.host)) return


        const { role, step, data } = event.data

        if (!event.source || role !== 'visitor') return  //请求者属于visitor，本页面属于 verifier，防止同站循环发送接收

        if (step === 0) {//初次接收验证信息

            const { type, key } = data
            OAuthCheck.key = key
            OAuthCheck.type = type
            console.log('验证成功')
            window.postMessage({ role: 'verifier', step: 0, data: { msg: '已接受到验证' } }, config.host)
            //移除窗口通信监听
            removeEventListener('message', receiveMessage)
            if (route.query.reffer === 'qq') {
                console.log('当前是QQ鉴权')
                console.log('获取地址栏信息，发送到服务器注册或登录');

                const OAuthData = oauth.clean_qq_path(route.fullPath)

                if (OAuthCheck.type === OAuthData.type && OAuthCheck.key === OAuthData.key) {//验证发信源
                    console.log('前往登录');
                    to_login_qq(OAuthData)
                }
            }
        }
    } catch (err) {
        console.error('receiveMessage出错了:')
        console.error(err)
        window.postMessage({ role: 'verifier', step: 1, data: { verify: 0, msg: '登录失败' } }, config.host)
        router.back()
    }
}
</script>

<style scoped>
.el-container {
    /*  background-color: rgba(176, 163, 149, 255)*/
    background: var(--el-color-primary-light-9);
}
</style>