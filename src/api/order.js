/**
 * 订单相关接口
 */
import request from '@/utils/request'

/**
 * 创建订单
 */
export function createOrder(data) {
  return request.post('/order/create', data)
}

/**
 * 获取订单列表
 */
export function getOrderList(params) {
  return request.get('/order/list', params)
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  return request.get(`/order/${id}`)
}

/**
 * 取消订单
 */
export function cancelOrder(id, reason) {
  return request.post(`/order/${id}/cancel`, { reason })
}

/**
 * 支付订单
 */
export function payOrder(id, payType = 'wechat') {
  return request.post(`/order/${id}/pay`, { payType })
}

/**
 * 确认完成
 */
export function confirmOrder(id) {
  return request.post(`/order/${id}/confirm`)
}

/**
 * 评价订单
 */
export function reviewOrder(id, data) {
  return request.post(`/order/${id}/review`, data)
}

export default {
  createOrder,
  getOrderList,
  getOrderDetail,
  cancelOrder,
  payOrder,
  confirmOrder,
  reviewOrder
}
