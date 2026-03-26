<template>
  <view class="wallet-page">
    <!-- 余额卡片 -->
    <view class="balance-card">
      <view class="balance-info">
        <text class="label">账户余额</text>
        <view class="balance-row">
          <text class="symbol">¥</text>
          <text class="balance">{{ walletInfo.balance || 0 }}</text>
        </view>
      </view>
      <view class="action-buttons">
        <button class="action-btn recharge-btn" @tap="goToRecharge">充值</button>
        <button class="action-btn withdraw-btn" @tap="goToWithdraw">提现</button>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">¥{{ walletInfo.totalIncome || 0 }}</text>
        <text class="stat-label">总收入</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">¥{{ walletInfo.totalExpense || 0 }}</text>
        <text class="stat-label">总支出</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">¥{{ walletInfo.frozen || 0 }}</text>
        <text class="stat-label">冻结金额</text>
      </view>
    </view>

    <!-- 明细Tab -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: currentTab === 'all' }"
        @tap="switchTab('all')"
      >
        全部
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'income' }"
        @tap="switchTab('income')"
      >
        收入
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'expense' }"
        @tap="switchTab('expense')"
      >
        支出
      </view>
    </view>

    <!-- 明细列表 -->
    <view class="record-list">
      <view class="record-item" v-for="record in records" :key="record.id">
        <view class="record-icon" :class="record.type">
          <uni-icons :type="getRecordIcon(record.type)" size="24" color="#fff"></uni-icons>
        </view>
        <view class="record-info">
          <text class="record-title">{{ record.title }}</text>
          <text class="record-time">{{ record.createTime }}</text>
        </view>
        <view class="record-amount" :class="record.type">
          <text>{{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount }}</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-more" v-if="hasMore">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="no-more" v-else-if="records.length > 0">
      <text>没有更多了</text>
    </view>
    <view class="empty" v-else>
      <image src="/static/empty-wallet.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWalletInfo, getWalletRecords } from '@/api/user'

const walletInfo = ref({})
const records = ref([])
const currentTab = ref('all')
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const loading = ref(false)

onMounted(() => {
  loadWalletInfo()
  loadRecords()
})

const loadWalletInfo = async () => {
  try {
    const res = await getWalletInfo()
    if (res.code === 200) {
      const data = res.data
      walletInfo.value = {
        ...data,
        balance: data.balance || 0,
        totalIncome: data.total_income || data.totalIncome || 0,
        totalExpense: data.total_expense || data.totalExpense || 0,
        frozen: data.frozen || 0
      }
    }
  } catch (error) {
    console.error('获取钱包信息失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

const loadRecords = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }

    if (currentTab.value !== 'all') {
      params.type = currentTab.value
    }

    const res = await getWalletRecords(params)
    const list = res.data.list || []
    // 转换字段名
    const formattedList = list.map(item => ({
      ...item,
      title: item.title || item.description,
      createTime: item.created_at || item.create_time || item.createTime,
      type: item.type || (item.amount > 0 ? 'income' : 'expense')
    }))

    if (page.value === 1) {
      records.value = formattedList
    } else {
      records.value = [...records.value, ...formattedList]
    }
    hasMore.value = res.data.hasMore || false
  } catch (error) {
    console.error('获取明细失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const switchTab = (tab) => {
  currentTab.value = tab
  page.value = 1
  loadRecords()
}

const getRecordIcon = (type) => {
  const iconMap = {
    income: 'wallet-filled',
    expense: 'wallet',
    recharge: 'redo',
    withdraw: 'undo'
  }
  return iconMap[type] || 'help'
}

const goToRecharge = () => {
  uni.navigateTo({
    url: '/pages/wallet/recharge'
  })
}

const goToWithdraw = () => {
  uni.navigateTo({
    url: '/pages/wallet/withdraw'
  })
}

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    page.value++
    loadRecords()
  }
})
</script>

<style lang="scss" scoped>
.wallet-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.balance-card {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 40rpx 30rpx;

  .balance-info {
    margin-bottom: 40rpx;

    .label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 10rpx;
    }

    .balance-row {
      display: flex;
      align-items: baseline;

      .symbol {
        font-size: 40rpx;
        color: #fff;
        margin-right: 8rpx;
      }

      .balance {
        font-size: 80rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }

  .action-buttons {
    display: flex;

    .action-btn {
      flex: 1;
      height: 70rpx;
      border-radius: 35rpx;
      font-size: 28rpx;
      border: none;

      &::after {
        border: none;
      }

      &.recharge-btn {
        background-color: #fff;
        color: #3b82f6;
        margin-right: 20rpx;
      }

      &.withdraw-btn {
        background-color: rgba(255, 255, 255, 0.2);
        color: #fff;
      }
    }
  }
}

.stats-section {
  display: flex;
  background-color: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 10rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.tab-bar {
  display: flex;
  background-color: #fff;
  margin-bottom: 20rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 30rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #3b82f6;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background-color: #3b82f6;
        border-radius: 2rpx;
      }
    }
  }
}

.record-list {
  background-color: #fff;

  .record-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .record-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      &.income, &.recharge {
        background-color: #52c41a;
      }

      &.expense, &.withdraw {
        background-color: #ff4d4f;
      }
    }

    .record-info {
      flex: 1;

      .record-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 8rpx;
      }

      .record-time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .record-amount {
      font-size: 32rpx;
      font-weight: bold;

      &.income, &.recharge {
        color: #52c41a;
      }

      &.expense, &.withdraw {
        color: #ff4d4f;
      }
    }
  }
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 26rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;

  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    color: #999;
    font-size: 28rpx;
  }
}
</style>
