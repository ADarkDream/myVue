<template>
  <div class="forumCenter">
    <!--   文章筛选区-->
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="&ensp;&ensp;&ensp;文章筛选条件">
        <el-form
          :inline="isPC"
          label-position="left"
          :model="articleParams"
          size="small"
        >
          <el-form-item label="文章标题">
            <el-input
              v-model.trim="articleParams.title"
              clearable
              placeholder="填写文章标题"
              :prefix-icon="Search"
              @keyup.enter="getArticleList"
            />
          </el-form-item>
          <el-form-item label="文章作者">
            <el-input
              v-model.trim="articleParams.author"
              clearable
              placeholder="填写作者昵称"
              :prefix-icon="Search"
              @keyup.enter="getArticleList"
            />
          </el-form-item>
          <el-form-item label="发布板块">
            <el-select v-model="articleParams.area" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option label="文章" value="文章" />
              <el-option label="教程" value="教程" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择标签">
            <el-select v-model="articleParams.tags" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option label="散文" value="散文" />
              <el-option label="小说" value="小说" />
              <el-option label="前端" value="前端" />
              <el-option label="教程" value="教程" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <div class="btn">
            <el-button @click="clearForm">重置</el-button>
            <el-button type="primary" @click="getArticleList">查询</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!--文章列表区-->
    <div class="content">
      <div
        v-for="{
          id,
          title,
          coverUrl,
          area,
          tags,
          author,
          created_time,
        } in articleList"
        :key="id"
        class="card"
        @click="toArticle(id, title)"
      >
        <div class="articleCover">
          <el-image
            :src="item.coverUrl"
            fit="cover"
            :draggable="false"
            v-if="item.coverUrl"
            lazy
          >
            <template #error>
              <div class="image-slot">
                <el-icon size="40px">
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div v-else class="image-slot" style="margin: 0 auto">
            <el-icon size="40px">
              <icon-picture />
            </el-icon>
          </div>
        </div>
        <div class="articleInfo">
          <div>
            <el-text size="large" truncated>{{ title }}</el-text>
          </div>
          <div>
            <el-text size="small" tag="sub" truncated
              >板块：{{ area }}&ensp;&ensp;&ensp;标签：{{ tags }}
            </el-text>
          </div>
          <div class="footer">
            <el-text size="small" tag="b" style="width: 30%" truncated>{{
              item.author
            }}</el-text>
            <el-text size="small" truncated>
              &ensp;&ensp;发布于:{{ getDiffTime(item.created_time) }}
            </el-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Search, Picture as IconPicture } from "@element-plus/icons-vue";
//stores
import { useResponsiveStore } from "@/store/useResponsiveStore";
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
//apis
import { api_getArticleList } from "@/apis/article";
//types
import { Article, ArticleParams } from "@/types/articles";

const responsiveStore = useResponsiveStore();

const { isPC } = toRefs(responsiveStore);
const { getDiffTime } = useTimeStamp();

const { setRouterBreadcrumb } = defineProps<{
  setRouterBreadcrumb: Function;
}>();

//路由跳转，前往文章页
const router = useRouter();
const route = useRoute();

const activeNames = ref("1");
// 文章列表查询参数
const articleParams = reactive<ArticleParams>({
  title: "",
  author: "",
  area: "",
  tags: "",
});

//用来接收查询的文章列表
const articleList = ref<Article[]>([]);

// 跳转到文章
const toArticle = (id: number, title: string) =>
  setRouterBreadcrumb(1, { name: "article", label: title, query: { id } });

//获取文章列表
const getArticleList = async () => {
  articleList.value = await api_getArticleList(articleParams);
};

//清除查询表单
function clearForm() {
  articleParams.title = "";
  articleParams.author = "";
  articleParams.area = "";
  articleParams.tags = "";
  // 清除地址栏参数
  router.push({ name: "center" });
  // 重新获取文章列表
  getArticleList();
}

onMounted(async () => {
  //从文章页跳转过来的数据
  const { author, area, tags } = route.query as unknown as Article;
  if (author) articleParams.author = author;
  if (area) articleParams.area = area;
  if (tags) articleParams.tags = tags;
  await getArticleList();
});
</script>
<style scoped>
.el-select {
  min-width: 150px;
}

.content {
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  overflow-x: hidden;
}

.card {
  margin: 10px auto 0;
  padding: 5px;
  width: 90%;
  border-radius: 10px;
  background-color: var(--el-bg-color);
  opacity: 0.9;
}

.image-slot {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gray;
}

@media (max-width: 780px) {
  .content {
    grid-template-columns: 1fr;
  }

  .card {
    width: 90%;
    display: flex;
    justify-content: space-between;
  }

  .articleCover {
    display: inline-block;
    width: 20%;

    img {
      margin: 0;
    }
  }

  .articleInfo {
    display: inline-block;
    width: 75%;
    height: 100%;
    text-align: left;
    margin-left: 5%;
  }
}
</style>
