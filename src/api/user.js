/**
 * 用户相关接口
 */
import request from '@/utils/request'

/**
 * 微信登录
 */
export function wxLogin(code) {
  return request.post('/auth/wx/login', { code })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/user/info')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data) {
  return request.put('/user/info', data)
}

/**
 * 上传头像
 */
export function uploadAvatar(filePath) {
  return request.upload('/user/avatar', filePath)
}

/**
 * 获取用户钱包信息
 */
export function getWalletInfo() {
  return request.get('/user/wallet')
}

/**
 * 提现申请
 */
export function applyWithdraw(data) {
  return request.post('/user/wallet/withdraw', data)
}

/**
 * 获取交易记录
 */
export function getTransactionRecords(params) {
  return request.get('/user/wallet/records', params)
}

export default {
  wxLogin,
  getUserInfo,
  updateUserInfo,
  uploadAvatar,
  getWalletInfo,
  applyWithdraw,
  getTransactionRecords
}
