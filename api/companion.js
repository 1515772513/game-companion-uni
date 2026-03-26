/**
 * 陪玩师相关接口
 */
import { get, post, put, del } from '../utils/request'

/**
 * 获取陪玩师列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.gameId - 游戏ID
 * @param {string} params.gender - 性别: male-男, female-女
 * @param {string} params.priceSort - 价格排序: asc-升序, desc-降序
 * @param {string} params.serviceType - 服务类型: voice-语音, video-视频, game-游戏
 * @returns {Promise}
 */
export function getCompanionList(params) {
  return get('/companion/list', params)
}

/**
 * 获取陪玩师详情
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionDetail(companionId) {
  return get(`/companion/detail/${companionId}`)
}

/**
 * 获取陪玩师服务列表
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionServices(companionId) {
  return get(`/companion/${companionId}/services`)
}

/**
 * 获取陪玩师评价列表
 * @param {string} companionId - 陪玩师ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.score - 评分: 1-5星
 * @returns {Promise}
 */
export function getCompanionReviews(companionId, params) {
  return get(`/companion/${companionId}/reviews`, params)
}

/**
 * 获取陪玩师评价统计
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionReviewStats(companionId) {
  return get(`/companion/${companionId}/reviews/stats`)
}

/**
 * 搜索陪玩师
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 关键词
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function searchCompanions(params) {
  return get('/companion/search', params)
}

/**
 * 获取推荐陪玩师
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 数量限制
 * @returns {Promise}
 */
export function getRecommendedCompanions(params) {
  return get('/companion/recommended', params)
}

/**
 * 获取热门陪玩师
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 数量限制
 * @returns {Promise}
 */
export function getHotCompanions(params) {
  return get('/companion/hot', params)
}

/**
 * 获取新手陪玩师
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 数量限制
 * @returns {Promise}
 */
export function getNewCompanions(params) {
  return get('/companion/new', params)
}

/**
 * 获取陪玩师在线状态
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionOnlineStatus(companionId) {
  return get(`/companion/${companionId}/status`)
}

/**
 * 申请成为陪玩师
 * @param {Object} data - 申请数据
 * @param {string} data.realName - 真实姓名
 * @param {string} data.idCard - 身份证号
 * @param {string} data.phone - 手机号
 * @param {Array} data.images - 照片列表
 * @param {string} data.intro - 个人简介
 * @param {Array} data.games - 游戏列表
 * @returns {Promise}
 */
export function applyCompanion(data) {
  return post('/companion/apply', data)
}

/**
 * 获取陪玩师申请状态
 * @returns {Promise}
 */
export function getCompanionApplyStatus() {
  return get('/companion/apply/status')
}

/**
 * 获取陪玩师个人信息
 * @returns {Promise}
 */
export function getCompanionProfile() {
  return get('/companion/profile')
}

/**
 * 更新陪玩师个人信息
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export function updateCompanionProfile(data) {
  return put('/companion/profile', data)
}

/**
 * 更新陪玩师头像
 * @param {Object} data - 头像数据
 * @param {string} data.avatar - 头像URL
 * @returns {Promise}
 */
export function updateCompanionAvatar(data) {
  return put('/companion/avatar', data)
}

/**
 * 更新陪玩师相册
 * @param {Object} data - 相册数据
 * @param {Array} data.images - 图片URL列表
 * @returns {Promise}
 */
export function updateCompanionGallery(data) {
  return put('/companion/gallery', data)
}

/**
 * 删除陪玩师相册图片
 * @param {string} imageId - 图片ID
 * @returns {Promise}
 */
export function deleteCompanionGalleryImage(imageId) {
  return del(`/companion/gallery/${imageId}`)
}

/**
 * 更新陪玩师简介
 * @param {Object} data - 简介数据
 * @param {string} data.intro - 简介
 * @returns {Promise}
 */
export function updateCompanionIntro(data) {
  return put('/companion/intro', data)
}

/**
 * 获取陪玩师服务管理
 * @returns {Promise}
 */
export function getCompanionServiceManage() {
  return get('/companion/service/manage')
}

/**
 * 添加陪玩师服务
 * @param {Object} data - 服务数据
 * @param {string} data.type - 服务类型: voice-语音, video-视频, game-游戏
 * @param {string} data.gameId - 游戏ID
 * @param {string} data.name - 服务名称
 * @param {string} data.description - 服务描述
 * @param {number} data.price - 价格
 * @param {number} data.duration - 时长(分钟)
 * @returns {Promise}
 */
export function addCompanionService(data) {
  return post('/companion/service', data)
}

/**
 * 更新陪玩师服务
 * @param {string} serviceId - 服务ID
 * @param {Object} data - 服务数据
 * @returns {Promise}
 */
export function updateCompanionService(serviceId, data) {
  return put(`/companion/service/${serviceId}`, data)
}

/**
 * 删除陪玩师服务
 * @param {string} serviceId - 服务ID
 * @returns {Promise}
 */
export function deleteCompanionService(serviceId) {
  return del(`/companion/service/${serviceId}`)
}

/**
 * 上架/下架服务
 * @param {string} serviceId - 服务ID
 * @param {Object} data - 状态数据
 * @param {boolean} data.online - 是否上架
 * @returns {Promise}
 */
export function toggleServiceOnline(serviceId, data) {
  return put(`/companion/service/${serviceId}/online`, data)
}

/**
 * 获取陪玩师订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 状态: pending-待接单, accepted-已接单, ongoing-进行中, completed-已完成, cancelled-已取消
 * @returns {Promise}
 */
export function getCompanionOrders(params) {
  return get('/companion/orders', params)
}

/**
 * 接受订单
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function acceptOrder(orderId) {
  return post(`/companion/order/${orderId}/accept`)
}

/**
 * 拒绝订单
 * @param {string} orderId - 订单ID
 * @param {Object} data - 拒绝原因
 * @param {string} data.reason - 拒绝原因
 * @returns {Promise}
 */
export function rejectOrder(orderId, data) {
  return post(`/companion/order/${orderId}/reject`, data)
}

/**
 * 开始服务
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function startService(orderId) {
  return post(`/companion/order/${orderId}/start`)
}

/**
 * 结束服务
 * @param {string} orderId - 订单ID
 * @param {Object} data - 结束数据
 * @param {number} data.actualDuration - 实际时长(分钟)
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function endService(orderId, data) {
  return post(`/companion/order/${orderId}/end`, data)
}

/**
 * 获取陪玩师收益统计
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getCompanionEarnings(params) {
  return get('/companion/earnings', params)
}

/**
 * 获取陪玩师收益明细
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getCompanionEarningRecords(params) {
  return get('/companion/earnings/records', params)
}

/**
 * 获取陪玩师提现记录
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getCompanionWithdrawRecords(params) {
  return get('/companion/withdraw/records', params)
}

/**
 * 申请提现
 * @param {Object} data - 提现数据
 * @param {number} data.amount - 提现金额
 * @returns {Promise}
 */
export function companionWithdraw(data) {
  return post('/companion/withdraw', data)
}

/**
 * 获取陪玩师统计数据
 * @returns {Promise}
 */
export function getCompanionStats() {
  return get('/companion/stats')
}

/**
 * 获取陪玩师工作日历
 * @param {Object} params - 查询参数
 * @param {string} params.year - 年份
 * @param {string} params.month - 月份
 * @returns {Promise}
 */
export function getCompanionCalendar(params) {
  return get('/companion/calendar', params)
}

/**
 * 设置陪玩师工作时间
 * @param {Object} data - 时间数据
 * @param {Array} data.workTimes - 工作时间列表
 * @returns {Promise}
 */
export function setCompanionWorkTime(data) {
  return put('/companion/worktime', data)
}

/**
 * 设置陪玩师在线状态
 * @param {Object} data - 状态数据
 * @param {boolean} data.online - 是否在线
 * @returns {Promise}
 */
export function setCompanionOnlineStatus(data) {
  return put('/companion/status/online', data)
}

/**
 * 设置陪玩师忙碌状态
 * @param {Object} data - 状态数据
 * @param {boolean} data.busy - 是否忙碌
 * @returns {Promise}
 */
export function setCompanionBusyStatus(data) {
  return put('/companion/status/busy', data)
}

/**
 * 获取陪玩师通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getCompanionNotifications(params) {
  return get('/companion/notifications', params)
}

/**
 * 标记通知已读
 * @param {string} notificationId - 通知ID
 * @returns {Promise}
 */
export function markNotificationRead(notificationId) {
  return put(`/companion/notification/${notificationId}/read`)
}

/**
 * 获取陪玩师评价回复
 * @param {string} reviewId - 评价ID
 * @returns {Promise}
 */
export function getCompanionReviewReply(reviewId) {
  return get(`/companion/review/${reviewId}/reply`)
}

/**
 * 回复用户评价
 * @param {string} reviewId - 评价ID
 * @param {Object} data - 回复数据
 * @param {string} data.content - 回复内容
 * @returns {Promise}
 */
export function replyReview(reviewId, data) {
  return post(`/companion/review/${reviewId}/reply`, data)
}

/**
 * 获取游戏列表
 * @returns {Promise}
 */
export function getGameList() {
  return get('/companion/games')
}

/**
 * 获取游戏详情
 * @param {string} gameId - 游戏ID
 * @returns {Promise}
 */
export function getGameDetail(gameId) {
  return get(`/companion/game/${gameId}`)
}

/**
 * 获取陪玩师等级信息
 * @returns {Promise}
 */
export function getCompanionLevel() {
  return get('/companion/level')
}

/**
 * 获取等级权益列表
 * @returns {Promise}
 */
export function getLevelBenefits() {
  return get('/companion/level/benefits')
}

/**
 * 获取陪玩师排行榜
 * @param {Object} params - 查询参数
 * @param {string} params.type - 类型: income-收益, orders-订单, rating-评分
 * @param {number} params.limit - 数量限制
 * @returns {Promise}
 */
export function getCompanionRanking(params) {
  return get('/companion/ranking', params)
}
