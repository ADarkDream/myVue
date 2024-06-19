import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import legacy from "@vitejs/plugin-legacy"
import compression from 'vite-plugin-compression';
// https://vitejs.dev/config/

export default defineConfig({
    define: {//打开控制台插件
        __VUE_PROD_DEVTOOLS__: true,
    },
    server: {
        host: "0.0.0.0",//开发模式开启调试的外网网址
        // proxy: { //前端代理的接口，仅限本地开发使用，上线之后需要nginx或后端代理
        //     "/download1999": {
        //         target: "https://gamecms-res.sl916.com",
        //         changeOrigin: true, //是否跨域
        //         rewrite: (path) => path.replace(/^\/download1999/, ""), //将代理的地址替换为目标地址
        //         // ws: true,                       //是否代理 websockets
        //         secure: true, //是否https接口
        //     }
        // }
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {isCustomElement: (tag) => tag.startsWith('wc-')}
            },
        }),
        VueSetupExtend(),
        // 以下两项是为配置Element-plus自动按需导入
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        //压缩打包后的代码，去掉注释
        legacy({
            targets: ["defaults", "ie 11"]
        }),
        //压缩成gzip，减少传输的资源大小，提高网站资源加载速度
        compression({
            algorithm: 'gzip',
            ext: '.gz', // 输出文件的扩展名
            threshold: 10240, // 只压缩大于 10KB 的文件
            deleteOriginFile: false, // 是否删除源文件
        })

    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    //下面的esbuild和build用于压缩打包后的代码
    esbuild: {
        drop: ['console', 'debugger'], // 删除 所有的console 和 debugger
    },
    build: {
        chunkSizeWarningLimit: 1500,//配置文件大小提醒限制，默认500
        // rollupOptions: {
        //     output: {
        //每个node_modules模块分成一个js文件
        // manualChunks(id) {
        //     if (id.includes('node_modules')) {
        //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
        //     }
        // },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        //         entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
        //         chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
        //         assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        //     }
        // }
    },
    //部署在主路径使用base:“/”(默认状态)，部署在子路径则使用base:“/ProjectName/”
    //webHistory模式下不能使用相对路径base:“./”
    base: '/',

})
