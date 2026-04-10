<template>
  <view class="companion-card" @click="handleClick">
    <view class="companion-card__avatar">
      <image :src="companion.avatar || '/static/default-avatar.png'" mode="aspectFill" class="companion-card__avatar-img" />
      <view v-if="companion.online" class="companion-card__online"></view>
      <view class="companion-card__level">{{ companion.level || 'Lv.1' }}</view>
    </view>
    <view class="companion-card__info">
      <view class="companion-card__name">{{ companion.nickname }}</view>
      <view class="companion-card__tags">
        <text v-for="(tag, index) in companion.tags" :key="index" class="companion-card__tag">{{ tag }}</text>
      </view>
      <view class="companion-card__game">
        <text class="companion-card__game-icon">🎮</text>
        <text class="companion-card__game-name">{{ companion.gameName }}</text>
      </view>
      <view class="companion-card__stats">
        <view class="companion-card__stat">
          <text class="companion-card__stat-value">{{ companion.orderCount || 0 }}</text>
          <text class="companion-card__stat-label">订单</text>
        </view>
        <view class="companion-card__stat">
          <text class="companion-card__stat-value">{{ companion.rating || 5.0 }}</text>
          <text class="companion-card__stat-label">评分</text>
        </view>
      </view>
    </view>
    <view class="companion-card__price">
      <text class="companion-card__price-symbol">¥</text>
      <text class="companion-card__price-value">{{ companion.price }}</text>
      <text class="companion-card__price-unit">/小时</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  companion: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      nickname: '',
      avatar: '',
      level: 'Lv.1',
      tags: [],
      gameName: '',
      orderCount: 0,
      rating: 5.0,
      price: 0,
      online: false
    })
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.companion-card {
  display: flex;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(66, 133, 240, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(66, 133, 240, 0.12);
  }

  &__avatar {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-right: 24rpx;
    flex-shrink: 0;

    &-img {
      width: 100%;
      height: 100%;
      border-radius: 12rpx;
      background: #f5f8ff;
    }
  }

  &__online {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 24rpx;
    height: 24rpx;
    background: #52c41a;
    border: 4rpx solid #ffffff;
    border-radius: 50%;
  }

  &__level {
    position: absolute;
    bottom: 8rpx;
    left: 8rpx;
    padding: 4rpx 12rpx;
    background: linear-gradient(135deg, #4285f4 0%, #66a3ff 100%);
    color: #ffffff;
    font-size: 20rpx;
    border-radius: 20rpx;
    font-weight: 600;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  &__name {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12rpx;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    margin-bottom: 12rpx;
  }

  &__tag {
    padding: 6rpx 16rpx;
    background: #f5f8ff;
    color: #4285f4;
    font-size: 22rpx;
    border-radius: 20rpx;
  }

  &__game {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;

    &-icon {
      font-size: 28rpx;
      margin-right: 8rpx;
    }

    &-name {
      font-size: 26rpx;
      color: #666666;
    }
  }

  &__stats {
    display: flex;
    gap: 32rpx;
  }

  &__stat {
    display: flex;
    align-items: baseline;
    gap: 8rpx;

    &-value {
      font-size: 28rpx;
      font-weight: 600;
      color: #4285f4;
    }

    &-label {
      font-size: 22rpx;
      color: #999999;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding-left: 16rpx;
    flex-shrink: 0;

    &-symbol {
      font-size: 24rpx;
      color: #ff4d4f;
      font-weight: 600;
    }

    &-value {
      font-size: 36rpx;
      color: #ff4d4f;
      font-weight: 700;
    }

    &-unit {
      font-size: 22rpx;
      color: #999999;
    }
  }
}
</style>
