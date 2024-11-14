// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-vue-components/dist/vite.js";
import Icons from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///E:/Dream/Documents/Gitee/myVue/node_modules/unplugin-icons/dist/resolver.js";
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
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon"
          })
        ]
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"]
          })
        ]
      }),
      Icons({
        autoInstall: true
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEcmVhbVxcXFxEb2N1bWVudHNcXFxcR2l0ZWVcXFxcbXlWdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERyZWFtXFxcXERvY3VtZW50c1xcXFxHaXRlZVxcXFxteVZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRHJlYW0vRG9jdW1lbnRzL0dpdGVlL215VnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSAndml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZCdcclxuaW1wb3J0IGxlZ2FjeSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tbGVnYWN5XCJcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xyXG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcblxyXG4vKipcclxuICogQHBhcmFtIG1vZGUgLSBcdTVGNTNcdTUyNERcdTc2ODRcdThGRDBcdTg4NENcdTZBMjFcdTVGMEYsXHU1OTgyICdkZXZlbG9wbWVudCdcclxuICogQHBhcmFtIGNvbW1hbmQgLSBcdTVGNTNcdTUyNERcdTYyNjdcdTg4NENcdTc2ODQgVml0ZSBcdTgxMUFcdTY3MkNcdTU0N0RcdTRFRTQsXHU1OTgyICdzZXJ2ZXInXHJcbiAqKi9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSwgY29tbWFuZCB9OiB7IG1vZGU6IHN0cmluZywgY29tbWFuZDogc3RyaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcclxuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgICAgIGRlZmluZToge1xyXG4gICAgICAgICAgICBfX1ZVRV9QUk9EX0RFVlRPT0xTX186IHRydWUsLy9cdTYyNTNcdTVGMDBcdTYzQTdcdTUyMzZcdTUzRjBcdTYzRDJcdTRFRjZcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZlcjoge1xyXG4gICAgICAgICAgICBob3N0OiBcIjAuMC4wLjBcIiwvL1x1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NUYwMFx1NTQyRlx1OEMwM1x1OEJENVx1NzY4NFx1NTkxNlx1N0Y1MVx1N0Y1MVx1NTc0MFxyXG4gICAgICAgICAgICBwcm94eTogeyAvL1x1NTI0RFx1N0FFRlx1NEVFM1x1NzQwNlx1NzY4NFx1NjNBNVx1NTNFM1x1RkYwQ1x1NEVDNVx1OTY1MFx1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMVx1NEY3Rlx1NzUyOFx1RkYwQ1x1NEUwQVx1N0VCRlx1NEU0Qlx1NTQwRVx1OTcwMFx1ODk4MW5naW54XHU2MjE2XHU1NDBFXHU3QUVGXHU0RUUzXHU3NDA2XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCIvZG93bmxvYWQxOTk5XCI6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vZ2FtZWNtcy1yZXMuc2w5MTYuY29tXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZcdThERThcdTU3REZcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Rvd25sb2FkMTk5OS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAvLyB3czogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgIC8vXHU2NjJGXHU1NDI2XHU0RUUzXHU3NDA2IHdlYnNvY2tldHNcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc2VjdXJlOiB0cnVlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gXCIvbXVzaWNfYXBpXCI6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo0MDAwXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1OERFOFx1NTdERlxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9tdXNpY19hcGkvLCBcIlwiKSwgLy9cdTVDMDZcdTRFRTNcdTc0MDZcdTc2ODRcdTU3MzBcdTU3NDBcdTY2RkZcdTYzNjJcdTRFM0FcdTc2RUVcdTY4MDdcdTU3MzBcdTU3NDBcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyB3czogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgIC8vXHU2NjJGXHU1NDI2XHU0RUUzXHU3NDA2IHdlYnNvY2tldHNcclxuICAgICAgICAgICAgICAgIC8vICAgICBzZWN1cmU6IGZhbHNlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdhcm11cDoge1xyXG4gICAgICAgICAgICAgICAgY2xpZW50RmlsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnL3NyYy9jb21wb25lbnRzL1RpdGxlRGl2LnZ1ZSdcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgICB2dWUoe1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHsgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgnd2MtJykgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIC8vU1ZHXHU2M0QyXHU0RUY2XHJcbiAgICAgICAgICAgIHN2Z0xvYWRlcigpLFxyXG4gICAgICAgICAgICAvL1x1OEMwM1x1OEJENVx1NjNEMlx1NEVGNixcdTlFRDhcdThCQTRcdTU0MkZcdTUyQTh2c2NvZGVcclxuICAgICAgICAgICAgVnVlRGV2VG9vbHMoe1xyXG4gICAgICAgICAgICAgICAgLy8gbGF1bmNoRWRpdG9yOiAnd2Vic3Rvcm0nLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcclxuXHJcbiAgICAgICAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcclxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFsndnVlJ10sXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXHJcbiAgICAgICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICdJY29uJyxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIENvbXBvbmVudHMoe1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFsnZXAnXSxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBJY29ucyh7XHJcbiAgICAgICAgICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxlZ2FjeSh7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBbXCJkZWZhdWx0c1wiLCBcImllIDExXCJdXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAvL1x1NTM4Qlx1N0YyOVx1NjIxMGd6aXBcdUZGMENcdTUxQ0ZcdTVDMTFcdTRGMjBcdThGOTNcdTc2ODRcdThENDRcdTZFOTBcdTU5MjdcdTVDMEZcdUZGMENcdTYzRDBcdTlBRDhcdTdGNTFcdTdBRDlcdThENDRcdTZFOTBcdTUyQTBcdThGN0RcdTkwMUZcdTVFQTZcclxuICAgICAgICAgICAgY29tcHJlc3Npb24oe1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAvLihqc3xtanN8anNvbnxjc3N8aHRtbCkkL2ksXHJcbiAgICAgICAgICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgICAgICAgICAgIGV4dDogJy5neicsIC8vIFx1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1NzY4NFx1NjI2OVx1NUM1NVx1NTQwRFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gXHU1M0VBXHU1MzhCXHU3RjI5XHU1OTI3XHU0RThFIDFLQiBcdTc2ODRcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTUyMjBcdTk2NjRcdTZFOTBcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIFx1OTcwMFx1ODk4MVx1NkNFOFx1NTE2NSBpbmRleC5odG1sIGVqcyBcdTZBMjFcdTcyNDhcdTc2ODRcdTY1NzBcdTYzNkVcclxuICAgICAgICAgICAgICAgICogXHU0RjdGaHRtbFx1NjU4N1x1NEVGNlx1NzY4NGVqc1x1NkEyMVx1Njc3Rlx1NEUyRFx1ODBGRFx1NTkxRlx1ODNCN1x1NTNENlZJVEVfTk9ERV9NT0RFXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWSVRFX05PREVfTU9ERTogZW52LlZJVEVfTk9ERV9NT0RFLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL1x1NEUwQlx1OTc2Mlx1NzY4NGVzYnVpbGRcdTU0OENidWlsZFx1NzUyOFx1NEU4RVx1NTM4Qlx1N0YyOVx1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NEVFM1x1NzgwMSxcdTZDRThcdTkxQ0FcdTYzODlcdTUzRUZcdTRFRTVcdTU3MjhcdTdFQkZcdTRFMEFcdTc3MEJcdTYyQTVcdTk1MTkoXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0c3RvcmVcdTc2ODRcdThCRURcdTUzRTVcdTRFNUZcdTRGMUFcdTg4QUJcdTUyMjBcdTk2NjQpXHJcbiAgICAgICAgZXNidWlsZDoge1xyXG4gICAgICAgICAgICBkcm9wOiBwcm9jZXNzLmVudi5OT0RFX01PREUgPT09ICdwcm9kdWN0aW9uJyA/IFsnY29uc29sZScsICdkZWJ1Z2dlciddIDogW10sXHJcbiAgICAgICAgICAgIC8vIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLCAvLyBcdTUyMjBcdTk2NjQgXHU1RjAwXHU1M0QxXHU1NDhDXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0XHU2MjQwXHU2NzA5XHU3Njg0Y29uc29sZSBcdTU0OEMgZGVidWdnZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTUwMCwvL1x1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1NTkyN1x1NUMwRlx1NjNEMFx1OTE5Mlx1OTY1MFx1NTIzNlx1RkYwQ1x1OUVEOFx1OEJBNDUwMFxyXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTZCQ0ZcdTRFMkFub2RlX21vZHVsZXNcdTZBMjFcdTU3NTdcdTUyMDZcdTYyMTBcdTRFMDBcdTRFMkFqc1x1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAnZ3JvdXAtaG9tZSc6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL1RpdGxlRGl2LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9BZGRVcmwudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL0FzaWRlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9Ob3RpY2UudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL1RpdGxlRGl2LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9VcGxvYWRJbWFnZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0ZvcnVtLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvSG9tZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0NvbnRlbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BcnRpY2xlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQ2VudGVyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICdncm91cC1tYW5hZ2VtZW50JzogW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluQXJ0aWNsZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5DZW50ZXIudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkNvbW1lbnRzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluRmVlZGJhY2tNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5JbWFnZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5Mb2dpbi52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluTm90aWNlc01hbmFnZW1lbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pblVybHNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5Vc2Vyc01hbmFnZW1lbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyQ2VudGVyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckVkaXQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VySW5mby52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlclByZWZlcmVuY2UudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ2dyb3VwLW90aGVycyc6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Eb3dubG9hZDE5OTkudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9OZXdzLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvTmV3c0NvbnRlbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Ob3RGb3VuZC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1JvbGVzMTk5OS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL3VzZXIudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIC8vIFx1NzUyOFx1NEU4RVx1NEVDRVx1NTE2NVx1NTNFM1x1NzBCOVx1NTIxQlx1NUVGQVx1NzY4NFx1NTc1N1x1NzY4NFx1NjI1M1x1NTMwNVx1OEY5M1x1NTFGQVx1NjgzQ1x1NUYwRltuYW1lXVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NTQwRCxbaGFzaF1cdTg4NjhcdTc5M0FcdThCRTVcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjloYXNoXHU1MDNDXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzJywgLy8gXHU3NTI4XHU0RThFXHU1NDdEXHU1NDBEXHU0RUUzXHU3ODAxXHU2MkM2XHU1MjA2XHU2NUY2XHU1MjFCXHU1RUZBXHU3Njg0XHU1MTcxXHU0RUFCXHU1NzU3XHU3Njg0XHU4RjkzXHU1MUZBXHU1NDdEXHU1NDBEXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzJywgLy8gXHU3NTI4XHU0RThFXHU4RjkzXHU1MUZBXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3Njg0XHU1NDdEXHU1NDBEXHVGRjBDW2V4dF1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tleHRdL1tuYW1lXS5baGFzaF0uW2V4dF0nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vXHU5MEU4XHU3RjcyXHU1NzI4XHU0RTNCXHU4REVGXHU1Rjg0XHU0RjdGXHU3NTI4YmFzZTpcdTIwMUMvXHUyMDFEKFx1OUVEOFx1OEJBNFx1NzJCNlx1NjAwMSlcdUZGMENcdTkwRThcdTdGNzJcdTU3MjhcdTVCNTBcdThERUZcdTVGODRcdTUyMTlcdTRGN0ZcdTc1MjhiYXNlOlx1MjAxQy9Qcm9qZWN0TmFtZS9cdTIwMURcclxuICAgICAgICAvL3dlYkhpc3RvcnlcdTZBMjFcdTVGMEZcdTRFMEJcdTRFMERcdTgwRkRcdTRGN0ZcdTc1MjhcdTc2RjhcdTVCRjlcdThERUZcdTVGODRiYXNlOlx1MjAxQy4vXHUyMDFEXHJcbiAgICAgICAgYmFz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
