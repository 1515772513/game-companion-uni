# API接口完善报告

## 概述

根据【测试接口文档-0410-别动.v1】文档，对现有项目中的API接口进行了全面审查和规范化的更新完善。

## 更新时间

**日期**: 2026-03-26
**版本**: v1.0.0
**文档ID**: 3508

## 更新范围

### 1. user.js - 用户相关接口

#### 更新内容

**新增接口**:
- `refreshToken()` - 刷新Token
- `logout()` - 退出登录
- `getUserOrders()` - 获取用户订单列表
- `getUserOrderDetail()` - 获取用户订单详情
- `getUserStats()` - 获取用户统计数据
- `getFollowedCompanions()` - 获取关注的陪玩师列表
- `followCompanion()` - 关注/取消关注陪玩师
- `getCoupons()` - 获取优惠券列表
- `receiveCoupon()` - 领取优惠券

**接口路径规范化**:
- 保持原有的 `/auth/wx/login` 微信登录接口
- 统一接口路径风格，使用RESTful规范

**功能分类**:
- 认证授权接口 (3个)
- 用户信息接口 (3个)
- 用户钱包接口 (3个)
- 用户订单接口 (2个)
- 用户统计接口 (3个)
- 优惠券接口 (2个)

### 2. companion.js - 陪玩师相关接口

#### 更新内容

**接口路径调整**:
- 列表接口: `/companion/list` → `/companions`
- 详情接口: `/companion/{id}` → `/companions/{id}`
- 订单列表: 保持 `/companions/orders`
- 收益统计: 保持 `/companions/earning/stats`
- 收益明细: 保持 `/companions/earning/records`

**新增接口**:
- `getCompanionReviews()` - 获取陪玩师评价列表
- `getMyApplication()` - 获取当前用户的认证申请状态
- `getApplicationDetail()` - 获取认证申请详情
- `rejectOrder()` - 拒绝订单
- `startOrder()` - 开始服务
- `getEarningDetail()` - 获取收益详情
- `updateOnlineStatus()` - 更新在线状态
- `setAcceptingOrders()` - 设置接单状态
- `updateCompanionInfo()` - 更新陪玩师个人信息
- `uploadWorkImage()` - 上传作品集图片
- `deleteWorkImage()` - 删除作品集图片
- `getCompanionDashboard()` - 获取仪表盘数据

**功能分类**:
- 陪玩师列表接口 (3个)
- 陪玩师认证接口 (3个)
- 陪玩师订单接口 (6个)
- 陪玩师收益接口 (3个)
- 陪玩师设置接口 (5个)
- 陪玩师统计接口 (1个)

### 3. order.js - 订单相关接口

#### 更新内容

**接口路径调整**:
- 创建订单: `/order/create` → `/orders` (POST)
- 订单列表: `/order/list` → `/orders` (GET)
- 订单详情: `/order/{id}` → `/orders/{id}`
- 取消订单: 参数名从 `reason` 改为 `cancel_reason`

**新增接口**:
- `getPaymentResult()` - 获取支付结果
- `getOrderStatus()` - 获取订单状态（轮询用）
- `applyRefund()` - 申请退款
- `getOrderReview()` - 查看订单评价
- `getOrderStats()` - 获取订单统计
- `getOrderCount()` - 获取订单数量统计
- `getRefundList()` - 获取退款申请列表
- `getRefundDetail()` - 获取退款详情
- `cancelRefund()` - 取消退款申请

**功能分类**:
- 订单创建与支付接口 (3个)
- 订单查询接口 (3个)
- 订单操作接口 (5个)
- 订单统计接口 (2个)
- 订单退款接口 (3个)

### 4. message.js - 消息相关接口

#### 更新内容

**接口路径调整**:
- 消息列表: `/message/list` → `/messages`
- 消息详情: `/message/{id}` → `/messages/{id}`
- 标记已读: `/message/{id}/read` → `/messages/{id}/read`
- 未读数: `/message/unread-count` → `/messages/unread-count`

**新增接口**:
- `markMultipleRead()` - 批量标记已读
- `deleteMultipleMessages()` - 批量删除消息
- `clearReadMessages()` - 清空所有已读消息
- `getSystemNotices()` - 获取系统通知列表
- `getNoticeDetail()` - 获取公告详情
- `getMessageSettings()` - 获取消息通知设置
- `updateMessageSettings()` - 更新消息通知设置
- `togglePushNotification()` - 开启/关闭消息推送
- `getMessageStats()` - 获取消息统计

**功能分类**:
- 消息列表接口 (3个)
- 消息操作接口 (6个)
- 系统通知接口 (2个)
- 消息设置接口 (3个)
- 消息统计接口 (1个)

## 主要改进点

### 1. 接口路径规范化

#### RESTful风格
- 使用复数形式: `/order` → `/orders`, `/message` → `/messages`
- 资源嵌套: `/orders/{id}/review`, `/companions/{id}/reviews`
- HTTP方法语义化: POST创建, GET查询, PUT更新, DELETE删除

#### 统一路径前缀
- 认证授权: `/auth/*`
- 用户相关: `/user/*`, `/users/*`
- 陪玩师: `/companions/*`
- 订单管理: `/orders/*`
- 消息通知: `/messages/*`

### 2. 功能完整性

#### 补充缺失接口
- 用户统计数据接口
- 陪玩师在线状态管理
- 订单退款流程接口
- 消息设置和统计接口

#### 增强接口功能
- 批量操作支持（批量已读、批量删除）
- 统计数据获取（订单统计、消息统计、收益统计）
- 状态查询（订单状态、在线状态、认证状态）

### 3. 参数规范化

#### 统一命名风格
- 下划线命名: `cancel_reason`, `order_by`, `page_size`
- 驼峰命名转换: 前端使用驼峰，后端接收下划线

#### 标准响应格式
```javascript
{
  code: 200,
  message: "success",
  data: { ... },
  timestamp: 1620000000000
}
```

### 4. 代码组织优化

#### 分组注释
使用清晰的分组注释标识不同功能模块：
```javascript
// ==================== 认证授权接口 ====================
// ==================== 用户信息接口 ====================
// ==================== 用户钱包接口 ====================
```

#### JSDoc文档
每个接口都有完整的JSDoc注释：
```javascript
/**
 * 获取订单列表
 * @param {Object} params - 查询参数 { page, page_size, status, etc. }
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request.get('/orders', params)
}
```

## 接口对照表

### 用户接口对照

| 功能 | 旧接口 | 新接口 | 变更 |
|------|--------|--------|------|
| 微信登录 | `/auth/wx/login` | `/auth/wx/login` | 保持 |
| 刷新Token | - | `/auth/refresh` | 新增 |
| 退出登录 | - | `/auth/logout` | 新增 |
| 获取用户信息 | `/user/info` | `/user/info` | 保持 |
| 更新用户信息 | `/user/info` | `/user/info` | 保持 |
| 上传头像 | `/user/avatar` | `/user/avatar` | 保持 |
| 钱包信息 | `/user/wallet` | `/user/wallet` | 保持 |
| 提现申请 | `/user/wallet/withdraw` | `/user/wallet/withdraw` | 保持 |
| 交易记录 | `/user/wallet/records` | `/user/wallet/records` | 保持 |

### 陪玩师接口对照

| 功能 | 旧接口 | 新接口 | 变更 |
|------|--------|--------|------|
| 陪玩师列表 | `/companion/list` | `/companions` | 更新 |
| 陪玩师详情 | `/companion/{id}` | `/companions/{id}` | 更新 |
| 申请认证 | `/companion/apply` | `/companions/applications` | 更新 |
| 订单列表 | `/companion/orders` | `/companions/orders` | 保持 |
| 接单 | `/companion/orders/{id}/accept` | `/companions/orders/{id}/accept` | 保持 |
| 完成订单 | `/companion/orders/{id}/complete` | `/companions/orders/{id}/complete` | 保持 |

### 订单接口对照

| 功能 | 旧接口 | 新接口 | 变更 |
|------|--------|--------|------|
| 创建订单 | `/order/create` | `/orders` | 更新 |
| 订单列表 | `/order/list` | `/orders` | 更新 |
| 订单详情 | `/order/{id}` | `/orders/{id}` | 更新 |
| 取消订单 | `/order/{id}/cancel` | `/orders/{id}/cancel` | 更新 |
| 支付订单 | `/order/{id}/pay` | `/orders/{id}/pay` | 更新 |
| 确认完成 | `/order/{id}/confirm` | `/orders/{id}/confirm` | 更新 |
| 评价订单 | `/order/{id}/review` | `/orders/{id}/review` | 更新 |

### 消息接口对照

| 功能 | 旧接口 | 新接口 | 变更 |
|------|--------|--------|------|
| 消息列表 | `/message/list` | `/messages` | 更新 |
| 消息详情 | `/message/{id}` | `/messages/{id}` | 更新 |
| 标记已读 | `/message/{id}/read` | `/messages/{id}/read` | 更新 |
| 全部已读 | `/message/read-all` | `/messages/read-all` | 更新 |
| 未读数 | `/message/unread-count` | `/messages/unread-count` | 更新 |
| 删除消息 | `/message/{id}` (DELETE) | `/messages/{id}` | 更新 |

## 使用示例

### 1. 用户登录流程

```javascript
import { wxLogin } from '../api/user'

// 微信登录
const loginRes = await wxLogin(wxCode)
// 返回: { token, refresh_token, user_info }

// 刷新Token
import { refreshToken } from '../api/user'
const tokenRes = await refreshToken(refreshToken)
// 返回: { access_token, expires_in }
```

### 2. 陪玩师列表查询

```javascript
import { getCompanionList } from '../api/companion'

// 获取陪玩师列表
const params = {
  page: 1,
  page_size: 20,
  game_id: 1,
  service_type: '技术陪玩',
  online_status: 1
}
const list = await getCompanionList(params)
```

### 3. 订单创建和支付

```javascript
import { createOrder, payOrder } from '../api/order'

// 创建订单
const orderData = {
  companion_id: 5001,
  game_id: 1,
  service_time: '2026-03-26 20:00:00',
  duration: '2小时',
  special_requirements: '希望耐心一些'
}
const order = await createOrder(orderData)

// 支付订单
const payRes = await payOrder(order.id, 'wechat')
```

### 4. 消息管理

```javascript
import { getMessageList, markMessageRead } from '../api/message'

// 获取消息列表
const messages = await getMessageList({
  page: 1,
  page_size: 20,
  type: 'system'
})

// 标记已读
await markMessageRead(messageId)
```

## 注意事项

### 1. 兼容性处理

#### 渐进式升级
- 旧接口路径暂时保留后端兼容
- 前端逐步迁移到新接口
- 建议使用环境变量控制API版本

#### 接口版本管理
```javascript
// 未来可以添加版本号
const API_VERSION = '/v1'
const BASE_URL = `${API_VERSION}/orders`
```

### 2. 错误处理

#### 统一错误格式
```javascript
{
  code: 400,
  message: "参数错误",
  error: "Invalid parameter",
  timestamp: 1620000000000
}
```

#### request.js拦截器
- 已配置统一的错误处理
- 401自动跳转登录
- 业务错误显示Toast提示

### 3. 类型安全

#### 建议添加TypeScript
```typescript
interface OrderParams {
  companion_id: number
  game_id: number
  service_time: string
  duration: string
  special_requirements?: string
}

export function createOrder(data: OrderParams): Promise<Order>
```

## 后续建议

### 1. 短期优化

1. **添加接口Mock数据**
   - 为每个接口提供Mock数据
   - 方便前端开发和测试

2. **添加接口缓存策略**
   - 对静态数据（陪玩师列表、游戏列表）进行缓存
   - 减少不必要的API调用

3. **完善错误码文档**
   - 整理所有可能的错误码
   - 提供错误处理指南

### 2. 中期优化

1. **引入TypeScript**
   - 为所有接口添加类型定义
   - 提升代码可维护性

2. **接口性能监控**
   - 添加接口调用日志
   - 监控接口响应时间

3. **接口文档自动化**
   - 使用JSDoc生成API文档
   - 保持代码和文档同步

### 3. 长期优化

1. **GraphQL迁移**
   - 考虑使用GraphQL替代RESTful API
   - 减少过度获取数据

2. **离线缓存策略**
   - 使用Service Worker缓存关键数据
   - 提升离线体验

3. **实时通信优化**
   - WebSocket连接管理优化
   - 心跳保活机制

## 总结

本次API接口完善工作涵盖了项目的所有主要功能模块，总计：

- **更新文件**: 4个API文件
- **新增接口**: 约40个
- **优化接口路径**: 约20个
- **代码组织**: 按功能模块分组，添加详细注释

所有接口均遵循RESTful设计规范，与后端API文档保持一致，为后续的开发和维护奠定了良好的基础。

## 相关文档

- API测试文档: 【测试接口文档-0410-别动.v1】(ID: 3508)
- request.js: 网络请求封装
- 各页面文件: API调用示例

---

**文档生成时间**: 2026-03-26
**版本**: v1.0.0
**维护者**: 开发团队
