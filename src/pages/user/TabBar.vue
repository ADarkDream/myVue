<template>
  <div class="tabBar">
    <!--    做一个悬浮菜单按钮-->
    <!--        <div style="position: absolute;bottom: 60px;justify-content: space-evenly;">
                  <div > 123</div>
                   <div > 123</div>
            </div>-->
    <menu ref="menu" class="menu">

      <div :class="index===0? 'menu__item active':'menu__item'" style="--bgColorItem: #ff8c00;"
           @click="clickItem(0)">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M3.8,6.6h16.4"/>
          <path d="M20.2,12.1H3.8"/>
          <path d="M3.8,17.5h16.4"/>
          <!--圆-->
          <!--          <path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z"/>-->
          <!--头-->
          <!--          <path d="M12,10 C10.34,10 9,8.66 9,7 C9,5.34 10.34,4 12,4 C13.66,4 15,5.34 15,7 C15,8.66 13.66,10 12,10 Z"/>-->
          <!--身体-->
        </svg>
      </div>

      <div :class="index===1? 'menu__item active':'menu__item'" style="--bgColorItem: #f54888;"
           @click="clickItem(1)">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1
          C3.9,4.4,4.4,3.9,5.1,3.9z"/>
          <path d="M5.5,20l9.9-9.9l4.7,4.7"/>
          <path
              d="M10.4,8.8c0,0.9-0.7,1.6-1.6,1.6c-0.9,0-1.6-0.7-1.6-1.6C7.3,8,8,7.3,8.9,7.3C9.7,7.3,10.4,8,10.4,8.8z"/>
        </svg>
      </div>


      <div :class="index===2? 'menu__item active':'menu__item'" style="--bgColorItem: #65ddb7;"
           @click="clickItem(2)">
        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <path d="M12,12H20M12,12V20M12,12V4M12,12H4"/>
        </svg>
      </div>

      <div :class="index===3? 'menu__item active':'menu__item'" style="--bgColorItem: #7373fb;"
           @click="clickItem(3)">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M3.4,11.9l8.8,4.4l8.4-4.4"/>
          <path d="M3.4,16.2l8.8,4.5l8.4-4.5"/>
          <path d="M3.7,7.8l8.6-4.5l8,4.5l-8,4.3L3.7,7.8z"/>
        </svg>
      </div>

      <div :class="index===4? 'menu__item active':'menu__item'" style="--bgColorItem:#e0b115;"
           @click="clickItem(4)">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1
          C3.9,4.4,4.4,3.9,5.1,3.9z"/>
          <path d="M4.2,9.3h15.6"/>
          <path d="M9.1,9.5v10.3"/>
        </svg>
      </div>

      <div ref="menuBorder" class="menu__border"></div>

    </menu>
    <!--半圆形背景-->
    <div class="svg-container">
      <svg viewBox="0 0 202.9 45.5">
        <clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)">
          <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7
          c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5
          c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
        </clipPath>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, defineProps, toRefs} from 'vue';

const props = defineProps<{
  change: Function,
  index: number
}>()
const {change} = props
const {index} = toRefs(props)
//元素：tab菜单
const menu = ref(null)
//元素数组：按钮
let menuItems = null


const activeItem = ref(null)
//元素：半圆背景
const menuBorder = ref(null)


//点击按钮触发
const clickItem = (id: number) => {
//重复点击同一个按钮
  if (index.value === id) return
  //跳转路由
  change(id)
  offsetMenuBorder(menuItems![id])
}

//移动半圆背景和显示圆形背景
const offsetMenuBorder = (element: HTMLDivElement) => {

  const offsetActiveItem = element.getBoundingClientRect()
  console.log('menuItems![index.value]', menuItems![index.value])
  console.log('offsetActiveItem', offsetActiveItem)
  const left = Math.floor(offsetActiveItem.left - menu.value.offsetLeft - (menuBorder.value.offsetWidth - offsetActiveItem.width) / 2) + "px"
  menuBorder.value.style.transform = `translate3d(${left}, 0, 0)`
}

onMounted(() => {
  //跳转到某界面
  change(index.value)
  console.log('barindex', index.value)
  //获取按钮元素
  menuItems = menu.value.querySelectorAll(".menu__item");
  console.log('menuItems[index]', menuItems[index.value])
  offsetMenuBorder(menuItems[index.value])

})


watch(() => props.index, (newVal, oldVal) => {
  console.log('index变了');
  if (newVal !== oldVal) offsetMenuBorder(menuItems[index.value])
});

</script>


<style scoped>
/*移动端底部导航栏背景样式*/

/*夜间模式*/
.dark .tabBar {
  --bgColorMenu: #1d1d27;
}

.tabBar {
  --bgColorMenu: #dde0e8; /* #09abab;*/
  --duration: .7s;
  --timeOut: .7s;
  width: 100%;
  display: flex;
  height: auto;
  overflow: visible;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--duration);

}

.menu {
  margin: 0;
  display: flex;
  /* Works well with 100% width  */
  width: 100%;
  font-size: 1.5em;
  padding: 0 2em 0 1em;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: var(--bgColorMenu);
}

.menu__item {
  all: unset;
  flex-grow: 1;
  z-index: 100;
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  align-items: center;
  will-change: transform;
  justify-content: center;
  padding: 0.55em 0 0.85em;
  transition: transform var(--timeOut, var(--duration));
}

.menu__item::before {
  content: "";
  z-index: -1;
  width: 4.2em;
  height: 4.2em;
  border-radius: 50%;
  position: absolute;
  transform: scale(0);
  transition: background-color var(--duration), transform var(--duration);

}


.menu__item.active {
  transform: translate3d(0, -.8em, 0);
}

.menu__item.active::before {
  transform: scale(1);
  background-color: var(--bgColorItem);
}

.icon {
  display: block;
  width: 2.6em;
  height: 2.6em;
  stroke: currentColor;
  fill: transparent;
  stroke-width: 1pt;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
}

.menu__item.active .icon {
  animation: strok 1.5s reverse;
}

@keyframes strok {
  100% {
    stroke-dashoffset: 400;
  }
}

.menu__border {
  left: 0;
  bottom: 99%;
  width: 10.9em;
  height: 2.4em;
  position: absolute;
  clip-path: url(#menu);
  will-change: transform;
  background-color: var(--bgColorMenu);
  transition: transform var(--timeOut, var(--duration));
}

.svg-container {
  width: 0;
  height: 0;
}


@media screen and (max-width: 50em) {
  .menu {
    font-size: .8em;
  }
}
</style>
