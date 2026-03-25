<template>
  <view class="order-detail-page">
    <view class="order-info">
      <view class="title">订单详情</view>
      <view class="content">订单信息将在这里显示</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const orderId = ref('')
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.order-info {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.content {
  font-size: 28rpx;
  color: #666;
}
</style>
