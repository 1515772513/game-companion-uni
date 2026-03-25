<template>
  <view class="order-list-page">
    <view class="order-tabs">
      <view class="tab-item">全部</view>
      <view class="tab-item">待支付</view>
      <view class="tab-item">进行中</view>
      <view class="tab-item">已完成</view>
    </view>
    <view class="order-list">
      <view class="empty">暂无订单</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const orderList = ref([])
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.order-tabs {
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

.order-list {
  padding: 30rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
