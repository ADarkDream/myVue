import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/pages/home/Home.vue"//常用，不异步加载

const Forum = () => import( "@/pages/forum/Forum.vue");
const AdminLogin = () => import( "@/pages/admin/AdminLogin.vue");
const AdminCenter = () => import( "@/pages/admin/AdminCenter.vue");
const UserCenter = () => import( "@/pages/user/UserCenter.vue");
const NotFound = () => import( "@/pages/NotFound.vue");
const UserInfo = () => import( "@/pages/user/UserInfo.vue");
const UserPreference = () => import( "@/pages/user/UserPreference.vue");
const UserManagement = () => import( "@/pages/user/UserManagement.vue");
const UserEdit = () => import( "@/pages/user/UserEdit.vue");
const UserBooks = () => import("@/pages/user/books/UserBooks.vue")
const UserBook = () => import("@/pages/user/books/UserBook.vue")

const Article = () => import( "@/pages/forum/Article.vue");
const Center = () => import( "@/pages/forum/Center.vue")
const AdminArticlesManagement = () => import( "@/pages/admin/AdminArticlesManagement.vue");
const AdminUsersManagement = () => import( "@/pages/admin/AdminUsersManagement.vue");
const AdminNoticesManagement = () => import( "@/pages/admin/AdminNoticesManagement.vue");
const AdminUrlsManagement = () => import( "@/pages/admin/AdminUrlsManagement.vue");
const AdminImagesManagement = () => import( "@/pages/admin/AdminImagesManagement.vue");
const AdminFeedbackManagement = () => import( "@/pages/admin/AdminFeedbackManagement.vue");
const AdminCommentsManagement = () => import( "@/pages/admin/AdminCommentsManagement.vue");
const Download1999 = () => import( "@/pages/reverse1999/Download1999.vue");//常用，不异步加载
const Roles1999 = () => import( "@/pages/reverse1999/Roles1999.vue");
const Images1999 = () => import( "@/pages/reverse1999/Images1999.vue");
const Test = () => import( "@/pages/Test.vue");
const News = () => import( "@/pages/News.vue");
const NewsContent = () => import( "@/pages/NewsContent.vue");
const Admin1999ImagesManagement = () => import("@/pages/admin/Admin1999ImagesManagement.vue")
const ChatCenter = () => import("@/pages/user/chat/ChatCenter.vue")
const ChatHall = () => import("@/pages/user/chat/ChatHall.vue")
const Chatroom = () => import("@/pages/user/chat/ChatRoom.vue")
const Talk = () => import("@/pages/user/chat/Talk.vue")
const Music = () => import("@/pages/music/Music.vue")
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
        {//聊天大厅
            name: 'chat',
            path: '/Chat',
            component: ChatCenter,
            redirect: {name: 'hall'},
            children: [{
                name: 'hall',
                path: 'hall',
                component: ChatHall,
            }, {//聊天室
                name: 'room',
                path: 'room',
                component: Chatroom,
            }, {//双人聊天室
                name: 'talk',
                path: 'talk',
                component: Talk,
            }]
        },
        {
            name: 'music',
            path: '/music',
            component: Music
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
                path: 'user',
                component: AdminUsersManagement
            }, {
                name: 'adminArticlesManagement',
                path: 'articles',
                component: AdminArticlesManagement
            }, {
                name: 'adminCommentsManagement',
                path: 'comments',
                component: AdminCommentsManagement
            }, {
                name: 'adminNoticesManagement',
                path: 'notices',
                component: AdminNoticesManagement
            }, {
                name: 'adminUrlsManagement',
                path: 'urls',
                component: AdminUrlsManagement
            }, {
                name: 'adminImagesManagement',
                path: 'images',
                component: AdminImagesManagement
            }, {
                name: 'adminFeedbackManagement',
                path: 'feedback',
                component: AdminFeedbackManagement
            }, {
                name: 'admin1999ImagesManagement',
                path: '1999Images',
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
                },
                {
                    path: 'books',
                    children: [{
                        name: 'books',//账本界面
                        path: '',
                        component: UserBooks
                    }, {
                        name: 'book',//账单界面
                        path: 'book',
                        component: UserBook
                    }]
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
        },
        {
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
