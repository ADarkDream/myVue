<template>
  <el-collapse v-model="activeNames" accordion style="text-align: left;">
    <el-collapse-item title="账本月历" :name="1">
      <el-card>
        <p>
          账本月历中，
          <el-badge value="1" color="lightgray"/>
          代表
          <el-text type="info">已销账的账单</el-text>
          ，
          <el-badge :value="1" color="lightgreen"/>
          代表
          <el-text type="success">尚未销账的账单</el-text>
          。每一天的
          <el-text tag="b">总计</el-text>
          包含已销账单部分。
        </p>
      </el-card>
    </el-collapse-item>
    <el-collapse-item title="账单详情" :name="2">
      <el-card>
        <p>1、 账单详情中，
          <el-button-group size="small" type="primary">
            <el-button>
              日
            </el-button>
            <el-button>周</el-button>
            <el-button>
              月
            </el-button>
          </el-button-group>
          可分别按
          <el-text tag="b">一天</el-text>
          ，
          <el-text tag="b">一周</el-text>
          ，
          <el-text tag="b">一个月</el-text>
          的范围来查询账单数据。
        </p>
        <p>2、以周为例，
          <el-button-group size="small">
            <el-button>
              上一周
            </el-button>
            <el-button>本周</el-button>
            <el-button>
              下一周
            </el-button>
          </el-button-group>
          可分别按
          <el-text tag="b">上一周</el-text>
          、
          <el-text tag="b">当前周</el-text>
          、
          <el-text tag="b">下一周</el-text>
          的范围来查询账单数据。
        </p>
        <p>3、
          <el-date-picker size="small"
                          type="daterange" range-separator="To"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" style="width: 160px"/>
          可用来自由地选择
          <el-text tag="b">任意日期范围</el-text>
          来查询账单，但不能选择未来的日期。
        </p>
      </el-card>
    </el-collapse-item>
    <el-collapse-item title="花费统计" :name="3">
      <el-card>
        <p>
          <el-text tag="b" type="info">总支出</el-text>
          代表该段时间范围内，包含已销账的账单的花费总计。
        </p>
        <p>
          <el-text tag="b" type="warning">当前支出</el-text>
          代表该段时间范围内，尚未销账的账单的花费总计。
        </p>
        <p>
          <el-text tag="b">应收取</el-text>
          代表尚未销账的账单的总计平均结果，
          <el-text type="success">绿色</el-text>
          代表应收取金额，
          <el-text type="danger">红色</el-text>
          代表应支付金额，
          <el-text type="primary">蓝色</el-text>
          代表每个人应承担的平均金额。
        </p>
      </el-card>
    </el-collapse-item>
    <el-collapse-item title="协作成员" :name="4">
      <el-card>
        <p>
          <el-text tag="b">协作成员</el-text>
          中可以查看当前账本的协作成员。
        </p>
        <p>您可以邀请其他用户来加入账本协作。点击
          <el-button size="small" type="primary">邀请协作</el-button>
          后会将协作信息保存到粘贴板，为了保护隐私，账本协作功能作出如下限制：
        </p>
        <p>1、只有账本创建者可以邀请其他用户；</p>
        <p> 2、被邀请用户需要注册并登录本站账号；</p>
        <p>3、邀请的协作码只能使用一次，即每个协作码只能邀请一个用户，邀请后就会更新；</p>
        <el-text tag="p" type="warning">
          4、注意：账本和账单的修改和删除功能尚不支持权限分级，协作中的任何成员均可操作；
        </el-text>
        <el-text tag="p" type="warning">
          5、注意：账本暂不支持退出协作和删除成员功能。
        </el-text>
      </el-card>
    </el-collapse-item>
      <el-collapse-item title="未解决BUG或未实现功能" :name="5">
      <div style="padding-left:10px;">
        <p>1、添加账单之后,判断添加的数据是否在当前时间范围内,需要把dateRange改成全局共享</p>
        <p>2、组账单第一个销账会导致下面的子帐单UI错位，暂定为将子账单一并销账</p>
        <el-text tag="p" type="danger">3、移动端隐藏右侧日期选择器面板有bug，显示有空白</el-text>
        <p>4、刷新之后会返回账本列表界面</p>
      </div>
    </el-collapse-item>
    <el-collapse-item title="已解决BUG" :name="6">
      <div style="padding-left:10px;">
        <p class="delLine">首次加载时日历界面无法获得帐单列表；</p>
        <p class="delLine">不要星期日开始；</p>
        <p class="delLine">修改组内子账单时，禁用日期修改；；</p>
        <p class="delLine">首次加载时日历界面无法获得帐单列表；</p>
        <p class="delLine">添加账单之后,需要重排表格</p>
        <p class="delLine">AddBill需要修改,修改组别后没传递参数gid</p>
        <p class="delLine">cancelAddBill下的日期需要修改</p>
        <p class="delLine">el-table左右容器溢出，有问题</p>
        <p class="delLine"> 日历界面总计计算不准确，有问题,在后端</p>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import {ref} from 'vue'
//折叠面板序号
const activeNames = ref('0')
</script>

<style scoped>

</style>
