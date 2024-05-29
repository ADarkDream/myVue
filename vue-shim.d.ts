// declare module '*.png' {
//   const value: string;
//   export = value;
// }
//解决报错Vue: Cannot find module '@/assets/google.png' or its corresponding type declarations.
declare module "*.png" {
  const value: any;
  export default value;
}