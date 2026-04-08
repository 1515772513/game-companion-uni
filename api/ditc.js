import { get, post, put, del } from '../utils/request'

/**
 * 获取字典下拉列表（通用）
 * @param {String} dictType - 字典类型：review_status / service_type 等
 * @returns {Promise}
 */
export const getDictList = (dictType) => {
  console.log('dictType', dictType)
  return get('/dict/list', { dictType })
}

/**
 * 获取审核状态列表
 * @returns {Promise}
 */
export const getReviewStatusList = () => {
  return get('/dict/review-status')
}

/**
 * 获取服务类型列表
 * @returns {Promise}
 */
export const getServiceTypeList = () => {
  return get('/dict/service-type')
}