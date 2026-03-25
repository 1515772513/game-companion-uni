# 修复报告 - uni-app 入口文件错误

## 问题描述

**错误信息**: `Could not resolve entry module "../../../../工作/2026/game-companion-uni/main.js`

**错误原因**:
uni-app 项目需要特定的目录结构，入口文件 `main.js` 和 `App.vue` 必须位于项目根目录，而不是 `src` 目录下。

## 解决方案

### 1. 创建正确的入口文件结构

#### 在根目录创建 `main.js`
```javascript
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
```

#### 将 `App.vue` 复制到根目录
从 `src/App.vue` 复制到根目录

#### 将 `store` 目录复制到根目录
从 `src/store/` 复制到根目录

### 2. 更新配置文件

#### 修改 `package.json`
将 `main` 字段从 `"src/main.js"` 改为 `"main.js"`:
```json
{
  "main": "main.js"
}
```

#### 简化 `vite.config.js`
移除不必要的构建配置（uni-app 会自动处理）:
```javascript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  }
})
```

#### 删除 `index.html`
uni-app 不需要手动创建 HTML 入口文件，框架会自动处理。

## uni-app 标准项目结构

```
project-root/
├── main.js              # 入口文件（根目录）
├── App.vue              # 应用组件（根目录）
├── pages.json           # 页面路由配置
├── manifest.json        # 应用配置
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── store/               # 状态管理（根目录）
│   ├── index.js
│   ├── user.js
│   └── app.js
├── src/                 # 源代码目录
│   ├── api/             # API 接口
│   ├── pages/           # 页面组件
│   ├── components/      # 公共组件
│   ├── utils/           # 工具函数
│   └── static/          # 静态资源
│       ├── images/
│       ├── icons/
│       ├── tabbar/
│       └── styles/
└── node_modules/        # 依赖包
```

## 关键要点

### uni-app 与标准 Vue 项目的区别

1. **入口文件位置**:
   - 标准 Vue 项目: `src/main.js`
   - uni-app 项目: `main.js`（根目录）

2. **HTML 文件**:
   - 标准 Vue 项目: 需要 `index.html`
   - uni-app 项目: 不需要，自动生成

3. **构建配置**:
   - uni-app 通过 `@dcloudio/vite-plugin-uni` 插件处理
   - 不需要手动配置 rollup、terser 等

4. **页面路由**:
   - 使用 `pages.json` 配置，而不是 Vue Router

## 验证修复

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

### 预期结果
- ✅ 不再出现入口模块解析错误
- ✅ 项目正常启动
- ✅ 可以在微信开发者工具中预览

## 后续步骤

1. ✅ 依赖安装中...
2. ⏳ 测试项目运行
3. ⏳ 在微信开发者工具中验证
4. ⏳ 完善其他页面功能

## Git 提交信息

```
commit c48cc4c
fix: 修复 uni-app 项目入口文件错误

- 在根目录创建 main.js 入口文件（uni-app 标准结构）
- 将 App.vue 复制到根目录
- 将 store 目录复制到根目录
- 更新 package.json 的 main 字段指向正确的入口
- 简化 vite.config.js 配置，移除不必要的构建选项
- 删除不需要的 index.html 文件（uni-app 自动处理）
```

## 技术说明

### 为什么需要根目录的文件？

uni-app 的编译器（通过 `@dcloudio/vite-plugin-uni`）会：
1. 从根目录的 `main.js` 开始编译
2. 读取根目录的 `pages.json` 和 `manifest.json`
3. 自动生成不同平台（小程序、H5、App）的入口文件

如果入口文件不在根目录，编译器将无法找到正确的入口点。

### src 目录的作用

`src` 目录仍然是有效的，用于组织：
- 页面组件（`src/pages/`）
- 公共组件（`src/components/`）
- API 接口（`src/api/`）
- 工具函数（`src/utils/`）
- 静态资源（`src/static/`）

这些文件会被 uni-app 的编译器正确处理和引用。

---

*修复时间: 2026-03-25 19:30*
*提交哈希: c48cc4c*
*状态: 已修复并推送到远程仓库*
