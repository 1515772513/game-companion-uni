<template>
  <view class="companion-list-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: filterType === 'all' }" @click="handleFilterChange('all')">
        全部
      </view>
      <view class="filter-item" :class="{ active: filterType === 'price' }" @click="handleFilterChange('price')">
        价格
      </view>
      <view class="filter-item" :class="{ active: filterType === 'rating' }" @click="handleFilterChange('rating')">
        评分
      </view>
      <view class="filter-item" :class="{ active: filterType === 'distance' }" @click="handleFilterChange('distance')">
        距离
      </view>
    </view>

    <!-- 陪玩师列表 -->
    <scroll-view class="companion-scroll" scroll-y @scrolltolower="handleLoadMore">
      <view class="companion-list">
        <view class="companion-card" v-for="item in companionList" :key="item.id" @click="handleCardClick(item)">
          <image class="companion-avatar" :src="item.avatar" mode="aspectFill"></image>
          <view class="companion-info">
            <view class="companion-header">
              <view class="companion-name">{{ item.name }}</view>
              <view class="companion-rating">
                <uni-icons type="star-filled" size="12" color="#FFB800"></uni-icons>
                <text>{{ item.rating }}</text>
              </view>
            </view>
            <view class="companion-tags">
              <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
            </view>
            <view class="companion-intro">{{ item.intro }}</view>
            <view class="companion-footer">
              <view class="companion-price">
                <text class="price">¥{{ item.price }}</text>
                <text class="unit">/小时</text>
              </view>
              <button class="order-btn" size="mini" type="primary">下单</button>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text>{{ isLoading ? '加载中...' : '上拉加载更多' }}</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选类型
const filterType = ref('all')

// 陪玩师列表
const companionList = ref([])

// 分页信息
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)
const isLoading = ref(false)

// 获取陪玩师列表数据（模拟）
const fetchCompanionList = async () => {
  if (isLoading.value) return

  isLoading.value = true

  // 模拟数据
  const mockData = [
    {
      id: 1,
      name: '陪玩师A',
      avatar: 'https://via.placeholder.com/200x200/FF6B00/FFFFFF?text=A',
      rating: 4.8,
      tags: ['声音甜美', '技术好'],
      intro: '擅长王者荣耀，段位王者，可以陪玩、带飞',
      price: 50
    },
    {
      id: 2,
      name: '陪玩师B',
      avatar: 'https://via.placeholder.com/200x200/FF6B00/FFFFFF?text=B',
      rating: 4.9,
      tags: ['游戏高手', '幽默风趣'],
      intro: '和平精英高手，KD 5.0+，声线磁性',
      price: 60
    }
  ]

  // 模拟延迟
  setTimeout(() => {
    if (currentPage.value === 1) {
      companionList.value = mockData
    } else {
      companionList.value = [...companionList.value, ...mockData]
    }

    hasMore.value = currentPage.value < 3
    isLoading.value = false
  }, 500)
}

// 筛选变化
const handleFilterChange = (type) => {
  filterType.value = type
  currentPage.value = 1
  hasMore.value = true
  fetchCompanionList()
}

// 卡片点击
const handleCardClick = (item) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${item.id}`
  })
}

// 加载更多
const handleLoadMore = () => {
  if (!hasMore.value || isLoading.value) return

  currentPage.value++
  fetchCompanionList()
}

// 下拉刷新
const onPullDownRefresh = () => {
  currentPage.value = 1
  hasMore.value = true
  fetchCompanionList().then(() => {
    uni.stopPullDownRefresh()
  })
}

onMounted(() => {
  fetchCompanionList()
})

// 暴露下拉刷新方法
defineExpose({
  onPullDownRefresh
})
</script>

<style lang="scss" scoped>
.companion-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.filter-bar {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 20rpx 30rpx;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.filter-item.active {
  color: #FF6B00;
  background-color: rgba(255, 107, 0, 0.1);
}

.companion-scroll {
  height: calc(100vh - 100rpx);
  padding: 30rpx;
}

.companion-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.companion-card {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.companion-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.companion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.companion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.companion-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.companion-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #FFB800;
}

.companion-rating text {
  margin-left: 4rpx;
}

.companion-tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  padding: 4rpx 12rpx;
  font-size: 22rpx;
  color: #FF6B00;
  background-color: rgba(255, 107, 0, 0.1);
  border-radius: 4rpx;
}

.companion-intro {
  font-size: 26rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.companion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.companion-price {
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 32rpx;
  font-weight: 500;
  color: #FF6B00;
}

.unit {
  margin-left: 4rpx;
  font-size: 24rpx;
  color: #999;
}

.order-btn {
  margin: 0;
  background-color: #FF6B00;
  border-color: #FF6B00;
}

.order-btn::after {
  border: none;
}

.load-more,
.no-more {
  padding: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}
</style>
