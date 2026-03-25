/**
 * 陪玩师相关接口
 */
import request from '@/utils/request'

/**
 * 获取陪玩师列表
 */
export function getCompanionList(params) {
  return request.get('/companion/list', params)
}

/**
 * 获取陪玩师详情
 */
export function getCompanionDetail(id) {
  return request.get(`/companion/${id}`)
}

/**
 * 申请成为陪玩师
 */
export function applyCompanion(data) {
  return request.post('/companion/apply', data)
}

/**
 * 获取陪玩师订单列表
 */
export function getCompanionOrders(params) {
  return request.get('/companion/orders', params)
}

/**
 * 接单
 */
export function acceptOrder(orderId) {
  return request.post(`/companion/orders/${orderId}/accept`)
}

/**
 * 完成订单
 */
export function completeOrder(orderId, data) {
  return request.post(`/companion/orders/${orderId}/complete`, data)
}

/**
 * 获取收益统计
 */
export function getEarningStats(params) {
  return request.get('/companion/earning/stats', params)
}

/**
 * 获取收益明细
 */
export function getEarningRecords(params) {
  return request.get('/companion/earning/records', params)
}

export default {
  getCompanionList,
  getCompanionDetail,
  applyCompanion,
  getCompanionOrders,
  acceptOrder,
  completeOrder,
  getEarningStats,
  getEarningRecords
}
