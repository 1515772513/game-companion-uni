/**
 * 验证工具函数
 */

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {Boolean}
 */
export function isPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {String} email 邮箱
 * @returns {Boolean}
 */
export function isEmail(email) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

/**
 * 验证身份证号
 * @param {String} idCard 身份证号
 * @returns {Boolean}
 */
export function isIdCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

/**
 * 验证URL
 * @param {String} url URL地址
 * @returns {Boolean}
 */
export function isUrl(url) {
  return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(url)
}

/**
 * 验证数字
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isNumber(value) {
  return !isNaN(Number(value))
}

/**
 * 验证整数
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isInteger(value) {
  return Number.isInteger(Number(value))
}

/**
 * 验证正整数
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isPositiveInteger(value) {
  return /^\+?[1-9]\d*$/.test(value)
}

/**
 * 验证金额
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isAmount(value) {
  return /^(([1-9]\d*)|\d)(\.\d{1,2})?$/.test(value)
}

/**
 * 验证中文
 * @param {String} str 字符串
 * @returns {Boolean}
 */
export function isChinese(str) {
  return /^[\u4e00-\u9fa5]+$/.test(str)
}

/**
 * 验证用户名（字母开头，允许字母数字下划线，4-16位）
 * @param {String} username 用户名
 * @returns {Boolean}
 */
export function isUsername(username) {
  return /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(username)
}

/**
 * 验证密码（至少包含数字和字母，6-20位）
 * @param {String} password 密码
 * @returns {Boolean}
 */
export function isPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(password)
}

/**
 * 验证车牌号
 * @param {String} carNumber 车牌号
 * @returns {Boolean}
 */
export function isCarNumber(carNumber) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(carNumber)
}

/**
 * 验证是否为空
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}

/**
 * 验证数组
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isArray(value) {
  return Array.isArray(value)
}

/**
 * 验证对象
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 验证函数
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isFunction(value) {
  return typeof value === 'function'
}

/**
 * 验证Promise
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isPromise(value) {
  return value instanceof Promise
}

/**
 * 验证日期
 * @param {*} value 值
 * @returns {Boolean}
 */
export function isDate(value) {
  return value instanceof Date
}

/**
 * 验证银行卡号
 * @param {String} cardNumber 银行卡号
 * @returns {Boolean}
 */
export function isBankCard(cardNumber) {
  return /^\d{16,19}$/.test(cardNumber)
}
