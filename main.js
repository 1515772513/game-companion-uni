import App from './App'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import pinia from './store'

export function createApp() {
  const app = createSSRApp(App)

  // 注册状态管理
  app.use(pinia)

  return {
    app
  }
}
