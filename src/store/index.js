import { createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()

export default pinia

// 导出各个 store 模块
export * from './user'
export * from './app'
