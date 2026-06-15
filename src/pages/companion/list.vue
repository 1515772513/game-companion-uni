<template>
  <view class="companion-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <input
          v-model="keyword"
          :placeholder="`搜索${mainText}师`"
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
    
    <!-- 筛选条件 - 改造为 Picker 组件 -->
    <view class="filter-bar">
      <!-- 1. 游戏选择 - 改为自定义弹窗选择器 -->
      <view 
        class="filter-item"
        @tap="openGameSelector"
      >
        <view>
          <text class="filter-text">{{ selectedGame.name || '游戏' }}</text>
          <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
        </view>
      </view>
      
      <!-- 2. 等级选择 (核心改动：增加 picker 包裹) -->
      <picker
        class="filter-item"
        :class="{ disabled: !selectedGame.id }"
        :value="levelIndex"
        :range="levelOptions"
        range-key="name"
        @change="onLevelChange"
        :disabled="!selectedGame.id"
      >
        <view>
          <text class="filter-text">{{ selectedLevel.name || '等级' }}</text>
          <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
        </view>
      </picker>
      
      <!-- 3. 服务类型选择 -->
      <picker
        class="filter-item"
        :value="typeIndex"
        :range="typeOptions"
        range-key="name"
        @change="onTypeChange"
      >
        <view>
          <text class="filter-text">{{ selectedType.name || '服务类型' }}</text>
          <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
        </view>
      </picker>
      
      <!-- 4. 排序选择 -->
      <picker
        class="filter-item"
        :value="sortIndex"
        :range="sortOptions"
        range-key="name"
        @change="onSortChange"
      >
        <view>
          <text class="filter-text">{{ selectedSort.name || '排序' }}</text>
          <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
        </view>
      </picker>
    </view>

    <!-- 陪玩师列表 -->
    <view class="companion-list">
      <view
        class="companion-item"
        v-for="companion in companions"
        :key="companion.id"
        @tap="goToDetail(companion.id)"
      >
        <image :src="companion.avatarUrl" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ companion.nickname }}</text>
            <view class="level-badge">{{ companion.level }}</view>
            <view class="online-status" :class="{ online: normalizeOnlineStatus(companion.onlineStatus) === 'online' }"></view>
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
            <text class="order-count">已接{{ companion.orderCount }}单</text>
          </view>
          <view class="price-row">
            <text class="price">¥{{ companion.price }}</text>
            <text class="unit">/{{ companion.priceUnit }}</text>
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

    <!-- 游戏选择弹窗 -->
    <uni-popup ref="gamePopup" type="bottom" :mask-click="false">
      <view class="game-selector">
        <view class="selector-header">
          <text class="title">选择游戏</text>
          <uni-icons type="close" size="24" color="#666" @tap="closeGameSelector"></uni-icons>
        </view>
        
        <!-- 游戏搜索框 -->
        <view class="game-search-input">
          <uni-icons type="search" size="20" color="#999"></uni-icons>
          <input
            v-model="gameSearchKeyword"
            placeholder="搜索游戏"
            placeholder-class="placeholder"
            @input="filterGames"
          />
          <uni-icons
            v-if="gameSearchKeyword"
            type="clear"
            size="20"
            color="#999"
            @tap="clearGameSearch"
          ></uni-icons>
        </view>
        
        <!-- 游戏列表 -->
        <view class="game-list">
          <view 
            class="game-item"
            v-for="(game, index) in filteredGameOptions"
            :key="game.id || index"
            @tap="selectGame(game)"
          >
            <text :class="{ active: selectedGame.id === game.id }">{{ game.name }}</text>
          </view>
          
          <view class="empty" v-if="filteredGameOptions.length === 0">
            <text class="empty-text">未找到相关游戏</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getCompanionList } from '@/api/companion'
import { getDictList } from '@/api/dict'
import { getGameList } from '@/api/game'
import { useAppStore } from '@/store/app'
import { normalizeOnlineStatus } from '@/utils/common'

const appStore = useAppStore()

// 计算属性
const mainText = computed(() => {
  return appStore.getConfig.mainText
})

const keyword = ref('')
const companions = ref([])
const hasMore = ref(true)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)

// 筛选条件
const selectedGame = ref({})
const selectedLevel = ref({})
const selectedType = ref({})
const selectedSort = ref({})

// Picker 索引变量 (核心新增：控制组件滚动位置)
const gameIndex = ref(0)
const levelIndex = ref(0)
const typeIndex = ref(0)
const sortIndex = ref(0)

// 选项数据源
const gameOptions = ref([{ id: '', name: '全部游戏' }])
const filteredGameOptions = ref([]) // 搜索过滤后的游戏列表
const gameSearchKeyword = ref('') // 游戏搜索关键词
const levelOptions = ref([{ id: '', name: '全部等级' }])
const typeOptions = ref([{ id: '', name: '全部类型' }])
const sortOptions = ref([
  { id: 'rating', name: '评分最高', order: 'rating_desc' },
  { id: 'price_asc', name: '价格从低到高', order: 'price_asc' },
  { id: 'price_desc', name: '价格从高到高', order: 'price_desc' },
  { id: 'order_count', name: '接单最多', order: 'total_orders_desc' }
])

// 弹窗引用
const gamePopup = ref(null)

onMounted(async () => {
  uni.setNavigationBarTitle({
    title: `${mainText.value}师`
  })
  // 初始化数据
  await Promise.all([loadGames(), loadServiceTypes()])
  
  // 设置默认选中第一项
  selectedGame.value = gameOptions.value[0]
  selectedLevel.value = levelOptions.value[0]
  selectedType.value = typeOptions.value[0]
  selectedSort.value = sortOptions.value[0]
  
  // 初始化过滤后的游戏列表
  filteredGameOptions.value = [...gameOptions.value]
  
  // 初始加载列表
  loadCompanions()
})

// 监听游戏变化，联动重置等级
watch(selectedGame, async () => {
  // 重置等级选中状态
  selectedLevel.value = levelOptions.value[0]
  levelIndex.value = 0
  
  // 加载新的等级列表
  if (selectedGame.value.id) {
    await loadLevels()
  } else {
    levelOptions.value = [{ id: '', name: '全部等级' }]
  }
}, { deep: true })

// 监听游戏列表变化，同步过滤列表
watch(gameOptions, () => {
  filteredGameOptions.value = [...gameOptions.value]
})

// 加载游戏列表
const loadGames = async () => {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      const items = res.data || []
      gameOptions.value = [
        { id: '', name: '全部游戏' },
        ...items.map(game => ({ id: game.value, name: game.label }))
      ]
    }
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}

// 加载服务类型列表
const loadServiceTypes = async () => {
  try {
    const res = await getDictList('service_type')
    if (res.code === 200) {
      typeOptions.value = [
        { id: '', name: '全部类型' },
        ...((res.data || []).map(item => ({ id: item.dictValue, name: item.dictLabel })))
      ]
    }
  } catch (error) {
    console.error('加载服务类型列表失败', error)
  }
}

// 加载等级列表
const loadLevels = async () => {
  if (!selectedGame.value.id) return
  
  try {
    const res = await getDictList(`game_level_${selectedGame.value.id}`)
    if (res.code === 200) {
      levelOptions.value = [
        { id: '', name: '全部等级' },
        ...((res.data || []).map(item => ({ id: item.dictValue, name: item.dictLabel })))
      ]
      // 加载完数据后，默认选中第一项
      selectedLevel.value = levelOptions.value[0]
    }
  } catch (error) {
    console.error('加载等级列表失败', error)
  }
}

// 加载陪玩师列表
const loadCompanions = async () => {
  if (loading.value) return
  loading.value = true

  try {
    // 查询参数对应后端 CompanionListFrontRequest（snake_case）
    const params = {
      page: page.value,
      page_size: pageSize.value,
      sort: selectedSort.value.order || 'rating_desc'
    }

    const kw = keyword.value.trim()
    if (kw) params.keyword = kw
    if (selectedGame.value.id) params.game_id = selectedGame.value.id
    if (selectedLevel.value.id) params.level = selectedLevel.value.id
    if (selectedType.value.id) params.service_type = selectedType.value.id

    const res = await getCompanionList(params)

    if (res.code === 200) {
      const items = res.data.items || []
      companions.value = page.value === 1 ? items : [...companions.value, ...items]
      hasMore.value = res.data.pagination?.hasMore || false
    }
  } catch (error) {
    console.error('加载失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadCompanions()
}

// 清除关键词
const clearKeyword = () => {
  keyword.value = ''
  handleSearch()
}

// 游戏选择器相关方法
const openGameSelector = () => {
  gamePopup.value.open()
}

const closeGameSelector = () => {
  gamePopup.value.close()
}

// 过滤游戏列表
const filterGames = () => {
  const keyword = gameSearchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    filteredGameOptions.value = [...gameOptions.value]
    return
  }
  
  filteredGameOptions.value = gameOptions.value.filter(game => 
    game.name.toLowerCase().includes(keyword)
  )
}

// 清除游戏搜索关键词
const clearGameSearch = () => {
  gameSearchKeyword.value = ''
  filterGames()
}

// 选择游戏
const selectGame = (game) => {
  selectedGame.value = game
  gameIndex.value = gameOptions.value.findIndex(item => item.id === game.id)
  page.value = 1
  loadCompanions()
  closeGameSelector()
}

// Picker 改变事件 (核心逻辑：同步选中状态并刷新数据)
const onLevelChange = (e) => {
  const index = e.detail.value
  selectedLevel.value = levelOptions.value[index]
  levelIndex.value = index
  page.value = 1
  loadCompanions()
}

const onTypeChange = (e) => {
  const index = e.detail.value
  selectedType.value = typeOptions.value[index]
  typeIndex.value = index
  page.value = 1
  loadCompanions()
}

const onSortChange = (e) => {
  const index = e.detail.value
  selectedSort.value = sortOptions.value[index]
  sortIndex.value = index
  page.value = 1
  loadCompanions()
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/companion/detail?id=${id}` })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 触底加载更多
onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    page.value++
    loadCompanions()
  }
})
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

// 游戏选择器样式
.game-selector {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .game-search-input {
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    margin: 20rpx 30rpx;

    input {
      flex: 1;
      margin: 0 10rpx;
      font-size: 28rpx;
    }

    .placeholder {
      color: #999;
    }
  }

  .game-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 30rpx 20rpx;

    .game-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      font-size: 28rpx;
      color: #333;

      &:last-child {
        border-bottom: none;
      }

      .active {
        color: #3b82f6;
        font-weight: bold;
      }
    }

    .empty {
      padding: 50rpx 0;

      .empty-text {
        font-size: 26rpx;
      }
    }
  }
}
</style>