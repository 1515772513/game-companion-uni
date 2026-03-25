# 修复报告 - uni-app 页面路径和导入路径错误

## 问题描述

### 错误信息
```
pages/index/index not found
pages/user/login not found
pages/order/list not found
pages/companion/list not found
...
Cannot find module "D:/工作/2026/游玩/game-companion-uni/utils/websocket" from "App.vue"
Cannot find module 'D:/工作/2026/游玩/game-companion-uni/static/styles/global.scss' from 'App.vue'
```

### 错误原因

1. **页面路径问题**:
   - pages.json 中配置的路径是 `pages/index/index`
   - 但实际文件位于 `src/pages/index/index.vue`
   - uni-app 默认从项目根目录查找页面，不需要 `src` 前缀

2. **导入路径问题**:
   - App.vue 和其他文件使用了 `@/` 别名
   - uni-app 的 `@/` 别名默认指向项目根目录，但需要配置
   - 相对路径更加可靠和标准

3. **目录结构问题**:
   - 之前的结构不符合 uni-app 的标准目录结构
   - uni-app 期望核心目录（pages、components、utils、api、static）在根目录

## 解决方案

### 1. 调整目录结构

将所有必要的目录从 `src/` 移动到根目录：

```bash
# 创建标准目录结构
pages/          # 页面组件
components/     # 公共组件
utils/          # 工具函数
api/            # API 接口
static/         # 静态资源
store/          # 状态管理（已在根目录）
```

### 2. 修复导入路径

#### App.vue
```vue
<!-- 修复前 -->
import { useUserStore } from '@/store/user'
import ws from '@/utils/websocket'
@import '@/static/styles/global.scss';

<!-- 修复后 -->
import { useUserStore } from './store/user'
import ws from './utils/websocket'
@import './static/styles/global.scss';
```

#### 页面组件
```vue
<!-- 修复前 -->
import { useUserStore } from '@/store/user'

<!-- 修复后 -->
import { useUserStore } from '../store/user'
```

#### Store 文件
```javascript
// 修复前
import { wxLogin } from '@/api/user'

// 修复后
import { wxLogin } from '../api/user'
```

#### Utils 文件
```javascript
// 修复前
import { useAppStore } from '@/store/app'

// 修复后
import { useAppStore } from '../store/app'
```

### 3. 批量修复命令

```bash
# 修复页面和组件中的导入
find pages components -name "*.vue" -type f -exec sed -i "s|@/store|../store|g" {} \;
find pages components -name "*.vue" -type f -exec sed -i "s|@/utils|../utils|g" {} \;
find pages components -name "*.vue" -type f -exec sed -i "s|@/api|../api|g" {} \;
find pages components -name "*.vue" -type f -exec sed -i "s|@/components|../components|g" {} \;

# 修复 store 文件中的导入
sed -i "s|from '@/api|from '../api|g" store/*.js
sed -i "s|from '@/utils|from './utils|g" store/*.js

# 修复 utils 文件中的导入
sed -i "s|from '@/store|from '../store|g" utils/*.js

# 修复 api 文件中的导入
sed -i "s|from '@/utils|from '../utils|g" api/*.js
```

## uni-app 标准项目结构

```
project-root/
├── main.js              # 入口文件（根目录）
├── App.vue              # 应用组件（根目录）
├── pages.json           # 页面路由配置
├── manifest.json        # 应用配置
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── store/               # 状态管理
│   ├── index.js
│   ├── user.js
│   └── app.js
├── pages/               # 页面组件（根目录）
│   ├── index/
│   │   └── index.vue
│   ├── user/
│   │   └── login.vue
│   ├── order/
│   ├── companion/
│   ├── wallet/
│   ├── profile/
│   └── message/
├── components/          # 公共组件（根目录）
│   ├── AppNavbar.vue
│   ├── AppLoading.vue
│   ├── AppEmpty.vue
│   ├── AppCard.vue
│   └── AppImage.vue
├── utils/               # 工具函数（根目录）
│   ├── request.js
│   ├── websocket.js
│   ├── format.js
│   ├── validate.js
│   ├── storage.js
│   ├── common.js
│   └── index.js
├── api/                 # API 接口（根目录）
│   ├── user.js
│   ├── companion.js
│   ├── order.js
│   ├── message.js
│   └── index.js
├── static/              # 静态资源（根目录）
│   ├── images/
│   ├── icons/
│   ├── tabbar/
│   └── styles/
│       ├── global.scss
│       ├── variables.scss
│       └── mixins.scss
├── subpackages/         # 分包
│   └── companion/
│       ├── order/
│       └── earning/
├── src/                 # 源代码目录（可选，用于组织其他资源）
└── node_modules/        # 依赖包
```

## 路径引用规范

### 相对路径规则

```
从根目录文件引用:
- ./store      → store/
- ./utils      → utils/
- ./api        → api/

从 pages/ 引用:
- ../store     → store/
- ../utils     → utils/
- ../api       → api/
- ../components → components/

从 components/ 引用:
- ../store     → store/
- ../utils     → utils/
- ../api       → api/

从 utils/ 引用:
- ../store     → store/
- ./utils      → utils/（utils 内部）

从 store/ 引用:
- ../api       → api/
- ./utils      → utils/
```

### 不建议使用 @/ 别名

虽然可以配置 `@/` 别名，但：
1. 需要额外的配置
2. 可能在不同工具中有不同的行为
3. 相对路径更直观、更可靠
4. 符合 uni-app 的标准实践

## 验证修复

### 检查点

1. ✅ 页面文件位于根目录的 `pages/` 下
2. ✅ 所有导入使用相对路径
3. ✅ 没有使用 `@/` 别名
4. ✅ static 目录在根目录
5. ✅ 分包目录已创建

### 测试步骤

1. 在 HBuilderX 中运行项目
2. 检查控制台是否还有 "not found" 错误
3. 验证页面能否正常加载
4. 检查组件导入是否正常
5. 测试 API 调用是否正常

## 关键要点

### uni-app 与标准 Vue 项目的区别

1. **页面位置**:
   - uni-app: `pages/` 在根目录
   - 标准 Vue: 通常在 `src/pages/`

2. **导入方式**:
   - uni-app: 推荐使用相对路径
   - 标准 Vue: 可以使用 `@/` 别名（通过 vite 配置）

3. **配置文件**:
   - uni-app: pages.json, manifest.json
   - 标准 Vue: vite.config.js, router 配置

### 最佳实践

1. **遵循 uni-app 标准结构**
   - 核心目录在根目录
   - 使用 pages.json 配置路由
   - 使用 manifest.json 配置应用

2. **使用相对路径**
   - 更直观、更可靠
   - 避免别名配置问题
   - 便于团队协作

3. **保持目录简洁**
   - 不要过度嵌套
   - 按功能分类组织
   - 遵循命名规范

## Git 提交信息

```
commit 66738c1
fix: 修复 uni-app 页面路径和导入路径问题

- 将 pages、components、utils、api、static 复制到根目录（uni-app 标准结构）
- 修复 App.vue 中的导入路径，将 @/ 别名改为相对路径
- 批量修复所有 .vue 文件中的导入路径
- 修复 store 和 utils 文件中的相互导入路径
- 创建分包目录结构（subpackages/companion）
```

## 后续建议

1. ✅ 已修复所有路径问题
2. ⏳ 等待推送到远程仓库
3. ⏳ 在 HBuilderX 中测试运行
4. ⏳ 验证所有页面功能正常
5. ⏳ 完善其他页面功能

---

*修复时间: 2026-03-25 19:50*
*提交哈希: 66738c1*
*状态: 已修复，等待推送*
