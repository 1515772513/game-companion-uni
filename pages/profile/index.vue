<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ userInfo.nickname || '未登录' }}</text>
            <view class="vip-badge" v-if="userInfo.isVip">
              <uni-icons type="vip-filled" size="16" color="#FFD700"></uni-icons>
              <text>VIP</text>
            </view>
          </view>
          <text class="id" v-if="userInfo.id">ID: {{ userInfo.id }}</text>
        </view>
        <view class="edit-btn" @tap="goToEditProfile">
          <uni-icons type="compose" size="18" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-row">
        <view class="stat-item" @tap="goToOrders">
          <text class="stat-value">{{ stats.orderCount || 0 }}</text>
          <text class="stat-label">订单</text>
        </view>
        <view class="stat-item" @tap="goToFavorites">
          <text class="stat-value">{{ stats.favoriteCount || 0 }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @tap="goToCoupons">
          <text class="stat-value">{{ stats.couponCount || 0 }}</text>
          <text class="stat-label">优惠券</text>
        </view>
        <view class="stat-item" @tap="goToWallet">
          <text class="stat-value">{{ stats.balance || 0 }}</text>
          <text class="stat-label">余额</text>
        </view>
      </view>
    </view>

    <!-- 订单管理 -->
    <view class="order-section">
      <view class="section-header" @tap="goToOrders">
        <text class="section-title">我的订单</text>
        <view class="more">
          <text>全部订单</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>
      <view class="order-types">
        <view class="order-type-item" @tap="goToOrders('pending')">
          <uni-icons type="wallet" size="28" color="#3b82f6"></uni-icons>
          <text class="type-label">待支付</text>
          <view class="badge" v-if="orderStats.pending > 0">{{ orderStats.pending }}</view>
        </view>
        <view class="order-type-item" @tap="goToOrders('ongoing')">
          <uni-icons type="loop" size="28" color="#52c41a"></uni-icons>
          <text class="type-label">进行中</text>
          <view class="badge" v-if="orderStats.ongoing > 0">{{ orderStats.ongoing }}</view>
        </view>
        <view class="order-type-item" @tap="goToOrders('completed')">
          <uni-icons type="checkbox-filled" size="28" color="#FFB800"></uni-icons>
          <text class="type-label">已完成</text>
        </view>
        <view class="order-type-item" @tap="goToOrders('refund')">
          <uni-icons type="refreshempty" size="28" color="#ff4d4f"></uni-icons>
          <text class="type-label">退款</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goToWallet">
        <view class="menu-left">
          <uni-icons type="wallet-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">我的钱包</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
      <view class="menu-item" @tap="goToCompanionApply">
        <view class="menu-left">
          <uni-icons type="person-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">成为陪玩师</text>
        </view>
        <view class="menu-right">
          <text class="tip" v-if="!userInfo.isCompanion">申请成为陪玩师</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>
      <view class="menu-item" @tap="goToAddress">
        <view class="menu-left">
          <uni-icons type="location" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">收货地址</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
      <view class="menu-item" @tap="goToSettings">
        <view class="menu-left">
          <uni-icons type="gear-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">设置</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 其他功能 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goToFeedback">
        <view class="menu-left">
          <uni-icons type="chatbubble-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">意见反馈</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
      <view class="menu-item" @tap="goToAbout">
        <view class="menu-left">
          <uni-icons type="info-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">关于我们</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
      <view class="menu-item" @tap="contactService">
        <view class="menu-left">
          <uni-icons type="phone-filled" size="22" color="#3b82f6"></uni-icons>
          <text class="menu-label">联系客服</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userInfo.id">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo, logout } from '@/api/user'
import { getOrderStats } from '@/api/order'

const userInfo = ref({})
const stats = ref({
  orderCount: 0,
  favoriteCount: 0,
  couponCount: 0,
  balance: 0
})
const orderStats = ref({
  pending: 0,
  ongoing: 0,
  completed: 0,
  refund: 0
})

onMounted(() => {
  loadUserInfo()
  loadOrderStats()
})

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      const data = res.data
      userInfo.value = {
        ...data,
        avatar: data.avatar || data.avatar_url,
        id: data.id || data.user_id
      }
      stats.value = {
        orderCount: data.order_count || data.orderCount || 0,
        favoriteCount: data.favorite_count || data.favoriteCount || 0,
        couponCount: data.coupon_count || data.couponCount || 0,
        balance: data.balance || 0
      }
    }
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

const loadOrderStats = async () => {
  try {
    const res = await getOrderStats()
    if (res.code === 200) {
      orderStats.value = res.data
    }
  } catch (error) {
    console.error('获取订单统计失败', error)
  }
}

const goToEditProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/edit'
  })
}

const goToOrders = (status) => {
  const url = status ? `/pages/order/list?status=${status}` : '/pages/order/list'
  uni.navigateTo({ url })
}

const goToFavorites = () => {
  uni.navigateTo({
    url: '/pages/profile/favorites'
  })
}

const goToCoupons = () => {
  uni.navigateTo({
    url: '/pages/profile/coupons'
  })
}

const goToWallet = () => {
  uni.navigateTo({
    url: '/pages/wallet/index'
  })
}

const goToCompanionApply = () => {
  if (userInfo.value.isCompanion) {
    uni.switchTab({
      url: '/packages/companion/index'
    })
  } else {
    uni.navigateTo({
      url: '/pages/profile/companion-apply'
    })
  }
}

const goToAddress = () => {
  uni.navigateTo({
    url: '/pages/profile/address'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings'
  })
}

const goToFeedback = () => {
  uni.navigateTo({
    url: '/pages/profile/feedback'
  })
}

const goToAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/about'
  })
}

const contactService = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服电话：400-123-4567\n工作时间：9:00-21:00',
    showCancel: false
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await logout()
        } catch (error) {
          console.error('退出登录失败', error)
        }

        uni.clearStorageSync()
        uni.reLaunch({
          url: '/pages/user/login'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 20rpx;
    }

    .info {
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .name {
          font-size: 36rpx;
          font-weight: bold;
          color: #fff;
          margin-right: 16rpx;
        }

        .vip-badge {
          display: flex;
          align-items: center;
          padding: 4rpx 12rpx;
          background-color: rgba(255, 215, 0, 0.2);
          border-radius: 20rpx;
          border: 1px solid rgba(255, 215, 0, 0.5);

          text {
            font-size: 20rpx;
            color: #FFD700;
            margin-left: 4rpx;
          }
        }
      }

      .id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .edit-btn {
      width: 60rpx;
      height: 60rpx;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .stats-row {
    display: flex;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 30rpx 0;
    backdrop-filter: blur(10rpx);

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-value {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.order-section, .menu-section {
  background-color: #fff;
  margin-bottom: 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .more {
      display: flex;
      align-items: center;
      color: #999;
      font-size: 26rpx;

      text {
        margin-right: 6rpx;
      }
    }
  }

  .order-types {
    display: flex;
    padding: 0 30rpx 30rpx;

    .order-type-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .type-label {
        font-size: 24rpx;
        color: #666;
        margin-top: 12rpx;
      }

      .badge {
        position: absolute;
        top: -10rpx;
        right: 10rpx;
        min-width: 32rpx;
        height: 32rpx;
        background-color: #ff4d4f;
        color: #fff;
        font-size: 20rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8rpx;
      }
    }
  }

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .menu-left {
      display: flex;
      align-items: center;

      .menu-label {
        margin-left: 20rpx;
        font-size: 28rpx;
        color: #333;
      }
    }

    .menu-right {
      display: flex;
      align-items: center;

      .tip {
        font-size: 24rpx;
        color: #999;
        margin-right: 10rpx;
      }
    }
  }
}

.logout-section {
  padding: 40rpx 30rpx;

  .logout-btn {
    width: 100%;
    height: 90rpx;
    background-color: #fff;
    color: #ff4d4f;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;

    &::after {
      border: none;
    }
  }
}
</style>
