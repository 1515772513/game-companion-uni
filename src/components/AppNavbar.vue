<template>
  <view class="app-navbar" :style="{ height: navbarHeight + 'px' }">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="navbar-content">
      <view class="navbar-left" @click="handleLeftClick">
        <slot name="left">
          <uni-icons v-if="showBack" type="back" size="20" @click="goBack"></uni-icons>
        </slot>
      </view>
      <view class="navbar-title">{{ title }}</view>
      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['leftClick'])

const appStore = useAppStore()

const statusBarHeight = computed(() => appStore.statusBarHeight)
const navbarHeight = computed(() => appStore.navigationBarHeight)

const handleLeftClick = () => {
  emit('leftClick')
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.status-bar {
  width: 100%;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 30rpx;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  width: 88rpx;
  height: 100%;
}

.navbar-right {
  justify-content: flex-end;
}

.navbar-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
