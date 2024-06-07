import axios from "axios";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

export default function () {
    const screenWidth = ref(document.body.clientWidth)
    const screenHeight = ref(window.innerHeight)
    const isPC = ref(screenWidth.value > 980)
    //控制PC和手机的dialog宽度
    let dialogWidth = ref(isPC.value ? '50%' : '90%')
    let dialogWidth2 = ref(isPC.value ? '40%' : '80%')
    console.log(screenHeight.value)

    if (!isPC.value) {
        dialogWidth.value = '90%'
        dialogWidth2.value = '80%'
    } else {
        dialogWidth.value = '50%'
        dialogWidth2.value = '40%'
    }
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

        } else {
            console.log('当前是PC')
            isPC.value = true
            dialogWidth.value = '50%'
            dialogWidth2.value = '40%'

        }
    }


    // 向外暴露
    return {screen, screenWidth, screenHeight, isPC, dialogWidth, dialogWidth2}
}
