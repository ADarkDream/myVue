import {ref} from "vue";
import {useRouter} from "vue-router";

export default function () {
    const router = useRouter()
    const screenWidth = ref(document.body.clientWidth)
    const screenHeight = ref(window.innerHeight)
    const isPC = ref(screenWidth.value > 980)
    const isDark = ref(sessionStorage.getItem('isDark') === '1' || false)
    const isHome = ref(router.currentRoute.value.path === '/')
    const isForum = ref(!!router.currentRoute.value.path.concat('/forum'))
    //控制PC和手机的dialog宽度
    const dialogWidth = ref(isPC.value ? '50%' : '90%')
    const dialogWidth2 = ref(isPC.value ? '40%' : '80%')
    const elSize = ref(isPC.value ? 'default' : 'small')
    // if (!isPC.value) {
    //     dialogWidth.value = '90%'
    //     dialogWidth2.value = '80%'
    // } else {
    //     dialogWidth.value = '50%'
    //     dialogWidth2.value = '40%'
    // }
    window.addEventListener('resize', () => {
        screen()
    })

    function screen() {
        //获取当前屏幕宽度
        screenWidth.value = document.body.clientWidth
        screenHeight.value = window.innerHeight
        // console.log('宽'+screenWidth.value+'，高'+screenHeight.value)
        //修改dialog框和登录抽屉的宽度
        if (screenWidth.value <= 980) {
            console.log('当前是手机')
            isPC.value = false
            dialogWidth.value = '90%'
            dialogWidth2.value = '80%'
            elSize.value = 'small'
        } else {
            console.log('当前是PC')
            isPC.value = true
            dialogWidth.value = '50%'
            dialogWidth2.value = '40%'
            elSize.value = 'default'
        }
    }

    // 向外暴露
    return {screen, screenWidth, screenHeight, isPC, isDark, isHome, isForum, dialogWidth, dialogWidth2,elSize}
}
