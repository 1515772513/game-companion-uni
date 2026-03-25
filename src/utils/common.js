/**
 * 通用工具函数
 */

/**
 * 防抖
 * @param {Function} func 函数
 * @param {Number} wait 延迟时间
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流
 * @param {Function} func 函数
 * @param {Number} wait 间隔时间
 * @returns {Function}
 */
export function throttle(func, wait = 300) {
  let previous = 0
  return function (...args) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(this, args)
      previous = now
    }
  }
}

/**
 * 深拷贝
 * @param {*} obj 对象
 * @returns {*}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj

  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }

  if (obj instanceof Object) {
    const cloneObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloneObj[key] = deepClone(obj[key])
      }
    }
    return cloneObj
  }
}

/**
 * 合并对象
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @returns {Object}
 */
export function merge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (isObject(sourceValue) && isObject(targetValue)) {
        target[key] = merge(targetValue, sourceValue)
      } else {
        target[key] = deepClone(sourceValue)
      }
    }
  }

  return target
}

/**
 * 判断是否为对象
 * @param {*} obj 值
 * @returns {Boolean}
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 生成唯一ID
 * @returns {String}
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数组去重
 * @param {Array} arr 数组
 * @returns {Array}
 */
export function unique(arr) {
  return Array.from(new Set(arr))
}

/**
 * 数组排序
 * @param {Array} arr 数组
 * @param {String} key 排序键
 * @param {String} order 排序方式 asc/desc
 * @returns {Array}
 */
export function sortBy(arr, key, order = 'asc') {
  return arr.sort((a, b) => {
    const valueA = key ? a[key] : a
    const valueB = key ? b[key] : b

    if (order === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })
}

/**
 * 数组分组
 * @param {Array} arr 数组
 * @param {String} key 分组键
 * @returns {Object}
 */
export function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

/**
 * 数组分页
 * @param {Array} arr 数组
 * @param {Number} page 当前页
 * @param {Number} pageSize 每页数量
 * @returns {Array}
 */
export function pagination(arr, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return arr.slice(start, end)
}

/**
 * 对象转URL参数
 * @param {Object} obj 对象
 * @returns {String}
 */
export function objectToParams(obj) {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&')
}

/**
 * URL参数转对象
 * @param {String} url URL地址
 * @returns {Object}
 */
export function paramsToObject(url) {
  const params = {}
  const search = url.split('?')[1]

  if (!search) return params

  search.split('&').forEach(item => {
    const [key, value] = item.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })

  return params
}

/**
 * 获取图片路径
 * @param {String} path 相对路径
 * @returns {String}
 */
export function getImagePath(path) {
  if (!path) return ''

  // 如果是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 本地图片路径
  return `/static/images/${path}`
}

/**
 * 预览图片
 * @param {String|Array} urls 图片URL或URL数组
 * @param {Number} current 当前显示图片索引
 */
export function previewImage(urls, current = 0) {
  const urlArray = Array.isArray(urls) ? urls : [urls]

  uni.previewImage({
    urls: urlArray,
    current: current,
    fail: (error) => {
      console.error('预览图片失败:', error)
    }
  })
}

/**
 * 选择图片
 * @param {Object} options 选项
 * @returns {Promise<Array>}
 */
export function chooseImage(options = {}) {
  const defaultOptions = {
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera']
  }

  const mergeOptions = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...mergeOptions,
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: (error) => {
        console.error('选择图片失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 复制到剪贴板
 * @param {String} data 数据
 * @returns {Promise<Boolean>}
 */
export function setClipboardData(data) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data,
      success: () => {
        uni.showToast({
          title: '复制成功',
          icon: 'success'
        })
        resolve(true)
      },
      fail: (error) => {
        console.error('复制失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 拨打电话
 * @param {String} phoneNumber 电话号码
 */
export function makePhoneCall(phoneNumber) {
  uni.makePhoneCall({
    phoneNumber,
    fail: (error) => {
      console.error('拨打电话失败:', error)
    }
  })
}

/**
 * 扫码
 * @returns {Promise<String>}
 */
export function scanCode() {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success: (res) => {
        resolve(res.result)
      },
      fail: (error) => {
        console.error('扫码失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 震动
 * @param {String} type 震动类型 short/long
 */
export function vibrate(type = 'short') {
  if (type === 'long') {
    uni.vibrateLong({
      fail: (error) => {
        console.error('震动失败:', error)
      }
    })
  } else {
    uni.vibrateShort({
      fail: (error) => {
        console.error('震动失败:', error)
      }
    })
  }
}

/**
 * 页面跳转
 * @param {String} url 页面路径
 * @param {Object} params 参数
 */
export function navigateTo(url, params = {}) {
  const query = objectToParams(params)
  const fullUrl = query ? `${url}?${query}` : url

  uni.navigateTo({
    url: fullUrl,
    fail: (error) => {
      console.error('页面跳转失败:', error)
    }
  })
}

/**
 * 页面重定向
 * @param {String} url 页面路径
 * @param {Object} params 参数
 */
export function redirectTo(url, params = {}) {
  const query = objectToParams(params)
  const fullUrl = query ? `${url}?${query}` : url

  uni.redirectTo({
    url: fullUrl,
    fail: (error) => {
      console.error('页面重定向失败:', error)
    }
  })
}

/**
 * 切换Tab页面
 * @param {String} url 页面路径
 */
export function switchTab(url) {
  uni.switchTab({
    url,
    fail: (error) => {
      console.error('切换Tab失败:', error)
    }
  })
}

/**
 * 返回上一页
 * @param {Number} delta 返回层数
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({
    delta,
    fail: (error) => {
      console.error('返回失败:', error)
    }
  })
}

/**
 * 显示提示
 * @param {String} title 提示内容
 * @param {String} icon 图标 success/error/loading/none
 * @param {Number} duration 持续时间
 */
export function showToast(title, icon = 'none', duration = 2000) {
  uni.showToast({
    title,
    icon,
    duration,
    mask: true
  })
}

/**
 * 显示加载
 * @param {String} title 加载文字
 */
export function showLoading(title = '加载中...') {
  uni.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载
 */
export function hideLoading() {
  uni.hideLoading()
}

/**
 * 显示模态框
 * @param {Object} options 选项
 * @returns {Promise<Boolean>}
 */
export function showModal(options = {}) {
  const defaultOptions = {
    title: '提示',
    content: '',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定'
  }

  const mergeOptions = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    uni.showModal({
      ...mergeOptions,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: (error) => {
        console.error('显示模态框失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 显示操作菜单
 * @param {Array} itemList 菜单项数组
 * @returns {Promise<Number>}
 */
export function showActionSheet(itemList) {
  return new Promise((resolve, reject) => {
    uni.showActionSheet({
      itemList,
      success: (res) => {
        resolve(res.tapIndex)
      },
      fail: (error) => {
        console.error('显示操作菜单失败:', error)
        reject(error)
      }
    })
  })
}
