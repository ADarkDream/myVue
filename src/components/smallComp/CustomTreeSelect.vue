<!--虚拟化tree组件+ElTags-->
<template>
  <div ref="customTreeSelectRef" class="customTreeSelect" @click="handleClickInside">
    <el-input-tag
      v-model="labelArr"
      class="inputTag"
      clearable
      :placeholder="props.placeholder"
      @input="onInput"
      @remove-tag="onRemoveTag"
      @clear="onClear"
    />

    <ElTreeV2
      v-show="isTreeVisible"
      ref="treeRef"
      class="treeV2"
      :data="treeData"
      show-checkbox
      filterable
      :props="customProps"
      :default-checked-keys="valueArr"
      :render-after-expand="false"
      :filter-method="filterNodeMethod"
      @check="checked"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { ElTreeV2 } from "element-plus"
import type { TreeData, TreeKey, TreeNodeData } from "element-plus/es/components/tree-v2/src/types"
type Info = { checkedKeys: TreeKey[]; checkedNodes: TreeData; halfCheckedKeys: TreeKey[]; halfCheckedNodes: TreeData }

type TreeItem = {
  label: string
  value: any
  children?: TreeItem[]
}

const emit = defineEmits<{
  (event: "updateData", data: { labelArr: string[]; valueArr: number[] }): void
}>()
const props = defineProps({
  tree: { type: Array<TreeItem>, default: [] },
  defaultValueArr: { type: Array<number>, default: [] },
  placeholder: { type: String, default: "请输入" },
})

//自定义树结构
const customProps = {
  label: "label",
  value: "value",
  children: "children",
}
/**树状筛选标签数组 */
const labelArr = ref<string[]>([])
/**树状筛选值数组 */
const valueArr = ref<number[]>([])

const treeRef = ref<InstanceType<typeof ElTreeV2>>()

//名称：id 键值对
const tempMap = {} as Record<string, number>

/**树的数据*/
const treeData = ref<TreeItem[]>([])
// 获取全部图片

//因为子组件比父组件更早渲染，此处用watch监听父组件传过来的数据，然后停止监听
const stopWatch = watch(props, (newVal, oldVal) => {
  treeData.value = newVal.tree
  valueArr.value = newVal.defaultValueArr
  console.log(valueArr.value)

  // treeRef.value!.setCheckedKeys(valueArr.value)
  valueArr.value.forEach((key) => {
    const item = treeRef.value!.getNode(key)
    console.log(item)
  })
  setTimeout(() => {
    labelArr.value = valueArr.value.map((key) => {
      const item = treeRef.value!.getNode(key)
      return item!.label as string
    })
  }, 1000)

  // 有树结构了就关闭监听
  if (treeData.value.length) stopWatch()
})

/**输入时过滤节点*/
const filterNodeMethod = (label: string, data: any) => data.label.includes(label)

/**选择节点*/
const checked = (data: TreeNodeData, info: Info) => {
  tempMap[data.label] = data.value
  const { checkedKeys, checkedNodes } = info
  labelArr.value = checkedNodes.map((x) => x.label)
  valueArr.value = checkedKeys as number[]
  sendToParent()
  console.log("aaa", treeRef.value!.getCheckedKeys())
}

/**移除tag*/
const onRemoveTag = (tag: string) => {
  console.log("移除", tag)
  labelArr.value = labelArr.value.filter((x) => x !== tag)
  treeRef.value!.setChecked(tempMap[tag], false)
  sendToParent()
}

/**清空输入框时*/
const onClear = () => {
  valueArr.value = []
  treeRef.value!.setCheckedKeys([])
  sendToParent()
}

/**输入时过滤树*/
const onInput = (query: string) => {
  treeRef.value!.filter(query)
}

/**将数据返回给父组件*/
const sendToParent = () => {
  const data = {
    labelArr: labelArr.value,
    valueArr: valueArr.value,
  }
  emit("updateData", data)
}

const customTreeSelectRef = ref<HTMLDivElement | null>(null)
const isTreeVisible = ref(false) // 控制树形容器的显示/隐藏

// 处理点击子组件内部
const handleClickInside = (event: MouseEvent) => {
  isTreeVisible.value = true // 切换树形容器的显示状态
  event.stopPropagation() // 阻止事件冒泡，避免外部点击时触发隐藏
}

// 处理点击其他地方时隐藏树形容器
const handleClickOutside = (event: MouseEvent) => {
  console.log("customTreeSelect面板监听中")

  if (!customTreeSelectRef.value) return
  if (!customTreeSelectRef.value.contains(event.target as Node)) {
    isTreeVisible.value = false
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

// 组件销毁前移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style scoped>
.customTreeSelect {
  position: relative;
  width: 100%;
  max-width: 300px;
  text-align: left;

  .inputTag {
    overflow: hidden;
  }

  .treeV2 {
    position: absolute;
    border-radius: 5px;
    padding: 2px 0;
    top: 35px;
    left: 0;
    right: 0;
    height: 200px;
    z-index: 100;
  }
}
</style>
