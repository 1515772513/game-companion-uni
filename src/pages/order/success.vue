<template>
  <view class="success-page">
    <!-- 成功图标区域 -->
    <view class="success-header">
      <view class="success-icon">
        <uni-icons type="checkmarkempty" size="60" color="#fff"></uni-icons>
      </view>
      <text class="success-title">订单提交成功</text>
      <!-- <text class="success-desc">我们已收到您的陪玩服务订单</text> -->
    </view>

    <!-- 订单信息卡片 -->
    <view class="order-card">
      <view class="card-title">订单信息</view>

      <view class="info-item">
        <text class="label">订单编号</text>
        <text class="value">{{ orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">服务类型</text>
        <text class="value">{{ selectedService?.serviceTypeName }}</text>
      </view>

      <view class="info-item">
        <text class="label">游戏名称</text>
        <text class="value">{{ selectedService?.gameName }}</text>
      </view>

      <view class="info-item">
        <text class="label">服务数量</text>
        <text class="value">{{ serviceCount }} 局</text>
      </view>

      <view class="info-item">
        <text class="label">订单创建时间</text>
        <text class="value">{{ createdAt }}</text>
      </view>

      <view class="info-item">
        <text class="label">支付金额</text>
        <text class="value price">¥{{ totalAmount }}</text>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="tip-card">
      <view class="tip-title">温馨提示</view>
      <text class="tip-content">
        请复制订单信息后及时联系在线客服，客服将尽快为您安排陪玩师服务，感谢您的支持与配合！
      </text>
    </view>

    <!-- 操作按钮 -->
    <view class="btn-group">
      <button class="btn copy-btn" @tap="copyOrderInfo">
        <uni-icons type="copy" size="18"></uni-icons>
        复制订单信息
      </button>
      <button class="btn service-btn" open-type="contact" :data-info="getCopyText()">
        <uni-icons type="contact" size="18" color="#FFF"></uni-icons>
        联系客服
      </button>
    </view>

    <!-- 底部导航 -->
    <!-- <view class="bottom-nav">
      <text class="nav-item" @tap="goHome">返回首页</text>
      <text class="nav-item" @tap="goOrderList">查看我的订单</text>
    </view> -->
  </view>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { getOrderDetail } from '@/api/order'

  const orderNo = ref('')
  const orderInfo = ref({})
  const selectedService = ref(null)
  const serviceCount = ref(1)
  const createdAt = ref('')
  const totalAmount = ref(0)

  onMounted(async () => {
    // 获取页面传递的订单ID
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    orderNo.value = currentPage.options.orderNo || ''

    // 获取订单详情
    await loadOrderDetail()
  })

  // 加载订单详情
  const loadOrderDetail = async () => {
    try {
      const res = await getOrderDetail(orderNo.value)
      if (res.code === 200) {
        const data = res.data
        orderInfo.value = data
        selectedService.value = {
          serviceTypeName: data.serviceTypeName,
          gameName: data.game.name,
        }
        serviceCount.value = data.serviceCount
        createdAt.value = data.createdAt
        totalAmount.value = data.totalAmount
      }
    } catch (error) {
      console.error('获取订单详情失败', error)
    }
  }

  const getCopyText = () => {
    const copyText = `
  订单编号：${orderNo.value}
  服务类型：${selectedService.value?.serviceTypeName || ''}
  游戏名称：${selectedService.value?.gameName || ''}
  服务数量：${serviceCount.value}局
  订单创建时间：${createdAt.value}
  支付金额：¥${totalAmount.value}
    `.trim()
    return copyText
  }

  // 复制订单信息
  const copyOrderInfo = () => {
    const copyText = getCopyText()

    uni.setClipboardData({
      data: copyText,
      success: () => {
        uni.showToast({ title: '订单信息复制成功', icon: 'success' })
      }
    })
  }

  // 返回首页
  const goHome = () => {
    uni.switchTab({ url: '/pages/index/index' })
  }

  // 查看订单列表
  const goOrderList = () => {
    uni.navigateTo({ url: '/pages/order/list' })
  }
</script>

<style lang="scss" scoped>
  .success-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding: 40rpx 30rpx;
    box-sizing: border-box;
  }

  /* 成功头部 */
  .success-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 60rpx 0 80rpx;

    .success-icon {
      width: 120rpx;
      height: 120rpx;
      background-color: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30rpx;
    }

    .success-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }

    .success-desc {
      font-size: 26rpx;
      color: #999;
    }
  }

  /* 订单信息卡片 */
  .order-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    margin-bottom: 30rpx;

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 30rpx;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
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
  }

  /* 温馨提示 */
  .tip-card {
    background-color: #fff9e6;
    border: 1rpx solid #ffe79e;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 50rpx;

    .tip-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #f59e0b;
      margin-bottom: 16rpx;
    }

    .tip-content {
      font-size: 26rpx;
      color: #996a0b;
      line-height: 1.6;
    }
  }

  /* 按钮组 */
  .btn-group {
    display: flex;
    gap: 30rpx;
    margin-bottom: 60rpx;

    .btn {
      flex: 1;
      height: 88rpx;
      border-radius: 44rpx;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      border: none;

      &::after {
        border: none;
      }
    }

    .copy-btn {
      background-color: #f5f7fa;
      color: #333;
    }

    .service-btn {
      background-color: #3b82f6;
      color: #fff;
    }
  }

  /* 底部导航 */
  .bottom-nav {
    display: flex;
    justify-content: space-around;

    .nav-item {
      font-size: 26rpx;
      color: #999;
    }
  }
</style>