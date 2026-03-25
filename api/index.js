/**
 * API 统一导出
 */
import user from './user'
import companion from './companion'
import order from './order'
import message from './message'

export default {
  user,
  companion,
  order,
  message
}

// 也支持按需导入
export { user as userApi } from './user'
export { companion as companionApi } from './companion'
export { order as orderApi } from './order'
export { message as messageApi } from './message'
