/**
 * 用户相关接口
 * 根据API文档规范定义
 */
import request from '../utils/request'

// ==================== 认证授权接口 ====================

/**
 * 微信登录
 * @param {String} code - 微信登录code
 * @returns {Promise}
 */
export function wxLogin(code) {
  return request.post('/auth/wx/login', { code })
}

/**
 * 刷新Token
 * @param {String} refreshToken - 刷新令牌
 * @returns {Promise}
 */
export function refreshToken(refreshToken) {
  return request.post('/auth/refresh', { refresh_token: refreshToken })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request.post('/auth/logout')
}

// ==================== 用户信息接口 ====================

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request.get('/user/info')
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息数据
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return request.put('/user/info', data)
}

/**
 * 上传头像
 * @param {String} filePath - 本地文件路径
 * @returns {Promise}
 */
export function uploadAvatar(filePath) {
  return request.upload('/user/avatar', filePath)
}

// ==================== 用户钱包接口 ====================

/**
 * 获取用户钱包信息
 * @returns {Promise}
 */
export function getWalletInfo() {
  return request.get('/user/wallet')
}

/**
 * 提现申请
 * @param {Object} data - 提现数据 { amount, withdraw_method, account_info }
 * @returns {Promise}
 */
export function applyWithdraw(data) {
  return request.post('/user/wallet/withdraw', data)
}

/**
 * 获取交易记录
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getTransactionRecords(params) {
  return request.get('/user/wallet/records', params)
}

// ==================== 用户订单接口 ====================

/**
 * 获取用户订单列表
 * @param {Object} params - 查询参数 { page, page_size, status, etc. }
 * @returns {Promise}
 */
export function getUserOrders(params) {
  return request.get('/user/orders', params)
}

/**
 * 获取用户订单详情
 * @param {Number} orderId - 订单ID
 * @returns {Promise}
 */
export function getUserOrderDetail(orderId) {
  return request.get(`/user/orders/${orderId}`)
}

// ==================== 用户统计数据接口 ====================

/**
 * 获取用户统计数据
 * @returns {Promise}
 */
export function getUserStats() {
  return request.get('/user/stats')
}

/**
 * 获取用户关注的陪玩师列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getFollowedCompanions(params) {
  return request.get('/user/follows', params)
}

/**
 * 关注/取消关注陪玩师
 * @param {Number} companionId - 陪玩师ID
 * @param {Boolean} isFollow - 是否关注 true关注 false取消
 * @returns {Promise}
 */
export function followCompanion(companionId, isFollow = true) {
  return request.post(`/user/follows/${companionId}`, { action: isFollow ? 'follow' : 'unfollow' })
}

// ==================== 优惠券接口 ====================

/**
 * 获取用户优惠券列表
 * @param {Object} params - 查询参数 { status:可用/已使用/已过期 }
 * @returns {Promise}
 */
export function getCoupons(params) {
  return request.get('/user/coupons', params)
}

/**
 * 领取优惠券
 * @param {Number} couponId - 优惠券ID
 * @returns {Promise}
 */
export function receiveCoupon(couponId) {
  return request.post(`/user/coupons/${couponId}/receive`)
}

export default {
  // 认证授权
  wxLogin,
  refreshToken,
  logout,

  // 用户信息
  getUserInfo,
  updateUserInfo,
  uploadAvatar,

  // 钱包
  getWalletInfo,
  applyWithdraw,
  getTransactionRecords,

  // 订单
  getUserOrders,
  getUserOrderDetail,

  // 统计
  getUserStats,
  getFollowedCompanions,
  followCompanion,

  // 优惠券
  getCoupons,
  receiveCoupon
}
