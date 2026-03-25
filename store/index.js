/**
 * Pinia 状态管理入口
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 添加持久化插件
pinia.use(piniaPluginPersistedstate)

export default pinia
