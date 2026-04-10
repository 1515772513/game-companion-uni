<template>
  <view class="app-card" :class="{ 'app-card--shadow': shadow, 'app-card--border': border }">
    <view v-if="showHeader" class="app-card__header">
      <view class="app-card__title">{{ title }}</view>
      <view v-if="extra" class="app-card__extra">{{ extra }}</view>
    </view>
    <view class="app-card__body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="app-card__footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  extra: {
    type: String,
    default: ''
  },
  shadow: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.app-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  margin: 24rpx;

  &--shadow {
    box-shadow: 0 4rpx 16rpx rgba(66, 133, 240, 0.08);
  }

  &--border {
    border: 2rpx solid #e8f0fe;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28rpx 32rpx;
    border-bottom: 2rpx solid #f5f8ff;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
    position: relative;
    padding-left: 20rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 32rpx;
      background: linear-gradient(180deg, #4285f4 0%, #66a3ff 100%);
      border-radius: 4rpx;
    }
  }

  &__extra {
    font-size: 28rpx;
    color: #4285f4;
  }

  &__body {
    padding: 32rpx;
  }

  &__footer {
    padding: 24rpx 32rpx;
    border-top: 2rpx solid #f5f8ff;
    background: #fafbff;
  }
}
</style>
