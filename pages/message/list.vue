<template>
  <view class="message-list-page">
    <view class="message-tabs">
      <view class="tab-item active">全部</view>
      <view class="tab-item">未读</view>
    </view>
    <view class="message-list">
      <view class="empty">暂无消息</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const messageList = ref([])
</script>

<style lang="scss" scoped>
.message-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.message-tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #FF6B00;
  font-weight: 500;
}

.message-list {
  padding: 30rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
