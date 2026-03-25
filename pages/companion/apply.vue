<template>
  <view class="companion-apply-page">
    <view class="form">
      <view class="title">申请成为陪玩师</view>
      <view class="content">申请表单</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})
</script>

<style lang="scss" scoped>
.companion-apply-page {
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
