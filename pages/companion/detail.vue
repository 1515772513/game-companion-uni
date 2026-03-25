<template>
  <view class="companion-detail-page">
    <view class="companion-info">
      <view class="title">陪玩师详情</view>
      <view class="content">陪玩师详细信息</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const companionId = ref('')
</script>

<style lang="scss" scoped>
.companion-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.companion-info {
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
