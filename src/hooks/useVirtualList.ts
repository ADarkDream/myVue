// 虚拟滚动列表/表格dom
//From:https://juejin.cn/post/7415663559310540827

import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import type { Ref } from "vue";

// interface Config {
//     data: Ref<any[]>; // 数据源
//     scrollContainer: string; // 滚动容器的元素选择器
//     actualHeightContainer: string; // 用于撑开高度的元素选择器
//     translateContainer: string; // 用于偏移的元素选择器
//     itmeContainer: string;// 列表项选择器
//     itemHeight: number; // 列表项高度
//     size: number; // 每次渲染数据量
// }



// 针对 「自定义列表结构」 应符合如下结构：
// <html>
// <ul class="scroll-container" > // 滚动容器
//     <div class="actual-height-container" >// 渲染实际高度的容器
//         <div class="translate-container" > // 用于偏移的容器
//             <li v -for= "(item, i) in actualRenderData" >
//           ...
//             </li>
//         </div>
//     </div>
// </ul>

// <ts>
// const { actualRenderData } = useVirtualList({
//     data: tableData, // 列表项数据
//     scrollContainer: ".scroll-container", // 滚动容器
//     actualHeightContainer: ".actual-height-container", // 渲染实际高度的容器
//     translateContainer: ".translate-container", // 需要偏移的目标元素,
//     itmeContainer: '.item',// 列表项
//     itemHeight: 50,// 列表项的大致高度
//     size: 10,// 单次渲染数量
// });

//  el-table 组件
// const { actualRenderData } = useVirtualList({
//     data: tableData, // 列表项数据
//     scrollContainer: ".el-scrollbar__wrap", // 滚动容器
//     actualHeightContainer: ".el-scrollbar__view", // 渲染实际高度的容器
//     tranlateContainer: ".el-table__body", // 需要偏移的目标元素,
//     itmeContainer: '.el-table__row',// 列表项
//     itemHeight: 50,// 列表项的大致高度
//     size: 10,// 单次渲染数量
// });

// useVirtualList.ts


interface Config {
    data: Ref<any[]>; // 数据源
    scrollContainer: string; // 滚动容器的元素选择器
    actualHeightContainer: string; // 用于撑开高度的元素选择器
    translateContainer: string; // 用于偏移的元素选择器
    itmeContainer: string;// 列表项选择器
    itemHeight: number; // 列表项高度
    size: number; // 每次渲染数据量
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
    // 获取元素
    let actualHeightContainerEl: HtmlElType = null,
        translateContainerEl: HtmlElType = null,
        scrollContainerEl: HtmlElType = null;

    onMounted(async () => {
        await nextTick()
        actualHeightContainerEl = document.querySelector(
            config.actualHeightContainer
        );
        scrollContainerEl = document.querySelector(config.scrollContainer);
        translateContainerEl = document.querySelector(config.translateContainer);

        scrollContainerEl?.addEventListener("scroll", handleScroll);
        console.log('scrollContainerEl', scrollContainerEl);
        // 更新数据源
        dataSource = config.data.value;

        // 计算需要渲染的数据
        updateRenderData(0);

    });


    // 数据源，便于后续直接访问
    let dataSource: any[] = [];

    // 数据源发生变动
    watch(
        () => config.data.value,
        async (newVla) => {
            await nextTick()
            // 更新数据源
            dataSource = newVla;

            // 计算需要渲染的数据
            updateRenderData(0);
        }
    );

    // 更新实际高度
    const updateActualHeight = () => {
        let actualHeight = 0;
        dataSource.forEach((_, i) => {
            actualHeight += getItemHeightFromCache(i);
        });

        actualHeightContainerEl!.style.height = actualHeight + "px";
    };

    // 缓存已渲染元素的高度
    const RenderedItemsCache: any = {};

    // 更新已渲染列表项的缓存高度
    const updateRenderedItemCache = (index: number) => {
        // 当所有元素的实际高度更新完毕，就不需要重新计算高度
        const shouldUpdate =
            Object.keys(RenderedItemsCache).length < dataSource.length;
        if (!shouldUpdate) return;

        nextTick(() => {
            // 获取所有列表项元素
            const Items: HTMLElement[] = Array.from(
                document.querySelectorAll(config.itmeContainer)
            );
            console.log('Items', Items);
            // 进行缓存
            Items.forEach((el) => {
                if (!RenderedItemsCache[index]) {
                    RenderedItemsCache[index] = el.offsetHeight;
                }
                index++;
            });

            // 更新实际高度
            updateActualHeight();
        });
    };

    // 获取缓存高度，无缓存，取配置项的 itemHeight
    const getItemHeightFromCache = (index: number | string) => {
        const val = RenderedItemsCache[index];
        return val === void 0 ? config.itemHeight : val;
    };

    // 实际渲染的数据
    const actualRenderData: Ref<any[]> = ref([]);

    // 更新实际渲染数据
    const updateRenderData = (scrollTop: number) => {
        let startIndex = 0;
        let offsetHeight = 0;

        console.log('dataSource', dataSource);

        for (let i = 0; i < dataSource.length; i++) {
            offsetHeight += getItemHeightFromCache(i);

            if (offsetHeight >= scrollTop) {
                startIndex = i;
                break;
            }
        }

        // 计算得出的渲染数据
        actualRenderData.value = dataSource.slice(
            startIndex,
            startIndex + config.size
        );

        // 缓存最新的列表项高度
        updateRenderedItemCache(startIndex);

        // 更新偏移值
        updateOffset(offsetHeight - getItemHeightFromCache(startIndex));
    };

    // 更新偏移值
    const updateOffset = (offset: number) => {
        translateContainerEl!.style.transform = `translateY(${offset}px)`;
    };

    // 滚动事件
    const handleScroll = (e: any) => {
        // 渲染正确的数据
        updateRenderData(e.target.scrollTop);
        console.log('滚动了', e.target.scrollTop);

    };

    // 注册滚动事件
    onMounted(() => {
        // scrollContainerEl?.addEventListener("scroll", handleScroll);
    });

    // 移除滚动事件
    onBeforeUnmount(() => {
        scrollContainerEl?.removeEventListener("scroll", handleScroll);
    });

    return { actualRenderData };
}
