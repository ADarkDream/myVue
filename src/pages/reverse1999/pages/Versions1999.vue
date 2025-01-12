<template>
    <div>
        <div>
            <el-button type="primary" size="default" @click="toggleAddVersionDrawer(true)">新增版本信息</el-button>
            <el-button type="success" plain @click="refreshVersion()">刷新</el-button>
        </div>
        <el-text tag="p" type="warning">如有错漏还请向我反馈。注册登录之后可编辑。</el-text>
        <el-table ref="tableRef" class="myCustomElTable" :data="tableData"
            :max-height="isPC ? (screenHeight - 240) : (screenHeight - 180)" stripe flexible border
            highlight-current-row table-layout="auto">
            <el-table-column prop="index" label="序号" min-width="50" align="center" />
            <el-table-column prop="versionName" label="版本名称" min-width="140" align="center">
                <template #default="scope">
                    <div v-if="isEditRow === scope.$index">
                        <el-input v-model="newInfo.versionName" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="version" label="版本值" min-width="50" align="center">
                <template #default="scope">
                    <template v-if="isEditRow === scope.$index">
                        <el-select placeholder="选择阵营" v-model="newInfo.version" default-first-option>
                            <el-option v-for="{ name, count } in campInfo" :key="name" :label="name + '[' + count + ']'"
                                :value="name" />
                        </el-select>
                    </template>
                    <template v-else>
                        {{ scope.row.version }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="官方上传时间" min-width="130" align="center">
                <template #default="scope">
                    <div style="display: flex;justify-content: center;flex-wrap: wrap;">
                        <el-tag style="margin: 2px;" type="primary" v-for="(time, index) in scope.row.time"
                            :key="time">{{ time }}</el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="100" align="center" :fixed="isPC ? 'right' : false">
                <template #default="scope">
                    <div v-if="isEditRow !== scope.$index">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"
                            :disabled="!canEdit(scope.row.status)">编辑</el-button>
                        <el-button link type="danger" size="small" :disabled="!canDel(scope.row.status)"
                            @click="deleteRow(scope.$index, scope.row.id)">
                            删除
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button link type="info" size="small" @click="exit_edit()">取消
                        </el-button>
                        <el-button link type="primary" size="small" @click.prevent="checkUpdateRow(newInfo, scope.row)">
                            更新
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑版本信息的抽屉-->
        <el-drawer v-model="isShowAddVersionDrawer" :title="isEdit ? '编辑版本信息' : '添加版本信息'" :show-close="false"
            direction="btt" :append-to-body="true" size="40%" @close="reSetFormData()"
            :before-close="beforeCloseDrawer">
            <AddVersion />
        </el-drawer>
    </div>
</template>


<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import type { TableInstance } from "element-plus";
import { Search, Refresh } from "@element-plus/icons-vue";
//stores
import { useUserInfoStore } from "@/store/user/useUserInfoStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store'
import { useRolesStore } from '@/store/reverse1999/useRolesStore';
import { useVersionsStore } from '@/store/reverse1999/useVersionsStore';
//hooks
import useTimeStamp from "@/hooks/useTimestamp";
import useReverse1999 from '@/hooks/reverse1999/useReverse1999';
//components
const AddVersion = defineAsyncComponent(() => import('../components/AddVersion.vue'))
//utils
import myFunction from "@/utils/myFunction";
import fileProcess from "@/utils/fileProcess";
//types

//files


const router = useRouter()
const userInfoStore = useUserInfoStore()
const responsiveStore = useResponsiveStore()
const reverse1999Store = useReverse1999Store()
const versionsStore = useVersionsStore()
const { allRoleInfo, versionInfo, campInfo, raceInfo, statusOptions } = toRefs(reverse1999Store)
const { toggleAddRoleDrawer } = useRolesStore()
const { isShowAddVersionDrawer, isEdit } = toRefs(versionsStore)
const { toggleAddVersionDrawer, reSetFormData } = versionsStore
const { getTime } = useTimeStamp()
const { diffObj } = myFunction
const { getVersion, updateRole } = useReverse1999()



//屏幕高度
const { screenHeight, isPC } = toRefs(responsiveStore)
const { isAdmin, isLogin } = toRefs(userInfoStore)

const tableRef = ref<TableInstance>()

//添加角色面板的显示与隐藏
const dialogVisible = ref(false)
//表格内的数据（添加序号）
const tableData = computed(() => versionInfo.value.map((item, index) => ({ index, ...item })))





const oldInfo = ref<VersionInfo>({
    index: 0,
    versionName: '',
    version: 0,
    time: []
})



const newInfo = ref<VersionInfo>({
    index: 0,
    versionName: '',
    version: 0,
    time: []
})


//编辑标记
const isEditRow = ref<number>(-1)

//编辑角色信息(修改编辑标记)
const handleEdit = (index: number, row: VersionInfo) => {
    if (!isLogin.value) return ElMessage.warning('注册登录后可编辑')
    if (isPC.value) {//PC端在表格上修改
        isEditRow.value = index
        newInfo.value = Object.assign(newInfo.value, row)
    } else {//移动端用抽屉修改
        toggleAddVersionDrawer(true, row)
    }
}

//还原编辑标记
const exit_edit = () => {
    isEditRow.value = -1
}

//对上传的数据进行格式检查
const checkUpdateRow = async (newData: VersionInfo, oldData: VersionInfo) => {
    const data = <VersionInfo>diffObj(newData, oldData)
    //判断角色信息是否修改
    if (Object.keys(data).length === 0) return ElMessage.info('角色信息未修改，已取消上传。')
    else {
        //uid被洗掉了，手动添加
        // await updateRole({ ...data, id: newData.id })
        //去除编辑标记
        exit_edit()
    }
}


//角色是否可编辑
const canEdit = (status: number) => {
    // if (!isLogin.value) return false
    // else
    if (isAdmin.value) return true
    else if (status === 1 || status === 2) return true
    else return false
}

//角色是否可删除
const canDel = (status: number) => {
    if (status === 0) return false
    else if (!isLogin.value) return false
    else if (isAdmin.value) return true
    else if (status === 1 || status === 3) return true
    else return false
}

//刷新版本信息
const refreshVersion = async () => {
    const flag = await getVersion({ version: "all" }, true)
    if (flag) {
        ElMessage.success('刷新成功')
    } else {
        ElMessage.error('刷新失败')
    }
}


const deleteRow = (index: number, id: number) => {
    ElMessageBox.confirm(
        '确认删除该角色信息吗?',
        'Warning',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消删除',
            type: 'warning',
            showClose: false
        }
    )
        .then(() => {
            //uid被洗掉了，手动添加
            updateRole({ status: 0, id } as Role)
        })
        .catch(() => ElMessage.info('删除操作已取消'))
}

const beforeCloseDrawer = () => {
    ElMessageBox.confirm(
        '确认关闭面板吗?关闭后未保存的修改会取消。',
        'Warning',
        {
            confirmButtonText: '关闭',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
        }
    )
        .then(() => {
            isShowAddVersionDrawer.value = false
        })
        .catch(() => {
        })
}

/**
 * 处理excel表头和数据，并导出
 * */
const export_excel = () => {
    //提取表头和表数据
    const headers = ["ID", "角色名", "所属阵营", "所属种族", "其他标签", "更新时间"]
    const propsIndex = ["id", "name", "camp", "race", "otherTags", "updated_time"] //收集序号
    // this.tablelabels.forEach((label, index) => {
    //     if (index !== 0) headers.push(label.label)
    // })

    // 数据
    const data = allRoleInfo.value.map((row) => {
        return propsIndex.map((prop, index) => {

            return row[prop as keyof Role] || ""
        }).filter(item => item !== undefined)
    })
    // 组合数据，第一行是表头
    const sheetData = [headers, ...data]

    //生成Excel文件并保存
    fileProcess.save_as_excel(sheetData, "重返未来1999角色表", "重返未来1999角色表(部分)")
}


onMounted(async () => {
    await getVersion({ version: "all" }, true)
})
</script>


<style scoped>
@media (max-width: 780px) {
    .header2 {
        width: 80%;
        margin: 0 auto;
        padding-top: 10px;
    }

    .el-col {
        margin: 5px 0;
    }

    /*#region el-table */
    .myCustomElTable {

        .el-table__header-wrapper {
            height: 40px;
            line-height: 40px;
        }

        .tableItem {
            white-space: nowrap;
            overflow: hidden;
        }

        /* .el-table__cell {
                  overflow: hidden;
              } */
    }

    .myCustomElTable>>>.el-table__body-header .el-table__cell {
        padding: 0;
    }

    .myCustomElTable>>>.el-table__body-header .el-table__cell .cell {
        padding: 0 5px;
        text-align: center;
    }

    .myCustomElTable>>>.el-table__header tr th {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .myCustomElTable>>>.el-table__row .cell {
        padding: 0;
    }

    .myCustomElTable>>>.success-row {
        background: #f0f9eb;
    }

    /*#endregion */

    .pageMenu {
        padding-bottom: 5px;
    }
}
</style>
