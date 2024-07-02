import {ref} from "vue";
import {ElMessage} from "element-plus";


export default function () {
    //复制备案号并跳转
    function copyWebsiteRecord(text: string, url: string) {
        navigator.clipboard.writeText(text).then(
            () => {
                ElMessage.success('备案号已复制到剪贴板')
                setTimeout(() => {
                    window.open(url)
                }, 1500)
            },
            () => {
                alert('备案号复制失败,请自行复制')
                setTimeout(() => {
                    window.open(url)
                }, 1500)
            }
        )
    }

    function copyText(text: string, msg: string, url?: string) {
        navigator.clipboard.writeText(text).then(
            () => {
                ElMessage.success(msg + '已复制到剪贴板')
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            },
            () => {
                alert(msg + '复制失败,请自行复制')
                if (url !== undefined) setTimeout(() => {
                    window.open(url)
                }, 1500)
            }
        )
    }

    //复制代码
    function copyCode(code: string, msg: string) {
        navigator.clipboard.writeText(code).then(
            () => {
                ElMessage.success(msg + '已复制到剪贴板')
            },
            () => {
                alert(msg + '复制失败,请自行复制')
            }
        )
    }

    //深度对比两个数据是否一致，能比较常见数据。isSort=true先排序再比较，使其对数组排序不敏感
    // 不能比较循环引用对象(会导致无限递归)、特殊对象类型(例如 Date、Map、Set 等)，以及原型链上的属性、函数、 NaN、Symbol 类型。
    function deepEqual(a, b, isSort = false) {
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
                    if (!deepEqual(sortedA[i], sortedB[i])) return false;
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
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
        }
        return true;
    }

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


    // 向外暴露
    return {copyWebsiteRecord, copyText, copyCode, deepEqual}
}
