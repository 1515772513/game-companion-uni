import {
  createSSRApp
} from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'

// 导入过滤器
import filters from './utils/filter.js'

export function createApp () {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  
  // 注册全局过滤器
  Object.keys(filters).forEach(key => {
    app.config.globalProperties[`$${key}`] = filters[key]
  })
  return {
    app,
    Pinia
  }
}
