# 游戏陪玩小程序 - 开发指南

## 项目简介

这是一个基于 uni-app + Vue3 开发的游戏陪玩微信小程序，支持用户端和陪玩师端双角色。

## 技术栈

- **框架**: uni-app (Vue3 + setup 语法糖)
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI 组件**: uni-ui
- **网络请求**: uni.request 封装
- **实时通信**: WebSocket

## 项目结构

```
src/
├── api/                 # API 接口模块
│   ├── user.js         # 用户相关接口
│   ├── companion.js    # 陪玩师相关接口
│   ├── order.js        # 订单相关接口
│   ├── message.js      # 消息相关接口
│   └── index.js        # 接口统一导出
├── pages/              # 页面
│   ├── index/          # 首页
│   ├── user/           # 用户相关页面
│   ├── order/          # 订单相关页面
│   ├── companion/      # 陪玩师相关页面
│   ├── wallet/         # 钱包相关页面
│   ├── profile/        # 个人中心页面
│   └── message/        # 消息相关页面
├── components/         # 公共组件
│   ├── AppNavbar.vue   # 导航栏组件
│   ├── AppLoading.vue  # 加载组件
│   ├── AppEmpty.vue    # 空状态组件
│   ├── AppCard.vue     # 卡片组件
│   └── AppImage.vue    # 图片组件
├── store/              # 状态管理
│   ├── index.js        # Store 入口
│   ├── user.js         # 用户状态
│   └── app.js          # 应用状态
├── utils/              # 工具函数
│   ├── request.js      # 网络请求封装
│   ├── format.js       # 格式化工具
│   ├── validate.js     # 验证工具
│   ├── storage.js      # 存储工具
│   ├── common.js       # 通用工具
│   ├── websocket.js    # WebSocket 封装
│   └── index.js        # 工具函数统一导出
├── static/             # 静态资源
│   ├── images/         # 图片资源
│   ├── icons/          # 图标资源
│   ├── tabbar/         # TabBar 图标
│   └── styles/         # 全局样式
│       ├── global.scss       # 全局样式
│       ├── variables.scss    # 样式变量
│       └── mixins.scss       # 样式混入
├── App.vue             # 应用入口组件
└── main.js             # 应用主入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build:prod
```

## 核心功能模块

### 1. 用户认证

- 微信快速登录
- Token 自动刷新
- 登录状态持久化

### 2. 状态管理

#### User Store (用户状态)

```javascript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 登录
await userStore.login(code)

// 获取用户信息
await userStore.fetchUserInfo()

// 退出登录
userStore.logout()
```

#### App Store (应用状态)

```javascript
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

// 初始化系统信息
appStore.initSystemInfo()

// 监听网络状态
appStore.watchNetworkStatus()

// 设置加载状态
appStore.setLoading(true)
```

### 3. 网络请求

#### 基础用法

```javascript
import request from '@/utils/request'

// GET 请求
const data = await request.get('/api/user/info')

// POST 请求
const result = await request.post('/api/order/create', orderData)
```

#### API 模块调用

```javascript
import { getUserInfo, createOrder } from '@/api'

// 获取用户信息
const userInfo = await getUserInfo()

// 创建订单
const order = await createOrder(orderData)
```

### 4. 工具函数

#### 格式化工具

```javascript
import { formatTime, formatAmount, formatPhone } from '@/utils'

// 格式化时间
const time = formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss')

// 格式化金额
const amount = formatAmount(1234.56)

// 格式化手机号
const phone = formatPhone('13800138000') // 138****8000
```

#### 验证工具

```javascript
import { isPhone, isEmail, isIdCard } from '@/utils'

// 验证手机号
if (isPhone('13800138000')) {
  // 有效手机号
}

// 验证邮箱
if (isEmail('test@example.com')) {
  // 有效邮箱
}
```

#### 通用工具

```javascript
import { showToast, showModal, navigateTo } from '@/utils'

// 显示提示
showToast('操作成功', 'success')

// 显示模态框
const confirmed = await showModal({
  title: '提示',
  content: '确定要删除吗？'
})

// 页面跳转
navigateTo('/pages/detail/detail', { id: 1 })
```

### 5. WebSocket 实时通信

```javascript
import ws from '@/utils/websocket'

// 连接 WebSocket
ws.connect(token)

// 发送消息
ws.send({ type: 'chat', content: 'Hello' })

// 监听消息
ws.on('message', (data) => {
  console.log('收到消息:', data)
})

// 关闭连接
ws.close()
```

## 开发规范

### 命名规范

- **文件命名**: 使用短横线命名法 (kebab-case)
- **组件命名**: 使用大驼峰命名法 (PascalCase)
- **变量/函数命名**: 使用小驼峰命名法 (camelCase)
- **常量命名**: 使用大写字母和下划线 (UPPER_SNAKE_CASE)

### 代码风格

项目使用 ESLint + Prettier 进行代码格式化，请确保:

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

### 组件开发

```vue
<template>
  <view class="my-component">
    <!-- 模板内容 -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props 定义
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

// Emits 定义
const emit = defineEmits(['click'])

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.my-component {
  // 样式内容
}
</style>
```

## 环境配置

### 开发环境 (.env.development)

```env
VITE_APP_API_BASE_URL=http://localhost:5000/api
VITE_APP_WS_BASE_URL=ws://localhost:5000/ws
```

### 生产环境 (.env.production)

```env
VITE_APP_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_WS_BASE_URL=wss://api.yourdomain.com/ws
```

## 发布部署

### 小程序发布

1. 在 HBuilderX 中打开项目
2. 点击 `发行` → `微信小程序自动上传`
3. 在微信公众平台提交审核

### 注意事项

1. 确保小程序 AppID 配置正确
2. 确保服务器域名已添加到小程序白名单
3. 检查业务域名配置

## 常见问题

### 1. 无法连接后端

- 检查 API 地址配置
- 检查服务器端口是否开放
- 检查跨域配置

### 2. 微信登录失败

- 检查 AppID 是否正确
- 检查服务器域名是否在小程序白名单
- 检查后端登录接口是否正常

### 3. WebSocket 连接失败

- 检查 WebSocket 地址配置
- 检查服务器是否支持 WebSocket
- 检查 Token 是否有效

## 技术支持

如有问题，请联系技术团队。
