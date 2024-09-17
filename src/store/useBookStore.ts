// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import {Bill, TotalCost} from "@/types/books";


// 定义并暴露一个store
export const useBookStore = defineStore('book', () => {
        //订单列表
        const billList: Bill[] = reactive([])
        //当前订单(还没使用)
        const thisBill = ref<Bill>({
            id: 1,
            bid: 1,
            uid: 77,
            gid: 1,
            name: "白菜渣",
            price: 3,
            desc: "一捆",
            type: "蔬菜",
            status: 0,
            bill_date: "2024-09-01T00:00:00.000Z",
            created_time: "2024-08-18T13:24:29.000Z",
            updated_time: "2024-09-01T15:26:46.000Z",
            username: "默默"
        })
// //总价
//         const totalCostList = ref<TotalCost[]>([]);

        //更新整个订单
        const updateBillList = (newBillList: Bill[]) => {
            billList.splice(0, billList.length, ...newBillList)
        }
        //添加新账单
        const addBill = (newBill: Bill) => {
            billList.push(newBill)
        }
        //修改账单
        const updateBill = ({newBill, index}: {
            newBill?: Bill,
            index?: number,
        }) => {
            //修改账单状态(status),0正常，1结算，2删除
            console.log(newBill, index)

            //修改订单(合并)
            if (newBill) billList.splice(index, 1, newBill)
        }

        //删除账单
        const deleteBill = ({index, gid, status}: { index?: number, gid?: number, status?: number }) => {
            //删除
            if (status === 2) billList.splice(index, 1)
            //更新销账状态，按组销账
            else billList.forEach((bill, index) => {
                if (bill.gid === gid) billList[index].status = status
            })
        }

        return {thisBill, billList, updateBillList, addBill, updateBill, deleteBill}
    }
)
