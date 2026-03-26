<template>
  <view class="order-accept-page">
    <!-- 订单状态 -->
    <view class="status-section">
      <view class="status-icon" :class="`status-${orderInfo.status}`">
        <uni-icons type="checkbox-filled" size="60" color="#fff"></uni-icons>
      </view>
      <view class="status-text">{{ getStatusText(orderInfo.status) }}</view>
    </view>

    <!-- 用户信息 -->
    <view class="user-section">
      <view class="section-title">用户信息</view>
      <view class="user-info">
        <image :src="orderInfo.userAvatar" mode="aspectFill" class="user-avatar"></image>
        <view class="info">
          <text class="name">{{ orderInfo.userName }}</text>
          <text class="phone">{{ orderInfo.userPhone }}</text>
        </view>
        <button class="contact-btn" @tap="contactUser">联系用户</button>
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
        <text class="label">服务类型</text>
        <text class="value">{{ orderInfo.serviceName }}</text>
      </view>
      <view class="info-row">
        <text class="label">预约时间</text>
        <text class="value">{{ orderInfo.appointmentTime }}</text>
      </view>
      <view class="info-row">
        <text class="label">服务时长</text>
        <text class="value">{{ orderInfo.duration }}小时</text>
      </view>
      <view class="info-row">
        <text class="label">订单金额</text>
        <text class="value price">¥{{ orderInfo.price }}</text>
      </view>
      <view class="info-row" v-if="orderInfo.remark">
        <text class="label">用户备注</text>
        <text class="value">{{ orderInfo.remark }}</text>
      </view>
    </view>

    <!-- 服务进度 -->
    <view class="progress-section" v-if="orderInfo.status === 'ongoing'">
      <view class="section-title">服务进度</view>
      <view class="progress-info">
        <view class="progress-item">
          <text class="progress-label">开始时间</text>
          <text class="progress-value">{{ orderInfo.startTime || '--' }}</text>
        </view>
        <view class="progress-item">
          <text class="progress-label">已服务时长</text>
          <text class="progress-value">{{ serviceDuration }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <button
        class="action-btn reject-btn"
        v-if="orderInfo.status === 'pending'"
        @tap="rejectOrder"
      >
        拒绝订单
      </button>
      <button
        class="action-btn primary-btn"
        v-if="orderInfo.status === 'pending'"
        @tap="acceptOrder"
      >
        接受订单
      </button>
      <button
        class="action-btn primary-btn"
        v-if="orderInfo.status === 'accepted'"
        @tap="startService"
      >
        开始服务
      </button>
      <button
        class="action-btn primary-btn"
        v-if="orderInfo.status === 'ongoing'"
        @tap="endService"
      >
        结束服务
      </button>
      <button
        class="action-btn default-btn"
        @tap="contactUser"
      >
        联系用户
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getCompanionOrders, acceptOrder as acceptOrderApi, rejectOrder as rejectOrderApi, startService as startServiceApi, endService as endServiceApi } from '@/api/companion'

const orderId = ref('')
const orderInfo = ref({})
const timer = ref(null)

const serviceDuration = computed(() => {
  if (!orderInfo.value.startTime) return '0分钟'
  const start = new Date(orderInfo.value.startTime)
  const now = new Date()
  const diff = Math.floor((now - start) / 1000 / 60)
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  orderId.value = options.id
  loadOrderDetail()

  // 定时更新服务时长
  timer.value = setInterval(() => {
    if (orderInfo.value.status === 'ongoing') {
      // 触发重新计算
    }
  }, 60000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const loadOrderDetail = async () => {
  try {
    const res = await getCompanionOrders({ page: 1, pageSize: 1, orderId: orderId.value })
    if (res.code === 200 && res.data.list.length > 0) {
      orderInfo.value = res.data.list[0]
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待接单',
    accepted: '已接单',
    ongoing: '服务中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const acceptOrder = async () => {
  try {
    const res = await acceptOrderApi(orderId.value)
    if (res.code === 200) {
      uni.showToast({
        title: '接单成功',
        icon: 'success'
      })
      loadOrderDetail()
    }
  } catch (error) {
    uni.showToast({
      title: '接单失败',
      icon: 'none'
    })
  }
}

const rejectOrder = () => {
  uni.showModal({
    title: '拒绝订单',
    editable: true,
    placeholderText: '请输入拒绝原因',
    success: async (res) => {
      if (res.confirm) {
        try {
          await rejectOrderApi(orderId.value, { reason: res.content || '陪玩师拒绝' })
          uni.showToast({
            title: '已拒绝',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const startService = async () => {
  try {
    const res = await startServiceApi(orderId.value)
    if (res.code === 200) {
      uni.showToast({
        title: '服务已开始',
        icon: 'success'
      })
      loadOrderDetail()
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

const endService = () => {
  uni.navigateTo({
    url: `/subpackages/companion/order/confirm?id=${orderId.value}`
  })
}

const contactUser = () => {
  uni.navigateTo({
    url: `/pages/message/detail?conversationId=${orderInfo.value.conversationId}`
  })
}
</script>

<style lang="scss" scoped>
.order-accept-page {
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
  }
}

.user-section, .order-info-section, .progress-section {
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

.user-info {
  display: flex;
  align-items: center;

  .user-avatar {
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

    .phone {
      font-size: 24rpx;
      color: #999;
    }
  }

  .contact-btn {
    padding: 0 24rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 30rpx;
    font-size: 26rpx;
    border: none;

    &::after {
      border: none;
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

    &.price {
      color: #3b82f6;
      font-weight: bold;
    }
  }
}

.progress-section {
  .progress-info {
    display: flex;

    .progress-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 0;
      background-color: #f5f5f5;
      border-radius: 12rpx;
      margin-right: 20rpx;

      &:last-child {
        margin-right: 0;
      }

      .progress-label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 10rpx;
      }

      .progress-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #3b82f6;
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

    &.reject-btn {
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
