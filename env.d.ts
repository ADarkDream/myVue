/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />



//解决wangEditor在TS中引入报错的问题，但USerEdit已经解决TS检查了
// declare module '@wangeditor/editor-for-vue' {
// const Editor: any;
// const Toolbar: any;
// type IEditorConfig = any;
// }
//



//解决报错Vue: Cannot find module '@/hooks/useTimestamp' or its corresponding type declarations.
declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}

//因为这是js库，在ts环境中需要额外声明
declare module 'file-saver'