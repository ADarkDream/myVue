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
var __vite_injected_original_import_meta_url = "file:///E:/Dream/Documents/Gitee/myVue/vite.config.ts";
var vite_config_default = defineConfig({
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
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  //下面的esbuild和build用于压缩打包后的代码,注释掉可以在线上看报错(开发环境下的store的语句也会被删除)
  esbuild: {
    // drop: ['console', 'debugger'], // 删除 所有的console 和 debugger
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEcmVhbVxcXFxEb2N1bWVudHNcXFxcR2l0ZWVcXFxcbXlWdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERyZWFtXFxcXERvY3VtZW50c1xcXFxHaXRlZVxcXFxteVZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRHJlYW0vRG9jdW1lbnRzL0dpdGVlL215VnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBVUkx9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQge0VsZW1lbnRQbHVzUmVzb2x2ZXJ9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnXHJcbmltcG9ydCBsZWdhY3kgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiXHJcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogdHJ1ZSwvL1x1NjI1M1x1NUYwMFx1NjNBN1x1NTIzNlx1NTNGMFx1NjNEMlx1NEVGNlxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLC8vXHU1RjAwXHU1M0QxXHU2QTIxXHU1RjBGXHU1RjAwXHU1NDJGXHU4QzAzXHU4QkQ1XHU3Njg0XHU1OTE2XHU3RjUxXHU3RjUxXHU1NzQwXHJcbiAgICAgICAgcHJveHk6IHsgLy9cdTUyNERcdTdBRUZcdTRFRTNcdTc0MDZcdTc2ODRcdTYzQTVcdTUzRTNcdUZGMENcdTRFQzVcdTk2NTBcdTY3MkNcdTU3MzBcdTVGMDBcdTUzRDFcdTRGN0ZcdTc1MjhcdUZGMENcdTRFMEFcdTdFQkZcdTRFNEJcdTU0MEVcdTk3MDBcdTg5ODFuZ2lueFx1NjIxNlx1NTQwRVx1N0FFRlx1NEVFM1x1NzQwNlxyXG4gICAgICAgICAgICAvLyAgICAgXCIvZG93bmxvYWQxOTk5XCI6IHtcclxuICAgICAgICAgICAgLy8gICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9nYW1lY21zLXJlcy5zbDkxNi5jb21cIixcclxuICAgICAgICAgICAgLy8gICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vXHU2NjJGXHU1NDI2XHU4REU4XHU1N0RGXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2Rvd25sb2FkMTk5OS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxyXG4gICAgICAgICAgICAvLyAgICAgICAgIC8vIHdzOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgLy9cdTY2MkZcdTU0MjZcdTRFRTNcdTc0MDYgd2Vic29ja2V0c1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHNlY3VyZTogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZodHRwc1x1NjNBNVx1NTNFM1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyBcIi9tdXNpY19hcGlcIjoge1xyXG4gICAgICAgICAgICAvLyAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6NDAwMFwiLFxyXG4gICAgICAgICAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvL1x1NjYyRlx1NTQyNlx1OERFOFx1NTdERlxyXG4gICAgICAgICAgICAvLyAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL211c2ljX2FwaS8sIFwiXCIpLCAvL1x1NUMwNlx1NEVFM1x1NzQwNlx1NzY4NFx1NTczMFx1NTc0MFx1NjZGRlx1NjM2Mlx1NEUzQVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFxyXG4gICAgICAgICAgICAvLyAgICAgLy8gd3M6IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAvL1x1NjYyRlx1NTQyNlx1NEVFM1x1NzQwNiB3ZWJzb2NrZXRzXHJcbiAgICAgICAgICAgIC8vICAgICBzZWN1cmU6IGZhbHNlLCAvL1x1NjYyRlx1NTQyNmh0dHBzXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHdhcm11cDp7XHJcbiAgICAgICAgICAgIGNsaWVudEZpbGVzOltcclxuICAgICAgICAgICAgICAgICcvc3JjL2NvbXBvbmVudHMvVGl0bGVEaXYudnVlJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2dWUoe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7aXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgnd2MtJyl9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy9TVkdcdTYzRDJcdTRFRjZcclxuICAgICAgICBzdmdMb2FkZXIoKSxcclxuICAgICAgICAvL1x1OEMwM1x1OEJENVx1NjNEMlx1NEVGNixcdTlFRDhcdThCQTRcdTU0MkZcdTUyQTh2c2NvZGVcclxuICAgICAgICBWdWVEZXZUb29scyh7XHJcbiAgICAgICAgICAgIC8vIGxhdW5jaEVkaXRvcjogJ3dlYnN0b3JtJyxcclxuICAgICAgICB9KSxcclxuICAgICAgICBWdWVTZXR1cEV4dGVuZCgpLFxyXG4gICAgICAgIC8vIFx1NEVFNVx1NEUwQlx1NEUyNFx1OTg3OVx1NjYyRlx1NEUzQVx1OTE0RFx1N0Y2RUVsZW1lbnQtcGx1c1x1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVxyXG4gICAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGxlZ2FjeSh7XHJcbiAgICAgICAgICAgIHRhcmdldHM6IFtcImRlZmF1bHRzXCIsIFwiaWUgMTFcIl1cclxuICAgICAgICB9KSxcclxuICAgICAgICAvL1x1NTM4Qlx1N0YyOVx1NjIxMGd6aXBcdUZGMENcdTUxQ0ZcdTVDMTFcdTRGMjBcdThGOTNcdTc2ODRcdThENDRcdTZFOTBcdTU5MjdcdTVDMEZcdUZGMENcdTYzRDBcdTlBRDhcdTdGNTFcdTdBRDlcdThENDRcdTZFOTBcdTUyQTBcdThGN0RcdTkwMUZcdTVFQTZcclxuICAgICAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgICAgICAgIGZpbHRlcjogLy4oanN8bWpzfGpzb258Y3NzfGh0bWwpJC9pLFxyXG4gICAgICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgICAgICAgZXh0OiAnLmd6JywgLy8gXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU3Njg0XHU2MjY5XHU1QzU1XHU1NDBEXHJcbiAgICAgICAgICAgIHRocmVzaG9sZDogMTAyNDAsIC8vIFx1NTNFQVx1NTM4Qlx1N0YyOVx1NTkyN1x1NEU4RSAxS0IgXHU3Njg0XHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTUyMjBcdTk2NjRcdTZFOTBcdTY1ODdcdTRFRjZcclxuICAgICAgICB9KVxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvL1x1NEUwQlx1OTc2Mlx1NzY4NGVzYnVpbGRcdTU0OENidWlsZFx1NzUyOFx1NEU4RVx1NTM4Qlx1N0YyOVx1NjI1M1x1NTMwNVx1NTQwRVx1NzY4NFx1NEVFM1x1NzgwMSxcdTZDRThcdTkxQ0FcdTYzODlcdTUzRUZcdTRFRTVcdTU3MjhcdTdFQkZcdTRFMEFcdTc3MEJcdTYyQTVcdTk1MTkoXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0c3RvcmVcdTc2ODRcdThCRURcdTUzRTVcdTRFNUZcdTRGMUFcdTg4QUJcdTUyMjBcdTk2NjQpXHJcbiAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgLy8gZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sIC8vIFx1NTIyMFx1OTY2NCBcdTYyNDBcdTY3MDlcdTc2ODRjb25zb2xlIFx1NTQ4QyBkZWJ1Z2dlclxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNTAwLC8vXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHU1OTI3XHU1QzBGXHU2M0QwXHU5MTkyXHU5NjUwXHU1MjM2XHVGRjBDXHU5RUQ4XHU4QkE0NTAwXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIC8vIFx1NkJDRlx1NEUyQW5vZGVfbW9kdWxlc1x1NkEyMVx1NTc1N1x1NTIwNlx1NjIxMFx1NEUwMFx1NEUyQWpzXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgICAgICAgICAvLyBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAnZ3JvdXAtaG9tZSc6IFtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvVGl0bGVEaXYudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQWRkVXJsLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL0FzaWRlLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL05vdGljZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9UaXRsZURpdi52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9VcGxvYWRJbWFnZS52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvRm9ydW0udnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0hvbWUudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0NvbnRlbnQudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FydGljbGUudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0NlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJ2dyb3VwLW1hbmFnZW1lbnQnOiBbXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkFydGljbGVzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5DZW50ZXIudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluQ29tbWVudHNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkZlZWRiYWNrTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvQWRtaW5JbWFnZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbkxvZ2luLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pbk5vdGljZXNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pblVybHNNYW5hZ2VtZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9BZG1pblVzZXJzTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckNlbnRlci52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlckVkaXQudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL1VzZXJJbmZvLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Vc2VyTWFuYWdlbWVudC52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvVXNlclByZWZlcmVuY2UudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICBdLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICdncm91cC1vdGhlcnMnOiBbXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Eb3dubG9hZDE5OTkudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05ld3MudnVlJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJy4vc3JjL3BhZ2VzL05ld3NDb250ZW50LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy9Ob3RGb3VuZC52dWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnLi9zcmMvcGFnZXMvUm9sZXMxOTk5LnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICcuL3NyYy9wYWdlcy91c2VyLnZ1ZScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXSxcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgLy8gXHU3NTI4XHU0RThFXHU0RUNFXHU1MTY1XHU1M0UzXHU3MEI5XHU1MjFCXHU1RUZBXHU3Njg0XHU1NzU3XHU3Njg0XHU2MjUzXHU1MzA1XHU4RjkzXHU1MUZBXHU2ODNDXHU1RjBGW25hbWVdXHU4ODY4XHU3OTNBXHU2NTg3XHU0RUY2XHU1NDBELFtoYXNoXVx1ODg2OFx1NzkzQVx1OEJFNVx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOWhhc2hcdTUwM0NcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsIC8vIFx1NzUyOFx1NEU4RVx1NTQ3RFx1NTQwRFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlx1NjVGNlx1NTIxQlx1NUVGQVx1NzY4NFx1NTE3MVx1NEVBQlx1NTc1N1x1NzY4NFx1OEY5M1x1NTFGQVx1NTQ3RFx1NTQwRFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzJywgLy8gXHU3NTI4XHU0RThFXHU4RjkzXHU1MUZBXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3Njg0XHU1NDdEXHU1NDBEXHVGRjBDW2V4dF1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLltoYXNoXS5bZXh0XSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvL1x1OTBFOFx1N0Y3Mlx1NTcyOFx1NEUzQlx1OERFRlx1NUY4NFx1NEY3Rlx1NzUyOGJhc2U6XHUyMDFDL1x1MjAxRChcdTlFRDhcdThCQTRcdTcyQjZcdTYwMDEpXHVGRjBDXHU5MEU4XHU3RjcyXHU1NzI4XHU1QjUwXHU4REVGXHU1Rjg0XHU1MjE5XHU0RjdGXHU3NTI4YmFzZTpcdTIwMUMvUHJvamVjdE5hbWUvXHUyMDFEXHJcbiAgICAvL3dlYkhpc3RvcnlcdTZBMjFcdTVGMEZcdTRFMEJcdTRFMERcdTgwRkRcdTRGN0ZcdTc1MjhcdTc2RjhcdTVCRjlcdThERUZcdTVGODRiYXNlOlx1MjAxQy4vXHUyMDFEXHJcbiAgICBiYXNlOiAnLycsXHJcblxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVEsZUFBZSxXQUFVO0FBRXZULFNBQVEsb0JBQW1CO0FBQzNCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFRLDJCQUEwQjtBQUNsQyxPQUFPLG9CQUFvQjtBQUMzQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxlQUFlO0FBWHVKLElBQU0sMkNBQTJDO0FBYzlOLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLHVCQUF1QjtBQUFBO0FBQUEsRUFDM0I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBZVA7QUFBQSxJQUNBLFFBQU87QUFBQSxNQUNILGFBQVk7QUFBQSxRQUNSO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDTixpQkFBaUIsRUFBQyxpQkFBaUIsQ0FBQyxRQUFRLElBQUksV0FBVyxLQUFLLEVBQUM7QUFBQSxNQUNyRTtBQUFBLElBQ0osQ0FBQztBQUFBO0FBQUEsSUFFRCxVQUFVO0FBQUE7QUFBQSxJQUVWLFlBQVk7QUFBQTtBQUFBLElBRVosQ0FBQztBQUFBLElBQ0QsZUFBZTtBQUFBO0FBQUEsSUFFZixXQUFXO0FBQUEsTUFDUCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNyQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDUCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNyQyxDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsTUFDSCxTQUFTLENBQUMsWUFBWSxPQUFPO0FBQUEsSUFDakMsQ0FBQztBQUFBO0FBQUEsSUFFRCxZQUFZO0FBQUEsTUFDUixRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUE7QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBLE1BQ1gsa0JBQWtCO0FBQUE7QUFBQSxJQUN0QixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN4RDtBQUFBLEVBQ0o7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBO0FBQUEsRUFFVDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsdUJBQXVCO0FBQUE7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDWCxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQW1EUjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBLEVBR0EsTUFBTTtBQUVWLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
