// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-vue-components/dist/resolvers.js";
import VueSetupExtend from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import legacy from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import compression from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite-plugin-compression/dist/index.mjs";
import VueDevTools from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import svgLoader from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite-svg-loader/index.js";
import { createHtmlPlugin } from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite-plugin-html/dist/index.mjs";
import { loadEnv } from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///E:/Dream/Documents/Gitee/myVue/vite.config.ts";
var vite_config_default = ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      __VUE_PROD_DEVTOOLS__: true
      //打开控制台插件
    },
    server: {
      host: "0.0.0.0",
      //开发模式开启调试的外网网址
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
        clientFiles: [
          "/src/components/TitleDiv.vue"
        ]
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: { isCustomElement: (tag) => tag.startsWith("wc-") }
        }
      }),
      //SVG插件
      svgLoader(),
      //调试插件,默认启动vscode
      VueDevTools({
        // launchEditor: 'webstorm',
      }),
      VueSetupExtend(),
      // 以下两项是为配置Element-plus自动按需导入
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      legacy({
        targets: ["defaults", "ie 11"]
      }),
      //压缩成gzip，减少传输的资源大小，提高网站资源加载速度
      compression({
        filter: /.(js|mjs|json|css|html)$/i,
        algorithm: "gzip",
        ext: ".gz",
        // 输出文件的扩展名
        threshold: 10240,
        // 只压缩大于 1KB 的文件
        deleteOriginFile: false
        // 是否删除源文件
      }),
      createHtmlPlugin({
        /**
        * 需要注入 index.html ejs 模版的数据
        * 使html文件的ejs模板中能够获取VITE_NODE_MODE
        */
        inject: {
          data: {
            VITE_NODE_MODE: env.VITE_NODE_MODE
          }
        }
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    //下面的esbuild和build用于压缩打包后的代码,注释掉可以在线上看报错(开发环境下的store的语句也会被删除)
    esbuild: {
      drop: process.env.NODE_MODE === "production" ? ["console", "debugger"] : []
      // drop: ['console', 'debugger'], // 删除 开发和生产环境下的所有的console 和 debugger
    },
    build: {
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
          //  // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          //         entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
          //         chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
          //         assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      }
    },
    //部署在主路径使用base:“/”(默认状态)，部署在子路径则使用base:“/ProjectName/”
    //webHistory模式下不能使用相对路径base:“./”
    base: "/"
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEcmVhbVxcXFxEb2N1bWVudHNcXFxcR2l0ZWVcXFxcbXlWdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERyZWFtXFxcXERvY3VtZW50c1xcXFxHaXRlZVxcXFxteVZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRHJlYW0vRG9jdW1lbnRzL0dpdGVlL215VnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnXHJcbmltcG9ydCBsZWdhY3kgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiXHJcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xyXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCdcclxuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBtb2RlIC0gXHU1RjUzXHU1MjREXHU3Njg0XHU4RkQwXHU4ODRDXHU2QTIxXHU1RjBGLFx1NTk4MiAnZGV2ZWxvcG1lbnQnXHJcbiAqIEBwYXJhbSBjb21tYW5kIC0gXHU1RjUzXHU1MjREXHU2MjY3XHU4ODRDXHU3Njg0IFZpdGUgXHU4MTFBXHU2NzJDXHU1NDdEXHU0RUU0LFx1NTk4MiAnc2VydmVyJ1xyXG4gKiovXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUsIGNvbW1hbmQgfTogeyBtb2RlOiBzdHJpbmcsIGNvbW1hbmQ6IHN0cmluZyB9KSA9PiB7XHJcbiAgICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgICBkZWZpbmU6IHtcclxuICAgICAgICAgICAgX19WVUVfUFJPRF9ERVZUT09MU19fOiB0cnVlLC8vXHU2MjUzXHU1RjAwXHU2M0E3XHU1MjM2XHU1M0YwXHU2M0QyXHU0RUY2XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICAgICAgaG9zdDogXCIwLjAuMC4wXCIsLy9cdTVGMDBcdTUzRDFcdTZBMjFcdTVGMEZcdTVGMDBcdTU0MkZcdThDMDNcdThCRDVcdTc2ODRcdTU5MTZcdTdGNTFcdTdGNTFcdTU3NDBcclxuICAgICAgICAgICAgcHJveHk6IHsgLy9cdTUyNERcdTdBRUZcdTRFRTNcdTc0MDZcdTc2ODRcdTYzQTVcdTUzRTNcdUZGMENcdTRFQzVcdTk2NTBcdTY3MkNcdTU3MzBcdTVGMDBcdTUzRDFcdTRGN0ZcdTc1MjhcdUZGMENcdTRFMEFcdTdFQkZcdTRFNEJcdTU0MEVcdTk3MDBcdTg5ODFuZ2lueFx1NjIxNlx1NTQwRVx1N0FFRlx1NEVFM1x1NzQwNlxyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwiL2Rvd25sb2FkMTk5OVwiOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRhcmdldDogXCJodHRwczovL2dhbWVjbXMtcmVzLnNsOTE2LmNvbVwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vXHU2NjJGXHU1NDI2XHU4REU4XHU1N0RGXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9kb3dubG9hZDE5OTkvLCBcIlwiKSwgLy9cdTVDMDZcdTRFRTNcdTc0MDZcdTc2ODRcdTU3MzBcdTU3NDBcdTY2RkZcdTYzNjJcdTRFM0FcdTc2RUVcdTY4MDdcdTU3MzBcdTU3NDBcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gd3M6IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAvL1x1NjYyRlx1NTQyNlx1NEVFM1x1NzQwNiB3ZWJzb2NrZXRzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNlY3VyZTogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZodHRwc1x1NjNBNVx1NTNFM1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFwiL211c2ljX2FwaVwiOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6NDAwMFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZcdThERThcdTU3REZcclxuICAgICAgICAgICAgICAgIC8vICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvbXVzaWNfYXBpLywgXCJcIiksIC8vXHU1QzA2XHU0RUUzXHU3NDA2XHU3Njg0XHU1NzMwXHU1NzQwXHU2NkZGXHU2MzYyXHU0RTNBXHU3NkVFXHU2ODA3XHU1NzMwXHU1NzQwXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gd3M6IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAvL1x1NjYyRlx1NTQyNlx1NEVFM1x1NzQwNiB3ZWJzb2NrZXRzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2VjdXJlOiBmYWxzZSwgLy9cdTY2MkZcdTU0MjZodHRwc1x1NjNBNVx1NTNFM1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3YXJtdXA6IHtcclxuICAgICAgICAgICAgICAgIGNsaWVudEZpbGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJy9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgdnVlKHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7IGlzQ3VzdG9tRWxlbWVudDogKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgoJ3djLScpIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAvL1NWR1x1NjNEMlx1NEVGNlxyXG4gICAgICAgICAgICBzdmdMb2FkZXIoKSxcclxuICAgICAgICAgICAgLy9cdThDMDNcdThCRDVcdTYzRDJcdTRFRjYsXHU5RUQ4XHU4QkE0XHU1NDJGXHU1MkE4dnNjb2RlXHJcbiAgICAgICAgICAgIFZ1ZURldlRvb2xzKHtcclxuICAgICAgICAgICAgICAgIC8vIGxhdW5jaEVkaXRvcjogJ3dlYnN0b3JtJyxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIFZ1ZVNldHVwRXh0ZW5kKCksXHJcbiAgICAgICAgICAgIC8vIFx1NEVFNVx1NEUwQlx1NEUyNFx1OTg3OVx1NjYyRlx1NEUzQVx1OTE0RFx1N0Y2RUVsZW1lbnQtcGx1c1x1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVxyXG4gICAgICAgICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBsZWdhY3koe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0czogW1wiZGVmYXVsdHNcIiwgXCJpZSAxMVwiXVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgLy9cdTUzOEJcdTdGMjlcdTYyMTBnemlwXHVGRjBDXHU1MUNGXHU1QzExXHU0RjIwXHU4RjkzXHU3Njg0XHU4RDQ0XHU2RTkwXHU1OTI3XHU1QzBGXHVGRjBDXHU2M0QwXHU5QUQ4XHU3RjUxXHU3QUQ5XHU4RDQ0XHU2RTkwXHU1MkEwXHU4RjdEXHU5MDFGXHU1RUE2XHJcbiAgICAgICAgICAgIGNvbXByZXNzaW9uKHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogLy4oanN8bWpzfGpzb258Y3NzfGh0bWwpJC9pLFxyXG4gICAgICAgICAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXHJcbiAgICAgICAgICAgICAgICBleHQ6ICcuZ3onLCAvLyBcdThGOTNcdTUxRkFcdTY1ODdcdTRFRjZcdTc2ODRcdTYyNjlcdTVDNTVcdTU0MERcclxuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMTAyNDAsIC8vIFx1NTNFQVx1NTM4Qlx1N0YyOVx1NTkyN1x1NEU4RSAxS0IgXHU3Njg0XHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSwgLy8gXHU2NjJGXHU1NDI2XHU1MjIwXHU5NjY0XHU2RTkwXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiBcdTk3MDBcdTg5ODFcdTZDRThcdTUxNjUgaW5kZXguaHRtbCBlanMgXHU2QTIxXHU3MjQ4XHU3Njg0XHU2NTcwXHU2MzZFXHJcbiAgICAgICAgICAgICAgICAqIFx1NEY3Rmh0bWxcdTY1ODdcdTRFRjZcdTc2ODRlanNcdTZBMjFcdTY3N0ZcdTRFMkRcdTgwRkRcdTU5MUZcdTgzQjdcdTUzRDZWSVRFX05PREVfTU9ERVxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGluamVjdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVklURV9OT0RFX01PREU6IGVudi5WSVRFX05PREVfTU9ERSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy9cdTRFMEJcdTk3NjJcdTc2ODRlc2J1aWxkXHU1NDhDYnVpbGRcdTc1MjhcdTRFOEVcdTUzOEJcdTdGMjlcdTYyNTNcdTUzMDVcdTU0MEVcdTc2ODRcdTRFRTNcdTc4MDEsXHU2Q0U4XHU5MUNBXHU2Mzg5XHU1M0VGXHU0RUU1XHU1NzI4XHU3RUJGXHU0RTBBXHU3NzBCXHU2MkE1XHU5NTE5KFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NHN0b3JlXHU3Njg0XHU4QkVEXHU1M0U1XHU0RTVGXHU0RjFBXHU4OEFCXHU1MjIwXHU5NjY0KVxyXG4gICAgICAgIGVzYnVpbGQ6IHtcclxuICAgICAgICAgICAgZHJvcDogcHJvY2Vzcy5lbnYuTk9ERV9NT0RFID09PSAncHJvZHVjdGlvbicgPyBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSA6IFtdLFxyXG4gICAgICAgICAgICAvLyBkcm9wOiBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSwgLy8gXHU1MjIwXHU5NjY0IFx1NUYwMFx1NTNEMVx1NTQ4Q1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NFx1NjI0MFx1NjcwOVx1NzY4NGNvbnNvbGUgXHU1NDhDIGRlYnVnZ2VyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsLy9cdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcdTYzRDBcdTkxOTJcdTk2NTBcdTUyMzZcdUZGMENcdTlFRDhcdThCQTQ1MDBcclxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU2QkNGXHU0RTJBbm9kZV9tb2R1bGVzXHU2QTIxXHU1NzU3XHU1MjA2XHU2MjEwXHU0RTAwXHU0RTJBanNcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ2dyb3VwLWhvbWUnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQWRkVXJsLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9Bc2lkZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvTm90aWNlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvVXBsb2FkSW1hZ2UudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Gb3J1bS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0hvbWUudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Db250ZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQXJ0aWNsZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0NlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAnZ3JvdXAtbWFuYWdlbWVudCc6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkFydGljbGVzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluQ2VudGVyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5Db21tZW50c01hbmFnZW1lbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkZlZWRiYWNrTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluSW1hZ2VzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluTG9naW4udnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbk5vdGljZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5VcmxzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluVXNlcnNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckNlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJFZGl0LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckluZm8udnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJQcmVmZXJlbmNlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICdncm91cC1vdGhlcnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvRG93bmxvYWQxOTk5LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvTmV3cy52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05ld3NDb250ZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvTm90Rm91bmQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Sb2xlczE5OTkudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy91c2VyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAvLyBcdTc1MjhcdTRFOEVcdTRFQ0VcdTUxNjVcdTUzRTNcdTcwQjlcdTUyMUJcdTVFRkFcdTc2ODRcdTU3NTdcdTc2ODRcdTYyNTNcdTUzMDVcdThGOTNcdTUxRkFcdTY4M0NcdTVGMEZbbmFtZV1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTU0MEQsW2hhc2hdXHU4ODY4XHU3OTNBXHU4QkU1XHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5aGFzaFx1NTAzQ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsIC8vIFx1NzUyOFx1NEU4RVx1NTQ3RFx1NTQwRFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlx1NjVGNlx1NTIxQlx1NUVGQVx1NzY4NFx1NTE3MVx1NEVBQlx1NTc1N1x1NzY4NFx1OEY5M1x1NTFGQVx1NTQ3RFx1NTQwRFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsIC8vIFx1NzUyOFx1NEU4RVx1OEY5M1x1NTFGQVx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NzY4NFx1NTQ3RFx1NTQwRFx1RkYwQ1tleHRdXHU4ODY4XHU3OTNBXHU2NTg3XHU0RUY2XHU2MjY5XHU1QzU1XHU1NDBEXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0uW2hhc2hdLltleHRdJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL1x1OTBFOFx1N0Y3Mlx1NTcyOFx1NEUzQlx1OERFRlx1NUY4NFx1NEY3Rlx1NzUyOGJhc2U6XHUyMDFDL1x1MjAxRChcdTlFRDhcdThCQTRcdTcyQjZcdTYwMDEpXHVGRjBDXHU5MEU4XHU3RjcyXHU1NzI4XHU1QjUwXHU4REVGXHU1Rjg0XHU1MjE5XHU0RjdGXHU3NTI4YmFzZTpcdTIwMUMvUHJvamVjdE5hbWUvXHUyMDFEXHJcbiAgICAgICAgLy93ZWJIaXN0b3J5XHU2QTIxXHU1RjBGXHU0RTBCXHU0RTBEXHU4MEZEXHU0RjdGXHU3NTI4XHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0YmFzZTpcdTIwMUMuL1x1MjAxRFxyXG4gICAgICAgIGJhc2U6ICcvJyxcclxuXHJcbiAgICB9KVxyXG59Il0s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
