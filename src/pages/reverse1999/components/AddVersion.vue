<template>
  <el-form ref="editVersionFormRef" class="editVersionForm" :model="formData" status-icon :rules="Rules"
    label-width="auto">
    <el-form-item label="版本名称" prop="versionName" autocomplete="off">
      <el-input v-model.lazy.trim="formData.halfName" placeholder="版本名称" clearable>
        <template #prepend>{{ formData.halfText }}</template>
      </el-input>
    </el-form-item>
    <el-form-item label="版本数值" prop="version" autocomplete="off">
      <el-input-number v-model.number.lazy.trim="formData.version" @change="handleChange" placeholder="版本数值" :min="10"
        :max="1999" clearable style="min-width: 175px;" />
    </el-form-item>
    <el-form-item label="上传时间" prop="time" autocomplete="off">
      <el-input-tag v-model.lazy.trim="formData.time" placeholder="官方上传时间(8位数字日期格式)" clearable />
    </el-form-item>
    <div>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submitForm()" :loading="isLoading">{{ isEdit ? '修改' : '添加'
        }}版本信息</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useVersionsStore } from '@/store/reverse1999/useVersionsStore';
import { useReverse1999Store } from '@/store/reverse1999/useReverse1999Store';
import type { FormInstance, FormRules } from 'element-plus';
//hooks
import useReverse1999 from '@/hooks/reverse1999/useReverse1999';

//utils
import verifyRules from "@/utils/verifyRules";
import myFunction from "@/utils/myFunction";
//files


const versionsStore = useVersionsStore();

const reverse1999Store = useReverse1999Store();

const { isLoading, isEdit, formData, oldFormData } = toRefs(versionsStore)
const { toggleAddVersionDrawer, handleChange } = versionsStore
const { allRoleInfo, campInfo, raceInfo } = toRefs(reverse1999Store)
const { addRole, updateRole } = useReverse1999()
const { diffObj } = myFunction

const editVersionFormRef = ref<FormInstance>()

//用哪些表单验证规则
const Rules = ref<FormRules<typeof formData>>({
  versionName: [{ validator: verifyRules.text, required: true, trigger: 'blur' }],
  version: [{ validator: verifyRules.text, required: true, trigger: 'blur' }],
  time: [{ validator: verifyRules.timeArray, required: false, trigger: 'blur' }]
})

//提交表单，再次判断表单验证是否通过
const submitForm = async () => {
  //设置按钮禁用
  isLoading.value = true

  if (!editVersionFormRef.value) return
  try {
    const flag = await editVersionFormRef.value.validate()
    console.log('表单验证结果：', flag);
    if (flag) {
      if (isEdit.value) {//修改或删除版本
        const newData = <VersionInfo>diffObj(formData.value, oldFormData.value)
        //判断版本信息是否修改
        if (Object.keys(newData).length === 0) {


          ElMessage.info('版本信息未修改，已取消上传。')
        } else await updateRole({ ...newData, id: formData.value.id })
      } else {//新增版本
        await addRole(formData.value)
      }
    }
  } catch (error) {
    console.log('发生错误：', error);
  }
  isLoading.value = false
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
  margin: 0 auto
}

@media screen and (max-width: 780px) {
  .editVersionForm {
    margin-top: 10px
  }
}
</style>
