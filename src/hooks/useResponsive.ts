import {ref} from "vue";
import {useRouter} from "vue-router";

export default function () {
    const router = useRouter()
    const screenWidth = ref<number>(document.body.clientWidth)
    const screenHeight = ref<number>(window.innerHeight)
    const isPC = ref<boolean>(screenWidth.value > 980)
    //容器高度
    const containerHeight = ref<number>( isPC.value? (screenHeight.value - 80): (screenHeight.value - 40))
    const isDark = ref<boolean>(sessionStorage.getItem('isDark') === '1' || false)
    const isHome = ref<boolean>(router.currentRoute.value.path === '/')
    const isForum = ref<boolean>(!!router.currentRoute.value.path.concat('/forum'))
    //控制PC和手机的dialog宽度
    const dialogWidth = ref<string>(isPC.value ? '50%' : '90%')
    const dialogWidth2 = ref<string>(isPC.value ? '40%' : '80%')
    //elSize已经在main.ts中定义了，可删除
    const elSize = ref<string>(isPC.value ? 'default' : 'small')
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
            containerHeight.value = screenHeight.value - 40
        } else {
            console.log('当前是PC')
            isPC.value = true
            dialogWidth.value = '50%'
            dialogWidth2.value = '40%'
            elSize.value = 'default'
            containerHeight.value = screenHeight.value - 80
        }
    }

    //是否允许页面纵向滚动,仅限PC端,true为允许，false溢出隐藏，null清除样式
    function isScroll(flag?) {
        const bodyStyle = document.querySelector('body').style
        if (flag) {  /*全局样式，当前页面及子页面在PC端禁止滚动*/
            bodyStyle.overflowY = 'visible'
            // bodyStyle.overflowX = 'hidden'
        } else if (flag === null) {
            bodyStyle.overflowY = ''
            // bodyStyle.overflowX = ''
        } else {//false溢出隐藏
            bodyStyle.overflowY = 'hidden'
            // bodyStyle.overflowX = 'hidden'
        }
    }

    // 向外暴露
    return {
        screen,
        isScroll,
        screenWidth,
        screenHeight,
        containerHeight,
        isPC,
        isDark,
        isHome,
        isForum,
        dialogWidth,
        dialogWidth2,
        elSize
    }
}
