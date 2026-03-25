<template>
  <view class="withdraw-page">
    <view class="form">
      <view class="title">提现</view>
      <view class="content">提现表单</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  amount: '',
  account: ''
})
</script>

<style lang="scss" scoped>
.withdraw-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.form {
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
