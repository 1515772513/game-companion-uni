/**
 * 订单相关接口
 * 根据API文档规范定义
 */
import request from '../utils/request'

// ==================== 订单创建与支付 ====================

/**
 * 创建订单
 * @param {Object} data - 订单数据 { companion_id, game_id, service_time, duration, special_requirements, etc. }
 * @returns {Promise}
 */
export function createOrder(data) {
  return request.post('/orders', data)
}

/**
 * 支付订单
 * @param {Number} orderId - 订单ID
 * @param {String} payType - 支付方式 wechat/alipay/balance
 * @returns {Promise}
 */
export function payOrder(orderId, payType = 'wechat') {
  return request.post(`/orders/${orderId}/pay`, { payType })
}

/**
 * 获取支付结果
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function getPaymentResult(orderId) {
  return request.get(`/orders/${orderId}/payment-result`)
}

// ==================== 订单查询接口 ====================

/**
 * 获取订单列表
 * @param {Object} params - 查询参数 { page, page_size, status, payment_status, etc. }
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request.get('/orders', params)
}

/**
 * 获取订单详情
 * @param {Number} id - 订单ID
 * @returns {Promise}
 */
export function getOrderDetail(id) {
  return request.get(`/orders/${id}`)
}

/**
 * 获取订单状态（轮询用）
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderStatus(orderId) {
  return request.get(`/orders/${orderId}/status`)
}

// ==================== 订单操作接口 ====================

/**
 * 取消订单
 * @param {Number} id - 订单ID
 * @param {String} reason - 取消原因
 * @returns {Promise}
 */
export function cancelOrder(id, reason) {
  return request.post(`/orders/${id}/cancel`, { cancel_reason: reason })
}

/**
 * 确认完成订单（用户确认服务完成）
 * @param {Number} id - 订单ID
 * @returns {Promise}
 */
export function confirmOrder(id) {
  return request.post(`/orders/${id}/confirm`)
}

/**
 * 申请退款
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 退款申请数据 { reason, refund_amount }
 * @returns {Promise}
 */
export function applyRefund(orderId, data) {
  return request.post(`/orders/${orderId}/refund`, data)
}

/**
 * 评价订单
 * @param {Number} orderId - 订单ID
 * @param {Object} data - 评价数据 { rating, comment, tags }
 * @returns {Promise}
 */
export function reviewOrder(orderId, data) {
  return request.post(`/orders/${orderId}/review`, data)
}

/**
 * 查看订单评价
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderReview(orderId) {
  return request.get(`/orders/${orderId}/review`)
}

// ==================== 订单统计接口 ====================

/**
 * 获取订单统计
 * @param {Object} params - 查询参数 { date_range: today/week/month }
 * @returns {Promise}
 */
export function getOrderStats(params) {
  return request.get('/orders/stats', params)
}

/**
 * 获取订单数量统计
 * @returns {Promise}
 */
export function getOrderCount() {
  return request.get('/orders/count')
}

// ==================== 订单退款接口 ====================

/**
 * 获取退款申请列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getRefundList(params) {
  return request.get('/orders/refunds', params)
}

/**
 * 获取退款详情
 * @param {Number} refundId - 退款ID
 * @returns {Promise}
 */
export function getRefundDetail(refundId) {
  return request.get(`/orders/refunds/${refundId}`)
}

/**
 * 取消退款申请
 * @param {Number} refundId - 退款ID
 * @returns {Promise}
 */
export function cancelRefund(refundId) {
  return request.post(`/orders/refunds/${refundId}/cancel`)
}

export default {
  // 创建与支付
  createOrder,
  payOrder,
  getPaymentResult,

  // 查询
  getOrderList,
  getOrderDetail,
  getOrderStatus,

  // 操作
  cancelOrder,
  confirmOrder,
  applyRefund,
  reviewOrder,
  getOrderReview,

  // 统计
  getOrderStats,
  getOrderCount,

  // 退款
  getRefundList,
  getRefundDetail,
  cancelRefund
}
