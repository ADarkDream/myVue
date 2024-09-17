// 引入mitt
import mitt from "mitt";

// 创建emitter
// const emitter = mitt()

/*
  // 绑定事件
  emitter.on('abc',(value)=>{
    console.log('abc事件被触发',value)
  })
  emitter.on('xyz',(value)=>{
    console.log('xyz事件被触发',value)
  })

  setInterval(() => {
    // 触发事件
    emitter.emit('abc',666)
    emitter.emit('xyz',777)
  }, 1000);

  setTimeout(() => {
    // 清理事件
    emitter.all.clear()
  }, 3000);
*/

// 创建并暴露mitt
//export default emitter

// import mitt from 'mitt'
// type ValidateFunc = () => boolean
// type Emits<EventType extends string | symbol, T> = {
//   on(type: EventType, handler: (arg: T) => void): void
//   off(type: EventType, handler: (arg: T) => void): void
//   emit(type: EventType, arg: T): void
// }
// type Emitter = Emits<'form-item-created', ValidateFunc>
// export const emitter = mitt()
type Handler<T = any> = (payload: T) => void;

const events: { [key: string]: Handler[] } = {};

// 注册事件监听
function on<T>(event: string, handler: Handler<T>): void {
  if (!events[event]) {
    events[event] = [];
  }
  events[event].push(handler);
}

// 触发事件
function emit<T>(event: string, payload: T): void {
  if (events[event]) {
    events[event].forEach((handler) => handler(payload));
  }
}

// 移除事件监听
function off<T>(event: string, handler: Handler<T>): void {
  if (events[event]) {
    events[event] = events[event].filter(h => h !== handler);
  }
}

// 导出 emitter 对象
export const emitter = {
  on,
  emit,
  off,
};

