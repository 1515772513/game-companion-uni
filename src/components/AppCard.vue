<template>
  <view class="app-card" :style="{ margin: margin }" @click="handleClick">
    <view v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <view class="card-title">{{ title }}</view>
        <view v-if="extra" class="card-extra">{{ extra }}</view>
      </slot>
    </view>
    <view class="card-body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="card-footer">
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
  margin: {
    type: String,
    default: '0 30rpx'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.app-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.card-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.card-extra {
  font-size: 28rpx;
  color: #999;
}

.card-body {
  padding: 30rpx;
}

.card-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f5f5f5;
}
</style>
