<template>
  <view class="message-detail-page">
    <view class="message-content">
      <view class="title">消息详情</view>
      <view class="content">消息内容</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const messageId = ref('')
</script>

<style lang="scss" scoped>
.message-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.message-content {
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
