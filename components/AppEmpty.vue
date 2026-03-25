<template>
  <view class="app-empty">
    <view class="empty-image">
      <image v-if="image" :src="image" mode="aspectFit"></image>
      <slot v-else name="image">
        <view class="default-icon">
          <uni-icons type="inbox" size="80" color="#ccc"></uni-icons>
        </view>
      </slot>
    </view>
    <view v-if="text" class="empty-text">{{ text }}</view>
    <view v-if="showBtn" class="empty-btn">
      <slot name="button">
        <uni-button type="primary" size="mini" @click="handleClick">
          {{ btnText }}
        </uni-button>
      </slot>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  showBtn: {
    type: Boolean,
    default: false
  },
  btnText: {
    type: String,
    default: '去试试'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 60rpx;
}

.empty-image {
  width: 320rpx;
  height: 320rpx;
  margin-bottom: 40rpx;
}

.empty-image image {
  width: 100%;
  height: 100%;
}

.default-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-btn {
  width: 200rpx;
}
</style>
