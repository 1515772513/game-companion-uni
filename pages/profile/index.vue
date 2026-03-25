<template>
  <view class="profile-page">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="avatar-wrapper">
          <image class="user-avatar" :src="userInfo?.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
          <view class="vip-badge" v-if="userInfo?.isVip">
            <uni-icons type="star-filled" size="10" color="#FFD700"></uni-icons>
          </view>
        </view>
        <view class="user-detail">
          <view class="user-name-row">
            <text class="user-name">{{ userInfo?.name || '未登录' }}</text>
            <view class="verified-badge" v-if="userInfo?.verified">
              <uni-icons type="checkmarkempty" size="12" color="#3b82f6"></uni-icons>
            </view>
          </view>
          <view class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</view>
        </view>
        <view class="edit-btn" @click="handleEdit">
          <uni-icons type="compose" size="16" color="#fff"></uni-icons>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="user-stats">
        <view class="stat-item" @click="handleMenuClick(menuList[0])">
          <view class="stat-value">{{ userStats.orderCount || 0 }}</view>
          <view class="stat-label">订单</view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="handleWallet">
          <view class="stat-value">{{ userStats.followCount || 0 }}</view>
          <view class="stat-label">关注</view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <view class="stat-value">{{ userStats.couponCount || 0 }}</view>
          <view class="stat-label">优惠券</view>
        </view>
      </view>
    </view>

    <!-- 钱包入口 -->
    <view class="wallet-section" @click="handleWallet">
      <view class="wallet-icon">
        <view class="icon-bg">
          <uni-icons type="wallet" size="20" color="#3b82f6"></uni-icons>
        </view>
      </view>
      <view class="wallet-info">
        <view class="wallet-label">账户余额</view>
        <view class="wallet-amount">¥{{ walletBalance }}</view>
      </view>
      <view class="wallet-action">
        <text class="action-text">提现</text>
        <uni-icons type="right" size="14" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" v-for="item in menuList" :key="item.id" @click="handleMenuClick(item)">
        <view class="menu-left">
          <view class="menu-icon" :style="{ background: item.iconBg }">
            <uni-icons :type="item.icon" size="18" :color="item.color || '#3b82f6'"></uni-icons>
          </view>
          <text class="menu-title">{{ item.title }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-extra" v-if="item.extra">{{ item.extra }}</text>
          <view class="badge" v-if="item.badge">{{ item.badge }}</view>
          <uni-icons type="right" size="14" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../store/user'

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
    color: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    path: '/pages/order/list'
  },
  {
    id: 2,
    title: '成为陪玩师',
    icon: 'person-add',
    color: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    path: '/pages/companion/apply'
  },
  {
    id: 3,
    title: '消息通知',
    icon: 'notification',
    color: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    path: '/pages/message/list',
    badge: 2
  },
  {
    id: 4,
    title: '联系客服',
    icon: 'chatbubble',
    color: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.1)'
  },
  {
    id: 5,
    title: '设置',
    icon: 'gear',
    color: '#6b7280',
    iconBg: 'rgba(107, 114, 128, 0.1)'
  }
])

// 编辑资料
const handleEdit = () => {
  if (!userInfo.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }
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

onMounted(() => {
  // TODO: 从服务器加载用户数据和统计数据
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 顶部背景 */
.header-bg {
  height: 300rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 0 0 40rpx 40rpx;
}

/* 用户卡片 */
.user-card {
  position: relative;
  top: -200rpx;
  margin: 0 30rpx;
  padding: 40rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
}

.vip-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff;
}

.user-detail {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-right: 8rpx;
}

.verified-badge {
  width: 28rpx;
  height: 28rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-id {
  font-size: 24rpx;
  color: #999;
}

.edit-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

/* 数据统计 */
.user-stats {
  display: flex;
  align-items: center;
  padding-top: 30rpx;
  border-top: 1rpx solid #f0f0f0;
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
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.stat-divider {
  width: 1rpx;
  height: 40rpx;
  background-color: #f0f0f0;
}

/* 钱包 */
.wallet-section {
  position: relative;
  top: -170rpx;
  display: flex;
  align-items: center;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
}

.wallet-icon {
  margin-right: 20rpx;
}

.icon-bg {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%);
  border-radius: 16rpx;
}

.wallet-info {
  flex: 1;
}

.wallet-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.wallet-amount {
  font-size: 40rpx;
  font-weight: 500;
  color: #3b82f6;
}

.wallet-action {
  display: flex;
  align-items: center;
}

.action-text {
  margin-right: 8rpx;
  font-size: 26rpx;
  color: #3b82f6;
}

/* 菜单 */
.menu-section {
  position: relative;
  top: -140rpx;
  margin: 0 30rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f9fafb;
  }
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.menu-title {
  font-size: 30rpx;
  color: #333;
}

.menu-right {
  display: flex;
  align-items: center;
}

.menu-extra {
  margin-right: 8rpx;
  font-size: 26rpx;
  color: #999;
}

.badge {
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #fff;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  border-radius: 16rpx;
  margin-right: 8rpx;
}
</style>
