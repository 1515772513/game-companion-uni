<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @tap="goToSearch">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <text class="placeholder">搜索陪玩师</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots circular autoplay interval="3000">
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image :src="banner.image" mode="aspectFill" class="banner-image"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 分类筛选 -->
    <view class="filter-section">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-item"
              :class="{ active: filter.gameId === '' }"
              @tap="selectGame('')">
          全部
        </view>
        <view class="filter-item"
              v-for="game in games"
              :key="game.id"
              :class="{ active: filter.gameId === game.id }"
              @tap="selectGame(game.id)">
          {{ game.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 服务类型筛选 -->
    <view class="service-type-section">
      <view class="type-item"
            :class="{ active: filter.serviceType === '' }"
            @tap="selectServiceType('')">
        全部
      </view>
      <view class="type-item"
            :class="{ active: filter.serviceType === 'voice' }"
            @tap="selectServiceType('voice')">
        语音陪玩
      </view>
      <view class="type-item"
            :class="{ active: filter.serviceType === 'video' }"
            @tap="selectServiceType('video')">
        视频陪玩
      </view>
      <view class="type-item"
            :class="{ active: filter.serviceType === 'game' }"
            @tap="selectServiceType('game')">
        游戏陪玩
      </view>
    </view>

    <!-- 排序 -->
    <view class="sort-section">
      <view class="sort-item" :class="{ active: filter.sort === 'default' }" @tap="setSort('default')">
        综合排序
      </view>
      <view class="sort-item" :class="{ active: filter.sort === 'price_asc' }" @tap="setSort('price_asc')">
        价格从低到高
      </view>
      <view class="sort-item" :class="{ active: filter.sort === 'price_desc' }" @tap="setSort('price_desc')">
        价格从高到低
      </view>
    </view>

    <!-- 陪玩师列表 -->
    <view class="companion-list">
      <view class="companion-item"
            v-for="companion in companions"
            :key="companion.id"
            @tap="goToDetail(companion.id)">
        <image :src="companion.avatar" mode="aspectFill" class="companion-avatar"></image>
        <view class="companion-info">
          <view class="companion-name-row">
            <text class="companion-name">{{ companion.nickname }}</text>
            <view class="online-status" :class="{ online: companion.isOnline }"></view>
          </view>
          <view class="companion-tags">
            <text class="tag" v-for="tag in companion.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="companion-price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ companion.price }}</text>
            <text class="price-unit">/小时</text>
          </view>
          <view class="companion-rating">
            <uni-icons type="star-filled" size="12" color="#FFB800"></uni-icons>
            <text class="rating-text">{{ companion.rating }}</text>
            <text class="order-count">已接{{ companion.orderCount }}单</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-more" v-if="hasMore">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="no-more" v-else>
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompanionList, getGameList } from '@/api/companion'

const banners = ref([
  { image: 'https://via.placeholder.com/750x300/3b82f6/ffffff?text=Banner+1' },
  { image: 'https://via.placeholder.com/750x300/60a5fa/ffffff?text=Banner+2' },
  { image: 'https://via.placeholder.com/750x300/93c5fd/ffffff?text=Banner+3' }
])

const games = ref([])
const companions = ref([])
const filter = ref({
  gameId: '',
  serviceType: '',
  sort: 'default',
  page: 1,
  pageSize: 10
})
const hasMore = ref(true)
const loading = ref(false)

onMounted(() => {
  loadGames()
  loadCompanions()
})

const loadGames = async () => {
  try {
    const res = await getGameList()
    games.value = res.data || []
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}

const loadCompanions = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await getCompanionList(filter.value)
    if (filter.value.page === 1) {
      companions.value = res.data.list || []
    } else {
      companions.value = [...companions.value, ...(res.data.list || [])]
    }
    hasMore.value = res.data.hasMore || false
  } catch (error) {
    console.error('加载陪玩师列表失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const selectGame = (gameId) => {
  filter.value.gameId = gameId
  filter.value.page = 1
  loadCompanions()
}

const selectServiceType = (type) => {
  filter.value.serviceType = type
  filter.value.page = 1
  loadCompanions()
}

const setSort = (sort) => {
  filter.value.sort = sort
  filter.value.page = 1
  loadCompanions()
}

const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/companion/list?action=search'
  })
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${id}`
  })
}

// 触底加载更多
onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    filter.value.page++
    loadCompanions()
  }
})
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .search-input {
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;

    .placeholder {
      margin-left: 10rpx;
      color: #999;
      font-size: 28rpx;
    }
  }
}

.banner-section {
  width: 100%;
  height: 300rpx;
  background-color: #fff;

  .banner-swiper {
    width: 100%;
    height: 100%;

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
}

.filter-section {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 20rpx 0;

  .filter-scroll {
    white-space: nowrap;
    padding: 0 20rpx;

    .filter-item {
      display: inline-block;
      padding: 12rpx 30rpx;
      margin: 0 10rpx;
      border-radius: 30rpx;
      background-color: #f5f5f5;
      color: #666;
      font-size: 28rpx;
      transition: all 0.3s;

      &.active {
        background-color: #3b82f6;
        color: #fff;
      }
    }
  }
}

.service-type-section {
  display: flex;
  background-color: #fff;
  margin-top: 2rpx;
  padding: 20rpx;

  .type-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    border-radius: 8rpx;
    color: #666;
    font-size: 26rpx;
    transition: all 0.3s;

    &.active {
      background-color: #3b82f6;
      color: #fff;
    }
  }
}

.sort-section {
  display: flex;
  background-color: #fff;
  margin-top: 2rpx;
  padding: 20rpx;
  justify-content: space-around;

  .sort-item {
    color: #666;
    font-size: 26rpx;
    transition: all 0.3s;

    &.active {
      color: #3b82f6;
      font-weight: bold;
    }
  }
}

.companion-list {
  padding: 20rpx;

  .companion-item {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .companion-avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }

    .companion-info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .companion-name-row {
        display: flex;
        align-items: center;

        .companion-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-right: 10rpx;
        }

        .online-status {
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
          background-color: #ccc;

          &.online {
            background-color: #52c41a;
          }
        }
      }

      .companion-tags {
        .tag {
          display: inline-block;
          padding: 4rpx 12rpx;
          margin-right: 10rpx;
          background-color: #f0f0f0;
          color: #666;
          font-size: 22rpx;
          border-radius: 4rpx;
        }
      }

      .companion-price {
        .price-symbol {
          color: #3b82f6;
          font-size: 24rpx;
        }

        .price-value {
          color: #3b82f6;
          font-size: 36rpx;
          font-weight: bold;
        }

        .price-unit {
          color: #999;
          font-size: 24rpx;
        }
      }

      .companion-rating {
        display: flex;
        align-items: center;

        .rating-text {
          margin-left: 8rpx;
          color: #FFB800;
          font-size: 24rpx;
        }

        .order-count {
          margin-left: 20rpx;
          color: #999;
          font-size: 24rpx;
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
</style>
