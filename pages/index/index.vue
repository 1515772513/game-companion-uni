<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="handleSearch">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <text class="search-text">搜索陪玩师</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-wrapper">
      <swiper class="banner-swiper" indicator-dots circular autoplay>
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <image class="banner-image" :src="item.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="category-item" v-for="item in categoryList" :key="item.id" @click="handleCategoryClick(item)">
        <view class="category-icon">
          <image :src="item.icon" mode="aspectFit"></image>
        </view>
        <view class="category-name">{{ item.name }}</view>
      </view>
    </view>

    <!-- 推荐陪玩师 -->
    <view class="companion-section">
      <view class="section-header">
        <view class="section-title">推荐陪玩师</view>
        <view class="section-more" @click="handleMore">
          更多
          <uni-icons type="right" size="14"></uni-icons>
        </view>
      </view>
      <view class="companion-list">
        <view class="companion-item" v-for="item in companionList" :key="item.id" @click="handleCompanionClick(item)">
          <image class="companion-avatar" :src="item.avatar" mode="aspectFill"></image>
          <view class="companion-info">
            <view class="companion-name">{{ item.name }}</view>
            <view class="companion-tags">
              <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
            </view>
            <view class="companion-price">
              <text class="price">¥{{ item.price }}</text>
              <text class="unit">/小时</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 轮播图数据
const bannerList = ref([
  {
    image: 'https://via.placeholder.com/750x300/FF6B00/FFFFFF?text=Banner1'
  },
  {
    image: 'https://via.placeholder.com/750x300/FF6B00/FFFFFF?text=Banner2'
  },
  {
    image: 'https://via.placeholder.com/750x300/FF6B00/FFFFFF?text=Banner3'
  }
])

// 分类数据
const categoryList = ref([
  {
    id: 1,
    name: '王者荣耀',
    icon: 'https://via.placeholder.com/64x64/FF6B00/FFFFFF?text=王者'
  },
  {
    id: 2,
    name: '和平精英',
    icon: 'https://via.placeholder.com/64x64/FF6B00/FFFFFF?text=和平'
  },
  {
    id: 3,
    name: '英雄联盟',
    icon: 'https://via.placeholder.com/64x64/FF6B00/FFFFFF?text=LOL'
  },
  {
    id: 4,
    name: '原神',
    icon: 'https://via.placeholder.com/64x64/FF6B00/FFFFFF?text=原神'
  }
])

// 陪玩师列表
const companionList = ref([
  {
    id: 1,
    name: '陪玩师A',
    avatar: 'https://via.placeholder.com/200x200/FF6B00/FFFFFF?text=A',
    tags: ['声音甜美', '技术好'],
    price: 50
  },
  {
    id: 2,
    name: '陪玩师B',
    avatar: 'https://via.placeholder.com/200x200/FF6B00/FFFFFF?text=B',
    tags: ['游戏高手', '幽默风趣'],
    price: 60
  }
])

// 搜索
const handleSearch = () => {
  console.log('点击搜索')
}

// 分类点击
const handleCategoryClick = (item) => {
  console.log('点击分类:', item)
}

// 查看更多
const handleMore = () => {
  uni.navigateTo({
    url: '/pages/companion/list'
  })
}

// 陪玩师点击
const handleCompanionClick = (item) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${item.id}`
  })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

.search-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.search-input {
  display: flex;
  align-items: center;
  height: 70rpx;
  padding: 0 30rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
}

.search-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.banner-wrapper {
  width: 100%;
  height: 300rpx;
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

.category-nav {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  margin-top: 20rpx;
}

.category-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.category-icon image {
  width: 100%;
  height: 100%;
}

.category-name {
  font-size: 24rpx;
  color: #333;
}

.companion-section {
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #999;
}

.companion-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.companion-item {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.companion-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.companion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.companion-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
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
</style>
