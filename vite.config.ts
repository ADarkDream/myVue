import { fileURLToPath, URL } from "node:url"
import { loadEnv, defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import compression from "vite-plugin-compression"
import VueSetupExtend from "vite-plugin-vue-setup-extend"
import VueDevTools from "vite-plugin-vue-devtools"
import { createHtmlPlugin } from "vite-plugin-html"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import path from "path"
// 引入unplugin-element-plus,按需导入样式
// vite.config.js
import ElementPlus from "unplugin-element-plus/vite"
// https://vitejs.dev/config/

/**
 * @param mode - 当前的运行模式,如 'development'
 * @param command - 当前执行的 Vite 脚本命令,如 'server'
 **/
export default ({ mode, command }: { mode: string; command: string }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    define: {
      __VUE_PROD_DEVTOOLS__: true, //打开控制台插件
    },
    server: {
      host: "0.0.0.0", //开发模式开启调试的外网网址
      proxy: {
        //前端代理的接口，仅限本地开发使用，上线之后需要nginx或后端代理
        //     "/download1999": {
        //         target: "https://gamecms-res.sl916.com",
        //         changeOrigin: true, //是否跨域
        //         rewrite: (path) => path.replace(/^\/download1999/, ""), //将代理的地址替换为目标地址
        //         // ws: true,                       //是否代理 websockets
        //         secure: true, //是否https接口
        //     }
        // "/music_api": {
        //     target: "http://127.0.0.1:4000",
        //     changeOrigin: true, //是否跨域
        //     rewrite: (path) => path.replace(/^\/music_api/, ""), //将代理的地址替换为目标地址
        //     // ws: true,                       //是否代理 websockets
        //     secure: false, //是否https接口
        // }
      },
      warmup: {
        clientFiles: ["/src/components/TitleDiv.vue"],
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: { isCustomElement: (tag) => tag.startsWith("wc-") },
        },
      }),
      //SVG插件
      svgLoader({
        svgo: true, //移除svg内不必要的元数据
      }),
      //调试插件,默认启动vscode
      VueDevTools({
        // launchEditor: 'webstorm',
      }),
      VueSetupExtend(),

      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon",
          }),
        ],
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"],
          }),
        ],
        // 👉 添加本地组件目录
        dirs: ["src/components"], // 默认就是这个路径，你可以指定多个
        extensions: ["vue"],
        deep: true, // 是否递归子目录
        dts: "src/components.d.ts", // 生成类型定义文件，推荐开启
      }),
      ElementPlus({
        //组件中文配置
        defaultLocale: "zh-cn",
      }),
      Icons({
        autoInstall: true,
      }),
      legacy({
        targets: ["defaults", "ie 11"], //需要支持的浏览器，defaults是各大浏览器最新的两个版本
      }),
      //压缩成gzip，减少传输的资源大小，提高网站资源加载速度
      compression({
        filter: /.(js|mjs|json|css|html)$/i,
        algorithm: "gzip",
        ext: ".gz", // 输出文件的扩展名
        threshold: 10240, // 只压缩大于 1KB 的文件
        deleteOriginFile: false, // 是否删除源文件
      }),
      createHtmlPlugin({
        /**
         * 需要注入 index.html ejs 模版的数据
         * 使html文件的ejs模板中能够获取VITE_NODE_MODE
         */
        inject: {
          data: {
            VITE_NODE_MODE: env.VITE_NODE_MODE,
          },
        },
      }),
      createSvgIconsPlugin({
        // 指定图标文件夹（你 SVG 文件放的地方）
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    //下面的esbuild和build用于压缩打包后的代码,注释掉可以在线上看报错(开发环境下的store的语句也会被删除)
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [], // 删除生产环境下的所有的console 和 debugger
    },
    build: {
      outDir: "dist",
      minify: "esbuild", //压缩代码
      chunkSizeWarningLimit: 1500, //配置文件大小提醒限制，默认500
      rollupOptions: {
        output: {
          // 每个node_modules模块分成一个js文件
          // manualChunks: {
          //     'group-home': [
          //         './src/components/TitleDiv.vue',
          //         './src/components/AddUrl.vue',
          //         './src/components/Aside.vue',
          //         './src/components/Notice.vue',
          //         './src/components/TitleDiv.vue',
          //         './src/components/UploadImage.vue',
          //         './src/pages/Forum.vue',
          //         './src/pages/Home.vue',
          //         './src/pages/Content.vue',
          //         './src/pages/Article.vue',
          //         './src/pages/Center.vue',
          //     ],
          //     'group-management': [
          //         './src/pages/AdminArticlesManagement.vue',
          //         './src/pages/AdminCenter.vue',
          //         './src/pages/AdminCommentsManagement.vue',
          //         './src/pages/AdminFeedbackManagement.vue',
          //         './src/pages/AdminImagesManagement.vue',
          //         './src/pages/AdminLogin.vue',
          //         './src/pages/AdminNoticesManagement.vue',
          //         './src/pages/AdminUrlsManagement.vue',
          //         './src/pages/AdminUsersManagement.vue',
          //         './src/pages/UserCenter.vue',
          //         './src/pages/UserEdit.vue',
          //         './src/pages/UserInfo.vue',
          //         './src/pages/UserManagement.vue',
          //         './src/pages/UserPreference.vue',
          //     ],
          //     'group-others': [
          //         './src/pages/Download1999.vue',
          //         './src/pages/News.vue',
          //         './src/pages/NewsContent.vue',
          //         './src/pages/NotFound.vue',
          //         './src/pages/Roles1999.vue',
          //         './src/pages/user.vue',
          //     ],
          // },

          // manualChunks(id) {
          // if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
          // }
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "assets/js/[name].[hash].js", // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "assets/js/[name].[hash].js", // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: "assets/[ext]/[name].[hash].[ext]",
        },
      },
    },
    //部署在主路径使用base:“/”(默认状态)，部署在子路径则使用base:“/ProjectName/”
    //webHistory模式下不能使用相对路径base:“./”
    base: "/",
  })
}
