<template>
  <view class="wallet-page">
    <view class="wallet-card">
      <view class="balance">¥0.00</view>
      <view class="label">账户余额</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const balance = ref('0.00')
</script>

<style lang="scss" scoped>
.wallet-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.wallet-card {
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
  border-radius: 16rpx;
  padding: 60rpx 30rpx;
  text-align: center;
}

.balance {
  font-size: 48rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 10rpx;
}

.label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
