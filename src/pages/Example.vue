<template>
  <div v-if="false" class="example">
    <div class="control">
      <el-form :inline="true" :model="resortRule">
        <el-form-item :class="{ checked: !!resortRule.star }" label="星级筛选" prop="star">
          <el-select v-model="resortRule.star" clearable filterable multiple placeholder="选择星级" @change="filterAndSortRoles">
            <el-option v-for="item in options_star" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :class="{ checked: !!resortRule.damageType }" label="伤害类型筛选" prop="damageType">
          <el-select
            v-model="resortRule.damageType"
            clearable
            default-first-option
            filterable
            placeholder="选择伤害类型"
            @change="filterAndSortRoles"
          >
            <el-option v-for="item in options_damageType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序类型" prop="valueType">
          <el-select
            v-model="resortRule.valueType"
            clearable
            default-first-option
            filterable
            placeholder="选择伤害类型"
            @change="filterAndSortRoles"
          >
            <el-option v-for="item in options_valueType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-switch
          v-model="resortRule.isAsc"
          active-text="升序"
          :active-value="true"
          inactive-text="降序"
          :inactive-value="false"
          @change="filterAndSortRoles"
        >
        </el-switch>
      </el-form>
      <form v-if="false" @submit.prevent="filterAndSortRoles">
        <!-- 星级筛选 -->
        <label for="star-select">星级筛选：{{ resortRule.star }}</label>
        <select id="star-select" v-model="star" multiple @change="updateStarSelection">
          <option v-for="item in options_star" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <!-- 伤害类型筛选 -->
        <label for="damageType-select">伤害类型筛选：</label>
        <select id="damageType-select" v-model="resortRule.damageType" @change="filterAndSortRoles">
          <option value="">请选择</option>
          <option v-for="item in options_damageType" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <!-- 排序类型 -->
        <label for="valueType-select">排序类型：</label>
        <select id="valueType-select" v-model="resortRule.valueType" @change="filterAndSortRoles">
          <option value="">请选择</option>
          <option v-for="item in options_valueType" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <!-- 排序方向 -->
        <label for="isAsc-switch">排序方向：</label>
        <input id="isAsc-switch" v-model="resortRule.isAsc" type="checkbox" @change="filterAndSortRoles" />
        <span>{{ resortRule.isAsc ? "升序" : "降序" }}</span>
      </form>
    </div>
    <div class="main">
      <div v-for="(item, index) in showList" :key="item.id" class="role">
        <div class="info">
          <div>
            当前排序：<span class="red">{{ index + 1 }}</span>
          </div>
          <div>ID： {{ item.id }}</div>
          <div>姓名： {{ item.name }}</div>
          <div>星级： {{ item.star }}</div>
          <div :class="{ checked: !!resortRule.damageType }">伤害类型： {{ item.damageType }}</div>
        </div>
        <div class="info">
          <div :class="{ checked: resortRule.valueType === 'attack' }">攻击： {{ item.attack }}</div>
          <div :class="{ checked: resortRule.valueType === 'defense' }">防御： {{ item.defense }}</div>
          <div :class="{ checked: resortRule.valueType === 'life' }">生命： {{ item.life }}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="wrapper">
        <div class="box">
          <div class="box-header">
            <div class="head-img" :style="{ 'background-image': `url(${momo})` }"></div>
            <div>
              <p class="text-title">STORY</p>
              <p>OF THE</p>
              <p>INTERVIEWEE</p>
            </div>
          </div>

          <div class="box-footer">
            <div>
              <p>THE PAST</p>
              <p>AND</p>
              <p>THE FUTURE</p>
            </div>
          </div>
        </div>
      </div>
      <div class="box-shadow"></div>
    </div>
  </div>

  <div>
    <ul id="list">
      <li v-for="(item, index) in items" :key="index" @mouseleave="hideHoverBox" @mouseover="showHoverBox($event, item)">
        {{ item.text }}
      </li>
    </ul>
    <!-- 悬浮显示的盒子 -->
    <div
      v-if="isHoverBoxVisible"
      id="hover-box"
      :style="{
        left: `${hoverBoxPosition.left}px`,
        top: `${hoverBoxPosition.top}px`,
      }"
    >
      {{ hoverContent }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import momo from "/favicon_144x144.png"
type TestRole = {
  /**角色 ID */
  id: string
  /**角色星级 */
  star: number
  /**角色名称 */
  name: string
  /**角色伤害类型 */
  damageType: "现实" | "精神"
  /**角色攻击值 */
  attack: number
  /**角色防御值 */
  defense: number
  /**角色生命值 */
  life: number
}

type ResortRule = {
  star: number[]
  damageType: "现实" | "精神" | ""
  valueType: "attack" | "defense" | "life" | ""
  isAsc: boolean
}

//筛选和排序条件
const resortRule = reactive<ResortRule>({
  star: [],
  damageType: "",
  valueType: "",
  isAsc: true,
})

//星级选项
const options_star = [
  { value: 2, label: "2星" },
  { value: 3, label: "3星" },
  { value: 4, label: "4星" },
  { value: 5, label: "5星" },
  { value: 6, label: "6星" },
]

//伤害类型选项
const options_damageType = [
  { value: "", label: "不限" },
  { value: "现实", label: "现实" },
  { value: "精神", label: "精神" },
]

//数值类型选项
const options_valueType = [
  { value: "", label: "不限" },
  { value: "attack", label: "攻击" },
  { value: "defense", label: "防御" },
  { value: "life", label: "生命" },
]

//原生多选框筛选函数
const star = ref([])

function updateStarSelection() {
  const selectValue = star.value[0]
  const checkedStars = JSON.parse(JSON.stringify(resortRule.star))
  if (checkedStars.includes(selectValue)) {
    checkedStars.splice(checkedStars.indexOf(selectValue), 1)
  } else {
    checkedStars.push(selectValue)
  }
  resortRule.star = checkedStars.filter((item) => item !== undefined).sort((a, b) => a - b)
  console.log(selectValue)

  filterAndSortRoles() // 触发筛选和排序逻辑
}

/**
 * 筛选和排序角色数组
 */
function filterAndSortRoles() {
  showList.value = roles
    .filter((role) => {
      const starMatches = resortRule.star.length === 0 || resortRule.star.includes(role.star) // 如果 star 条件为空，不筛选
      const damageTypeMatches = !resortRule.damageType || role.damageType === resortRule.damageType // 如果 damageType 为空，不筛选
      return starMatches && damageTypeMatches
    })
    .sort((a: any, b: any) => {
      if (a[resortRule.valueType] === b[resortRule.valueType]) {
        return resortRule.isAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id) // ID 升序
      }
      return resortRule.isAsc
        ? a[resortRule.valueType] - b[resortRule.valueType]
        : b[resortRule.valueType] - a[resortRule.valueType] // 数值降序
    })
}

/**示例角色数组*/
const roles: TestRole[] = [
  {
    id: "B1",
    star: 6,
    name: "B1",
    damageType: "精神",
    attack: 320,
    defense: 240,
    life: 1000,
  },
  {
    id: "A2",
    star: 6,
    name: "A2",
    damageType: "精神",
    attack: 400,
    defense: 140,
    life: 2900,
  },
  {
    id: "A3",
    star: 4,
    name: "A3",
    damageType: "精神",
    attack: 320,
    defense: 240,
    life: 600,
  },
  {
    id: "D2",
    star: 3,
    name: "D2",
    damageType: "现实",
    attack: 250,
    defense: 130,
    life: 870,
  },
  {
    id: "B2",
    star: 4,
    name: "B2",
    damageType: "精神",
    attack: 500,
    defense: 240,
    life: 700,
  },
  {
    id: "B3",
    star: 3,
    name: "B3",
    damageType: "精神",
    attack: 320,
    defense: 300,
    life: 900,
  },
  {
    id: "A1",
    star: 5,
    name: "A1",
    damageType: "现实",
    attack: 500,
    defense: 150,
    life: 1000,
  },
  {
    id: "E1",
    star: 2,
    name: "E1",
    damageType: "精神",
    attack: 220,
    defense: 120,
    life: 800,
  },
  {
    id: "C1",
    star: 5,
    name: "C1",
    damageType: "精神",
    attack: 320,
    defense: 140,
    life: 900,
  },
  {
    id: "D1",
    star: 4,
    name: "D1",
    damageType: "现实",
    attack: 280,
    defense: 160,
    life: 950,
  },
]

/**显示的角色数组*/
const showList = ref<TestRole[]>([])

onMounted(() => {
  showList.value = roles
  filterAndSortRoles()
})

// 列表数据
const items = ref([
  { text: "列表项 1", content: "内容 1" },
  { text: "列表项 2", content: "内容 2" },
  { text: "列表项 3", content: "内容 3" },
])

// 状态和位置
const isHoverBoxVisible = ref(false)
const hoverBoxPosition = ref({ left: 0, top: 0 })
const hoverContent = ref("")

// 显示悬浮框
const showHoverBox = (event, item) => {
  const rect = event.target.getBoundingClientRect()
  hoverContent.value = item.content
  hoverBoxPosition.value = {
    left: rect.left,
    top: rect.bottom - 80,
  }
  isHoverBoxVisible.value = true
}

// 隐藏悬浮框
const hideHoverBox = () => {
  isHoverBoxVisible.value = false
}
</script>
<style scoped>
.control {
  width: 100%;
  padding-top: 20px;

  .el-form {
    display: flex;
    justify-content: space-between;
  }

  .el-form-item {
    min-width: 250px;
  }
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.role {
  border: 1px solid #ccc;
  width: 300px;
  margin: 10px auto;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: #ccc 1px dotted;
}

.red {
  color: rgb(239, 95, 95);
}

.checked {
  color: skyblue;
}

.example {
  --line-color: #50473e;
  --border-color: #716455;
  --bg-color: #302f2d;
  --text-color: #48413d;
}

.footer {
  display: flex;
  justify-content: center;
  background-color: #000;
  padding: 50px;
  position: relative;
}

.wrapper {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

.wrapper::after {
  position: absolute;
  content: "";
  left: -20px;
  top: 10px;
  width: 400px;
  height: 400px;
  z-index: 1;
  border: none;
  border-left: solid 5px var(--line-color);
  border-bottom: solid 5px var(--line-color);
  border-bottom-right-radius: 150px;
}

.box {
  position: absolute;
  box-sizing: border-box;
  width: 400px;
  height: 400px;
  z-index: 2;
  border: solid 5px var(--border-color);
  border-bottom-right-radius: 150px;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: left;
  font-size: 20px;
}

.box-header {
  display: grid;
  grid-template-columns: 1fr 2fr 4fr;

  .head-img {
    margin: 10px;
    width: 80px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .text-title {
    padding-top: 5px;
    font-size: 25px;
  }
}

.box-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
}

#list li {
  margin: 5px 0;
  cursor: pointer;
}

#hover-box {
  position: absolute;
  display: inline-block;
  background: white;
  top: 0;
  padding: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
