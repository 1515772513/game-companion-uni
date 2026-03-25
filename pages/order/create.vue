<template>
  <view class="order-create-page">
    <view class="form">
      <view class="form-title">创建订单</view>
      <view class="form-content">订单创建表单</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})
</script>

<style lang="scss" scoped>
.order-create-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.form {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.form-title {
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.form-content {
  font-size: 28rpx;
  color: #666;
}
</style>
