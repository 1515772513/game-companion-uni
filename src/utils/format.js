/**
 * 格式化工具函数
 */

/**
 * 格式化时间
 * @param {Date|String|Number} time 时间
 * @param {String} format 格式
 * @returns {String}
 */
export function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return ''

  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化相对时间
 * @param {Date|String|Number} time 时间
 * @returns {String}
 */
export function formatRelativeTime(time) {
  if (!time) return ''

  const now = Date.now()
  const timestamp = new Date(time).getTime()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < month) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前'
  } else {
    return Math.floor(diff / year) + '年前'
  }
}

/**
 * 格式化金额
 * @param {Number} amount 金额
 * @param {Number} decimals 小数位数
 * @returns {String}
 */
export function formatAmount(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '0.00'

  return Number(amount).toFixed(decimals)
}

/**
 * 格式化手机号
 * @param {String} phone 手机号
 * @returns {String}
 */
export function formatPhone(phone) {
  if (!phone) return ''

  const str = phone.toString()
  if (str.length === 11) {
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  return phone
}

/**
 * 格式化身份证号
 * @param {String} idCard 身份证号
 * @returns {String}
 */
export function formatIdCard(idCard) {
  if (!idCard) return ''

  const str = idCard.toString()
  if (str.length === 18) {
    return str.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  } else if (str.length === 15) {
    return str.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2')
  }

  return idCard
}

/**
 * 格式化文件大小
 * @param {Number} bytes 字节数
 * @returns {String}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

/**
 * 格式化数字（千分位）
 * @param {Number} num 数字
 * @returns {String}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化百分比
 * @param {Number} value 数值
 * @param {Number} total 总数
 * @param {Number} decimals 小数位数
 * @returns {String}
 */
export function formatPercent(value, total, decimals = 2) {
  if (!total || total === 0) return '0%'

  const percent = (value / total) * 100
  return percent.toFixed(decimals) + '%'
}
