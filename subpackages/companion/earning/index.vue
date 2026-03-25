<template>
  <view class="earning-page">
    <view class="earning-card">
      <view class="amount">¥0.00</view>
      <view class="label">累计收益</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const earning = ref('0.00')
</script>

<style lang="scss" scoped>
.earning-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.earning-card {
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
  border-radius: 16rpx;
  padding: 60rpx 30rpx;
  text-align: center;
}

.amount {
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
