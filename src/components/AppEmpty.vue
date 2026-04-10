<template>
  <view class="app-empty">
    <view class="app-empty__icon">
      <text class="app-empty__icon-text">{{ iconText }}</text>
    </view>
    <view class="app-empty__text">{{ text }}</view>
    <view v-if="description" class="app-empty__description">{{ description }}</view>
    <view v-if="showAction" class="app-empty__action">
      <slot name="action">
        <view class="app-empty__btn" @click="handleAction">{{ actionText }}</view>
      </slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  iconText: {
    type: String,
    default: '📭'
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: '去看看'
  }
})

const emit = defineEmits(['action'])

const handleAction = () => {
  emit('action')
}
</script>

<style lang="scss" scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
  min-height: 400rpx;

  &__icon {
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(135deg, #f5f8ff 0%, #e8f0fe 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;

    &-text {
      font-size: 100rpx;
      opacity: 0.6;
    }
  }

  &__text {
    font-size: 32rpx;
    color: #666666;
    margin-bottom: 16rpx;
  }

  &__description {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 48rpx;
    text-align: center;
  }

  &__action {
    margin-top: 24rpx;
  }

  &__btn {
    padding: 20rpx 60rpx;
    background: linear-gradient(135deg, #4285f4 0%, #66a3ff 100%);
    color: #ffffff;
    font-size: 28rpx;
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(66, 133, 244, 0.3);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
    }
  }
}
</style>
