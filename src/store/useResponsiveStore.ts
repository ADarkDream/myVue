import { defineStore } from "pinia";
import { ref, reactive, type Ref, watch, computed } from "vue";
import { useRouter } from "vue-router";

export const useResponsiveStore = defineStore('responsive', () => {
    const router = useRouter()
    const screenWidth = ref<number>(document.body.clientWidth)
    const screenHeight = ref<number>(window.innerHeight)
    const isPC = ref<boolean>(screenWidth.value > 980)
    //容器高度
    const containerHeight = computed(() => (isPC.value ? (screenHeight.value - 80) : (screenHeight.value - 40)))
    const mainPanelConentHeight = computed(() => screenHeight.value - 100)
    //首次加载，根据是否是深色偏好设置夜间模式
    const isDark = ref<boolean>(sessionStorage.getItem('isDark') === '1' || window.matchMedia('(prefers-color-scheme: dark)').matches || false)
    const isHome = ref<boolean>(true)
    const isForum = ref<boolean>(false)
    const isReverse1999 = ref<boolean>(false)
    const showPlayer = ref(false)
    //控制PC和手机的dialog宽度
    const dialogWidth = ref<string>(isPC.value ? '50%' : '90%')
    const dialogWidth2 = ref<string>(isPC.value ? '40%' : '80%')
    //抽屉高度
    const drawerSize = ref<number>(isPC.value ? screenHeight.value - 70 : screenHeight.value - 30)
    // if (!isPC.value) {
    //     dialogWidth.value = '90%'
    //     dialogWidth2.value = '80%'
    // } else {
    //     dialogWidth.value = '50%'
    //     dialogWidth2.value = '40%'
    // }


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
            containerHeight.value = screenHeight.value - 40
        } else {
            console.log('当前是PC')
            isPC.value = true
            dialogWidth.value = '50%'
            dialogWidth2.value = '40%'
            containerHeight.value = screenHeight.value - 80
        }
    }

    //是否允许页面纵向滚动,仅限PC端,true为允许，false溢出隐藏，null清除样式
    function isScroll(flag?: boolean) {
        const bodyStyle = (document.querySelector('body') as HTMLBodyElement).style
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

    //#region移动端计算滑动距离来实现左右翻页
    //移动端鼠标滑动
    const direction = reactive({
        start_x: 0,
        start_y: 0,
        end_x: 0,
        end_y: 0
    })

    //根据起点终点返回方向 1向上滑动 2向下滑动 3向左滑动 4向右滑动 0点击事件
    function getDirection() {
        const ang_x = direction.end_x - direction.start_x
        const ang_y = direction.end_y - direction.start_y
        let result = 0

        //如果滑动距离太短
        if (Math.abs(ang_x) < 2 && Math.abs(ang_y) < 2) {
            return result
        }

        //获得角度
        const angle = Math.atan2(ang_y, ang_x) * 180 / Math.PI
        if (angle >= -135 && angle <= -45) {
            result = 1
        } else if (angle > 45 && angle < 135) {
            result = 2
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3
        } else if (angle >= -45 && angle <= 45) {
            result = 4
        }
        return result
    }

    //手指接触屏幕
    const touchstart = (e: TouchEvent) => {
        console.log('触摸屏幕')
        direction.start_x = e.touches[0].pageX
        direction.start_y = e.touches[0].pageY
    }
    //计算移动距离并修改activeName
    const positionComputed = (e: TouchEvent, activeName: Ref<number>, minNum = 0, maxNum: number) => {
        direction.end_x = e.changedTouches[0].pageX
        direction.end_y = e.changedTouches[0].pageY
        const flag = getDirection()
        switch (flag) {
            case 0:
                // ElMessage.info("点击！")
                break
            case 1:
                // ElMessage.info("向上！")
                break
            case 2:
                // ElMessage.info("向下！")
                break
            case 3: {
                // ElMessage.info("向左！")
                console.log(activeName.value, '++')
                if (activeName.value < maxNum)
                    activeName.value++

                break
            }
            case 4: {
                console.log(activeName.value, '--')
                // ElMessage.info("向右！")
                if (activeName.value > minNum) activeName.value--
                break
            }
            default:
                // ElMessage.info("点击！")
                break
        }

    }
    //#endregion

    //判断当前页面,改变导航栏的按钮显隐
    // checkRoute(router.currentRoute.value.path)

    function checkRoute(path: string) {
        console.log('检查路由：', path)
        isHome.value = path === '/'
        isForum.value = path.includes('/forum')
        isReverse1999.value = isHome.value || path.includes('/reverse1999')
        //初始不显示，显示之后就不再判断
        if (!showPlayer.value)
            showPlayer.value = path.includes('/music')
    }

    //监听页面调整
    window.addEventListener('resize', () => {
        screen()
    })
    //监听路由变化
    watch(router.currentRoute, (newValue, oldValue) => {
        if (newValue === oldValue) return
        checkRoute(newValue.path)
    })

    // 向外暴露
    return {
        screen,
        isScroll,
        touchstart,
        positionComputed,
        screenWidth,
        screenHeight,
        containerHeight,
        mainPanelConentHeight,
        isPC,
        isDark,
        isHome,
        isForum,
        isReverse1999,
        showPlayer,
        dialogWidth,
        dialogWidth2,
        drawerSize
    }
}, {
    persist: {
        pick: ['isDark'],
        storage: sessionStorage,
    }

})
