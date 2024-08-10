import {reactive, ref} from "vue";
import {jwtDecode} from "jwt-decode";
import {ElMessage} from "element-plus";
import {useBaseUrlStore} from '@/store/useBaseUrlStore'

export default function () {
    const baseUrl = useBaseUrlStore()
    //获取本地存储的用户信息userInfo中的数据
    const imageSrc = baseUrl.qiniuHttpsUrl + '/headImg/hutao_%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%94%BB%E5%B8%88Love715_1714496199477.png'
    let userInfo = reactive(getLocalUserInfo('userInfo'))
    if (userInfo.headImgUrl === '') userInfo.headImgUrl = imageSrc
    let uid = ref(userInfo.uid)
    let email = ref(userInfo.email)
    let username = ref(userInfo.username)
    let signature = ref(userInfo.signature)
    let headImgUrl = ref(userInfo.headImgUrl)
    let bgUrl = ref(userInfo.bgUrl)
    let isLogin = ref(false)
    let isAdmin = ref(sessionStorage.getItem('isAdmin') === '1' || false)


    //图像错误显示备用图

    function getLocalUserInfo(key: string) {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || JSON.parse(localStorage.getItem('userInfo')) || {
            email: '',
            signature: '',
            uid: '',
            username: '',
            bgUrl: '',
            headImgUrl: imageSrc
        }
        if (key === 'userInfo') return userInfo
        if (key === 'email') return userInfo.email
        if (key === 'username') return userInfo.username
        if (key === 'headImgUrl') return userInfo.headImgUrl
        if (key === 'bgUrl') return userInfo.bgUrl
        if (key === 'signature') return userInfo.signature
    }

    //批量更新本地userInfo中的数据
    function updateLocalUserInfo(newUserInfo) {
        isAdmin.value = ref(sessionStorage.getItem('isAdmin') === '1' || false)
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
            email: '',
            signature: '',
            uid: '',
            username: '',
            bgUrl: '',
            headImgUrl: ''
        }
        Object.keys(newUserInfo).forEach(key => {
            userInfo[key] = newUserInfo[key]
        })
        console.log('userInfo', userInfo)
        console.log('newUserInfo', newUserInfo)
        if (isAdmin.value) sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        else localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }

    //检查本地token是否过期

    checkLocalToken()

    function checkLocalToken() {
        //true为未过期，false为过期
        const token = sessionStorage.getItem('token') || '' || localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            sessionStorage.setItem('isLogin', '0')
            isLogin.value = false
            return false
        }
        const tokenInfo = jwtDecode(token)
        // ((tokenInfo.exp * 1000 - Date.now() ) / 60000).toFixed()  //距离token过期剩余时间
        if (tokenInfo.exp * 1000 - Date.now() <= 0) {
            ElMessage.error('token已过期，请重新登录')
            sessionStorage.setItem('isLogin', '0')
            localStorage.removeItem('token') //清除过期的token
            localStorage.removeItem('userInfo')//清除过期的用户信息
            isLogin.value = false
            return false
        } else {
            sessionStorage.setItem('isLogin', '1')
            isLogin.value = true
            return true
        }
    }

    const errorFlag = ref(false)//头像错误标志

    //头像加载错误(链接不对或被屏蔽)
    function errorImage(e: Event) {
        e.preventDefault(); // 阻止默认的图片错误行为
        e.stopPropagation(); // 阻止事件冒泡
        headImgUrl.value = imageSrc; // 替换图片源为备用图片
        console.log('errorImg', imageSrc)
        if (!errorFlag.value) {//防止多个报错
            ElMessage.error('头像无法加载，已替换为默认头像。请尝试刷新或更换头像')
            ElMessage.info('原因：服务器错误；或已被管理员删除')
            errorFlag.value = true
            setTimeout(() => errorFlag.value = false, 1000)
        }

    }

    // 向外暴露
    return {
        getLocalUserInfo,
        updateLocalUserInfo,
        checkLocalToken,
        errorImage,
        userInfo,
        uid,
        username,
        email,
        signature,
        headImgUrl,
        bgUrl,
        isLogin,
        isAdmin,
        imageSrc
    }
}

