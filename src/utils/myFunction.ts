import { ElMessage } from "element-plus";
import axios from "axios";
//types
import type { ResultData } from "@/types/global";

const myFunction = {

    //复制文本
    copyText: (text: string, msg: string, url?: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                ElMessage.success(msg + '已复制到剪贴板')
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            },
            () => {
                alert(msg + '复制失败,请自行复制以下内容：' + text)
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            }
        )
    },

    //复制代码
    copyCode: (code: string, msg: string) => {
        navigator.clipboard.writeText(code).then(
            () => {
                ElMessage.success(msg + '已复制到剪贴板')
            },
            () => {
                alert(msg + '复制失败,请自行复制以下内容：' + code)
            }
        )
    },

    //深度对比两个数据是否一致,返回true为一致，能比较常见数据。isSort=true先排序再比较，使其对数组排序不敏感
    // 不能比较循环引用对象(会导致无限递归)、特殊对象类型(例如 Date、Map、Set 等)，以及原型链上的属性、函数、 NaN、Symbol 类型。
    deepEqual: (a, b, isSort = false) => {
        if (a === b) return true;

        if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
            return false;
        }

        //下面比较数组，先排序再比较，使其对顺序不敏感,isSort=true开启
        if (isSort) {
            const isArrayA = Array.isArray(a);
            const isArrayB = Array.isArray(b);
            if (isArrayA !== isArrayB) return false;
            if (isArrayA && isArrayB) {
                if (a.length !== b.length) return false;
                const sortedA = [...a].sort();
                const sortedB = [...b].sort();
                //递归，深层遍历数组
                for (let i = 0; i < sortedA.length; i++) {
                    if (!myFunction.deepEqual(sortedA[i], sortedB[i])) return false;
                }
                return true;
            }
        }

        //下面比较对象
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            //递归，深层遍历对象
            if (!keysB.includes(key) || !myFunction.deepEqual(a[key], b[key])) return false;
        }
        return true;
    },

    //比较之后返回不一致的数据(尚未验证)
    //     function deepEqual(a, b, path = '') {
    //     if (a === b) return true;
    //
    //     if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    //         return { path, a, b };
    //     }
    //
    //     const isArrayA = Array.isArray(a);
    //     const isArrayB = Array.isArray(b);
    //
    //     if (isArrayA !== isArrayB) {
    //         return { path, a, b };
    //     }
    //
    //     if (isArrayA && isArrayB) {
    //         if (a.length !== b.length) {
    //             return { path, a, b };
    //         }
    //
    //         const sortedA = [...a].sort();
    //         const sortedB = [...b].sort();
    //
    //         for (let i = 0; i < sortedA.length; i++) {
    //             const result = deepEqual(sortedA[i], sortedB[i], `${path}[${i}]`);
    //             if (result !== true) {
    //                 return result;
    //             }
    //         }
    //         return true;
    //     }
    //
    //     const keysA = Object.keys(a).sort();
    //     const keysB = Object.keys(b).sort();
    //
    //     if (keysA.length !== keysB.length) {
    //         return { path, keysA, keysB };
    //     }
    //
    //     for (const key of keysA) {
    //         const result = deepEqual(a[key], b[key], `${path}.${key}`);
    //         if (result !== true) {
    //             return result;
    //         }
    //     }
    //     return true;
    // }

    //获取随机N张重返未来1999背景图片
    getBG: async (sort?: number, limitNum?: number) => {
        try {
            const result = await axios<ResultData<ReverseImg[]>>({
                url: '/getRandomWallpaper',
                params: { sort, limitNum },
            })
            console.log(result)
            const { status, msg, data } = result.data
            if (status === 300) ElMessage.warning(msg)
            console.log('/getRandomWallpaper', data)
            if (data) return data
            else return []
        } catch (error) {
            console.log('发生错误：')
            console.dir(error)
            return []
        }
    },


    //清除未修改的数据,如果未修改返回{}
    diffObj: <T>(newData: T, oldData: T) => {
        return Object.keys(newData).concat(Object.keys(oldData))
            .filter(key => newData[key as keyof T] !== oldData[key as keyof T])
            .reduce((result: Record<string, any>, key) => {
                result[key] = newData[key as keyof T] // 返回newData对象的属性
                return result //最后返回的结果属于ReverseImgInfo的一部分
            }, {})
    },

    //el-table中按时间顺序和逆序排列
    sortByTime: (tableData, prop, order) => tableData.sort((a, b) => {
        const propA = a[prop as keyof typeof a]
        const propB = b[prop as keyof typeof b]
        if (propA < propB) return order === 'ascending' ? -1 : 1;
        if (propA > propB) return order === 'ascending' ? 1 : -1;
        return 0;
    }),

    /**
       * @param jsonData - (必需)需要转换的JSON数据
       * @param targetLanguage - typescript(默认)：转换的目标语言
       * @param typeName - Data(默认)：转换为的根类型名
       * @param justTypes - true(默认):仅返回类型,false:还会返回类型检查函数和步骤
       * @returns {{resultArr: string[]}} -返回的是数组,每个元素代表一行
       */
    getTypes: async ({ jsonData, targetLanguage, typeName, justTypes = true }: { jsonData: JSON, targetLanguage?: string, typeName?: string, justTypes?: boolean }) => {
        try {
            const result = await axios<ResultData<{ resultArr: string[] }>>({
                url: '/getTypes',
                method: "POST",
                data: { jsonData, justTypes }
            })
            console.log('/返回的数据为：', result.data.data)
            // const { status, msg, data } = result.data
        } catch (err) {
            console.error('getTypes出错了:')
            console.error(err)
        }
    }



}
export default myFunction