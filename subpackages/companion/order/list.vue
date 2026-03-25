<template>
  <view class="companion-order-list-page">
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
.companion-order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.order-list {
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
