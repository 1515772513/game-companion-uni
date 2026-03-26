<template>
  <view class="earning-page">
    <!-- 收益卡片 -->
    <view class="earning-card">
      <view class="earning-info">
        <text class="label">累计收益</text>
        <view class="earning-row">
          <text class="symbol">¥</text>
          <text class="amount">{{ earningInfo.totalEarning || 0 }}</text>
        </view>
      </view>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">¥{{ earningInfo.todayEarning || 0 }}</text>
          <text class="stat-label">今日收益</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">¥{{ earningInfo.monthEarning || 0 }}</text>
          <text class="stat-label">本月收益</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ earningInfo.orderCount || 0 }}</text>
          <text class="stat-label">完成订单</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn withdraw-btn" @tap="goToWithdraw">提现</button>
      <button class="action-btn detail-btn" @tap="goToRecords">收益明细</button>
    </view>

    <!-- 收益统计 -->
    <view class="chart-section">
      <view class="section-title">收益统计</view>
      <view class="date-tabs">
        <view
          class="date-tab"
          :class="{ active: dateType === 'week' }"
          @tap="switchDateType('week')"
        >
          本周
        </view>
        <view
          class="date-tab"
          :class="{ active: dateType === 'month' }"
          @tap="switchDateType('month')"
        >
          本月
        </view>
        <view
          class="date-tab"
          :class="{ active: dateType === 'year' }"
          @tap="switchDateType('year')"
        >
          本年
        </view>
      </view>
      <view class="chart-placeholder">
        <text class="placeholder-text">收益图表区域</text>
        <text class="chart-total">总收益: ¥{{ chartTotal }}</text>
      </view>
    </view>

    <!-- 收益记录 -->
    <view class="records-section">
      <view class="section-title">
        <text>收益记录</text>
        <text class="more" @tap="goToRecords">查看全部 ></text>
      </view>
      <view class="record-list">
        <view class="record-item" v-for="record in records" :key="record.id">
          <view class="record-icon">
            <uni-icons type="wallet-filled" size="20" color="#fff"></uni-icons>
          </view>
          <view class="record-info">
            <text class="record-title">{{ record.title }}</text>
            <text class="record-time">{{ record.createTime }}</text>
          </view>
          <view class="record-amount">
            <text>+¥{{ record.amount }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCompanionEarnings, getCompanionEarningRecords } from '@/api/companion'

const earningInfo = ref({})
const records = ref([])
const dateType = ref('week')
const chartTotal = ref('0.00')

onMounted(() => {
  loadEarnings()
  loadRecords()
})

const loadEarnings = async () => {
  try {
    const res = await getCompanionEarnings({})
    if (res.code === 200) {
      earningInfo.value = res.data
      chartTotal.value = res.data.chartTotal || '0.00'
    }
  } catch (error) {
    console.error('获取收益信息失败', error)
  }
}

const loadRecords = async () => {
  try {
    const res = await getCompanionEarningRecords({ page: 1, pageSize: 10 })
    if (res.code === 200) {
      records.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取收益记录失败', error)
  }
}

const switchDateType = (type) => {
  dateType.value = type
  // 重新加载图表数据
  loadEarnings()
}

const goToWithdraw = () => {
  uni.navigateTo({
    url: '/subpackages/companion/earning/withdraw'
  })
}

const goToRecords = () => {
  uni.navigateTo({
    url: '/subpackages/companion/earning/records'
  })
}
</script>

<style lang="scss" scoped>
.earning-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.earning-card {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 40rpx 30rpx;

  .earning-info {
    margin-bottom: 40rpx;

    .label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 10rpx;
    }

    .earning-row {
      display: flex;
      align-items: baseline;

      .symbol {
        font-size: 40rpx;
        color: #fff;
        margin-right: 8rpx;
      }

      .amount {
        font-size: 80rpx;
        font-weight: bold;
        color: #fff;
      }
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

.action-buttons {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;

  .action-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 32rpx;
    border: none;

    &::after {
      border: none;
    }

    &.withdraw-btn {
      background-color: #fff;
      color: #3b82f6;
    }

    &.detail-btn {
      background-color: #fff;
      color: #666;
    }
  }
}

.chart-section, .records-section {
  background-color: #fff;
  margin: 20rpx 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: flex;
    justify-content: space-between;

    .more {
      font-size: 26rpx;
      color: #999;
      font-weight: normal;
    }
  }
}

.date-tabs {
  display: flex;
  margin-bottom: 30rpx;

  .date-tab {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 26rpx;
    color: #666;
    border-radius: 8rpx;
    transition: all 0.3s;

    &.active {
      background-color: #f0f9ff;
      color: #3b82f6;
      font-weight: bold;
    }
  }
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;

  .placeholder-text {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 20rpx;
  }

  .chart-total {
    font-size: 32rpx;
    font-weight: bold;
    color: #3b82f6;
  }
}

.record-list {
  .record-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .record-icon {
      width: 70rpx;
      height: 70rpx;
      background-color: #3b82f6;
      border-radius: 35rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
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
      color: #3b82f6;
    }
  }
}
</style>
