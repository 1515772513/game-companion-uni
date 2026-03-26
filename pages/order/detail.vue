<template>
  <view class="order-detail-page">
    <!-- 订单状态 -->
    <view class="status-section">
      <view class="status-icon" :class="`status-${orderInfo.status}`">
        <uni-icons :type="getStatusIcon(orderInfo.status)" size="60" color="#fff"></uni-icons>
      </view>
      <view class="status-text">{{ getStatusText(orderInfo.status) }}</view>
      <view class="status-desc" v-if="orderInfo.status === 'pending'">请在30分钟内完成支付</view>
    </view>

    <!-- 陪玩师信息 -->
    <view class="companion-section">
      <view class="section-title">陪玩师信息</view>
      <view class="companion-info" @tap="goToCompanion">
        <image :src="orderInfo.companionAvatar" mode="aspectFill" class="companion-avatar"></image>
        <view class="info">
          <text class="name">{{ orderInfo.companionName }}</text>
          <text class="service">{{ orderInfo.serviceName }}</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info-section">
      <view class="section-title">订单信息</view>
      <view class="info-row">
        <text class="label">订单编号</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="label">下单时间</text>
        <text class="value">{{ orderInfo.createTime }}</text>
      </view>
      <view class="info-row">
        <text class="label">预约时间</text>
        <text class="value">{{ orderInfo.appointmentTime }}</text>
      </view>
      <view class="info-row">
        <text class="label">服务时长</text>
        <text class="value">{{ orderInfo.duration }}小时</text>
      </view>
      <view class="info-row" v-if="orderInfo.remark">
        <text class="label">备注</text>
        <text class="value">{{ orderInfo.remark }}</text>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-section">
      <view class="section-title">价格明细</view>
      <view class="price-row">
        <text class="label">服务费用</text>
        <text class="value">¥{{ orderInfo.servicePrice }}</text>
      </view>
      <view class="price-row" v-if="orderInfo.couponDiscount > 0">
        <text class="label">优惠券</text>
        <text class="value discount">-¥{{ orderInfo.couponDiscount }}</text>
      </view>
      <view class="price-row total">
        <text class="label">实付金额</text>
        <text class="value">¥{{ orderInfo.price }}</text>
      </view>
    </view>

    <!-- 订单进度 -->
    <view class="timeline-section" v-if="orderInfo.timeline?.length">
      <view class="section-title">订单进度</view>
      <view class="timeline">
        <view class="timeline-item" v-for="(item, index) in orderInfo.timeline" :key="index">
          <view class="timeline-dot"></view>
          <view class="timeline-content">
            <text class="timeline-title">{{ item.title }}</text>
            <text class="timeline-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="orderInfo.status !== 'cancelled'">
      <button class="action-btn cancel-btn" v-if="orderInfo.status === 'pending'" @tap="cancelOrder">
        取消订单
      </button>
      <button class="action-btn primary-btn" v-if="orderInfo.status === 'pending'" @tap="payOrder">
        去支付
      </button>
      <button class="action-btn primary-btn" v-if="orderInfo.status === 'ongoing'" @tap="contactCompanion">
        联系陪玩师
      </button>
      <button class="action-btn primary-btn" v-if="orderInfo.status === 'completed' && !orderInfo.isReviewed" @tap="reviewOrder">
        评价订单
      </button>
      <button class="action-btn default-btn" v-if="orderInfo.status === 'completed'" @tap="reorder">
        再来一单
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrderDetail, cancelOrder as cancelOrderApi } from '@/api/order'

const orderId = ref('')
const orderInfo = ref({})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  orderId.value = options.id
  loadOrderDetail()
})

const loadOrderDetail = async () => {
  try {
    const res = await getOrderDetail(orderId.value)
    if (res.code === 200) {
      orderInfo.value = res.data
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

const getStatusIcon = (status) => {
  const iconMap = {
    pending: 'clock',
    paid: 'checkmarkempty',
    ongoing: 'loop',
    completed: 'checkbox-filled',
    cancelled: 'closeempty'
  }
  return iconMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const goToCompanion = () => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${orderInfo.value.companionId}`
  })
}

const cancelOrder = () => {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrderApi(orderId.value, { reason: '用户主动取消' })
          uni.showToast({
            title: '订单已取消',
            icon: 'success'
          })
          loadOrderDetail()
        } catch (error) {
          uni.showToast({
            title: '取消失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const payOrder = () => {
  uni.navigateTo({
    url: `/pages/order/payment?id=${orderId.value}`
  })
}

const contactCompanion = () => {
  uni.navigateTo({
    url: `/pages/message/detail?conversationId=${orderInfo.value.conversationId}`
  })
}

const reviewOrder = () => {
  uni.navigateTo({
    url: `/pages/order/review?id=${orderId.value}`
  })
}

const reorder = () => {
  uni.navigateTo({
    url: `/pages/order/create?companionId=${orderInfo.value.companionId}&serviceId=${orderInfo.value.serviceId}`
  })
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.status-section {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 60rpx 30rpx;
  text-align: center;
  color: #fff;

  .status-icon {
    width: 120rpx;
    height: 120rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20rpx;
  }

  .status-text {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .status-desc {
    font-size: 24rpx;
    opacity: 0.9;
  }
}

.companion-section, .order-info-section, .price-section, .timeline-section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
}

.companion-info {
  display: flex;
  align-items: center;

  .companion-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .name {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .service {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 26rpx;
    color: #666;
  }

  .value {
    font-size: 26rpx;
    color: #333;
  }
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;

  .label {
    font-size: 26rpx;
    color: #666;
  }

  .value {
    font-size: 26rpx;
    color: #333;
    font-weight: bold;

    &.discount {
      color: #ff4d4f;
    }
  }

  &.total {
    border-top: 1rpx solid #f0f0f0;
    padding-top: 20rpx;
    margin-top: 10rpx;

    .label {
      font-size: 28rpx;
      font-weight: bold;
    }

    .value {
      font-size: 36rpx;
      color: #3b82f6;
    }
  }
}

.timeline {
  .timeline-item {
    display: flex;
    padding-bottom: 30rpx;
    position: relative;

    &:last-child {
      padding-bottom: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 10rpx;
      top: 30rpx;
      bottom: -30rpx;
      width: 2rpx;
      background-color: #e5e5e5;
    }

    &:last-child::before {
      display: none;
    }

    .timeline-dot {
      width: 22rpx;
      height: 22rpx;
      background-color: #3b82f6;
      border-radius: 11rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .timeline-content {
      flex: 1;
      display: flex;
      flex-direction: column;

      .timeline-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 8rpx;
      }

      .timeline-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .action-btn {
    margin-left: 16rpx;
    padding: 0 32rpx;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 35rpx;
    font-size: 28rpx;
    border: none;

    &::after {
      border: none;
    }

    &.cancel-btn {
      background-color: #f5f5f5;
      color: #666;
    }

    &.default-btn {
      background-color: #fff;
      color: #3b82f6;
      border: 1rpx solid #3b82f6;
    }

    &.primary-btn {
      background-color: #3b82f6;
      color: #fff;
    }
  }
}
</style>
