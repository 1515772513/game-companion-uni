/**
 * 用户相关接口
 */
import { get, post, put, del } from '../utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @param {string} data.code - 验证码
 * @returns {Promise}
 */
export function login(data) {
  return post('/user/login', data)
}

/**
 * 手机号登录
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @returns {Promise}
 */
export function loginByPhone(data) {
  return post('/user/login/phone', data)
}

/**
 * 微信登录
 * @param {Object} data - 登录数据
 * @param {string} data.code - 微信授权码
 * @returns {Promise}
 */
export function loginByWechat(data) {
  return post('/auth/login-wechat', data)
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.password - 密码
 * @param {string} data.nickname - 昵称
 * @returns {Promise}
 */
export function register(data) {
  return post('/user/register', data)
}

/**
 * 发送验证码
 * @param {Object} data - 请求数据
 * @param {string} data.phone - 手机号
 * @param {string} data.type - 类型: register-注册, login-登录, reset-重置密码, bind-绑定手机
 * @returns {Promise}
 */
export function sendSmsCode(data) {
  return post('/user/sms/send', data)
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return get('/user/info')
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return put('/user/info', data)
}

/**
 * 更新用户头像
 * @param {Object} data - 头像数据
 * @param {string} data.avatar - 头像URL
 * @returns {Promise}
 */
export function updateAvatar(data) {
  return put('/user/avatar', data)
}

/**
 * 更新用户昵称
 * @param {Object} data - 昵称数据
 * @param {string} data.nickname - 昵称
 * @returns {Promise}
 */
export function updateNickname(data) {
  return put('/user/nickname', data)
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function changePassword(data) {
  return post('/user/password/change', data)
}

/**
 * 重置密码
 * @param {Object} data - 重置数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.password - 新密码
 * @returns {Promise}
 */
export function resetPassword(data) {
  return post('/user/password/reset', data)
}

/**
 * 绑定手机号
 * @param {Object} data - 绑定数据
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @returns {Promise}
 */
export function bindPhone(data) {
  return post('/user/phone/bind', data)
}

/**
 * 实名认证
 * @param {Object} data - 认证数据
 * @param {string} data.realName - 真实姓名
 * @param {string} data.idCard - 身份证号
 * @returns {Promise}
 */
export function realNameVerify(data) {
  return post('/user/verify/realname', data)
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return post('/user/logout')
}

/**
 * 获取钱包信息
 * @returns {Promise}
 */
export function getWalletInfo() {
  return get('/user/wallet')
}

/**
 * 获取钱包明细
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.type - 类型: income-收入, expense-支出
 * @returns {Promise}
 */
export function getWalletRecords(params) {
  return get('/user/wallet/records', params)
}

/**
 * 充值
 * @param {Object} data - 充值数据
 * @param {number} data.amount - 充值金额
 * @param {string} data.payType - 支付方式: wechat-微信, alipay-支付宝
 * @returns {Promise}
 */
export function recharge(data) {
  return post('/user/wallet/recharge', data)
}

/**
 * 提现
 * @param {Object} data - 提现数据
 * @param {number} data.amount - 提现金额
 * @returns {Promise}
 */
export function withdraw(data) {
  return post('/user/wallet/withdraw', data)
}

/**
 * 获取优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 状态: unused-未使用, used-已使用, expired-已过期
 * @returns {Promise}
 */
export function getCoupons(params) {
  return get('/user/coupon', params)
}

/**
 * 领取优惠券
 * @param {Object} data - 领取数据
 * @param {string} data.couponId - 优惠券ID
 * @returns {Promise}
 */
export function receiveCoupon(data) {
  return post('/user/coupon/receive', data)
}

/**
 * 获取可用优惠券
 * @param {Object} params - 查询参数
 * @param {number} params.amount - 订单金额
 * @param {string} params.type - 业务类型
 * @returns {Promise}
 */
export function getAvailableCoupons(params) {
  return get('/user/coupon/available', params)
}

/**
 * 获取收藏列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getFavorites(params) {
  return get('/user/favorite', params)
}

/**
 * 添加收藏
 * @param {Object} data - 收藏数据
 * @param {string} data.companionId - 陪玩师ID
 * @returns {Promise}
 */
export function addFavorite(data) {
  return post('/user/favorite', data)
}

/**
 * 取消收藏
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function removeFavorite(data) {
  return post(`/user/favorite-remove`, data)
}

/**
 * 检查是否收藏
 * @param {string} companionId - 陪玩师ID
 * @returns {Promise}
 */
export function checkFavorite(companionId) {
  return get(`/user/favorite/check/${companionId}`)
}

/**
 * 获取浏览历史
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getBrowseHistory(params) {
  return get('/user/history', params)
}

/**
 * 清空浏览历史
 * @returns {Promise}
 */
export function clearBrowseHistory() {
  return del('/user/history')
}

/**
 * 删除浏览历史
 * @param {string} historyId - 历史记录ID
 * @returns {Promise}
 */
export function removeBrowseHistory(historyId) {
  return del(`/user/history/${historyId}`)
}

/**
 * 获取地址列表
 * @returns {Promise}
 */
export function getAddressList() {
  return get('/user/address')
}

/**
 * 添加地址
 * @param {Object} data - 地址数据
 * @returns {Promise}
 */
export function addAddress(data) {
  return post('/user/address', data)
}

/**
 * 更新地址
 * @param {string} addressId - 地址ID
 * @param {Object} data - 地址数据
 * @returns {Promise}
 */
export function updateAddress(addressId, data) {
  return put(`/user/address/${addressId}`, data)
}

/**
 * 删除地址
 * @param {string} addressId - 地址ID
 * @returns {Promise}
 */
export function deleteAddress(addressId) {
  return del(`/user/address/${addressId}`)
}

/**
 * 设置默认地址
 * @param {string} addressId - 地址ID
 * @returns {Promise}
 */
export function setDefaultAddress(addressId) {
  return put(`/user/address/${addressId}/default`)
}

/**
 * 获取反馈列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getFeedbackList(params) {
  return get('/user/feedback', params)
}

/**
 * 提交反馈
 * @param {Object} data - 反馈数据
 * @param {string} data.type - 类型: suggestion-建议, bug-问题, other-其他
 * @param {string} data.content - 内容
 * @param {Array} data.images - 图片列表
 * @returns {Promise}
 */
export function submitFeedback(data) {
  return post('/user/feedback', data)
}

/**
 * 上传图片
 * @param {string} filePath - 文件路径
 * @param {Object} options - 上传选项
 * @returns {Promise}
 */
export function uploadImage(filePath, options = {}) {
  return post('/user/upload/image', { filePath, ...options })
}

/**
 * 获取设置信息
 * @returns {Promise}
 */
export function getSettings() {
  return get('/user/settings')
}

/**
 * 更新设置
 * @param {Object} data - 设置数据
 * @returns {Promise}
 */
export function updateSettings(data) {
  return put('/user/settings', data)
}

/**
 * 删除账号
 * @param {Object} data - 删除数据
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function deleteAccount(data) {
  return post('/user/account/delete', data)
}

/**
 * 获取用户协议
 * @param {string} type - 类型: privacy-隐私政策, service-服务协议
 * @returns {Promise}
 */
export function getAgreement(type) {
  return get('/user/agreement', { type })
}


/**
 * 手机号登录
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @returns {Promise}
 */
export function smsLogin(data) {
  return post('/auth/sms-login', data)
}

/**
 * 更新陪玩师状态
 * @param {Object} data - 状态数据
 * @param {string} data.status - 状态: online, busy, offline
 * @returns {Promise}
 */
export function updateCompanionStatus(data) {
  return put('/user/companion/status', data)
}
