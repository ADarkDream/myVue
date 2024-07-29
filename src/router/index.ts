import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/pages/Home.vue"//常用，不异步加载

const Forum = () => import( "@/pages/Forum.vue");
const AdminLogin = () => import( "@/pages/AdminLogin.vue");
const AdminCenter = () => import( "@/pages/AdminCenter.vue");
const UserCenter = () => import( "@/pages/UserCenter.vue");
const NotFound = () => import( "@/pages/NotFound.vue");
const UserInfo = () => import( "@/pages/UserInfo.vue");
const UserPreference = () => import( "@/pages/UserPreference.vue");

const UserEdit = () => import( "@/pages/UserEdit.vue");
const UserManagement = () => import( "@/pages/UserManagement.vue");
const Article = () => import( "@/pages/Article.vue");
const Center = () => import( "@/pages/Center.vue")
const AdminArticlesManagement = () => import( "@/pages/AdminArticlesManagement.vue");
const AdminUsersManagement = () => import( "@/pages/AdminUsersManagement.vue");
const AdminNoticesManagement = () => import( "@/pages/AdminNoticesManagement.vue");
const AdminUrlsManagement = () => import( "@/pages/AdminUrlsManagement.vue");
const AdminImagesManagement = () => import( "@/pages/AdminImagesManagement.vue");
const AdminFeedbackManagement = () => import( "@/pages/AdminFeedbackManagement.vue");
const AdminCommentsManagement = () => import( "@/pages/AdminCommentsManagement.vue");
const Download1999 = () => import( "@/pages/Download1999.vue");//常用，不异步加载
const Roles1999 = () => import( "@/pages/Roles1999.vue");
const Images1999 = () => import( "@/pages/Images1999.vue");
const Test = () => import( "@/pages/Test.vue");
const News = () => import( "@/pages/News.vue");
const NewsContent = () => import( "@/pages/NewsContent.vue");
const Admin1999ImagesManagement = () => import("@/pages/Admin1999ImagesManagement.vue")
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
            }, {
                name: 'admin1999ImagesManagement',
                path: '1999ImagesManagement',
                component: Admin1999ImagesManagement
            },
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
            }, {
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
            }, {
                name: "images",
                path: 'images',
                component: Images1999
            }]
        },
        {
            path: '/test',
            name: 'test',
            component: Test
        },
        {
            name: "notFound",
            path: "/:pathMatch(.*)*",//匹配所有路由，找不到就显示404NotFound
            component: NotFound,
        }, {
            path: '/News',
            children: [{
                name: 'news',
                path: '',//重定向
                redirect: {name: 'newsCenter'}
            }, {
                name: 'newsCenter',
                path: 'center',
                component: News,
            }, {
                name: 'newsContent',
                path: 'newsContent',
                component: NewsContent,
            }]
        },
    ]

})

export default router