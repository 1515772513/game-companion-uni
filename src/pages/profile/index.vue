<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-detail">
          <view class="user-name">{{ userInfo?.name || '未登录' }}</view>
          <view class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</view>
        </view>
        <view class="edit-btn" @click="handleEdit">
          <uni-icons type="compose" size="18" color="#666"></uni-icons>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="user-stats">
        <view class="stat-item">
          <view class="stat-value">{{ userStats.orderCount || 0 }}</view>
          <view class="stat-label">订单</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ userStats.followCount || 0 }}</view>
          <view class="stat-label">关注</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ userStats.couponCount || 0 }}</view>
          <view class="stat-label">优惠券</view>
        </view>
      </view>
    </view>

    <!-- 钱包入口 -->
    <view class="wallet-section" @click="handleWallet">
      <view class="wallet-info">
        <view class="wallet-label">账户余额</view>
        <view class="wallet-amount">¥{{ walletBalance }}</view>
      </view>
      <view class="wallet-action">
        <text>提现</text>
        <uni-icons type="right" size="14"></uni-icons>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" v-for="item in menuList" :key="item.id" @click="handleMenuClick(item)">
        <view class="menu-left">
          <uni-icons :type="item.icon" size="20" :color="item.color || '#FF6B00'"></uni-icons>
          <text class="menu-title">{{ item.title }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-extra" v-if="item.extra">{{ item.extra }}</text>
          <uni-icons type="right" size="14" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 用户统计数据
const userStats = ref({
  orderCount: 10,
  followCount: 5,
  couponCount: 3
})

// 钱包余额
const walletBalance = ref('0.00')

// 菜单列表
const menuList = ref([
  {
    id: 1,
    title: '我的订单',
    icon: 'list',
    path: '/pages/order/list'
  },
  {
    id: 2,
    title: '成为陪玩师',
    icon: 'person-add',
    path: '/pages/companion/apply'
  },
  {
    id: 3,
    title: '消息通知',
    icon: 'notification',
    path: '/pages/message/list',
    extra: ''
  },
  {
    id: 4,
    title: '联系客服',
    icon: 'chatbubble'
  },
  {
    id: 5,
    title: '设置',
    icon: 'gear'
  }
])

// 编辑资料
const handleEdit = () => {
  uni.navigateTo({
    url: '/pages/profile/edit'
  })
}

// 钱包
const handleWallet = () => {
  uni.navigateTo({
    url: '/pages/wallet/index'
  })
}

// 菜单点击
const handleMenuClick = (item) => {
  if (item.path) {
    uni.navigateTo({
      url: item.path
    })
  } else if (item.id === 4) {
    // 联系客服
    uni.showModal({
      title: '联系客服',
      content: '客服电话: 400-xxx-xxxx',
      showCancel: true,
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: '400-xxx-xxxx'
          })
        }
      }
    })
  } else if (item.id === 5) {
    // 设置
    uni.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

.user-card {
  margin: 30rpx;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
  border-radius: 16rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  background-color: #fff;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.edit-btn {
  padding: 10rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.user-stats {
  display: flex;
  padding-top: 30rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.wallet-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.wallet-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.wallet-amount {
  font-size: 40rpx;
  font-weight: 500;
  color: #FF6B00;
}

.wallet-action {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.menu-section {
  margin: 0 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-title {
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #333;
}

.menu-right {
  display: flex;
  align-items: center;
}

.menu-extra {
  margin-right: 10rpx;
  font-size: 28rpx;
  color: #999;
}
</style>
