<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @tap="goToSearch">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <text class="placeholder">搜索{{ mainText }}师</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots circular autoplay interval="3000">
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image :src="banner.ImageUrl" mode="aspectFill" class="banner-image"></image>
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
              :key="game.value"
              :class="{ active: filter.gameId === game.value }"
              @tap="selectGame(game.value)">
          {{ game.label }}
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
      <!-- 服务类型选项 -->
      <view v-for="item in serviceTypeOptions"
            :key="item.dictValue"
            class="type-item"
            :class="{ active: filter.serviceType === item.dictValue }"
            @tap="selectServiceType(item.dictValue)">
        {{ item.dictLabel }}
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
        <image :src="companion.avatar_url" mode="aspectFill" class="companion-avatar"></image>
        <view class="companion-info">
          <view class="companion-name-row">
            <text class="companion-name">{{ companion.nickname }}</text>
            <view class="level-badge">{{ companion.levelName }}</view>
            <view class="online-status" :class="{ online: companion.onlineStatus === 'online', busy: companion.onlineStatus === 'busy' }"></view>
          </view>
          <view class="companion-tags">
            <text class="tag" v-for="tag in companion.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="companion-price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ companion.price }}</text>
            <text class="price-unit">/{{ companion.priceUnit }}</text>
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
import { ref, onMounted, computed } from 'vue'
import { getCompanionList } from '@/api/companion'
import { getHomeData } from '@/api/home'
import { getDictList } from '@/api/ditc'
import { getGameList } from '@/api/game'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

// 计算属性
const mainText = computed(() => {
  return appStore.getConfig.mainText
})


// 轮播图数据
const banners = ref([])
const games = ref([])
const companions = ref([])
const serviceTypeOptions = ref([])
const filter = ref({
  gameId: '',
  serviceType: '',
  sort: 'rating',
  page: 1,
  pageSize: 10
})
const hasMore = ref(true)
const loading = ref(false)

onMounted(() => {
  loadHomeData()
  loadGames()
  loadCompanions()
  loadServiceTypeList()
})

// 加载首页数据
const loadHomeData = async () => {
  try {
    const res = await getHomeData()
    if (res.code === 200) {
      banners.value = res.data.banners || []
    }
  } catch (error) {
    console.error('加载首页数据失败', error)
  }
}

// 加载游戏列表
const loadGames = async () => {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      games.value = res.data || []
    }
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}
// 加载服务类型列表
const loadServiceTypeList = async () => {
  try {
    const res = await getDictList('service_type')
    if (res.code === 200) {
      serviceTypeOptions.value = res.data || []
    }
  } catch (error) {
    console.error('加载服务类型列表失败', error)
  }
}

// 加载陪玩师列表
const loadCompanions = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const params = {
      page: filter.value.page,
      page_size: filter.value.pageSize,
      game_id: filter.value.gameId || '',
      service_type: filter.value.serviceType || '',
      sort: filter.value.sort
    }
    // 调用新接口
    const res = await getCompanionList(params)
    if (res.code === 200) {
      const items = res.data.items || []
      if (filter.value.page === 1) {
        companions.value = items
      } else {
        companions.value = [...companions.value, ...items]
      }
      hasMore.value = res.data.pagination.has_more || false
    }
  } catch (error) {
    console.error('加载列表失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 选择游戏
const selectGame = (gameId) => {
  filter.value.gameId = gameId
  filter.value.page = 1
  loadCompanions()
}

// 选择服务类型
const selectServiceType = (type) => {
  filter.value.serviceType = type
  filter.value.page = 1
  loadCompanions()
}

// 设置排序
const setSort = (sort) => {
  filter.value.sort = sort
  filter.value.page = 1
  loadCompanions()
}

// 跳转搜索
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/companion/list?action=search'
  })
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${id}&gameId=${filter.value.gameId}`
  })
}

// 触底加载更多
// onReachBottom(() => {
//   if (hasMore.value && !loading.value) {
//     filter.value.page++
//     loadCompanions()
//   }
// })
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
    width: calc(100% - 40rpx);

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

        .level-badge {
          padding: 4rpx 12rpx;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #fff;
          font-size: 20rpx;
          border-radius: 8rpx;
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

          &.busy {
            background-color: #FFB800;
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
