<template>
  <view class="order-card" @click="handleClick">
    <view class="order-card__header">
      <view class="order-card__order-no">
        <text class="order-card__order-no-label">订单号：</text>
        <text class="order-card__order-no-value">{{ order.orderNo }}</text>
      </view>
      <view class="order-card__status" :class="'order-card__status--' + order.status">
        {{ statusText }}
      </view>
    </view>

    <view class="order-card__companion">
      <image :src="order.companionAvatar || '/static/default-avatar.png'" mode="aspectFill" class="order-card__avatar" />
      <view class="order-card__companion-info">
        <view class="order-card__companion-name">{{ order.companionName }}</view>
        <view class="order-card__game">{{ order.gameName }}</view>
      </view>
      <view class="order-card__amount">
        <text class="order-card__amount-symbol">¥</text>
        <text class="order-card__amount-value">{{ order.amount }}</text>
      </view>
    </view>

    <view class="order-card__info">
      <view class="order-card__info-item">
        <text class="order-card__info-label">服务时长：</text>
        <text class="order-card__info-value">{{ order.duration }}小时</text>
      </view>
      <view class="order-card__info-item">
        <text class="order-card__info-label">下单时间：</text>
        <text class="order-card__info-value">{{ order.createTime }}</text>
      </view>
    </view>

    <view class="order-card__footer">
      <view v-if="order.status === 'pending'" class="order-card__actions">
        <view class="order-card__btn order-card__btn--cancel" @click.stop="handleCancel">取消订单</view>
        <view class="order-card__btn order-card__btn--pay" @click.stop="handlePay">立即支付</view>
      </view>
      <view v-else-if="order.status === 'paid'" class="order-card__actions">
        <view class="order-card__btn order-card__btn--contact" @click.stop="handleContact">联系</view>
      </view>
      <view v-else-if="order.status === 'completed'" class="order-card__actions">
        <view class="order-card__btn order-card__btn--review" @click.stop="handleReview">评价</view>
        <view class="order-card__btn order-card__btn--reorder" @click.stop="handleReorder">再次预约</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({
      orderNo: '',
      status: 'pending',
      companionName: '',
      companionAvatar: '',
      gameName: '',
      amount: 0,
      duration: 0,
      createTime: ''
    })
  }
})

const emit = defineEmits(['click', 'cancel', 'pay', 'contact', 'review', 'reorder'])

const statusText = computed(() => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    serving: '服务中',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[props.order.status] || '未知状态'
})

const handleClick = () => {
  emit('click')
}

const handleCancel = () => {
  emit('cancel', props.order)
}

const handlePay = () => {
  emit('pay', props.order)
}

const handleContact = () => {
  emit('contact', props.order)
}

const handleReview = () => {
  emit('review', props.order)
}

const handleReorder = () => {
  emit('reorder', props.order)
}
</script>

<style lang="scss" scoped>
.order-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(66, 133, 240, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f5f8ff;
    margin-bottom: 20rpx;
  }

  &__order-no {
    display: flex;
    align-items: center;

    &-label {
      font-size: 26rpx;
      color: #999999;
    }

    &-value {
      font-size: 26rpx;
      color: #666666;
      font-weight: 500;
    }
  }

  &__status {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;

    &--pending {
      background: #fff7e6;
      color: #fa8c16;
    }

    &--paid {
      background: #e6f7ff;
      color: #1890ff;
    }

    &--serving {
      background: #f6ffed;
      color: #52c41a;
    }

    &--completed {
      background: #f5f8ff;
      color: #4285f4;
    }

    &--cancelled {
      background: #f5f5f5;
      color: #999999;
    }

    &--refunded {
      background: #fff1f0;
      color: #ff4d4f;
    }
  }

  &__companion {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }

  &__avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 12rpx;
    background: #f5f8ff;
    margin-right: 20rpx;
  }

  &__companion-info {
    flex: 1;
  }

  &__companion-name {
    font-size: 30rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8rpx;
  }

  &__game {
    font-size: 24rpx;
    color: #999999;
  }

  &__amount {
    display: flex;
    align-items: baseline;

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
  }

  &__info {
    padding: 20rpx 0;
    border-top: 2rpx solid #f5f8ff;
    border-bottom: 2rpx solid #f5f8ff;
    margin-bottom: 20rpx;
  }

  &__info-item {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__info-label {
    font-size: 26rpx;
    color: #999999;
    margin-right: 12rpx;
  }

  &__info-value {
    font-size: 26rpx;
    color: #666666;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__actions {
    display: flex;
    gap: 16rpx;
  }

  &__btn {
    padding: 16rpx 32rpx;
    border-radius: 48rpx;
    font-size: 26rpx;
    font-weight: 500;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }

    &--cancel {
      background: #f5f5f5;
      color: #666666;
    }

    &--pay {
      background: linear-gradient(135deg, #4285f4 0%, #66a3ff 100%);
      color: #ffffff;
      box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.3);
    }

    &--contact {
      background: #f5f8ff;
      color: #4285f4;
    }

    &--review {
      background: #fff7e6;
      color: #fa8c16;
    }

    &--reorder {
      background: linear-gradient(135deg, #4285f4 0%, #66a3ff 100%);
      color: #ffffff;
    }
  }
}
</style>
