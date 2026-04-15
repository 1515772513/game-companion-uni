<template>
  <view class="order-list-page">
    <!-- Tab栏 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        v-for="tab in tabs"
        :key="tab.value"
        :class="{ active: currentTab === tab.value }"
        @tap="switchTab(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <view class="tab-badge" v-if="orderCounts[tabKeys[tab.value]] > 0">{{ orderCounts[tabKeys[tab.value]] }}</view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view class="order-item" v-for="order in orders" :key="order.id" @tap="goToDetail(order.id, order.orderNo)">
        <view class="order-header">
          <view class="order-no">订单号：{{ order.orderNo }}</view>
          <view class="order-status" :class="`status-${order.status}`">{{ order.statusText }}</view>
        </view>

        <view class="order-content">
          <image :src="order.companion.avatarUrl" mode="aspectFill" class="companion-avatar"></image>
          <view class="order-info">
            <text class="companion-name">{{ order.companion.nickname || order.companion.realName }}</text>
            <text class="service-name">{{ order.serviceTypeName }}</text>
            <view class="order-time">
              <text>创建时间：{{ order.createdAt }}</text>
            </view>
          </view>
          <view class="order-price">
            <text class="price">¥{{ order.totalAmount }}</text>
          </view>
        </view>

        <view class="order-footer">
          <view class="order-time-remaining">
            <!-- <text><uni-icons type="clock" size="14" color="#ff4d4f"></uni-icons>剩余 {{ order.remainingTime }} 自动取消</text> -->
            <text v-if="order.isExpired && order.status == '0'">已失效</text>
          </view>
          <view class="action-btns">
            <button
              class="action-btn cancel-btn"
              v-if="order.status == '0' && !order.isExpired"
              @tap.stop="cancelOrder(order)"
            >
              取消订单
            </button>
            <!-- <button
              class="action-btn primary-btn"
              v-if="order.status == '0' && !order.isExpired"
              @tap.stop="payOrder(order)"
            >
              去支付
            </button> -->
            <button
              open-type="contact"
              class="action-btn primary-btn"
            >
              联系客服
            </button>
            <button
              class="action-btn primary-btn"
              v-if="order.status === 'completed' && !order.isReviewed"
              @tap.stop="reviewOrder(order)"
            >
              评价
            </button>
            <button
              class="action-btn default-btn"
              v-if="order.status === 'completed'"
              @tap.stop="reorder(order)"
            >
              再来一单
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-more" v-if="hasMore">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="no-more" v-else-if="orders.length > 0">
      <text>没有更多了</text>
    </view>
    <view class="empty" v-else>
      <image src="/static/empty-order.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无订单数据</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrderList, cancelOrder as cancelOrderApi, payOrder as payOrderApi, getOrderStats } from '@/api/order'
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
import { getDictList } from '@/api/dict'

const appStore = useAppStore()

// 计算属性
const mainText = computed(() => {
  return appStore.getConfig.mainText
})

const tabs = ref([])

const currentTab = ref('')
const orders = ref([])
const orderCounts = ref({})
const tabKeys = ref({
  '': 'all',
  '0': 'pendingPayment',
  '1': '',
  '2': '',
  '3': '',
})
const page = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)

onShow(() => {
  loadOrderCounts()
  loadOrders()
})

onMounted(() => {
  loadOrderStatuses()
})



// 加载订单状态列表
const loadOrderStatuses = async () => {
  try {
    const res = await getDictList('order_status')
    if (res.code === 200) {
      tabs.value = [
        { label: '全部', value: '' },
        ...((res.data || []).filter(item => (item.dictValue != '3' && item.dictValue != '6')).map(item => ({ value: item.dictValue, label: item.dictLabel })))
      ]
    }
  } catch (error) {
    console.error('加载订单状态列表失败', error)
  }
}

const loadOrderCounts = async () => {
  try {
    const res = await getOrderStats()
    if (res.code === 200) {
      orderCounts.value = res.data
    }
  } catch (error) {
    console.error('获取订单数量失败', error)
  }
}

const loadOrders = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }

    if (currentTab.value !== 'all') {
      params.status = currentTab.value
    }

    const res = await getOrderList(params)
    const list = res.data.items || []
    // 转换字段名从snake_case到camelCase
    const formattedList = list.map(item => ({
      ...item,
      companionAvatar: item.companion_avatar || item.companionAvatar,
      companionName: item.companion_name || item.companionName,
      serviceName: item.service_name || item.serviceName,
      appointmentTime: item.appointment_time || item.appointmentTime
    }))

    if (page.value === 1) {
      orders.value = formattedList
    } else {
      orders.value = [...orders.value, ...formattedList]
    }
    hasMore.value = res.data.pagination.hasMore || false
  } catch (error) {
    console.error('获取订单列表失败', error)
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

  // 👉 切换 tab 自动回到顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 0
  })

  loadOrders()
}

const goToDetail = (orderId, orderNo) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${orderId}&orderNo=${orderNo}`
  })
}

const cancelOrder = (order) => {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrderApi(order.id, { CancelReason: '用户主动取消' })
          setTimeout(() => {
            uni.hideToast()
            uni.showToast({
              title: '订单已取消',
              icon: 'success',
              duration: 3000
            })
          }, 500)
          page.value = 1
          loadOrders()
          loadOrderCounts()
        } catch (error) {
          console.error('取消订单失败', error)
          loadOrders()
          loadOrderCounts()
          uni.showToast({
            title: error.error || error.message || '取消失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const payOrder = (order) => {
  uni.navigateTo({
    url: `/pages/order/payment?id=${order.id}`
  })
}

const contactCompanion = (order) => {
  uni.navigateTo({
    url: `/pages/message/detail?conversationId=${order.conversationId}`
  })
}

const reviewOrder = (order) => {
  uni.navigateTo({
    url: `/pages/order/review?id=${order.id}`
  })
}

const reorder = (order) => {
  uni.navigateTo({
    url: `/pages/order/create?companionId=${order.companionId}&serviceId=${order.serviceId}`
  })
}

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    page.value++
    loadOrders()
  }
})

onPullDownRefresh(() => {
  page.value = 1
  loadOrders().then(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tab-bar {
  display: flex;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    position: relative;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      transition: all 0.3s;
    }

    .tab-badge {
      position: absolute;
      top: 8rpx;
      right: 16rpx;
      width: 32rpx;
      height: 32rpx;
      background-color: #ff4d4f;
      color: #fff;
      font-size: 20rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
    }

    &.active {
      .tab-text {
        color: #3b82f6;
        font-weight: bold;
      }

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

.order-list {
  padding: 20rpx;

  .order-item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .order-no {
        font-size: 24rpx;
        color: #999;
      }

      .order-status {
        font-size: 26rpx;
        font-weight: bold;

        &.status-pending {
          color: #ff4d4f;
        }

        &.status-paid {
          color: #3b82f6;
        }

        &.status-ongoing {
          color: #52c41a;
        }

        &.status-completed {
          color: #999;
        }

        &.status-cancelled {
          color: #999;
        }
      }
    }

    .order-content {
      display: flex;
      padding: 20rpx 0;

      .companion-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }

      .order-info {
        flex: 1;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .companion-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }

        .service-name {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }

        .order-time {
          font-size: 22rpx;
          color: #999;
        }
      }

      .order-price {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .price {
          color: #3b82f6;
          font-size: 36rpx;
          font-weight: bold;
        }
      }
    }

    .order-footer {
      padding-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;
      display: flex;
      justify-content: space-between;

      .order-time-remaining {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        color: #ff4d4f;
        font-size: 24rpx;

        text {
          margin-left: 6rpx;
        }
      }

      .action-btns {
        display: flex;
        justify-content: flex-end;

        .action-btn {
          margin-left: 16rpx;
          padding: 0 32rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          font-size: 26rpx;
          border: none;

          &::after {
            border: none;
          }

          &.cancel-btn {
            background-color: #f5f5f5;
            color: #666;
          }

          &.default-btn {
            background-color: #fff;
            color: #3b82f6;
            border: 1rpx solid #3b82f6;
          }

          &.primary-btn {
            background-color: #3b82f6;
            color: #fff;
          }
        }
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
