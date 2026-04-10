<template>
  <view class="app-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="app-navbar__content">
      <view v-if="showBack" class="app-navbar__back" @click="handleBack">
        <text class="app-navbar__back-icon">←</text>
      </view>
      <view class="app-navbar__title">{{ title }}</view>
      <view class="app-navbar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  background: {
    type: String,
    default: '#4285f4'
  }
})

const emit = defineEmits(['back'])

const statusBarHeight = ref(0)

onMounted(() => {
  // 获取系统状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

const handleBack = () => {
  emit('back')
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4285f4 0%, #66a3ff 100%);
  z-index: 1000;
  box-shadow: 0 4rpx 16rpx rgba(66, 133, 244, 0.2);

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;
    position: relative;
  }

  &__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }

    &-icon {
      color: #ffffff;
      font-size: 40rpx;
      font-weight: 500;
    }
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__right {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
