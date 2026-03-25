/**
 * 本地存储工具函数
 */

/**
 * 设置存储
 * @param {String} key 键名
 * @param {*} value 值
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error('设置存储失败:', error)
    return false
  }
}

/**
 * 获取存储
 * @param {String} key 键名
 * @param {*} defaultValue 默认值
 * @returns {*}
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = uni.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (error) {
    console.error('获取存储失败:', error)
    return defaultValue
  }
}

/**
 * 删除存储
 * @param {String} key 键名
 * @returns {Boolean}
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除存储失败:', error)
    return false
  }
}

/**
 * 清空存储
 * @returns {Boolean}
 */
export function clearStorage() {
  try {
    uni.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储失败:', error)
    return false
  }
}

/**
 * 获取存储信息
 * @returns {Promise<Object>}
 */
export function getStorageInfo() {
  return new Promise((resolve, reject) => {
    uni.getStorageInfo({
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 设置存储（异步）
 * @param {String} key 键名
 * @param {*} value 值
 * @returns {Promise<Boolean>}
 */
export function setStorageAsync(key, value) {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key,
      data: value,
      success: () => {
        resolve(true)
      },
      fail: (error) => {
        console.error('设置存储失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 获取存储（异步）
 * @param {String} key 键名
 * @returns {Promise<*>}
 */
export function getStorageAsync(key) {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key,
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        console.error('获取存储失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 删除存储（异步）
 * @param {String} key 键名
 * @returns {Promise<Boolean>}
 */
export function removeStorageAsync(key) {
  return new Promise((resolve, reject) => {
    uni.removeStorage({
      key,
      success: () => {
        resolve(true)
      },
      fail: (error) => {
        console.error('删除存储失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 设置对象存储
 * @param {String} key 键名
 * @param {Object} value 对象值
 */
export function setObject(key, value) {
  try {
    const jsonStr = JSON.stringify(value)
    uni.setStorageSync(key, jsonStr)
    return true
  } catch (error) {
    console.error('设置对象存储失败:', error)
    return false
  }
}

/**
 * 获取对象存储
 * @param {String} key 键名
 * @param {Object} defaultValue 默认值
 * @returns {Object}
 */
export function getObject(key, defaultValue = {}) {
  try {
    const jsonStr = uni.getStorageSync(key)
    if (jsonStr) {
      return JSON.parse(jsonStr)
    }
    return defaultValue
  } catch (error) {
    console.error('获取对象存储失败:', error)
    return defaultValue
  }
}
