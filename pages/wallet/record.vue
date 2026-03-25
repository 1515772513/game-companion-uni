<template>
  <view class="record-page">
    <view class="record-list">
      <view class="empty">暂无交易记录</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([])
</script>

<style lang="scss" scoped>
.record-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.record-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 60rpx 30rpx;
  text-align: center;
}

.empty {
  font-size: 28rpx;
  color: #999;
}
</style>
