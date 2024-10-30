// 引入defineStore用于创建store
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import ico_baidu from '@/assets/home/baidu.png';
import ico_baidu_kaifa from '@/assets/home/baidu_kaifa.png';
import ico_bilibili from '@/assets/home/bilibili.png';
import ico_bing from '@/assets/home/bing.png';
import ico_google from '@/assets/home/google.png';
import ico_360 from '@/assets/home/360.png';
import ico_github from '@/assets/home/github.png';
import ico_custom from '@/assets/home/custom.png';
import type { EngineData } from "@/types/url";


// 定义并暴露一个store
export const useLocalEnginesStore = defineStore('searchEngines', () => {
    const searchEngines = reactive<EngineData[]>([
        {
            id: 0,
            name: '必应',
            index: 0,
            src: ico_bing,
            baseUrl: 'https://cn.bing.com',
            searchUrl: '/search?q=',
            isShow: true
        },
        {
            id: 1,
            name: '百度',
            index: 1,
            src: ico_baidu,
            baseUrl: 'https://www.baidu.com',
            searchUrl: '/s?wd=',
            isShow: true
        },
        {
            id: 2,
            name: '谷歌',
            index: 2,
            src: ico_google,
            baseUrl: 'https://www.google.com',
            searchUrl: '/search?q=',
            isShow: true
        },
        {
            id: 3,
            name: '360',
            index: 3,
            src: ico_360,
            baseUrl: 'https://www.so.com',
            searchUrl: '/s?q=',
            isShow: false
        },
        {
            id: 4,
            name: '哔哩哔哩',
            index: 4,
            src: ico_bilibili,
            baseUrl: 'https://search.bilibili.com',
            searchUrl: '/all?keyword=',
            isShow: false
        },
        {
            id: 5,
            name: '百度开发者搜索',
            index: 5,
            src: ico_baidu_kaifa,
            baseUrl: 'https://kaifa.baidu.com',
            searchUrl: '/searchPage?wd=',
            isShow: true
        },
        {
            id: 6,
            name: 'GitHub',
            index: 6,
            src: ico_github,
            baseUrl: 'https://github.com',
            searchUrl: '/search?q=',
            isShow: true
        },
    ])

    return { searchEngines }
})
