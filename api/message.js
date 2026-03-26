/**
 * 消息相关接口
 */
import { get, post, put, del } from '../utils/request'

/**
 * 获取会话列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getConversationList(params) {
  return get('/message/conversation/list', params)
}

/**
 * 获取会话详情
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function getConversationDetail(conversationId) {
  return get(`/message/conversation/${conversationId}`)
}

/**
 * 创建会话
 * @param {Object} data - 会话数据
 * @param {string} data.companionId - 陪玩师ID
 * @param {string} data.orderId - 订单ID(可选)
 * @returns {Promise}
 */
export function createConversation(data) {
  return post('/message/conversation/create', data)
}

/**
 * 删除会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function deleteConversation(conversationId) {
  return del(`/message/conversation/${conversationId}`)
}

/**
 * 置顶会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function pinConversation(conversationId) {
  return put(`/message/conversation/${conversationId}/pin`)
}

/**
 * 取消置顶会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function unpinConversation(conversationId) {
  return put(`/message/conversation/${conversationId}/unpin`)
}

/**
 * 标记会话已读
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function markConversationRead(conversationId) {
  return put(`/message/conversation/${conversationId}/read`)
}

/**
 * 获取消息列表
 * @param {string} conversationId - 会话ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.lastMessageId - 上一页最后一条消息ID
 * @returns {Promise}
 */
export function getMessageList(conversationId, params) {
  return get(`/message/conversation/${conversationId}/messages`, params)
}

/**
 * 发送文本消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.content - 消息内容
 * @returns {Promise}
 */
export function sendTextMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/text`, data)
}

/**
 * 发送图片消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.imageUrl - 图片URL
 * @returns {Promise}
 */
export function sendImageMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/image`, data)
}

/**
 * 发送语音消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.audioUrl - 音频URL
 * @param {number} data.duration - 时长
 * @returns {Promise}
 */
export function sendVoiceMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/voice`, data)
}

/**
 * 发送视频消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.videoUrl - 视频URL
 * @param {number} data.duration - 时长
 * @param {string} data.coverUrl - 封面URL
 * @returns {Promise}
 */
export function sendVideoMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/video`, data)
}

/**
 * 发送订单消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.orderId - 订单ID
 * @returns {Promise}
 */
export function sendOrderMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/order`, data)
}

/**
 * 发送系统消息
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 消息数据
 * @param {string} data.content - 消息内容
 * @returns {Promise}
 */
export function sendSystemMessage(conversationId, data) {
  return post(`/message/conversation/${conversationId}/system`, data)
}

/**
 * 撤回消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @returns {Promise}
 */
export function recallMessage(conversationId, messageId) {
  return post(`/message/conversation/${conversationId}/message/${messageId}/recall`)
}

/**
 * 删除消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @returns {Promise}
 */
export function deleteMessage(conversationId, messageId) {
  return del(`/message/conversation/${conversationId}/message/${messageId}`)
}

/**
 * 转发消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @param {Object} data - 转发数据
 * @param {string} data.targetConversationId - 目标会话ID
 * @returns {Promise}
 */
export function forwardMessage(conversationId, messageId, data) {
  return post(`/message/conversation/${conversationId}/message/${messageId}/forward`, data)
}

/**
 * 收藏消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @returns {Promise}
 */
export function favoriteMessage(conversationId, messageId) {
  return post(`/message/conversation/${conversationId}/message/${messageId}/favorite`)
}

/**
 * 取消收藏消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @returns {Promise}
 */
export function unfavoriteMessage(conversationId, messageId) {
  return del(`/message/conversation/${conversationId}/message/${messageId}/favorite`)
}

/**
 * 获取收藏消息列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getFavoriteMessages(params) {
  return get('/message/favorite/list', params)
}

/**
 * 获取未读消息数
 * @returns {Promise}
 */
export function getUnreadCount() {
  return get('/message/unread/count')
}

/**
 * 获取会话未读消息数
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function getConversationUnreadCount(conversationId) {
  return get(`/message/conversation/${conversationId}/unread/count`)
}

/**
 * 清空会话消息
 * @param {string} conversationId - 会话ID
 * @returns {Promise}
 */
export function clearConversationMessages(conversationId) {
  return del(`/message/conversation/${conversationId}/messages`)
}

/**
 * 搜索消息
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 关键词
 * @param {string} params.conversationId - 会话ID(可选)
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function searchMessages(params) {
  return get('/message/search', params)
}

/**
 * 获取系统通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.type - 类型: all-全部, system-系统, order-订单, activity-活动
 * @returns {Promise}
 */
export function getNotificationList(params) {
  return get('/message/notification/list', params)
}

/**
 * 获取通知详情
 * @param {string} notificationId - 通知ID
 * @returns {Promise}
 */
export function getNotificationDetail(notificationId) {
  return get(`/message/notification/${notificationId}`)
}

/**
 * 标记通知已读
 * @param {string} notificationId - 通知ID
 * @returns {Promise}
 */
export function markNotificationRead(notificationId) {
  return put(`/message/notification/${notificationId}/read`)
}

/**
 * 批量标记通知已读
 * @returns {Promise}
 */
export function markAllNotificationsRead() {
  return put('/message/notification/read/all')
}

/**
 * 删除通知
 * @param {string} notificationId - 通知ID
 * @returns {Promise}
 */
export function deleteNotification(notificationId) {
  return del(`/message/notification/${notificationId}`)
}

/**
 * 清空所有通知
 * @returns {Promise}
 */
export function clearAllNotifications() {
  return del('/message/notification/all')
}

/**
 * 获取未读通知数
 * @returns {Promise}
 */
export function getUnreadNotificationCount() {
  return get('/message/notification/unread/count')
}

/**
 * 上传聊天图片
 * @param {string} filePath - 文件路径
 * @param {Object} options - 上传选项
 * @returns {Promise}
 */
export function uploadChatImage(filePath, options = {}) {
  return post('/message/upload/image', { filePath, ...options })
}

/**
 * 上传聊天语音
 * @param {string} filePath - 文件路径
 * @param {Object} options - 上传选项
 * @returns {Promise}
 */
export function uploadChatVoice(filePath, options = {}) {
  return post('/message/upload/voice', { filePath, ...options })
}

/**
 * 上传聊天视频
 * @param {string} filePath - 文件路径
 * @param {Object} options - 上传选项
 * @returns {Promise}
 */
export function uploadChatVideo(filePath, options = {}) {
  return post('/message/upload/video', { filePath, ...options })
}

/**
 * 举报消息
 * @param {string} conversationId - 会话ID
 * @param {string} messageId - 消息ID
 * @param {Object} data - 举报数据
 * @param {string} data.reason - 举报原因
 * @param {string} data.description - 描述
 * @returns {Promise}
 */
export function reportMessage(conversationId, messageId, data) {
  return post(`/message/conversation/${conversationId}/message/${messageId}/report`, data)
}

/**
 * 屏蔽用户
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function blockUser(userId) {
  return post(`/message/block/${userId}`)
}

/**
 * 解除屏蔽
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function unblockUser(userId) {
  return del(`/message/block/${userId}`)
}

/**
 * 获取屏蔽列表
 * @returns {Promise}
 */
export function getBlockList() {
  return get('/message/block/list')
}

/**
 * 设置消息免打扰
 * @param {string} conversationId - 会话ID
 * @param {Object} data - 设置数据
 * @param {boolean} data.muted - 是否免打扰
 * @returns {Promise}
 */
export function setConversationMute(conversationId, data) {
  return put(`/message/conversation/${conversationId}/mute`, data)
}

/**
 * 获取消息设置
 * @returns {Promise}
 */
export function getMessageSettings() {
  return get('/message/settings')
}

/**
 * 更新消息设置
 * @param {Object} data - 设置数据
 * @returns {Promise}
 */
export function updateMessageSettings(data) {
  return put('/message/settings', data)
}

/**
 * 获取快捷回复列表
 * @returns {Promise}
 */
export function getQuickReplies() {
  return get('/message/quickreply/list')
}

/**
 * 添加快捷回复
 * @param {Object} data - 回复数据
 * @param {string} data.content - 回复内容
 * @returns {Promise}
 */
export function addQuickReply(data) {
  return post('/message/quickreply', data)
}

/**
 * 删除快捷回复
 * @param {string} replyId - 回复ID
 * @returns {Promise}
 */
export function deleteQuickReply(replyId) {
  return del(`/message/quickreply/${replyId}`)
}

/**
 * 更新快捷回复
 * @param {string} replyId - 回复ID
 * @param {Object} data - 回复数据
 * @returns {Promise}
 */
export function updateQuickReply(replyId, data) {
  return put(`/message/quickreply/${replyId}`, data)
}
