<template>
  <el-form ref="editRoleFormRef" class="editRoleForm" label-width="auto" :model="formData" :rules="Rules" status-icon>
    <el-form-item autocomplete="off" label="角色名称" prop="name">
      <!-- <el-input v-model="formData.name" placeholder="必填" /> -->
      <el-input v-model.lazy.trim="formData.name" clearable placeholder="角色名称" />
    </el-form-item>
    <el-form-item autocomplete="off" label="角色阵营" prop="camp">
      <el-select v-model="formData.camp">
        <el-option v-for="{ name } in campInfo" :key="name" :label="name" :value="name" />
      </el-select>
    </el-form-item>
    <el-form-item autocomplete="off" label="角色种族" prop="race">
      <el-select v-model="formData.race">
        <el-option v-for="{ name } in raceInfo" :key="name" :label="name" :value="name" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="角色标签">
      <el-input v-model="formData.tags" type="text" placeholder="选填" />
    </el-form-item> -->
    <el-form-item autocomplete="off" label="其他标签" prop="otherTags">
      <el-input v-model.trim="formData.otherTags" clearable placeholder="其他标签,以英文逗号分隔" />
    </el-form-item>
    <div>
      <el-button @click="resetForm">重置</el-button>
      <el-button :loading="isLoading" type="primary" @click="submitForm()">{{ isEdit ? "修改" : "添加" }}角色信息</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { useRolesStore } from "@/store/reverse1999/useRolesStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
import type { FormInstance, FormRules } from "element-plus"
//hooks
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"

//utils
import verifyRules from "@/utils/verifyRules"
import myFunction from "@/utils/myFunction"
//files

const rolesStore = useRolesStore()

const reverse1999Store = useReverse1999Store()
const { toggleAddRoleDrawer } = rolesStore
const { isLoading, isEdit, formData, oldFormData } = toRefs(rolesStore)

const { allRoleInfo, campInfo, raceInfo } = toRefs(reverse1999Store)
const { addRole, updateRole } = useReverse1999()
const { diffObj } = myFunction

const editRoleFormRef = ref<FormInstance>()

//用哪些表单验证规则
const Rules = ref<FormRules<typeof formData>>({
  name: [{ validator: verifyRules.text, required: true, trigger: "blur" }],
  camp: [{ validator: verifyRules.text, required: true, trigger: "blur" }],
  race: [{ validator: verifyRules.text, required: true, trigger: "blur" }],
})

//提交表单，再次判断表单验证是否通过
const submitForm = async () => {
  //设置按钮禁用
  isLoading.value = true

  if (!editRoleFormRef.value) return
  try {
    const flag = await editRoleFormRef.value.validate()
    console.log("表单验证结果：", flag)
    if (!flag) return

    if (isEdit.value) {
      //修改或删除角色
      const newData = diffObj(formData.value, oldFormData.value) as Role
      //判断角色信息是否修改
      if (!Object.keys(newData).length) return ElMessage.info("角色信息未修改，已取消上传。")

      newData.id = oldFormData.value.id
      await updateRole(newData)
    } else {
      //新增角色
      await addRole(formData.value)
    }
  } catch (error) {
    console.log("发生错误：", error)
  }
  isLoading.value = false
}

//region重置表单
const resetForm = () => {
  if (!editRoleFormRef.value) return
  if (isEdit.value) toggleAddRoleDrawer(true, oldFormData.value)
  else editRoleFormRef.value.resetFields()
}
</script>

<style scoped>
.editRoleForm {
  max-width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 780px) {
  .editRoleForm {
    margin-top: 10px;
  }
}
</style>
