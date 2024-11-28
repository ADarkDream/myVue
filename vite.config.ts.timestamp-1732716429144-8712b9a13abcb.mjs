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
      drop: ["console", "debugger"]
      // 删除 开发和生产环境下的所有的console 和 debugger
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEcmVhbVxcXFxEb2N1bWVudHNcXFxcR2l0ZWVcXFxcbXlWdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERyZWFtXFxcXERvY3VtZW50c1xcXFxHaXRlZVxcXFxteVZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRHJlYW0vRG9jdW1lbnRzL0dpdGVlL215VnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSAndml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZCdcclxuaW1wb3J0IGxlZ2FjeSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tbGVnYWN5XCJcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xyXG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcblxyXG4vKipcclxuICogQHBhcmFtIG1vZGUgLSBcdTVGNTNcdTUyNERcdTc2ODRcdThGRDBcdTg4NENcdTZBMjFcdTVGMEYsXHU1OTgyICdkZXZlbG9wbWVudCdcclxuICogQHBhcmFtIGNvbW1hbmQgLSBcdTVGNTNcdTUyNERcdTYyNjdcdTg4NENcdTc2ODQgVml0ZSBcdTgxMUFcdTY3MkNcdTU0N0RcdTRFRTQsXHU1OTgyICdzZXJ2ZXInXHJcbiAqKi9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSwgY29tbWFuZCB9OiB7IG1vZGU6IHN0cmluZywgY29tbWFuZDogc3RyaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcclxuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgICAgIGRlZmluZToge1xyXG4gICAgICAgICAgICBfX1ZVRV9QUk9EX0RFVlRPT0xTX186IHRydWUsLy9cdTYyNTNcdTVGMDBcdTYzQTdcdTUyMzZcdTUzRjBcdTYzRDJcdTRFRjZcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZlcjoge1xyXG4gICAgICAgICAgICBob3N0OiBcIjAuMC4wLjBcIiwvL1x1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NUYwMFx1NTQyRlx1OEMwM1x1OEJENVx1NzY4NFx1NTkxNlx1N0Y1MVx1N0Y1MVx1NTc0MFxyXG4gICAgICAgICAgICBwcm94eTogeyAvL1x1NTI0RFx1N0FFRlx1NEVFM1x1NzQwNlx1NzY4NFx1NjNBNVx1NTNFM1x1RkYwQ1x1NEVDNVx1OTY1MFx1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMVx1NEY3Rlx1NzUyOFx1RkYwQ1x1NEUwQVx1N0VCRlx1NEU0Qlx1NTQwRVx1OTcwMFx1ODk4MW5naW54XHU2MjE2XHU1NDBFXHU3QUVGXHU0RUUzXHU3NDA2XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCIvZG93bmxvYWQxOTk5XCI6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vZ2FtZWNtcy1yZXMuc2w5MTYuY29tXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZcdThERThcdTU3REZcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Rvd25sb2FkMTk5OS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAvLyB3czogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgIC8vXHU2NjJGXHU1NDI2XHU0RUUzXHU3NDA2IHdlYnNvY2tldHNcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc2VjdXJlOiB0cnVlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gXCIvbXVzaWNfYXBpXCI6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo0MDAwXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1OERFOFx1NTdERlxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9tdXNpY19hcGkvLCBcIlwiKSwgLy9cdTVDMDZcdTRFRTNcdTc0MDZcdTc2ODRcdTU3MzBcdTU3NDBcdTY2RkZcdTYzNjJcdTRFM0FcdTc2RUVcdTY4MDdcdTU3MzBcdTU3NDBcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyB3czogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgIC8vXHU2NjJGXHU1NDI2XHU0RUUzXHU3NDA2IHdlYnNvY2tldHNcclxuICAgICAgICAgICAgICAgIC8vICAgICBzZWN1cmU6IGZhbHNlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdhcm11cDoge1xyXG4gICAgICAgICAgICAgICAgY2xpZW50RmlsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAnL3NyYy9jb21wb25lbnRzL1RpdGxlRGl2LnZ1ZSdcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgICB2dWUoe1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHsgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgnd2MtJykgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIC8vU1ZHXHU2M0QyXHU0RUY2XHJcbiAgICAgICAgICAgIHN2Z0xvYWRlcigpLFxyXG4gICAgICAgICAgICAvL1x1OEMwM1x1OEJENVx1NjNEMlx1NEVGNixcdTlFRDhcdThCQTRcdTU0MkZcdTUyQTh2c2NvZGVcclxuICAgICAgICAgICAgVnVlRGV2VG9vbHMoe1xyXG4gICAgICAgICAgICAgICAgLy8gbGF1bmNoRWRpdG9yOiAnd2Vic3Rvcm0nLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcclxuXHJcbiAgICAgICAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcclxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFsndnVlJ10sXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXHJcbiAgICAgICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICdJY29uJyxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIENvbXBvbmVudHMoe1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFsnZXAnXSxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBJY29ucyh7XHJcbiAgICAgICAgICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxlZ2FjeSh7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBbXCJkZWZhdWx0c1wiLCBcImllIDExXCJdXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAvL1x1NTM4Qlx1N0YyOVx1NjIxMGd6aXBcdUZGMENcdTUxQ0ZcdTVDMTFcdTRGMjBcdThGOTNcdTc2ODRcdThENDRcdTZFOTBcdTU5MjdcdTVDMEZcdUZGMENcdTYzRDBcdTlBRDhcdTdGNTFcdTdBRDlcdThENDRcdTZFOTBcdTUyQTBcdThGN0RcdTkwMUZcdTVFQTZcclxuICAgICAgICAgICAgY29tcHJlc3Npb24oe1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAvLihqc3xtanN8anNvbnxjc3N8aHRtbCkkL2ksXHJcbiAgICAgICAgICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgICAgICAgICAgIGV4dDogJy5neicsIC8vIFx1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1NzY4NFx1NjI2OVx1NUM1NVx1NTQwRFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gXHU1M0VBXHU1MzhCXHU3RjI5XHU1OTI3XHU0RThFIDFLQiBcdTc2ODRcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTUyMjBcdTk2NjRcdTZFOTBcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIFx1OTcwMFx1ODk4MVx1NkNFOFx1NTE2NSBpbmRleC5odG1sIGVqcyBcdTZBMjFcdTcyNDhcdTc2ODRcdTY1NzBcdTYzNkVcclxuICAgICAgICAgICAgICAgICogXHU0RjdGaHRtbFx1NjU4N1x1NEVGNlx1NzY4NGVqc1x1NkEyMVx1Njc3Rlx1NEUyRFx1ODBGRFx1NTkxRlx1ODNCN1x1NTNENlZJVEVfTk9ERV9NT0RFXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWSVRFX05PREVfTU9ERTogZW52LlZJVEVfTk9ERV9NT0RFLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL1x1NEUwQlx1OTc2Mlx1NzY4NGVzYnVpbGRcdTU0OENidWlsZFx1NzUyOFx1NEU4RVx1NTM4Qlx1N0YyOVx1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NEVFM1x1NzgwMSxcdTZDRThcdTkxQ0FcdTYzODlcdTUzRUZcdTRFRTVcdTU3MjhcdTdFQkZcdTRFMEFcdTc3MEJcdTYyQTVcdTk1MTkoXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0c3RvcmVcdTc2ODRcdThCRURcdTUzRTVcdTRFNUZcdTRGMUFcdTg4QUJcdTUyMjBcdTk2NjQpXHJcbiAgICAgICAgZXNidWlsZDoge1xyXG4gICAgICAgICAgICBkcm9wOiBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSwgLy8gXHU1MjIwXHU5NjY0IFx1NUYwMFx1NTNEMVx1NTQ4Q1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NFx1NjI0MFx1NjcwOVx1NzY4NGNvbnNvbGUgXHU1NDhDIGRlYnVnZ2VyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsLy9cdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcdTYzRDBcdTkxOTJcdTk2NTBcdTUyMzZcdUZGMENcdTlFRDhcdThCQTQ1MDBcclxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU2QkNGXHU0RTJBbm9kZV9tb2R1bGVzXHU2QTIxXHU1NzU3XHU1MjA2XHU2MjEwXHU0RTAwXHU0RTJBanNcdTY1ODdcdTRFRjZcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgJ2dyb3VwLWhvbWUnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQWRkVXJsLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9Bc2lkZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvTm90aWNlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvVXBsb2FkSW1hZ2UudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Gb3J1bS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0hvbWUudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Db250ZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQXJ0aWNsZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0NlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAnZ3JvdXAtbWFuYWdlbWVudCc6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkFydGljbGVzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluQ2VudGVyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5Db21tZW50c01hbmFnZW1lbnQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkZlZWRiYWNrTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluSW1hZ2VzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluTG9naW4udnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbk5vdGljZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5VcmxzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluVXNlcnNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckNlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJFZGl0LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckluZm8udnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJQcmVmZXJlbmNlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICdncm91cC1vdGhlcnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvRG93bmxvYWQxOTk5LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvTmV3cy52dWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05ld3NDb250ZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvTm90Rm91bmQudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Sb2xlczE5OTkudnVlJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy91c2VyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAvLyBcdTc1MjhcdTRFOEVcdTRFQ0VcdTUxNjVcdTUzRTNcdTcwQjlcdTUyMUJcdTVFRkFcdTc2ODRcdTU3NTdcdTc2ODRcdTYyNTNcdTUzMDVcdThGOTNcdTUxRkFcdTY4M0NcdTVGMEZbbmFtZV1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTU0MEQsW2hhc2hdXHU4ODY4XHU3OTNBXHU4QkU1XHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5aGFzaFx1NTAzQ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsIC8vIFx1NzUyOFx1NEU4RVx1NTQ3RFx1NTQwRFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlx1NjVGNlx1NTIxQlx1NUVGQVx1NzY4NFx1NTE3MVx1NEVBQlx1NTc1N1x1NzY4NFx1OEY5M1x1NTFGQVx1NTQ3RFx1NTQwRFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsIC8vIFx1NzUyOFx1NEU4RVx1OEY5M1x1NTFGQVx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NzY4NFx1NTQ3RFx1NTQwRFx1RkYwQ1tleHRdXHU4ODY4XHU3OTNBXHU2NTg3XHU0RUY2XHU2MjY5XHU1QzU1XHU1NDBEXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0uW2hhc2hdLltleHRdJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL1x1OTBFOFx1N0Y3Mlx1NTcyOFx1NEUzQlx1OERFRlx1NUY4NFx1NEY3Rlx1NzUyOGJhc2U6XHUyMDFDL1x1MjAxRChcdTlFRDhcdThCQTRcdTcyQjZcdTYwMDEpXHVGRjBDXHU5MEU4XHU3RjcyXHU1NzI4XHU1QjUwXHU4REVGXHU1Rjg0XHU1MjE5XHU0RjdGXHU3NTI4YmFzZTpcdTIwMUMvUHJvamVjdE5hbWUvXHUyMDFEXHJcbiAgICAgICAgLy93ZWJIaXN0b3J5XHU2QTIxXHU1RjBGXHU0RTBCXHU0RTBEXHU4MEZEXHU0RjdGXHU3NTI4XHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0YmFzZTpcdTIwMUMuL1x1MjAxRFxyXG4gICAgICAgIGJhc2U6ICcvJyxcclxuXHJcbiAgICB9KVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLGVBQWUsV0FBVztBQUV6VCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGVBQWU7QUFDdEIsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxlQUFlO0FBZnFKLElBQU0sMkNBQTJDO0FBc0I5TixJQUFPLHNCQUFRLENBQUMsRUFBRSxNQUFNLFFBQVEsTUFBeUM7QUFDckUsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxTQUFPLGFBQWE7QUFBQSxJQUNoQixRQUFRO0FBQUEsTUFDSix1QkFBdUI7QUFBQTtBQUFBLElBQzNCO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUE7QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWVQO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDSixhQUFhO0FBQUEsVUFDVDtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsSUFBSTtBQUFBLFFBQ0EsVUFBVTtBQUFBLFVBQ04saUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxJQUFJLFdBQVcsS0FBSyxFQUFFO0FBQUEsUUFDdkU7QUFBQSxNQUNKLENBQUM7QUFBQTtBQUFBLE1BRUQsVUFBVTtBQUFBO0FBQUEsTUFFVixZQUFZO0FBQUE7QUFBQSxNQUVaLENBQUM7QUFBQSxNQUNELGVBQWU7QUFBQSxNQUVmLFdBQVc7QUFBQTtBQUFBLFFBRVAsU0FBUyxDQUFDLEtBQUs7QUFBQSxRQUNmLFdBQVc7QUFBQTtBQUFBLFVBRVAsb0JBQW9CO0FBQUE7QUFBQSxVQUVwQixjQUFjO0FBQUEsWUFDVixRQUFRO0FBQUEsVUFDWixDQUFDO0FBQUEsUUFDTDtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBRVAsV0FBVztBQUFBO0FBQUEsVUFFUCxvQkFBb0I7QUFBQTtBQUFBLFVBRXBCLGNBQWM7QUFBQSxZQUNWLG9CQUFvQixDQUFDLElBQUk7QUFBQSxVQUM3QixDQUFDO0FBQUEsUUFDTDtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsTUFBTTtBQUFBLFFBQ0YsYUFBYTtBQUFBLE1BQ2pCLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQSxRQUNILFNBQVMsQ0FBQyxZQUFZLE9BQU87QUFBQSxNQUNqQyxDQUFDO0FBQUE7QUFBQSxNQUVELFlBQVk7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxRQUNYLEtBQUs7QUFBQTtBQUFBLFFBQ0wsV0FBVztBQUFBO0FBQUEsUUFDWCxrQkFBa0I7QUFBQTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxNQUNELGlCQUFpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLYixRQUFRO0FBQUEsVUFDSixNQUFNO0FBQUEsWUFDRixnQkFBZ0IsSUFBSTtBQUFBLFVBQ3hCO0FBQUEsUUFDSjtBQUFBLE1BQ0osQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFFeEQ7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNMLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQTtBQUFBLElBQ2hDO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCx1QkFBdUI7QUFBQTtBQUFBLE1BQ3ZCLGVBQWU7QUFBQSxRQUNYLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBbURSO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQTtBQUFBO0FBQUEsSUFHQSxNQUFNO0FBQUEsRUFFVixDQUFDO0FBQ0w7IiwKICAibmFtZXMiOiBbXQp9Cg==
