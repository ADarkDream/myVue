// vite.config.ts
import { fileURLToPath, URL } from "node:url"
import {
  loadEnv,
  defineConfig,
} from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite@5.4.11_@types+node@20._19d03ef2902bc20fca049f43ff464a86/node_modules/vite/dist/node/index.js"
import vue from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vi_44121ba5ed8da92fb3386975f85c915c/node_modules/@vitejs/plugin-vue/dist/index.mjs"
import legacy from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/@vitejs+plugin-legacy@5.4.3_7fdd50907d27b7fa579f68d6cd0fc836/node_modules/@vitejs/plugin-legacy/dist/index.mjs"
import AutoImport from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-auto-import@0.17.8_f1ce589dd4cf655d12fb464f58ea9142/node_modules/unplugin-auto-import/dist/vite.js"
import Components from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-vue-components@0.2_7120c53ddb981ee9a4155a2ffe7af869/node_modules/unplugin-vue-components/dist/vite.js"
import Icons from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/vite.js"
import IconsResolver from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/resolver.js"
import { ElementPlusResolver } from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-vue-components@0.2_7120c53ddb981ee9a4155a2ffe7af869/node_modules/unplugin-vue-components/dist/resolvers.js"
import compression from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-compression@0.5_96cafdda9de985c0ef5e41ad840f587c/node_modules/vite-plugin-compression/dist/index.mjs"
import VueSetupExtend from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-vue-setup-exten_45652ef8c71fcec426c08c3dd51cc13b/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs"
import VueDevTools from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-vue-devtools@7._bfbc76a15d11ee183876dbf4397c2168/node_modules/vite-plugin-vue-devtools/dist/vite.mjs"
import svgLoader from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.13_typescript@5.7.3_/node_modules/vite-svg-loader/index.js"
import { ViteMinifyPlugin } from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-minify@2.1.0_vi_79e80adb743b938e0ffd656d4903e676/node_modules/vite-plugin-minify/dist/index.cjs"
import { createHtmlPlugin } from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-html@3.2.2_vite_225da61cb383e8a002e13b73b071f73f/node_modules/vite-plugin-html/dist/index.mjs"
import { createSvgIconsPlugin } from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/vite-plugin-svg-icons-ng@1._f8fbfd57ac748eb8d6ac0228bf0090e4/node_modules/vite-plugin-svg-icons-ng/dist/index.mjs"
import tailwindcss from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/@tailwindcss+vite@4.1.11_vi_eb1c8a4fffefb4b467b8ff63c50c8852/node_modules/@tailwindcss/vite/dist/index.mjs"
import path from "node:path"
import ElementPlus from "file:///E:/momo/Documents/GitHub/muxiDream/myVue/node_modules/.pnpm/unplugin-element-plus@0.9.1/node_modules/unplugin-element-plus/dist/vite.js"
var __vite_injected_original_import_meta_url = "file:///E:/momo/Documents/GitHub/muxiDream/myVue/vite.config.ts"
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    define: {
      __VUE_PROD_DEVTOOLS__: true,
      //打开控制台插件
    },
    server: {
      // host: "0.0.0.0", //开发模式开启调试的外网网址
      // open: true, //自动打开浏览器
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
        svgo: true,
        //移除svg内不必要的元数据
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
        // 添加本地组件目录
        dirs: ["src/components"],
        // 默认就是这个路径，你可以指定多个
        extensions: ["vue"],
        deep: true,
        // 是否递归子目录
        dts: "src/components.d.ts",
        // 生成类型定义文件，推荐开启
      }),
      ElementPlus({
        //组件中文配置
        defaultLocale: "zh-cn",
      }),
      Icons({
        autoInstall: true,
      }),
      legacy({
        targets: ["defaults", "ie 11"],
        //需要支持的浏览器，defaults是各大浏览器最新的两个版本
      }),
      //压缩成gzip，减少传输的资源大小，提高网站资源加载速度
      compression({
        filter: /.(js|mjs|json|css|html)$/i,
        algorithm: "gzip",
        ext: ".gz",
        // 输出文件的扩展名
        threshold: 10240,
        // 只压缩大于 1KB 的文件
        deleteOriginFile: false,
        // 是否删除源文件
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
      // html文件压缩
      ViteMinifyPlugin({
        collapseWhitespace: true,
        // 折叠空格
        removeComments: true,
        // 移除注释
        minifyJS: true,
        // 压缩 <script> 中的 JS
        minifyCSS: true,
        // 压缩 <style> 中的 CSS
      }),
      // 自定义svg组件
      createSvgIconsPlugin({
        // 指定图标文件夹（存放SVG的地方）
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[name]",
        // strokeOverride: true,
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      },
    },
    //下面的esbuild和build用于压缩打包后的代码,注释掉可以在线上看报错(开发环境下的store的语句也会被删除)
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
      // 删除生产环境下的所有的console 和 debugger
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      //压缩代码
      chunkSizeWarningLimit: 1500,
      //配置文件大小提醒限制，默认500
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
          entryFileNames: "assets/js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "assets/js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: "assets/[ext]/[name].[hash].[ext]",
        },
      },
    },
    //部署在主路径使用base:“/”(默认状态)，部署在子路径则使用base:“/ProjectName/”
    //webHistory模式下不能使用相对路径base:“./”
    base: "/",
  }
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxtb21vXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbXV4aURyZWFtXFxcXG15VnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxtb21vXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbXV4aURyZWFtXFxcXG15VnVlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9tb21vL0RvY3VtZW50cy9HaXRIdWIvbXV4aURyZWFtL215VnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCJcbmltcG9ydCB7IGxvYWRFbnYsIGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiXG5pbXBvcnQgbGVnYWN5IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1sZWdhY3lcIlxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIlxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIlxuaW1wb3J0IEljb25zIGZyb20gXCJ1bnBsdWdpbi1pY29ucy92aXRlXCJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCJcbmltcG9ydCBWdWVTZXR1cEV4dGVuZCBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZFwiXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1wiXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gXCJ2aXRlLXN2Zy1sb2FkZXJcIlxuaW1wb3J0IHsgVml0ZU1pbmlmeVBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1taW5pZnlcIlxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29ucy1uZ1wiXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIlxuXG4vLyBcdTVGMTVcdTUxNjV1bnBsdWdpbi1lbGVtZW50LXBsdXMsXHU2MzA5XHU5NzAwXHU1QkZDXHU1MTY1XHU2ODM3XHU1RjBGXG4vLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gXCJ1bnBsdWdpbi1lbGVtZW50LXBsdXMvdml0ZVwiXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuXG4vKipcbiAqIEBwYXJhbSBtb2RlIC0gXHU1RjUzXHU1MjREXHU3Njg0XHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGLFx1NTk4MiAnZGV2ZWxvcG1lbnQnXG4gKiBAcGFyYW0gY29tbWFuZCAtIFx1NUY1M1x1NTI0RFx1NjI2N1x1ODg0Q1x1NzY4NCBWaXRlIFx1ODExQVx1NjcyQ1x1NTQ3RFx1NEVFNCxcdTU5ODIgJ3NlcnZlcidcbiAqKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gdml0ZS5jb25maWcudHNcdTRFMkRcdTk3MDBcdTg5ODFcdTY2M0VcdTVGMEZcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdUZGMENcdTRFMTRcdTgzQjdcdTUzRDZcdTY1QjlcdTVGMEZcdTRFMERcdTY2MkZwcm9jZXNzLmVudi5YWFhcdUZGMENcdTgwMENcdTY2MkZlbnYuWFhYXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogdHJ1ZSwgLy9cdTYyNTNcdTVGMDBcdTYzQTdcdTUyMzZcdTUzRjBcdTYzRDJcdTRFRjZcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgLy8gaG9zdDogXCIwLjAuMC4wXCIsIC8vXHU1RjAwXHU1M0QxXHU2QTIxXHU1RjBGXHU1RjAwXHU1NDJGXHU4QzAzXHU4QkQ1XHU3Njg0XHU1OTE2XHU3RjUxXHU3RjUxXHU1NzQwXG4gICAgICAvLyBvcGVuOiB0cnVlLCAvL1x1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy9cdTUyNERcdTdBRUZcdTRFRTNcdTc0MDZcdTc2ODRcdTYzQTVcdTUzRTNcdUZGMENcdTRFQzVcdTk2NTBcdTY3MkNcdTU3MzBcdTVGMDBcdTUzRDFcdTRGN0ZcdTc1MjhcdUZGMENcdTRFMEFcdTdFQkZcdTRFNEJcdTU0MEVcdTk3MDBcdTg5ODFuZ2lueFx1NjIxNlx1NTQwRVx1N0FFRlx1NEVFM1x1NzQwNlxuICAgICAgICAvLyAgICAgXCIvZG93bmxvYWQxOTk5XCI6IHtcbiAgICAgICAgLy8gICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9nYW1lY21zLXJlcy5zbDkxNi5jb21cIixcbiAgICAgICAgLy8gICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vXHU2NjJGXHU1NDI2XHU4REU4XHU1N0RGXG4gICAgICAgIC8vICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Rvd25sb2FkMTk5OS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxuICAgICAgICAvLyAgICAgICAgIC8vIHdzOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgLy9cdTY2MkZcdTU0MjZcdTRFRTNcdTc0MDYgd2Vic29ja2V0c1xuICAgICAgICAvLyAgICAgICAgIHNlY3VyZTogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZodHRwc1x1NjNBNVx1NTNFM1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyBcIi9tdXNpY19hcGlcIjoge1xuICAgICAgICAvLyAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6NDAwMFwiLFxuICAgICAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1OERFOFx1NTdERlxuICAgICAgICAvLyAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL211c2ljX2FwaS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxuICAgICAgICAvLyAgICAgLy8gd3M6IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAvL1x1NjYyRlx1NTQyNlx1NEVFM1x1NzQwNiB3ZWJzb2NrZXRzXG4gICAgICAgIC8vICAgICBzZWN1cmU6IGZhbHNlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXG4gICAgICAgIC8vIH1cbiAgICAgIH0sXG4gICAgICB3YXJtdXA6IHtcbiAgICAgICAgY2xpZW50RmlsZXM6IFtcIi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWVcIl0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKHtcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHsgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aChcIndjLVwiKSB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICAvL1NWR1x1NjNEMlx1NEVGNlxuICAgICAgc3ZnTG9hZGVyKHtcbiAgICAgICAgc3ZnbzogdHJ1ZSwgLy9cdTc5RkJcdTk2NjRzdmdcdTUxODVcdTRFMERcdTVGQzVcdTg5ODFcdTc2ODRcdTUxNDNcdTY1NzBcdTYzNkVcbiAgICAgIH0pLFxuICAgICAgLy9cdThDMDNcdThCRDVcdTYzRDJcdTRFRjYsXHU5RUQ4XHU4QkE0XHU1NDJGXHU1MkE4dnNjb2RlXG4gICAgICBWdWVEZXZUb29scyh7XG4gICAgICAgIC8vIGxhdW5jaEVkaXRvcjogJ3dlYnN0b3JtJyxcbiAgICAgIH0pLFxuICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcblxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBWdWUgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBcmVmLCByZWFjdGl2ZSwgdG9SZWYgXHU3QjQ5XG4gICAgICAgIGltcG9ydHM6IFtcInZ1ZVwiXSxcbiAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICAgIHByZWZpeDogXCJJY29uXCIsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1N0VDNFx1NEVGNlxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogW1wiZXBcIl0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NjcyQ1x1NTczMFx1N0VDNFx1NEVGNlx1NzZFRVx1NUY1NVxuICAgICAgICBkaXJzOiBbXCJzcmMvY29tcG9uZW50c1wiXSwgLy8gXHU5RUQ4XHU4QkE0XHU1QzMxXHU2NjJGXHU4RkQ5XHU0RTJBXHU4REVGXHU1Rjg0XHVGRjBDXHU0RjYwXHU1M0VGXHU0RUU1XHU2MzA3XHU1QjlBXHU1OTFBXHU0RTJBXG4gICAgICAgIGV4dGVuc2lvbnM6IFtcInZ1ZVwiXSxcbiAgICAgICAgZGVlcDogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU5MDEyXHU1RjUyXHU1QjUwXHU3NkVFXHU1RjU1XG4gICAgICAgIGR0czogXCJzcmMvY29tcG9uZW50cy5kLnRzXCIsIC8vIFx1NzUxRlx1NjIxMFx1N0M3Qlx1NTc4Qlx1NUI5QVx1NEU0OVx1NjU4N1x1NEVGNlx1RkYwQ1x1NjNBOFx1ODM1MFx1NUYwMFx1NTQyRlxuICAgICAgfSksXG4gICAgICBFbGVtZW50UGx1cyh7XG4gICAgICAgIC8vXHU3RUM0XHU0RUY2XHU0RTJEXHU2NTg3XHU5MTREXHU3RjZFXG4gICAgICAgIGRlZmF1bHRMb2NhbGU6IFwiemgtY25cIixcbiAgICAgIH0pLFxuICAgICAgSWNvbnMoe1xuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgbGVnYWN5KHtcbiAgICAgICAgdGFyZ2V0czogW1wiZGVmYXVsdHNcIiwgXCJpZSAxMVwiXSwgLy9cdTk3MDBcdTg5ODFcdTY1MkZcdTYzMDFcdTc2ODRcdTZENEZcdTg5QzhcdTU2NjhcdUZGMENkZWZhdWx0c1x1NjYyRlx1NTQwNFx1NTkyN1x1NkQ0Rlx1ODlDOFx1NTY2OFx1NjcwMFx1NjVCMFx1NzY4NFx1NEUyNFx1NEUyQVx1NzI0OFx1NjcyQ1xuICAgICAgfSksXG4gICAgICAvL1x1NTM4Qlx1N0YyOVx1NjIxMGd6aXBcdUZGMENcdTUxQ0ZcdTVDMTFcdTRGMjBcdThGOTNcdTc2ODRcdThENDRcdTZFOTBcdTU5MjdcdTVDMEZcdUZGMENcdTYzRDBcdTlBRDhcdTdGNTFcdTdBRDlcdThENDRcdTZFOTBcdTUyQTBcdThGN0RcdTkwMUZcdTVFQTZcbiAgICAgIGNvbXByZXNzaW9uKHtcbiAgICAgICAgZmlsdGVyOiAvLihqc3xtanN8anNvbnxjc3N8aHRtbCkkL2ksXG4gICAgICAgIGFsZ29yaXRobTogXCJnemlwXCIsXG4gICAgICAgIGV4dDogXCIuZ3pcIiwgLy8gXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU3Njg0XHU2MjY5XHU1QzU1XHU1NDBEXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsIC8vIFx1NTNFQVx1NTM4Qlx1N0YyOVx1NTkyN1x1NEU4RSAxS0IgXHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTUyMjBcdTk2NjRcdTZFOTBcdTY1ODdcdTRFRjZcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBcdTk3MDBcdTg5ODFcdTZDRThcdTUxNjUgaW5kZXguaHRtbCBlanMgXHU2QTIxXHU3MjQ4XHU3Njg0XHU2NTcwXHU2MzZFXG4gICAgICAgICAqIFx1NEY3Rmh0bWxcdTY1ODdcdTRFRjZcdTc2ODRlanNcdTZBMjFcdTY3N0ZcdTRFMkRcdTgwRkRcdTU5MUZcdTgzQjdcdTUzRDZWSVRFX05PREVfTU9ERVxuICAgICAgICAgKi9cbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgVklURV9OT0RFX01PREU6IGVudi5WSVRFX05PREVfTU9ERSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICAvLyBodG1sXHU2NTg3XHU0RUY2XHU1MzhCXHU3RjI5XG4gICAgICBWaXRlTWluaWZ5UGx1Z2luKHtcbiAgICAgICAgY29sbGFwc2VXaGl0ZXNwYWNlOiB0cnVlLCAvLyBcdTYyOThcdTUzRTBcdTdBN0FcdTY4M0NcbiAgICAgICAgcmVtb3ZlQ29tbWVudHM6IHRydWUsIC8vIFx1NzlGQlx1OTY2NFx1NkNFOFx1OTFDQVxuICAgICAgICBtaW5pZnlKUzogdHJ1ZSwgLy8gXHU1MzhCXHU3RjI5IDxzY3JpcHQ+IFx1NEUyRFx1NzY4NCBKU1xuICAgICAgICBtaW5pZnlDU1M6IHRydWUsIC8vIFx1NTM4Qlx1N0YyOSA8c3R5bGU+IFx1NEUyRFx1NzY4NCBDU1NcbiAgICAgIH0pLFxuICAgICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5c3ZnXHU3RUM0XHU0RUY2XG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVx1RkYwOFx1NUI1OFx1NjUzRVNWR1x1NzY4NFx1NTczMFx1NjVCOVx1RkYwOVxuICAgICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyYy9hc3NldHMvaWNvbnNcIildLFxuICAgICAgICBzeW1ib2xJZDogXCJpY29uLVtuYW1lXVwiLFxuICAgICAgICAvLyBzdHJva2VPdmVycmlkZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvL1x1NEUwQlx1OTc2Mlx1NzY4NGVzYnVpbGRcdTU0OENidWlsZFx1NzUyOFx1NEU4RVx1NTM4Qlx1N0YyOVx1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NEVFM1x1NzgwMSxcdTZDRThcdTkxQ0FcdTYzODlcdTUzRUZcdTRFRTVcdTU3MjhcdTdFQkZcdTRFMEFcdTc3MEJcdTYyQTVcdTk1MTkoXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0c3RvcmVcdTc2ODRcdThCRURcdTUzRTVcdTRFNUZcdTRGMUFcdTg4QUJcdTUyMjBcdTk2NjQpXG4gICAgZXNidWlsZDoge1xuICAgICAgZHJvcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdIDogW10sIC8vIFx1NTIyMFx1OTY2NFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NFx1NjI0MFx1NjcwOVx1NzY4NGNvbnNvbGUgXHU1NDhDIGRlYnVnZ2VyXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICAgIG1pbmlmeTogXCJlc2J1aWxkXCIsIC8vXHU1MzhCXHU3RjI5XHU0RUUzXHU3ODAxXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsIC8vXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHU1OTI3XHU1QzBGXHU2M0QwXHU5MTkyXHU5NjUwXHU1MjM2XHVGRjBDXHU5RUQ4XHU4QkE0NTAwXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIC8vIFx1NkJDRlx1NEUyQW5vZGVfbW9kdWxlc1x1NkEyMVx1NTc1N1x1NTIwNlx1NjIxMFx1NEUwMFx1NEUyQWpzXHU2NTg3XHU0RUY2XG4gICAgICAgICAgLy8gbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gICAgICdncm91cC1ob21lJzogW1xuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvVGl0bGVEaXYudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL0FkZFVybC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQXNpZGUudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL05vdGljZS52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvVGl0bGVEaXYudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL1VwbG9hZEltYWdlLnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvRm9ydW0udnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Ib21lLnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQ29udGVudC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FydGljbGUudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9DZW50ZXIudnVlJyxcbiAgICAgICAgICAvLyAgICAgXSxcbiAgICAgICAgICAvLyAgICAgJ2dyb3VwLW1hbmFnZW1lbnQnOiBbXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5BcnRpY2xlc01hbmFnZW1lbnQudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkNlbnRlci52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluQ29tbWVudHNNYW5hZ2VtZW50LnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5GZWVkYmFja01hbmFnZW1lbnQudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkltYWdlc01hbmFnZW1lbnQudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkxvZ2luLnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5Ob3RpY2VzTWFuYWdlbWVudC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluVXJsc01hbmFnZW1lbnQudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pblVzZXJzTWFuYWdlbWVudC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJDZW50ZXIudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyRWRpdC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJJbmZvLnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlck1hbmFnZW1lbnQudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyUHJlZmVyZW5jZS52dWUnLFxuICAgICAgICAgIC8vICAgICBdLFxuICAgICAgICAgIC8vICAgICAnZ3JvdXAtb3RoZXJzJzogW1xuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0Rvd25sb2FkMTk5OS52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05ld3MudnVlJyxcbiAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9OZXdzQ29udGVudC52dWUnLFxuICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05vdEZvdW5kLnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvUm9sZXMxOTk5LnZ1ZScsXG4gICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvdXNlci52dWUnLFxuICAgICAgICAgIC8vICAgICBdLFxuICAgICAgICAgIC8vIH0sXG5cbiAgICAgICAgICAvLyBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgLy8gICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpXG4gICAgICAgICAgLy8gfVxuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU0RUNFXHU1MTY1XHU1M0UzXHU3MEI5XHU1MjFCXHU1RUZBXHU3Njg0XHU1NzU3XHU3Njg0XHU2MjUzXHU1MzA1XHU4RjkzXHU1MUZBXHU2ODNDXHU1RjBGW25hbWVdXHU4ODY4XHU3OTNBXHU2NTg3XHU0RUY2XHU1NDBELFtoYXNoXVx1ODg2OFx1NzkzQVx1OEJFNVx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOWhhc2hcdTUwM0NcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLltoYXNoXS5qc1wiLCAvLyBcdTc1MjhcdTRFOEVcdTU0N0RcdTU0MERcdTRFRTNcdTc4MDFcdTYyQzZcdTUyMDZcdTY1RjZcdTUyMUJcdTVFRkFcdTc2ODRcdTUxNzFcdTRFQUJcdTU3NTdcdTc2ODRcdThGOTNcdTUxRkFcdTU0N0RcdTU0MERcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLltoYXNoXS5qc1wiLCAvLyBcdTc1MjhcdTRFOEVcdThGOTNcdTUxRkFcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTc2ODRcdTU0N0RcdTU0MERcdUZGMENbZXh0XVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcImFzc2V0cy9bZXh0XS9bbmFtZV0uW2hhc2hdLltleHRdXCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy9cdTkwRThcdTdGNzJcdTU3MjhcdTRFM0JcdThERUZcdTVGODRcdTRGN0ZcdTc1MjhiYXNlOlx1MjAxQy9cdTIwMUQoXHU5RUQ4XHU4QkE0XHU3MkI2XHU2MDAxKVx1RkYwQ1x1OTBFOFx1N0Y3Mlx1NTcyOFx1NUI1MFx1OERFRlx1NUY4NFx1NTIxOVx1NEY3Rlx1NzUyOGJhc2U6XHUyMDFDL1Byb2plY3ROYW1lL1x1MjAxRFxuICAgIC8vd2ViSGlzdG9yeVx1NkEyMVx1NUYwRlx1NEUwQlx1NEUwRFx1ODBGRFx1NEY3Rlx1NzUyOFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NGJhc2U6XHUyMDFDLi9cdTIwMURcbiAgICBiYXNlOiBcIi9cIixcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxlQUFlLFdBQVc7QUFDelYsU0FBUyxTQUFTLG9CQUFvQjtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLG9CQUFvQjtBQUMzQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGVBQWU7QUFDdEIsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxVQUFVO0FBSWpCLE9BQU8saUJBQWlCO0FBckIySyxJQUFNLDJDQUEyQztBQTRCcFAsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FB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
