<template>
  <view class="earning-page">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>

    <!-- 收益卡片 -->
    <view class="earning-card">
      <view class="card-header">
        <text class="header-title">累计收益</text>
        <view class="eye-btn">
          <uni-icons :type="showBalance ? 'eye' : 'eye-slash'" size="16" color="#fff"></uni-icons>
        </view>
      </view>
      <view class="amount-row">
        <text class="amount-symbol">¥</text>
        <text class="amount">{{ showBalance ? earning : '****' }}</text>
      </view>
      <view class="card-stats">
        <view class="stat-item">
          <text class="stat-label">今日收益</text>
          <text class="stat-value">¥{{ todayEarning }}</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-label">本月收益</text>
          <text class="stat-value">¥{{ monthEarning }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary" @click="handleWithdraw">
        <uni-icons type="wallet" size="18" color="#fff"></uni-icons>
        <text>申请提现</text>
      </view>
      <view class="action-btn secondary" @click="handleRecord">
        <uni-icons type="list" size="18" color="#3b82f6"></uni-icons>
        <text>收益明细</text>
      </view>
    </view>

    <!-- 收益记录 -->
    <view class="record-section">
      <view class="section-title">
        <text>最近收益</text>
        <view class="more-btn" @click="handleRecord">
          <text>全部</text>
          <uni-icons type="right" size="12" color="#999"></uni-icons>
        </view>
      </view>
      <view class="record-list">
        <view class="record-item" v-for="item in recordList" :key="item.id">
          <view class="record-icon">
            <uni-icons type="chatbubble" size="18" color="#3b82f6"></uni-icons>
          </view>
          <view class="record-info">
            <view class="record-title">{{ item.title }}</view>
            <view class="record-time">{{ item.time }}</view>
          </view>
          <view class="record-amount">
            <text class="amount-text">+{{ item.amount }}</text>
            <text class="amount-unit">元</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 是否显示余额
const showBalance = ref(true)

// 累计收益
const earning = ref('0.00')

// 今日收益
const todayEarning = ref('0.00')

// 本月收益
const monthEarning = ref('0.00')

// 收益记录
const recordList = ref([
  {
    id: 1,
    title: '陪玩服务 - 王者荣耀',
    time: '2026-03-25 14:30',
    amount: '50.00'
  },
  {
    id: 2,
    title: '陪玩服务 - 和平精英',
    time: '2026-03-25 12:15',
    amount: '60.00'
  },
  {
    id: 3,
    title: '陪玩服务 - 英雄联盟',
    time: '2026-03-24 20:00',
    amount: '80.00'
  }
])

// 切换余额显示
const toggleBalance = () => {
  showBalance.value = !showBalance.value
}

// 申请提现
const handleWithdraw = () => {
  uni.navigateTo({
    url: '/pages/wallet/withdraw'
  })
}

// 收益明细
const handleRecord = () => {
  uni.navigateTo({
    url: '/pages/wallet/record'
  })
}
</script>

<style lang="scss" scoped>
.earning-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #f5f5f5 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 顶部背景 */
.header-bg {
  height: 360rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 0 0 40rpx 40rpx;
}

/* 收益卡片 */
.earning-card {
  position: relative;
  top: -280rpx;
  margin: 0 30rpx;
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 24rpx;
  box-shadow: 0 12rpx 32rpx rgba(59, 130, 246, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.eye-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.amount-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 40rpx;
}

.amount-symbol {
  font-size: 40rpx;
  font-weight: 500;
  color: #fff;
  margin-right: 8rpx;
}

.amount {
  font-size: 72rpx;
  font-weight: 600;
  color: #fff;
}

.card-stats {
  display: flex;
  align-items: center;
  padding-top: 30rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

.stat-divider {
  width: 1rpx;
  height: 40rpx;
  background-color: rgba(255, 255, 255, 0.2);
}

/* 操作按钮 */
.action-buttons {
  position: relative;
  top: -240rpx;
  display: flex;
  gap: 20rpx;
  margin: 0 30rpx 30rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  transition: all 0.3s;

  &.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.3);

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
    }
  }

  &.secondary {
    background-color: #fff;
    color: #3b82f6;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active {
      background-color: #f9fafb;
    }
  }

  text {
    margin-left: 8rpx;
  }
}

/* 收益记录 */
.record-section {
  position: relative;
  top: -200rpx;
  margin: 0 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.more-btn {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #999;

  text {
    margin-right: 4rpx;
  }
}

.record-list {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.record-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%);
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.record-info {
  flex: 1;
}

.record-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  display: flex;
  align-items: baseline;
}

.amount-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #10b981;
  margin-right: 4rpx;
}

.amount-unit {
  font-size: 22rpx;
  color: #999;
}
</style>
