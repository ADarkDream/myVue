import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/pages/Home.vue";
import Forum from "@/pages/Forum.vue";
import AdminLogin from "@/pages/AdminLogin.vue";
import AdminCenter from "@/pages/AdminCenter.vue";
import UserCenter from "@/pages/UserCenter.vue";
import NotFound from "@/pages/NotFound.vue";
import UserInfo from "@/pages/UserInfo.vue";
import UserPreference from "@/pages/UserPreference.vue";

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
import Download1999 from "@/pages/Download1999.vue";
import Roles1999 from "@/pages/Roles1999.vue";
import User from "@/pages/User.vue";

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
            component: Home
        },
        {
            path: '/forum',//论坛
            component: Forum,
            children: [{
                name: 'forum',
                path: '',//重定向
                redirect: {name: 'center'}
            },
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
        },
        {
            name: 'adminLogin',
            path: '/admin/login',
            component: AdminLogin
        },
        {
            path: '/admin',
            component: AdminCenter,
            children: [{
                name: 'adminCenter',
                path: ' ',//重定向
                redirect: {name: 'adminUsersManagement'}
            }, {
                name: 'adminUsersManagement',
                path: 'userManagement',
                component: AdminUsersManagement
            }, {
                name: 'adminArticlesManagement',
                path: 'articlesManagement',
                component: AdminArticlesManagement
            }, {
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
            }, {
                name: 'adminImagesManagement',
                path: 'imagesManagement',
                component: AdminImagesManagement
            }, {
                name: 'adminFeedbackManagement',
                path: 'feedbackManagement',
                component: AdminFeedbackManagement
            }
            ]
        },
        {
            path: '/user',//用户界面
            component: UserCenter,
            children: [{
                name: 'userCenter',
                path: ' ',//重定向
                redirect: {name: 'userInfo'}
            }, {
                name: 'userInfo',//用户个人信息界面
                path: 'info',
                component: UserInfo
            }, {//暂时没用
                name: 'userPreference',//用户偏好设置界面
                path: 'preference',
                component: UserPreference
            },  {
                name: 'userManagement',//用户管理界面
                path: 'management',
                component: UserManagement
            },
                {
                    name: 'userEdit',//发布文章界面
                    path: "edit",
                    component: UserEdit
                }
            ]
        },
        {
            path: "/reverse1999",
            children: [{
                name: 'reverse1999',
                path: '',//重定向
                redirect: {name: 'download'}
            }, {
                name: "download",
                path: 'download',
                component: Download1999
            }, {
                name: "roles",
                path: 'roles',
                component: Roles1999
            }]
        },
        // {
        //     path: '/test',
        //     name: 'test',
        //     component: User
        // },
        {
            name: "notFound",
            path: "/:pathMatch(.*)*",//匹配所有路由，找不到就显示404NotFound
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