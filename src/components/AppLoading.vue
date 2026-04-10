<template>
  <view class="app-loading" :class="{ 'app-loading--fullscreen': fullscreen }">
    <view class="app-loading__spinner">
      <view class="app-loading__dot" v-for="(item, index) in 8" :key="index" :style="{ animationDelay: index * 0.1 + 's' }"></view>
    </view>
    <view v-if="text" class="app-loading__text">{{ text }}</view>
  </view>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;

  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    z-index: 9999;
  }

  &__spinner {
    position: relative;
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 32rpx;
  }

  &__dot {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    background: #4285f4;
    border-radius: 50%;
    animation: loading-spin 1.2s linear infinite;

    &:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
    &:nth-child(2) { top: 12rpx; right: 12rpx; }
    &:nth-child(3) { top: 50%; right: 0; transform: translateY(-50%); }
    &:nth-child(4) { bottom: 12rpx; right: 12rpx; }
    &:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%); }
    &:nth-child(6) { bottom: 12rpx; left: 12rpx; }
    &:nth-child(7) { top: 50%; left: 0; transform: translateY(-50%); }
    &:nth-child(8) { top: 12rpx; left: 12rpx; }
  }

  &__text {
    font-size: 28rpx;
    color: #4285f4;
    font-weight: 500;
  }
}

@keyframes loading-spin {
  0%, 40%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  20% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
