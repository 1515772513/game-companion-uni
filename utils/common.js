/**
 * 通用工具函数
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {Number} wait - 等待时间(ms)
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {Number} wait - 等待时间(ms)
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300) {
  let previous = 0
  return function(...args) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(this, args)
      previous = now
    }
  }
}

/**
 * 深度克隆
 * @param {*} obj - 要克隆的对象
 * @returns {*} 克隆后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
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
 * 格式化日期时间
 * @param {Date|String|Number} date - 日期
 * @param {String} format - 格式化模板
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间
 * @param {Date|String|Number} date - 日期
 * @returns {String} 相对时间字符串
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `${years}年前`
  } else if (months > 0) {
    return `${months}个月前`
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

/**
 * 格式化文件大小
 * @param {Number} bytes - 字节数
 * @returns {String} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

/**
 * 格式化金额
 * @param {Number} amount - 金额
 * @param {Number} decimals - 小数位数
 * @returns {String} 格式化后的金额
 */
export function formatMoney(amount, decimals = 2) {
  if (isNaN(amount)) return '0.00'

  return Number(amount).toFixed(decimals)
}

/**
 * 手机号脱敏
 * @param {String} phone - 手机号
 * @returns {String} 脱敏后的手机号
 */
export function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone

  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 身份证号脱敏
 * @param {String} idCard - 身份证号
 * @returns {String} 脱敏后的身份证号
 */
export function maskIdCard(idCard) {
  if (!idCard || idCard.length < 15) return idCard

  return idCard.replace(/(\d{6})\d*(\d{4})/, '$1****$2')
}

/**
 * 验证手机号
 * @param {String} phone - 手机号
 * @returns {Boolean} 是否有效
 */
export function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {String} email - 邮箱
 * @returns {Boolean} 是否有效
 */
export function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证身份证号
 * @param {String} idCard - 身份证号
 * @returns {Boolean} 是否有效
 */
export function validateIdCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

/**
 * 验证密码强度
 * @param {String} password - 密码
 * @returns {Object} 强度信息
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, strength: 0, message: '请输入密码' }
  }

  if (password.length < 6) {
    return { valid: false, strength: 0, message: '密码长度不能少于6位' }
  }

  if (password.length < 8) {
    return { valid: true, strength: 1, message: '密码强度较弱' }
  }

  let strength = 0
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  const messages = ['弱', '较弱', '中等', '较强', '强']
  return {
    valid: true,
    strength,
    message: `密码强度: ${messages[strength - 1] || '弱'}`
  }
}

/**
 * 生成唯一ID
 * @returns {String} 唯一ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 数组去重
 * @param {Array} arr - 数组
 * @param {String} key - 对象数组的去重键
 * @returns {Array} 去重后的数组
 */
export function unique(arr, key) {
  if (!Array.isArray(arr)) return []

  if (key) {
    const seen = new Set()
    return arr.filter(item => {
      const k = item[key]
      if (seen.has(k)) {
        return false
      }
      seen.add(k)
      return true
    })
  }

  return [...new Set(arr)]
}

/**
 * 数组排序
 * @param {Array} arr - 数组
 * @param {String} key - 排序键
 * @param {String} order - 排序方式 asc/desc
 * @returns {Array} 排序后的数组
 */
export function sortBy(arr, key, order = 'asc') {
  if (!Array.isArray(arr)) return []

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
 * 对象转URL参数
 * @param {Object} obj - 对象
 * @returns {String} URL参数字符串
 */
export function objectToQueryString(obj) {
  if (!obj || typeof obj !== 'object') return ''

  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * URL参数转对象
 * @param {String} url - URL
 * @returns {Object} 参数对象
 */
export function queryStringToObject(url) {
  if (!url) return {}

  const search = url.split('?')[1]
  if (!search) return {}

  const pairs = search.split('&')
  const result = {}

  pairs.forEach(pair => {
    const [key, value] = pair.split('=')
    if (key) {
      result[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  })

  return result
}

/**
 * 获取图片信息
 * @param {String} src - 图片路径
 * @returns {Promise} 图片信息
 */
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 预览图片
 * @param {Array} urls - 图片地址数组
 * @param {Number} current - 当前显示图片索引
 */
export function previewImage(urls, current = 0) {
  uni.previewImage({
    urls,
    current: typeof current === 'number' ? current : urls.indexOf(current)
  })
}

/**
 * 保存图片到相册
 * @param {String} filePath - 图片路径
 * @returns {Promise} 保存结果
 */
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 复制到剪贴板
 * @param {String} data - 要复制的数据
 * @returns {Promise} 复制结果
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
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 拨打电话
 * @param {String} phoneNumber - 电话号码
 */
export function makePhoneCall(phoneNumber) {
  uni.makePhoneCall({
    phoneNumber
  })
}

/**
 * 扫码
 * @returns {Promise} 扫码结果
 */
export function scanCode() {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success: (res) => {
        resolve(res.result)
      },
      fail: reject
    })
  })
}

/**
 * 选择图片
 * @param {Object} options - 选项
 * @returns {Promise} 选择结果
 */
export function chooseImage(options = {}) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: options.count || 9,
      sizeType: options.sizeType || ['original', 'compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 页面跳转（防重复点击）
 * @param {String} url - 页面路径
 * @param {Object} params - 参数
 */
export function navigateTo(url, params = {}) {
  // 防抖处理
  if (navigateTo.lock) return

  navigateTo.lock = true
  setTimeout(() => {
    navigateTo.lock = false
  }, 300)

  // 拼接参数
  if (Object.keys(params).length > 0) {
    url += '?' + objectToQueryString(params)
  }

  uni.navigateTo({
    url,
    fail: () => {
      // 跳转失败，尝试switchTab
      uni.switchTab({
        url,
        fail: () => {
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    }
  })
}

/**
 * 获取位置信息
 * @returns {Promise} 位置信息
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: resolve,
      fail: reject
    })
  })
}
