import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/pages/Home.vue";
import Content from "@/pages/Content.vue";
import User from "@/pages/User.vue";
import AdminLogin from "@/pages/AdminLogin.vue";
import AdminCenter from "@/pages/AdminCenter.vue";
import UserCenter from "@/pages/UserCenter.vue";
import NotFound from "@/pages/NotFound.vue";
import UserInfo from "@/pages/UserInfo.vue";

import UserPreference from "@/pages/UserPreference.vue";
import UserHistory from "@/pages/AdminUsersManagement.vue";
import UserEdit from "@/pages/UserEdit.vue";
import UserManagement from "@/pages/UserManagement.vue";
import Article from "@/pages/Article.vue";
import Center from "@/pages/Center.vue"
import AdminArticlesManagement from "@/pages/AdminArticlesManagement.vue";
import AdminUsersManagement from "@/pages/AdminUsersManagement.vue";
import AdminNoticesManagement from "@/pages/AdminNoticesManagement.vue";
import AdminUrlsManagement from "@/pages/AdminUrlsManagement.vue";
import AdminImagesManagement from "@/pages/AdminImagesManagement.vue";
import AdminFeedbackManagement from "@/pages/AdminFeedbackManagement.vue";
import AdminCommentsManagement from "@/pages/AdminCommentsManagement.vue";

const router = createRouter({
    history: createWebHistory(),//路由器工作模式，有web和hash两种，web上线后需要服务器配置，hash地址栏会出现#号
    routes: [
    //     {
    //     path: '/',//主页首次加载重定向到Home页面
    //     redirect: '/Home'
    // },
        {
            name: 'home',//首页
            path: '/',
            component: Home,
            children: [{
                name: 'content',//首页网址区域
                path: '/home/content',
                component: Content
            }]
        },
        {
            path: '/forum',//论坛
            // component: Forum,
            children: [
                {
                    name: 'center',//大厅
                    path: 'center',
                    component: Center
                },
                {
                    name: 'article',//文章阅读界面
                    path: 'article',
                    component: Article,
                }]
        }, {//暂时没有用
            path: '/user',
            component: User
        },
        {
            path: '/admin',
            children: [{
                name: 'adminLogin',
                path: 'login',
                component: AdminLogin
            }, {
                name: 'adminCenter',
                path: 'center',
                component: AdminCenter,
                children: [
                    {
                        name: 'adminUsersManagement',
                        path: 'userManagement',
                        component: AdminUsersManagement
                    }, {
                        name: 'adminArticlesManagement',
                        path: 'articlesManagement',
                        component: AdminArticlesManagement
                    },{
                        name: 'adminCommentsManagement',
                        path: 'commentsManagement',
                        component: AdminCommentsManagement
                    }, {
                        name: 'adminNoticesManagement',
                        path: 'noticesManagement',
                        component: AdminNoticesManagement
                    }, {
                        name: 'adminUrlsManagement',
                        path: 'urlsManagement',
                        component: AdminUrlsManagement
                    } , {
                        name: 'adminImagesManagement',
                        path: 'imagesManagement',
                        component: AdminImagesManagement
                    },{
                        name: 'adminFeedbackManagement',
                        path: 'feedbackManagement',
                        component: AdminFeedbackManagement
                    }
                ]
            }]
        },
        {

            path: '/userCenter',//用户界面
            component: UserCenter,
            children: [
                {
                    name: 'userInfo',//用户个人信息界面
                    path: 'userInfo',
                    component: UserInfo
                }, {//暂时没用
                    name: 'userPreference',//用户偏好设置界面
                    path: 'userPreference',
                    component: UserPreference
                }, {
                    name: 'userHistory',
                    path: 'userHistory',
                    component: UserHistory
                }, {
                    name: 'userManagement',//用户管理界面
                    path: 'userManagement',
                    component: UserManagement
                },
                {
                    name: 'userEdit',//发布文章界面
                    path: "userEdit",
                    component: UserEdit
                }
            ]
        },
        {
            path: "/:pathMatch(.*)*",//匹配所有路由，找不到就显示404NotFound
            name: "notFound",
            component: NotFound,
        }

        //  {
        //     name: 'xinwen',
        //     path: '/News',
        //     component: News,
        //     children: [{
        //         name:'xiangqing',
        //         path: 'Details',//子级路由不要斜杠
        //         component: Details
        //     }]
        // },
    ]

})

export default router