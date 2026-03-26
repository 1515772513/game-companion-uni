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
        <text class="filter-text">{{ selectedGame || '游戏' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @tap="showTypePicker">
        <text class="filter-text">{{ selectedType || '服务类型' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @tap="showGenderPicker">
        <text class="filter-text">{{ selectedGender || '性别' }}</text>
        <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
      </view>
      <view class="filter-item" @tap="showSortPicker">
        <text class="filter-text">{{ selectedSort || '排序' }}</text>
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
        <image :src="companion.avatar" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ companion.nickname }}</text>
            <view class="online-status" :class="{ online: companion.isOnline }"></view>
          </view>
          <view class="tags">
            <text class="tag" v-for="tag in companion.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="rating">
            <uni-icons type="star-filled" size="12" color="#FFB800"></uni-icons>
            <text class="rating-text">{{ companion.rating }}</text>
            <text class="order-count">{{ companion.orderCount }}单</text>
          </view>
          <view class="price-row">
            <text class="price">¥{{ companion.price }}</text>
            <text class="unit">/小时</text>
          </view>
        </view>
        <view class="favorite-btn" @tap.stop="toggleFavorite(companion)">
          <uni-icons
            :type="companion.isFavorite ? 'heart-filled' : 'heart'"
            size="24"
            :color="companion.isFavorite ? '#ff4d4f' : '#999'"
          ></uni-icons>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-more" v-if="hasMore">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="no-more" v-else-if="companions.length > 0">
      <text>没有更多了</text>
    </view>
    <view class="empty" v-else>
      <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无数据</text>
    </view>

    <!-- 选择器弹窗 -->
    <picker
      v-if="showPicker"
      mode="selector"
      :range="pickerOptions"
      @change="onPickerChange"
      @cancel="showPicker = false"
    >
      <view></view>
    </picker>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchCompanions, getCompanionList, addFavorite, removeFavorite } from '@/api/companion'

const keyword = ref('')
const companions = ref([])
const selectedGame = ref('')
const selectedType = ref('')
const selectedGender = ref('')
const selectedSort = ref('')
const hasMore = ref(true)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

const showPicker = ref(false)
const pickerType = ref('')
const pickerOptions = ref([])

const gameOptions = ref(['全部', '王者荣耀', '和平精英', '英雄联盟', '绝地求生'])
const typeOptions = ref(['全部', '语音陪玩', '视频陪玩', '游戏陪玩'])
const genderOptions = ref(['全部', '男', '女'])
const sortOptions = ref(['综合排序', '价格从低到高', '价格从高到低', '评分最高'])

onMounted(() => {
  if (keyword.value) {
    handleSearch()
  } else {
    loadCompanions()
  }
})

const loadCompanions = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }

    if (selectedGame.value && selectedGame.value !== '全部') {
      params.gameId = selectedGame.value
    }
    if (selectedType.value && selectedType.value !== '全部') {
      const typeMap = { '语音陪玩': 'voice', '视频陪玩': 'video', '游戏陪玩': 'game' }
      params.serviceType = typeMap[selectedType.value]
    }
    if (selectedGender.value && selectedGender.value !== '全部') {
      const genderMap = { '男': 'male', '女': 'female' }
      params.gender = genderMap[selectedGender.value]
    }
    if (selectedSort.value) {
      const sortMap = {
        '价格从低到高': 'price_asc',
        '价格从高到低': 'price_desc',
        '评分最高': 'rating_desc'
      }
      params.priceSort = sortMap[selectedSort.value]
    }

    const res = await getCompanionList(params)
    if (page.value === 1) {
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

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    loadCompanions()
    return
  }

  loading.value = true
  try {
    const res = await searchCompanions({
      keyword: keyword.value,
      page: page.value,
      pageSize: pageSize.value
    })

    if (page.value === 1) {
      companions.value = res.data.list || []
    } else {
      companions.value = [...companions.value, ...(res.data.list || [])]
    }
    hasMore.value = res.data.hasMore || false
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

const clearKeyword = () => {
  keyword.value = ''
  page.value = 1
  loadCompanions()
}

const showGamePicker = () => {
  pickerType.value = 'game'
  pickerOptions.value = gameOptions.value
  showPicker.value = true
}

const showTypePicker = () => {
  pickerType.value = 'type'
  pickerOptions.value = typeOptions.value
  showPicker.value = true
}

const showGenderPicker = () => {
  pickerType.value = 'gender'
  pickerOptions.value = genderOptions.value
  showPicker.value = true
}

const showSortPicker = () => {
  pickerType.value = 'sort'
  pickerOptions.value = sortOptions.value
  showPicker.value = true
}

const onPickerChange = (e) => {
  const value = pickerOptions.value[e.detail.value]

  if (pickerType.value === 'game') {
    selectedGame.value = value
  } else if (pickerType.value === 'type') {
    selectedType.value = value
  } else if (pickerType.value === 'gender') {
    selectedGender.value = value
  } else if (pickerType.value === 'sort') {
    selectedSort.value = value
  }

  showPicker.value = false
  page.value = 1
  loadCompanions()
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/companion/detail?id=${id}`
  })
}

const toggleFavorite = async (companion) => {
  try {
    if (companion.isFavorite) {
      await removeFavorite(companion.id)
      companion.isFavorite = false
      uni.showToast({
        title: '取消收藏',
        icon: 'success'
      })
    } else {
      await addFavorite({ companionId: companion.id })
      companion.isFavorite = true
      uni.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('收藏操作失败', error)
  }
}

const goBack = () => {
  uni.navigateBack()
}

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    page.value++
    if (keyword.value) {
      handleSearch()
    } else {
      loadCompanions()
    }
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
    position: relative;

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

    .favorite-btn {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
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
