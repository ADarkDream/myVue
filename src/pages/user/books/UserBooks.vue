<template>
  <el-container :style="'height:' + containerHeight + 'px'">
    <el-header>
      <el-button type="primary" @click="dialogVisible = true">添加账本</el-button>
    </el-header>
    <el-main>
      <el-empty style="margin: 0 auto" v-if="books.length === 0" description="暂无账本" />
      <el-card class="book" shadow="hover" v-for="(item, index) in books" :key="item.bid" @click="goBook(item.bid)">
        <template #header>
          <el-input v-if="isEditID === item.bid" v-model.trim="newBookInfo.name" maxlength="10" />
          <template v-else>
            <el-text class="title">{{ item.name }}</el-text>
            <el-text class="title" type="success" v-if="!item.key">[协作]</el-text>
            <div @click.stop>
              <el-dropdown class="menu" :trigger="isPC ? 'hover' : 'click'">
                <span>
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(item.bid, index)" :icon="Edit">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="item.key" @click="shareKey(item)" :icon="Share">分享
                    </el-dropdown-item>
                    <el-dropdown-item @click="updateBook(true, index)" :icon="Delete">删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

          </template>
        </template>
        <div>
          <el-input v-if="isEditID === item.bid" v-model.trim="newBookInfo.intro" maxlength="30" />
          <el-text v-else>{{ item.intro || '暂无说明' }}</el-text>
        </div>
        <template #footer>
          <el-button-group v-if="isEditID === item.bid" style="margin-top: 5px">
            <el-button type="primary" plain @click.stop="isEditID = 0">取消</el-button>
            <el-button type="success" @click.stop="updateBook(false, index)">保存</el-button>
          </el-button-group>
          <el-text v-else class="footer">{{ getTime(item.updated_time) }}</el-text>
        </template>
      </el-card>
    </el-main>
    <!--账本新建框-->
    <el-dialog v-model="dialogVisible" :width="dialogWidth" :show-close="false" title="新增账本">
      <AddBook :cancelAddBook="cancelAddBook" />
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Delete, Edit, MoreFilled, Share } from "@element-plus/icons-vue";
import axios from "axios";
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks

import useTimestamp from "@/hooks/useTimestamp";
//components
import AddBook from "@/pages/user/books/components/AddBook.vue";
//utils
import myFunction from "@/utils/myFunction";
//types
import { Book } from '@/types/books'

const responsiveStore = useResponsiveStore()
const { dialogWidth, containerHeight, isPC } = toRefs(responsiveStore)
const { getTime } = useTimestamp()

const { deepEqual, copyText } = myFunction
const router = useRouter()

//当前编辑的账本bid
const isEditID = ref(0)
//账本列表
const books: Book[] = reactive([])
//旧的账本信息
const bookInfo = ref<Book>({
  bid: 0,
  name: '',
  intro: '',
  updated_time: '',
})
//新的账本信息
const newBookInfo = ref<Book>({
  bid: 0,
  name: '',
  intro: '',
  updated_time: '',
})
//是否显示账本添加框
const dialogVisible = ref(false)


//获取账本列表
const getBooks = async () => {
  try {
    const result = await axios({ url: '/myBooks' })
    console.log(result)
    const { data } = result.data
    books.splice(0, books.length, ...data)

  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//更新账本信息或删除
const updateBook = async (isDelete = false, index: number) => {
  try {
    if (!isDelete && deepEqual(newBookInfo.value, bookInfo.value)) {//没有修改
      isEditID.value = 0
      return ElMessage.info('未检测到修改,已取消更新')
    }
    const { name, intro } = newBookInfo.value//解构出要上传的数据
    const result = await axios({
      url: '/updateBook',
      method: 'post',
      data: {
        bid: books[index].bid,
        name: isDelete ? undefined : name,
        intro: isDelete ? undefined : intro,
        status: isDelete ? 1 : undefined
      }
    })
    console.log(result)
    const { msg } = result.data
    ElMessage.success(msg)
    //删除账本
    if (isDelete) books.splice(index, 1)
    else   //修改账本信息
      books[index] = Object.assign(books[index], { ...newBookInfo.value, updated_time: Date.now() })
    //退出编辑
    isEditID.value = 0
  } catch (error) {
    console.log('发生错误：')
    console.dir(error)
  }
}

//进入编辑界面
const handleEdit = (bid: number, index: number) => {
  isEditID.value = bid
  bookInfo.value = Object.assign(bookInfo.value, books[index])
  newBookInfo.value = Object.assign(newBookInfo.value, books[index])
}

//添加账本并关闭窗口
const cancelAddBook = (val?: Book) => {
  if (val) {
    books.push(val)
  }
  dialogVisible.value = false
}

//分享功能
const shareKey = (bookInfo: Book) => copyText(`【默默的小站】注册登陆之后可前往https://muxidream.cn/user/books加入协作账本【${bookInfo.name}】，账本ID：${bookInfo.bid}，协作码：${bookInfo.key},协作码仅一次有效。`, '账本ID和协作码')

//前往账单列表
const goBook = (bid: number) => {
  console.log(isEditID.value)
  if (isEditID.value !== 0) return
  else {
    router.push({ name: 'book', query: { bid } })
    // ElMessage.success(`即将前往账本：${bid}`)
  }
}


onMounted(async () => {
  await getBooks()
})
</script>

<style scoped>
.el-header {
  height: auto;
  padding-top: 5px;
  margin-bottom: 5px;
}

.el-main {
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
}



/*账本信息卡片*/
.book {
  position: relative;
  border-radius: 5px;
  width: 150px;
  background: linear-gradient(45deg, #ffb30066, #ffb300a5);
  margin: 5px 15px 0 15px;
  max-height: 180px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.menu {
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
}

.el-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 780px) {
  .el-main {
    justify-content: space-between;
  }

  .book {
    width: 150px;
    margin: 5px;
    flex-shrink: 0.5;
  }


  .el-card :deep(.el-card__body),
  :deep(.el-card__header),
  :deep(.el-card__footer) {
    padding: 5px;
  }


  .footer {
    font-size: 11px
  }


}
</style>
