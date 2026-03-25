/**
 * 消息相关接口
 */
import request from '@/utils/request'

/**
 * 获取消息列表
 */
export function getMessageList(params) {
  return request.get('/message/list', params)
}

/**
 * 获取消息详情
 */
export function getMessageDetail(id) {
  return request.get(`/message/${id}`)
}

/**
 * 标记消息已读
 */
export function markMessageRead(id) {
  return request.put(`/message/${id}/read`)
}

/**
 * 批量标记已读
 */
export function markAllRead() {
  return request.put('/message/read-all')
}

/**
 * 获取未读消息数
 */
export function getUnreadCount() {
  return request.get('/message/unread-count')
}

/**
 * 删除消息
 */
export function deleteMessage(id) {
  return request.delete(`/message/${id}`)
}

export default {
  getMessageList,
  getMessageDetail,
  markMessageRead,
  markAllRead,
  getUnreadCount,
  deleteMessage
}
