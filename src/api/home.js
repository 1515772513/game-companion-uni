import { get, post, put, del } from '../utils/request'

/**
 * 获取首页数据
 * @returns {Promise}
 */
export function getHomeData() {
  return get('/home')
}

/**
 * 获取系统配置
 * @returns {Promise}
 */
export function getSystemConfig() {
  return get('/home/system_config')
}