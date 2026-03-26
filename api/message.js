/**
 * 消息相关接口
 * 根据API文档规范定义
 */
import request from '../utils/request'

// ==================== 消息列表接口 ====================

/**
 * 获取消息列表
 * @param {Object} params - 查询参数 { page, page_size, type: system/order/activity }
 * @returns {Promise}
 */
export function getMessageList(params) {
  return request.get('/messages', params)
}

/**
 * 获取消息详情
 * @param {Number} id - 消息ID
 * @returns {Promise}
 */
export function getMessageDetail(id) {
  return request.get(`/messages/${id}`)
}

/**
 * 获取未读消息数
 * @returns {Promise}
 */
export function getUnreadCount() {
  return request.get('/messages/unread-count')
}

// ==================== 消息操作接口 ====================

/**
 * 标记消息已读
 * @param {Number} id - 消息ID
 * @returns {Promise}
 */
export function markMessageRead(id) {
  return request.put(`/messages/${id}/read`)
}

/**
 * 批量标记已读
 * @param {Array} ids - 消息ID数组
 * @returns {Promise}
 */
export function markMultipleRead(ids) {
  return request.put('/messages/batch-read', { ids })
}

/**
 * 标记所有消息已读
 * @returns {Promise}
 */
export function markAllRead() {
  return request.put('/messages/read-all')
}

/**
 * 删除消息
 * @param {Number} id - 消息ID
 * @returns {Promise}
 */
export function deleteMessage(id) {
  return request.delete(`/messages/${id}`)
}

/**
 * 批量删除消息
 * @param {Array} ids - 消息ID数组
 * @returns {Promise}
 */
export function deleteMultipleMessages(ids) {
  return request.delete('/messages/batch', { ids })
}

/**
 * 清空所有已读消息
 * @returns {Promise}
 */
export function clearReadMessages() {
  return request.delete('/messages/clear-read')
}

// ==================== 系统通知接口 ====================

/**
 * 获取系统通知列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getSystemNotices(params) {
  return request.get('/messages/notices', params)
}

/**
 * 获取公告详情
 * @param {Number} noticeId - 公告ID
 * @returns {Promise}
 */
export function getNoticeDetail(noticeId) {
  return request.get(`/messages/notices/${noticeId}`)
}

// ==================== 消息设置接口 ====================

/**
 * 获取消息通知设置
 * @returns {Promise}
 */
export function getMessageSettings() {
  return request.get('/messages/settings')
}

/**
 * 更新消息通知设置
 * @param {Object} data - 设置数据 { order_notify, system_notify, activity_notify, etc. }
 * @returns {Promise}
 */
export function updateMessageSettings(data) {
  return request.put('/messages/settings', data)
}

/**
 * 开启/关闭消息推送
 * @param {Boolean} enabled - 是否开启推送
 * @returns {Promise}
 */
export function togglePushNotification(enabled) {
  return request.put('/messages/push-toggle', { enabled })
}

// ==================== 消息统计接口 ====================

/**
 * 获取消息统计
 * @returns {Promise}
 */
export function getMessageStats() {
  return request.get('/messages/stats')
}

export default {
  // 消息列表
  getMessageList,
  getMessageDetail,
  getUnreadCount,

  // 消息操作
  markMessageRead,
  markMultipleRead,
  markAllRead,
  deleteMessage,
  deleteMultipleMessages,
  clearReadMessages,

  // 系统通知
  getSystemNotices,
  getNoticeDetail,

  // 消息设置
  getMessageSettings,
  updateMessageSettings,
  togglePushNotification,

  // 消息统计
  getMessageStats
}
