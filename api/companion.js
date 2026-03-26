/**
 * 陪玩师相关接口
 * 根据API文档规范定义
 */
import request from '../utils/request'

// ==================== 陪玩师列表接口 ====================

/**
 * 获取陪玩师列表（小程序端）
 * @param {Object} params - 查询参数 { page, page_size, keyword, game_id, service_type, level, order_by, etc. }
 * @returns {Promise}
 */
export function getCompanionList(params) {
  return request.get('/companions', params)
}

/**
 * 获取陪玩师详情
 * @param {Number} id - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionDetail(id) {
  return request.get(`/companions/${id}`)
}

/**
 * 获取陪玩师评价列表
 * @param {Number} id - 陪玩师ID
 * @param {Object} params - 查询参数 { page, page_size }
 * @returns {Promise}
 */
export function getCompanionReviews(id, params) {
  return request.get(`/companions/${id}/reviews`, params)
}

// ==================== 陪玩师认证接口 ====================

/**
 * 申请成为陪玩师
 * @param {Object} data - 认证申请数据
 * @returns {Promise}
 */
export function applyCompanion(data) {
  return request.post('/companions/applications', data)
}

/**
 * 获取当前用户的认证申请状态
 * @returns {Promise}
 */
export function getMyApplication() {
  return request.get('/companions/applications/my')
}

/**
 * 获取认证申请详情
 * @param {Number} applicationId - 申请ID
 * @returns {Promise}
 */
export function getApplicationDetail(applicationId) {
  return request.get(`/companions/applications/${applicationId}`)
}

// ==================== 陪玩师订单接口 ====================

/**
 * 获取陪玩师订单列表（接单视角）
 * @param {Object} params - 查询参数 { page, page_size, status, etc. }
 * @returns {Promise}
 */
export function getCompanionOrders(params) {
  return request.get('/companions/orders', params)
}

/**
 * 接受订单
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function acceptOrder(orderId) {
  return request.post(`/companions/orders/${orderId}/accept`)
}

/**
 * 拒绝订单
 * @param {Number} orderId - 订单ID
 * @param {String} reason - 拒绝原因
 * @returns {Promise}
 */
export function rejectOrder(orderId, reason) {
  return request.post(`/companions/orders/${orderId}/reject`, { reason })
}

/**
 * 开始服务
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function startOrder(orderId) {
  return request.post(`/companions/orders/${orderId}/start`)
}

/**
 * 完成订单
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 完成数据 { service_images, summary }
 * @returns {Promise}
 */
export function completeOrder(orderId, data) {
  return request.post(`/companions/orders/${orderId}/complete`, data)
}

/**
 * 取消订单
 * @param {Number} orderId - 订单ID
 * @param {String} reason - 取消原因
 * @returns {Promise}
 */
export function cancelOrder(orderId, reason) {
  return request.post(`/companions/orders/${orderId}/cancel`, { reason })
}

// ==================== 陪玩师收益接口 ====================

/**
 * 获取收益统计
 * @param {Object} params - 查询参数 { date_range: today/week/month }
 * @returns {Promise}
 */
export function getEarningStats(params) {
  return request.get('/companions/earning/stats', params)
}

/**
 * 获取收益明细
 * @param {Object} params - 查询参数 { page, page_size, start_date, end_date }
 * @returns {Promise}
 */
export function getEarningRecords(params) {
  return request.get('/companions/earning/records', params)
}

/**
 * 获取收益详情
 * @param {Number} recordId - 收益记录ID
 * @returns {Promise}
 */
export function getEarningDetail(recordId) {
  return request.get(`/companions/earning/records/${recordId}`)
}

// ==================== 陪玩师设置接口 ====================

/**
 * 更新陪玩师在线状态
 * @param {Number} status - 在线状态 0离线 1在线 2忙碌
 * @returns {Promise}
 */
export function updateOnlineStatus(status) {
  return request.put('/companions/online-status', { status })
}

/**
 * 设置接单状态（开启/停止接单）
 * @param {Boolean} accepting - 是否接单
 * @returns {Promise}
 */
export function setAcceptingOrders(accepting) {
  return request.put('/companions/accepting-status', { accepting })
}

/**
 * 更新陪玩师个人信息
 * @param {Object} data - 更新数据 { bio, tags, service_type, etc. }
 * @returns {Promise}
 */
export function updateCompanionInfo(data) {
  return request.put('/companions/info', data)
}

/**
 * 上传陪玩师作品集图片
 * @param {String} filePath - 本地文件路径
 * @returns {Promise}
 */
export function uploadWorkImage(filePath) {
  return request.upload('/companions/works', filePath)
}

/**
 * 删除作品集图片
 * @param {Number} imageId - 图片ID
 * @returns {Promise}
 */
export function deleteWorkImage(imageId) {
  return request.delete(`/companions/works/${imageId}`)
}

// ==================== 陪玩师统计接口 ====================

/**
 * 获取陪玩师仪表盘数据
 * @returns {Promise}
 */
export function getCompanionDashboard() {
  return request.get('/companions/dashboard')
}

export default {
  // 列表和详情
  getCompanionList,
  getCompanionDetail,
  getCompanionReviews,

  // 认证申请
  applyCompanion,
  getMyApplication,
  getApplicationDetail,

  // 订单管理
  getCompanionOrders,
  acceptOrder,
  rejectOrder,
  startOrder,
  completeOrder,
  cancelOrder,

  // 收益管理
  getEarningStats,
  getEarningRecords,
  getEarningDetail,

  // 设置
  updateOnlineStatus,
  setAcceptingOrders,
  updateCompanionInfo,
  uploadWorkImage,
  deleteWorkImage,

  // 统计
  getCompanionDashboard
}
