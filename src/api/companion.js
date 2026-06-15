/**
 * 陪玩师相关接口
 *
 * ⚠️ 接口对接说明（已对照后端 game-companion-api/Controllers/CompanionController.cs 校正）：
 * 已验证存在的后端接口：
 *   GET  /companion/list              列表（查询参数 snake_case：page/page_size/game_id/service_type/level/sort/online_status/keyword）
 *   GET  /companion/{id}              详情
 *   GET  /companion/{id}/services     服务列表
 *   GET  /companion/{id}/reviews      评价列表
 *   GET  /companion/my-info           我的陪玩师信息
 *   PUT  /companion/my-info           更新我的陪玩师信息（UpdateCompanionInfoRequest）
 *   POST /companion/apply             申请成为陪玩师
 *   GET  /companion/application-status 申请状态
 *   PUT  /companion/online-status     切换在线状态（body: { onlineStatus: 0离线/1在线/2忙碌 }）
 *   GET  /companion/orders            接单列表
 *   POST /companion/orders/{id}/accept|reject|start|complete  订单流转
 *   GET  /companion/earnings、POST /companion/withdraw、GET /companion/withdraw-records
 * 下方其余函数（recommended/hot/new、gallery、intro、service CRUD、calendar、worktime、
 *   level、ranking、notifications、review reply 等）后端暂未实现，调用前请先与后端确认。
 */
import { get, post, put, del } from '../utils/request'

/**
 * 获取陪玩师列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @param {number} params.game_id - 游戏ID
 * @param {string} params.service_type - 服务类型: tech-技术, entertainment-娱乐
 * @param {string} params.level - 等级: silver-银牌, gold-金牌, diamond-钻石, king-王者
 * @param {number} params.min_price - 最低价格
 * @param {number} params.max_price - 最高价格
 * @param {number} params.online_status - 在线状态: 0-全部, 1-仅在线, 2-仅离线
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.sort_by - 排序字段: rating-评分, price-价格, order_count-接单数
 * @param {string} params.sort_order - 排序方向: asc-升序, desc-降序
 * @returns {Promise}
 */
export function getCompanionList(params) {
  return get('/companion/list', params)
}

/**
 * 获取陪玩师详情
 * @param {string|number} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function getCompanionDetail(companionId) {
  return get(`/companion/${companionId}`)
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
 * @param {number} params.page_size - 每页数量
 * @returns {Promise}
 */
export function searchCompanions(params) {
  return get('/search/companions', params)
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
 * 申请成为陪玩师（对应后端 POST /companion/apply，ApplyCompanionRequest）
 * @param {Object} data - 申请数据
 * @param {string} data.realName - 真实姓名
 * @param {string} data.idCard - 身份证号（18位）
 * @param {string} data.idCardFrontUrl - 身份证正面照URL
 * @param {string} data.idCardBackUrl - 身份证反面照URL
 * @param {string} data.phone - 手机号
 * @param {string} data.nickname - 昵称
 * @param {string} data.bio - 个人简介（后端必填）
 * @param {Array<string>} [data.tags] - 标签
 * @param {Array<{gameId:number,gameRank:string,serviceType:string,price:number}>} data.gameSkills - 游戏技能
 * @param {Array<{fileId:string,sort:number}>} [data.backgroundImages] - 背景轮播图
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
  return get('/companion/application-status')
}

/**
 * 获取陪玩师个人信息
 * @returns {Promise}
 */
export function getCompanionProfile() {
  return get('/companion/my-info')
}

/**
 * 更新陪玩师个人信息
 * 对应后端 PUT /companion/my-info（UpdateCompanionInfoRequest）
 * @param {Object} data - 更新数据，仅支持 { nickname?, avatarUrl?, serviceType?, price?, bio?, tags? }
 * @returns {Promise}
 */
export function updateCompanionProfile(data) {
  return put('/companion/my-info', data)
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
  return post(`/companion/orders/${orderId}/accept`)
}

/**
 * 拒绝订单
 * @param {string} orderId - 订单ID
 * @param {Object} data - 拒绝原因
 * @param {string} data.reason - 拒绝原因
 * @returns {Promise}
 */
export function rejectOrder(orderId, data) {
  return post(`/companion/orders/${orderId}/reject`, data)
}

/**
 * 开始服务
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function startService(orderId) {
  return post(`/companion/orders/${orderId}/start`)
}

/**
 * 完成服务（对应后端 POST /companion/orders/{id}/complete）
 * @param {string} orderId - 订单ID
 * @param {string} [serviceSummary] - 服务总结（后端 body 为字符串）
 * @returns {Promise}
 */
export function endService(orderId, serviceSummary) {
  return post(`/companion/orders/${orderId}/complete`, serviceSummary)
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
  return get('/companion/withdraw-records', params)
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
 * 设置陪玩师在线状态（对应后端 PUT /companion/online-status）
 * @param {Object} data - 状态数据
 * @param {number} data.onlineStatus - 在线状态：0-离线，1-在线，2-忙碌
 * @returns {Promise}
 */
export function setCompanionOnlineStatus(data) {
  return put('/companion/online-status', data)
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

// 注意：获取游戏列表请使用 @/api/game 的 getGameList（对应后端 GET /game/select-options）
// 此处原有的 getGameList('/games') 与后端不符，已移除，避免误用。

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
