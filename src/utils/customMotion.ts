/**
 * 此文件是自定义的motion动画
 * https://motion.vueuse.org/features/directive-usage#your-first-v-motion
 * */
export default {
  directives: {
    "pop-bottom": {
      initial: {
        scale: 0,
        opacity: 0,
        y: 100,
      },
      visible: {
        scale: 1,
        opacity: 1,
        y: 0,
      },
    },
  },
}
