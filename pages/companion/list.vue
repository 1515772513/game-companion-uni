<template>
  <view class="companion-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <input
          v-model="keyword"
          placeholder="搜索陪玩师"
          placeholder-class="placeholder"
          @confirm="handleSearch"
        />
        <uni-icons
          v-if="keyword"
          type="clear"
          size="20"
          color="#999"
          @tap="clearKeyword"
        ></uni-icons>
      </view>
      <text class="cancel-btn" @tap="goBack">取消</text>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-bar">
      <view class="filter-item" @tap="showGamePicker">
        <text class="filter-text">{{ selectedGame.name || '游戏' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view :class="`filter-item ${selectedGame.id ? '' : 'disabled'}`" @tap="showLevelPicker">
        <text class="filter-text">{{ selectedLevel.name || '等级' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @tap="showTypePicker">
        <text class="filter-text">{{ selectedType.name || '服务类型' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @tap="showSortPicker">
        <text class="filter-text">{{ selectedSort.name || '排序' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
    </view>

    <!-- 陪玩师列表 -->
    <view class="companion-list">
      <view
        class="companion-item"
        v-for="companion in companions"
        :key="companion.id"
        @tap="goToDetail(companion.id)"
      >
        <image :src="companion.avatar_url" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ companion.nickname }}</text>
            <view class="level-badge">{{ companion.level }}</view>
            <view class="online-status" :class="{ online: companion.online_status === 1 }"></view>
          </view>
          <view class="tags">
            <text class="tag" v-for="tag in companion.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="game-info">
            <text class="game-rank">{{ companion.game_rank }}</text>
          </view>
          <view class="rating">
            <uni-icons type="star-filled" size="12" color="#FFB800"></uni-icons>
            <text class="rating-text">{{ companion.rating }}</text>
            <text class="order-count">已接{{ companion.order_count }}单</text>
          </view>
          <view class="price-row">
            <text class="price">¥{{ companion.price }}</text>
            <text class="unit">/{{ companion.price_unit }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-more" v-if="loading">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="no-more" v-else-if="!hasMore && companions.length > 0">
      <text>没有更多了</text>
    </view>
    <view class="empty" v-else-if="!loading && companions.length === 0">
      <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无数据</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchCompanions, getCompanionList } from '@/api/companion'
import { getDictList } from '@/api/ditc'
import { getGameList } from '@/api/game'

const keyword = ref('')
const companions = ref([])
const games = ref([])
const hasMore = ref(true)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)

// 筛选条件
const selectedGame = ref({})
const selectedLevel = ref({})
const selectedType = ref({})
const selectedSort = ref({})

const gameOptions = ref([{ id: '', name: '全部游戏' }])
const levelOptions = ref([
  { id: '', name: '全部等级' },
])
const typeOptions = ref([])
const sortOptions = ref([
  { id: 'rating', name: '评分最高', order: 'rating_desc' },
  { id: 'price', name: '价格从低到高', order: 'price_asc' },
  { id: 'price', name: '价格从高到低', order: 'price_desc' },
  { id: 'order_count', name: '接单最多', order: 'total_orders_desc' }
])

onMounted(async () => {
  // 设置默认筛选值
  selectedGame.value = gameOptions.value[0]
  selectedLevel.value = levelOptions.value[0]
  selectedSort.value = sortOptions.value[0]

  // 加载游戏列表
  await loadGames()

  // 加载服务类型列表
  await loadServiceTypes()

  // 加载陪玩师列表
  await loadCompanions()
})

// 加载服务类型列表
const loadServiceTypes = async () => {
  try {
    const res = await getDictList('service_type')
    if (res.code === 200) {
      typeOptions.value = [
        { id: '', name: '全部类型' },
        ...((res.data || []).map(item => ({ id: item.dictValue, name: item.dictLabel })))
      ]
      
      selectedType.value = typeOptions.value[0]
    }
  } catch (error) {
    console.error('加载服务类型列表失败', error)
  }
}

// 加载等级列表
const loadLevels = async () => {
  try {
    const res = await getDictList(`game_level_${selectedGame.value.id}`)
    if (res.code === 200) {
      levelOptions.value = [
        { id: '', name: '全部等级' },
        ...((res.data || []).map(item => ({ id: item.dictValue, name: item.dictLabel })))
      ]
      selectedLevel.value = levelOptions.value[0]
      console.log(levelOptions.value)
    }
  } catch (error) {
    console.error('加载等级列表失败', error)
  }
}

// 加载游戏列表
const loadGames = async () => {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      const items = res.data || []
      games.value = items
      gameOptions.value = [
        { id: '', name: '全部游戏' },
        ...items.map(game => ({ id: game.value, name: game.label }))
      ]
    }
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}

// 加载陪玩师列表
const loadCompanions = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const params = {
      page: page.value,
      page_size: pageSize.value,
      sort: selectedSort.value.order
    }

    // 添加筛选条件
    if (selectedGame.value.id) {
      params.game_id = selectedGame.value.id
    }
    if (selectedLevel.value.id) {
      params.level = selectedLevel.value.id
    }
    if (selectedType.value.id) {
      params.service_type = selectedType.value.id
    }

    const res = await getCompanionList(params)

    if (res.code === 200) {
      const items = res.data.items || []
      if (page.value === 1) {
        companions.value = items
      } else {
        companions.value = [...companions.value, ...items]
      }

      const pagination = res.data.pagination || {}
      hasMore.value = pagination.has_more || false
    }
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

// 搜索陪玩师
const handleSearch = async () => {
  if (!keyword.value.trim()) {
    page.value = 1
    loadCompanions()
    return
  }

  loading.value = true
  try {
    const params = {
      keyword: keyword.value.trim(),
      page: page.value,
      page_size: pageSize.value
    }

    const res = await searchCompanions(params)

    if (res.code === 200) {
      const items = res.data.items || []
      if (page.value === 1) {
        companions.value = items
      } else {
        companions.value = [...companions.value, ...items]
      }

      const pagination = res.data.pagination || {}
      hasMore.value = pagination.has_more || false
    }
  } catch (error) {
    console.error('搜索失败', error)
    uni.showToast({
      title: '搜索失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 清除关键词
const clearKeyword = () => {
  keyword.value = ''
  page.value = 1
  loadCompanions()
}

// 显示选择器
const showGamePicker = () => {
  uni.showActionSheet({
    itemList: gameOptions.value.map(item => item.name),
    success: (res) => {
      selectedGame.value = gameOptions.value[res.tapIndex]
      page.value = 1
      // 获取等级列表
      loadLevels()
      loadCompanions()
    }
  })
}

const showLevelPicker = () => {
  if (!selectedGame.value.id) return
  uni.showActionSheet({
    itemList: levelOptions.value.map(item => item.name),
    success: (res) => {
      selectedLevel.value = levelOptions.value[res.tapIndex]
      page.value = 1
      loadCompanions()
    }
  })
}

const showTypePicker = () => {
  uni.showActionSheet({
    itemList: typeOptions.value.map(item => item.name),
    success: (res) => {
      selectedType.value = typeOptions.value[res.tapIndex]
      page.value = 1
      loadCompanions()
    }
  })
}

const showSortPicker = () => {
  uni.showActionSheet({
    itemList: sortOptions.value.map(item => item.name),
    success: (res) => {
      selectedSort.value = sortOptions.value[res.tapIndex]
      page.value = 1
      loadCompanions()
    }
  })
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${id}`
  })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 触底加载更多
// onReachBottom(() => {
//   if (hasMore.value && !loading.value) {
//     page.value++
//     if (keyword.value.trim()) {
//       handleSearch()
//     } else {
//       loadCompanions()
//     }
//   }
// })
</script>

<style lang="scss" scoped>
.companion-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;

    input {
      flex: 1;
      margin: 0 10rpx;
      font-size: 28rpx;
    }

    .placeholder {
      color: #999;
    }
  }

  .cancel-btn {
    margin-left: 20rpx;
    color: #3b82f6;
    font-size: 28rpx;
  }
}

.filter-bar {
  display: flex;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    font-size: 26rpx;
    color: #666;

    &.disabled {
      color: rgba(102, 102, 102, 0.5);
    }

    .filter-text {
      margin-right: 6rpx;
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

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name-row {
        display: flex;
        align-items: center;

        .name {
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
        }
      }

      .tags {
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

      .game-info {
        .game-rank {
          font-size: 24rpx;
          color: #666;
        }
      }

      .rating {
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

      .price-row {
        .price {
          color: #3b82f6;
          font-size: 36rpx;
          font-weight: bold;
        }

        .unit {
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
