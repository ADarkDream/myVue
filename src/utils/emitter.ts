// 引入mitt

type Handler<T = any> = (payload: T) => void

const events: { [key: string]: Handler[] } = {}

// 注册事件监听
function on<T>(event: string, handler: Handler<T>): void {
  if (!events[event]) {
    events[event] = []
  }
  events[event].push(handler)
}

// 触发事件
function emit<T>(event: string, payload: T): void {
  if (events[event]) {
    events[event].forEach((handler) => handler(payload))
  }
}

// 移除事件监听
function off<T>(event: string, handler: Handler<T>): void {
  if (events[event]) {
    events[event] = events[event].filter((h) => h !== handler)
  }
}

// 导出 emitter 对象
export const emitter = {
  on,
  emit,
  off,
}
