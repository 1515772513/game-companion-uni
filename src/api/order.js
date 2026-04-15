/**
 * 订单相关接口
 */
import { get, post, put, del } from '../utils/request'

/**
 * 创建订单
 * @param {Object} data - 订单数据
 * @param {string} data.companionId - 陪玩师ID
 * @param {string} data.serviceId - 服务ID
 * @param {number} data.quantity - 数量
 * @param {string} data.appointmentTime - 预约时间
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function createOrder(data) {
  return post('/orders/create', data)
}

/**
 * 获取订单详情
 * @param {string} orderNo - 订单编号
 * @returns {Promise}
 */
export function getOrderDetail(orderNo) {
  return get(`/orders/detail/${orderNo}`)
}

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.status - 状态: all-全部, pending-待支付, paid-已支付, ongoing-进行中, completed-已完成, cancelled-已取消, refunding-退款中, refunded-已退款
 * @returns {Promise}
 */
export function getOrderList(params) {
  return get('/orders/getList', params)
}

/**
 * 取消订单
 * @param {string} orderId - 订单ID
 * @param {Object} data - 取消数据
 * @param {string} data.reason - 取消原因
 * @returns {Promise}
 */
export function cancelOrder(orderId, data) {
  return post(`/orders/${orderId}/cancel`, data)
}

/**
 * 删除订单
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function deleteOrder(orderId) {
  return del(`/order/${orderId}`)
}

/**
 * 发起支付
 * @param {string} orderId - 订单ID
 * @param {Object} data - 支付数据
 * @param {string} data.payType - 支付方式: wechat-微信, alipay-支付宝, balance-余额
 * @returns {Promise}
 */
export function payOrder(orderId, data) {
  return post(`/order/${orderId}/pay`, data)
}

/**
 * 微信支付
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function payByWechat(orderId) {
  return post(`/order/${orderId}/pay/wechat`)
}

/**
 * 支付宝支付
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function payByAlipay(orderId) {
  return post(`/order/${orderId}/pay/alipay`)
}

/**
 * 余额支付
 * @param {string} orderId - 订单ID
 * @param {Object} data - 支付数据
 * @param {string} data.password - 支付密码
 * @returns {Promise}
 */
export function payByBalance(orderId, data) {
  return post(`/order/${orderId}/pay/balance`, data)
}

/**
 * 查询支付状态
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getPayStatus(orderId) {
  return get(`/order/${orderId}/pay/status`)
}

/**
 * 申请退款
 * @param {string} orderId - 订单ID
 * @param {Object} data - 退款数据
 * @param {string} data.reason - 退款原因
 * @returns {Promise}
 */
export function refundOrder(orderId, data) {
  return post(`/order/${orderId}/refund`, data)
}

/**
 * 取消退款申请
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function cancelRefund(orderId) {
  return post(`/order/${orderId}/refund/cancel`)
}

/**
 * 获取退款详情
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getRefundDetail(orderId) {
  return get(`/order/${orderId}/refund/detail`)
}

/**
 * 确认订单
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function confirmOrder(orderId) {
  return post(`/order/${orderId}/confirm`)
}

/**
 * 申请售后
 * @param {string} orderId - 订单ID
 * @param {Object} data - 售后数据
 * @param {string} data.type - 类型: refund-退款, exchange-换货
 * @param {string} data.reason - 原因
 * @param {string} data.description - 描述
 * @param {Array} data.images - 图片列表
 * @returns {Promise}
 */
export function applyAfterSale(orderId, data) {
  return post(`/order/${orderId}/aftersale`, data)
}

/**
 * 获取订单售后详情
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getAfterSaleDetail(orderId) {
  return get(`/order/${orderId}/aftersale/detail`)
}

/**
 * 评价订单
 * @param {string} orderId - 订单ID
 * @param {Object} data - 评价数据
 * @param {number} data.score - 评分 1-5
 * @param {string} data.content - 评价内容
 * @param {Array} data.images - 图片列表
 * @param {Array} data.tags - 标签列表
 * @returns {Promise}
 */
export function reviewOrder(orderId, data) {
  return post(`/order/${orderId}/review`, data)
}

/**
 * 追加评价
 * @param {string} orderId - 订单ID
 * @param {Object} data - 评价数据
 * @param {string} data.content - 评价内容
 * @param {Array} data.images - 图片列表
 * @returns {Promise}
 */
export function appendReview(orderId, data) {
  return post(`/order/${orderId}/review/append`, data)
}

/**
 * 获取订单评价
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderReview(orderId) {
  return get(`/order/${orderId}/review`)
}

/**
 * 获取订单时间线
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderTimeline(orderId) {
  return get(`/order/${orderId}/timeline`)
}

/**
 * 获取订单统计
 * @returns {Promise}
 */
export function getOrderStats() {
  return get('/orders/order-status')
}

/**
 * 计算订单价格
 * @param {Object} data - 计算数据
 * @param {string} data.serviceId - 服务ID
 * @param {number} data.quantity - 数量
 * @param {string} data.couponId - 优惠券ID
 * @returns {Promise}
 */
export function calculateOrderPrice(data) {
  return post('/order/calculate', data)
}

/**
 * 获取可用优惠券
 * @param {Object} data - 查询数据
 * @param {string} data.serviceId - 服务ID
 * @param {number} data.amount - 订单金额
 * @returns {Promise}
 */
export function getOrderCoupons(data) {
  return post('/order/coupons', data)
}

/**
 * 使用优惠券
 * @param {string} orderId - 订单ID
 * @param {Object} data - 优惠券数据
 * @param {string} data.couponId - 优惠券ID
 * @returns {Promise}
 */
export function useCoupon(orderId, data) {
  return post(`/order/${orderId}/coupon`, data)
}

/**
 * 取消使用优惠券
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function cancelCoupon(orderId) {
  return del(`/order/${orderId}/coupon`)
}

/**
 * 催单
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function urgeOrder(orderId) {
  return post(`/order/${orderId}/urge`)
}

/**
 * 申请发票
 * @param {string} orderId - 订单ID
 * @param {Object} data - 发票数据
 * @param {string} data.type - 类型: personal-个人, company-企业
 * @param {string} data.title - 发票抬头
 * @param {string} data.taxNumber - 税号
 * @param {string} data.email - 邮箱
 * @returns {Promise}
 */
export function applyInvoice(orderId, data) {
  return post(`/order/${orderId}/invoice`, data)
}

/**
 * 获取发票信息
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderInvoice(orderId) {
  return get(`/order/${orderId}/invoice`)
}

/**
 * 延长服务时间
 * @param {string} orderId - 订单ID
 * @param {Object} data - 延长数据
 * @param {number} data.duration - 延长时长(分钟)
 * @returns {Promise}
 */
export function extendOrder(orderId, data) {
  return post(`/order/${orderId}/extend`, data)
}

/**
 * 获取订单可操作列表
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderActions(orderId) {
  return get(`/order/${orderId}/actions`)
}

/**
 * 获取订单投诉
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderComplaint(orderId) {
  return get(`/order/${orderId}/complaint`)
}

/**
 * 提交订单投诉
 * @param {string} orderId - 订单ID
 * @param {Object} data - 投诉数据
 * @param {string} data.type - 类型: service-服务, attitude-态度, other-其他
 * @param {string} data.content - 投诉内容
 * @param {Array} data.images - 图片列表
 * @returns {Promise}
 */
export function submitOrderComplaint(orderId, data) {
  return post(`/order/${orderId}/complaint`, data)
}

/**
 * 获取订单分享信息
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderShareInfo(orderId) {
  return get(`/order/${orderId}/share`)
}

/**
 * 验证订单
 * @param {Object} data - 验证数据
 * @param {string} data.serviceId - 服务ID
 * @returns {Promise}
 */
export function validateOrder(data) {
  return post('/order/validate', data)
}

/**
 * 获取服务协议
 * @returns {Promise}
 */
export function getServiceAgreement() {
  return get('/order/agreement')
}

/**
 * 获取退款原因列表
 * @returns {Promise}
 */
export function getRefundReasons() {
  return get('/order/refund/reasons')
}

/**
 * 获取取消原因列表
 * @returns {Promise}
 */
export function getCancelReasons() {
  return get('/order/cancel/reasons')
}
