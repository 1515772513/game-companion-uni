<template>
  <view class="index-page">
    <!-- 顶部搜索栏 -->
    <view class="header">
      <view class="search-bar" @click="handleSearch">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <text class="search-text">搜索陪玩师、游戏</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-wrapper">
      <swiper class="banner-swiper" indicator-dots circular autoplay :indicator-color="'rgba(255,255,255,0.5)'" :indicator-active-color="'#3b82f6'">
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <image class="banner-image" :src="item.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 分类导航 -->
    <view class="category-section">
      <view class="category-item" v-for="item in categoryList" :key="item.id" @click="handleCategoryClick(item)">
        <view class="category-icon-wrapper">
          <image class="category-icon" :src="item.icon" mode="aspectFit"></image>
        </view>
        <view class="category-name">{{ item.name }}</view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view
          class="filter-tab"
          :class="{ active: activeFilter === item.value }"
          v-for="item in filterTabs"
          :key="item.value"
          @click="handleFilterChange(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <!-- 陪玩师列表 -->
    <view class="companion-section">
      <view class="companion-list">
        <view
          class="companion-card"
          v-for="item in companionList"
          :key="item.id"
          @click="handleCompanionClick(item)"
        >
          <!-- 头像和信息 -->
          <view class="companion-header">
            <view class="avatar-wrapper">
              <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
              <view class="level-badge">{{ item.level }}</view>
            </view>
            <view class="companion-info">
              <view class="name-row">
                <text class="name">{{ item.name }}</text>
                <view class="verified-badge" v-if="item.verified">
                  <uni-icons type="checkmarkempty" size="12" color="#3b82f6"></uni-icons>
                </view>
              </view>
              <view class="tags-row">
                <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
              </view>
            </view>
          </view>

          <!-- 数据统计 -->
          <view class="companion-stats">
            <view class="stat-item">
              <text class="stat-value">{{ item.orderCount }}</text>
              <text class="stat-label">订单</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ item.rating }}</text>
              <text class="stat-label">评分</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ item.completionRate }}%</text>
              <text class="stat-label">完成率</text>
            </view>
          </view>

          <!-- 价格和下单 -->
          <view class="companion-footer">
            <view class="price-wrapper">
              <text class="price-symbol">¥</text>
              <text class="price">{{ item.price }}</text>
              <text class="price-unit">/小时</text>
            </view>
            <view class="order-btn">
              立即下单
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore" @click="loadMore">
        <text class="load-text">加载更多</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 当前筛选
const activeFilter = ref('all')

// 轮播图数据
const bannerList = ref([
  {
    image: 'https://via.placeholder.com/750x300/3b82f6/FFFFFF?text=游戏陪玩平台'
  },
  {
    image: 'https://via.placeholder.com/750x300/60a5fa/FFFFFF?text=新用户专享优惠'
  },
  {
    image: 'https://via.placeholder.com/750x300/2563eb/FFFFFF?text=专业陪玩师入驻'
  }
])

// 分类数据
const categoryList = ref([
  {
    id: 1,
    name: '王者荣耀',
    icon: 'https://via.placeholder.com/80x80/3b82f6/FFFFFF?text=王者'
  },
  {
    id: 2,
    name: '和平精英',
    icon: 'https://via.placeholder.com/80x80/60a5fa/FFFFFF?text=和平'
  },
  {
    id: 3,
    name: '英雄联盟',
    icon: 'https://via.placeholder.com/80x80/2563eb/FFFFFF?text=LOL'
  },
  {
    id: 4,
    name: '原神',
    icon: 'https://via.placeholder.com/80x80/3b82f6/FFFFFF?text=原神'
  }
])

// 筛选标签
const filterTabs = ref([
  { label: '全部', value: 'all' },
  { label: '价格', value: 'price' },
  { label: '评分', value: 'rating' },
  { label: '距离', value: 'distance' }
])

// 陪玩师列表
const companionList = ref([
  {
    id: 1,
    name: '甜心小可爱',
    avatar: 'https://via.placeholder.com/200x200/3b82f6/FFFFFF?text=甜心',
    level: 'LV.8',
    verified: true,
    tags: ['声音甜美', '技术好', '有耐心'],
    orderCount: 128,
    rating: 4.9,
    completionRate: 98,
    price: 50
  },
  {
    id: 2,
    name: '游戏大神',
    avatar: 'https://via.placeholder.com/200x200/60a5fa/FFFFFF?text=大神',
    level: 'LV.15',
    verified: true,
    tags: ['游戏高手', '幽默风趣', '带飞'],
    orderCount: 356,
    rating: 4.8,
    completionRate: 96,
    price: 80
  },
  {
    id: 3,
    name: '温柔姐姐',
    avatar: 'https://via.placeholder.com/200x200/2563eb/FFFFFF?text=温柔',
    level: 'LV.12',
    verified: false,
    tags: ['温柔体贴', '声音好听', '不急不躁'],
    orderCount: 89,
    rating: 4.7,
    completionRate: 95,
    price: 60
  }
])

// 是否还有更多
const hasMore = ref(true)

// 搜索
const handleSearch = () => {
  console.log('点击搜索')
  // TODO: 跳转到搜索页面
}

// 分类点击
const handleCategoryClick = (item) => {
  console.log('点击分类:', item)
  // TODO: 根据分类筛选陪玩师
}

// 筛选切换
const handleFilterChange = (value) => {
  activeFilter.value = value
  console.log('切换筛选:', value)
  // TODO: 根据筛选条件重新加载列表
}

// 陪玩师点击
const handleCompanionClick = (item) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${item.id}`
  })
}

// 加载更多
const loadMore = () => {
  console.log('加载更多')
  // TODO: 加载更多数据
}

onMounted(() => {
  // TODO: 从服务器加载数据
})
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #f5f5f5 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 顶部搜索栏 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 20rpx 30rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 24rpx;
  background-color: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.15);
}

.search-text {
  margin-left: 16rpx;
  font-size: 26rpx;
  color: #999;
}

/* 轮播图 */
.banner-wrapper {
  width: 100%;
  height: 320rpx;
  background-color: #fff;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
}

/* 分类导航 */
.category-section {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 30rpx 30rpx;
  background-color: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 4rpx;
  margin-bottom: 12rpx;
}

.category-icon {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  background-color: #fff;
}

.category-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 筛选标签 */
.filter-section {
  padding: 0 30rpx 20rpx;
}

.filter-tabs {
  display: flex;
  gap: 16rpx;
}

.filter-tab {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  background-color: #fff;
  border-radius: 32rpx;
  transition: all 0.3s;
  white-space: nowrap;

  &.active {
    color: #fff;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
  }
}

/* 陪玩师列表 */
.companion-section {
  padding: 0 30rpx 30rpx;
}

.companion-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.companion-card {
  padding: 24rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
}

/* 头像和信息 */
.companion-header {
  display: flex;
  margin-bottom: 20rpx;
}

.avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: 3rpx solid #fff;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
}

.level-badge {
  position: absolute;
  bottom: -4rpx;
  right: -4rpx;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12rpx;
  border: 2rpx solid #fff;
}

.companion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.name {
  font-size: 30rpx;
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

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  padding: 4rpx 12rpx;
  font-size: 22rpx;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 6rpx;
}

/* 数据统计 */
.companion-stats {
  display: flex;
  justify-content: space-around;
  padding: 16rpx 0;
  margin-bottom: 16rpx;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

/* 价格和下单 */
.companion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-wrapper {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 24rpx;
  color: #3b82f6;
}

.price {
  font-size: 36rpx;
  font-weight: 500;
  color: #3b82f6;
  margin: 0 4rpx;
}

.price-unit {
  font-size: 22rpx;
  color: #999;
}

.order-btn {
  padding: 12rpx 32rpx;
  font-size: 26rpx;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
  }
}

/* 加载更多 */
.load-more {
  padding: 30rpx;
  text-align: center;
}

.load-text {
  font-size: 26rpx;
  color: #999;
}
</style>
