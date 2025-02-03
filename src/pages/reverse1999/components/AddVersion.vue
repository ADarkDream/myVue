<template>
  <el-form ref="editVersionFormRef" class="editVersionForm" :model="formData" status-icon :rules="Rules" label-width="auto">
    <el-form-item label="版本名称" prop="halfName" autocomplete="off">
      <el-input v-model.lazy.trim="formData.halfName" placeholder="版本名称" clearable>
        <template #prepend>{{ formData.halfText }}</template>
      </el-input>
    </el-form-item>
    <el-form-item label="版本数值" prop="version" autocomplete="off">
      <el-input-number
        v-model.number.lazy.trim="formData.version"
        @change="handleChange()"
        placeholder="版本数值"
        :min="10"
        :max="1999"
        clearable
        style="min-width: 175px"
      />
    </el-form-item>
    <el-form-item label="上传时间" prop="time" autocomplete="off">
      <el-input-tag v-model.lazy.trim="formData.time" placeholder="官方上传时间(8位数字日期格式)" clearable />
    </el-form-item>
    <el-form-item label="选择状态" v-if="isAdmin">
      <el-select placeholder="选择状态" v-model="formData.status" default-first-option>
        <el-option v-for="{ label, value } in statusOptions" :key="value" :label :value />
      </el-select>
    </el-form-item>

    <div>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submitForm()" :loading="isLoading" :disabled="isDisabled"
        >{{ isEdit ? "修改" : "添加" }}版本信息</el-button
      >
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { useUserInfoStore } from "@/store/user/useUserInfoStore"
import { useVersionsStore } from "@/store/reverse1999/useVersionsStore"
import { useReverse1999Store } from "@/store/reverse1999/useReverse1999Store"
import type { FormInstance, FormRules } from "element-plus"
//hooks
import useReverse1999 from "@/hooks/reverse1999/useReverse1999"

//utils
import verifyRules from "@/utils/verifyRules"
import myFunction from "@/utils/myFunction"
//files

const userInfoStore = useUserInfoStore()
const versionsStore = useVersionsStore()

const reverse1999Store = useReverse1999Store()

const { isAdmin } = toRefs(userInfoStore)
const { isLoading, isEdit, isDisabled, formData, oldFormData } = toRefs(versionsStore)
const { toggleAddVersionDrawer, handleChange } = versionsStore
const { allRoleInfo, campInfo, raceInfo, statusOptions } = toRefs(reverse1999Store)
const { addVersion, updateVersion } = useReverse1999()
const { diffObj } = myFunction

const editVersionFormRef = ref<FormInstance>()

//用哪些表单验证规则
const Rules = ref<FormRules<typeof formData>>({
  halfName: [{ validator: verifyRules.text, required: true, trigger: "blur" }],
  version: [{ validator: verifyRules.text, required: true, trigger: "blur" }],
  time: [{ validator: verifyRules.timeArray, required: false, trigger: "blur" }],
})

//提交表单，再次判断表单验证是否通过
const submitForm = async () => {
  //设置按钮禁用
  isLoading.value = true

  if (!editVersionFormRef.value) return
  try {
    const flag = await editVersionFormRef.value.validate()
    console.log("表单验证结果：", flag)
    if (!flag) return

    // const { halfText, halfName, ...tempData } = formData.value
    // tempData.versionName = halfText + halfName
    // if (tempData.time?.length)
    //   tempData.time = toNumberArr(tempData.time as string[])
    // if (!tempData.status && tempData.status !== 0) tempData.status = formData.value.status
    formData.value.versionName = formData.value.halfText + formData.value.halfName
    oldFormData.value.versionName = oldFormData.value.halfText + oldFormData.value.halfName
    if (isEdit.value) {
      //修改或删除版本
      const { halfText, halfName, ...tempData } = <VersionInfo>diffObj(formData.value, oldFormData.value)

      //判断版本信息是否修改
      if (!Object.keys(tempData).length) {
        isLoading.value = false
        return ElMessage.info("版本信息未修改，已取消上传。")
      }
      await updateVersion({ ...tempData, id: formData.value.id })
    } else {
      //新增版本
      const { halfText, halfName, ...tempData } = { ...formData.value }
      await addVersion(tempData)
    }
  } catch (error) {
    console.log("发生错误：", error)
  }
  isLoading.value = false
}

const toNumberArr = (arr: string[]) => {
  console.log("str", arr)
  const newArr = arr.map(Number)
  console.log("newArr", newArr)

  return newArr
}

//region重置表单
const resetForm = () => {
  if (!editVersionFormRef.value) return
  if (isEdit.value) toggleAddVersionDrawer(true, oldFormData.value)
  else editVersionFormRef.value.resetFields()
}
</script>

<style scoped>
.editVersionForm {
  max-width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 780px) {
  .editVersionForm {
    margin-top: 10px;
  }
}
</style>
