<template>
  <view class="companion-detail-page">
    <!-- 陪玩师信息 - 替换为轮播图 -->
    <view class="companion-header">
      <!-- 轮播图组件替换原单个背景图 -->
      <swiper class="bg-swiper" autoplay circular :interval="5000">
        <swiper-item v-for="(banner, index) in bannerList" :key="index">
          <image 
            :src="banner.url || banner" 
            mode="aspectFill" 
            class="bg-image"
          ></image>
        </swiper-item>
      </swiper>
      <view class="header-mask"></view>
      <view class="header-content">
        <view class="avatar-row">
          <image :src="companionInfo.avatarUrl || companionInfo.avatar" mode="aspectFill" class="avatar"></image>
          <view class="online-status" :class="{ online: companionInfo.onlineStatus === 'online', busy: companionInfo.onlineStatus === 'busy'  }">
            {{ companionInfo.onlineStatus === 'online' ? '在线' : (companionInfo.onlineStatus === 'busy' ? '接单中' : '离线') }}
          </view>
        </view>
        <view class="name-row">
          <text class="name">{{ companionInfo.nickname }}</text>
          <view class="vip-badge" v-if="companionInfo.isVip">
            <uni-icons type="vip-filled" size="14" color="#FFD700"></uni-icons>
            <text>VIP</text>
          </view>
        </view>
        <view class="stats-row">
          <view class="stat-item">
            <uni-icons type="star-filled" size="14" color="#FFB800"></uni-icons>
            <text class="stat-value">{{ companionInfo.rating }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">已接</text>
            <text class="stat-value">{{ companionInfo.orderCount }}</text>
            <text class="stat-label">单</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">好评率</text>
            <text class="stat-value">{{ companionInfo.goodRate }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 游戏选择标签 -->
    <view class="game-tags-section">
      <scroll-view scroll-x class="game-scroll">
        <view
          class="game-tag"
          :class="{ active: selectedGame.gameId === game.gameId }"
          v-for="game in games"
          :key="game.gameId"
          @tap="selectGame(game)"
        >
          {{ game.gameName }}
        </view>
      </scroll-view>
    </view>

    <!-- 服务标签 -->
    <view class="tags-section">
      <view class="tag" v-for="tag in companionInfo.tags" :key="tag">{{ tag }}</view>
    </view>

    <!-- 服务列表 -->
    <view class="services-section">
      <view class="section-title">
        选择服务
        <view class="tips">（服务类型：线上）</view>
      </view>
      <view class="service-list">
        <view
          class="service-item"
          v-for="service in filteredServices"
          :key="service.id"
          :class="{ active: selectedService?.id === service.id }"
          @tap="selectService(service)"
        >
          <view class="service-info">
            <text class="service-name">{{ service.serviceTypeName }}</text>
            <text class="service-desc">{{ service.description || `专业${mainText}服务` }}</text>
          </view>
          <view class="service-price">
            <text class="price">¥{{ service.price }}</text>
            <text class="unit">/{{ service.priceUnit || '' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 个人简介 -->
    <view class="intro-section">
      <view class="section-title">个人简介</view>
      <text class="intro-text">{{ companionInfo.intro || '这个人很懒，什么都没留下~' }}</text>
    </view>

    <!-- 相册 -->
    <view class="gallery-section" v-if="companionInfo.gallery?.length || companionInfo.images?.length">
      <view class="section-title">相册</view>
      <scroll-view scroll-x class="gallery-scroll">
        <image
          v-for="(img, index) in (companionInfo.gallery || companionInfo.images || [])"
          :key="index"
          :src="typeof img === 'string' ? img : img.url"
          mode="aspectFill"
          class="gallery-image"
          @tap="previewImage(index)"
        ></image>
      </scroll-view>
    </view>

    <!-- 评价 -->
    <view class="reviews-section">
      <view class="section-title">
        <text>用户评价</text>
        <view class="more" @tap="goToAllReviews">查看全部 <uni-icons type="right" size="14" color="#666"></uni-icons></view>
      </view>
      <view class="review-list">
        <view class="review-item" v-for="review in reviews" :key="review.id">
          <view class="review-header">
            <image :src="review.userAvatar || review.user_avatar" mode="aspectFill" class="user-avatar"></image>
            <view class="user-info">
              <text class="user-name">{{ review.userName || review.user_name }}</text>
              <uni-icons type="star-filled" size="12" color="#FFB800"></uni-icons>
              <text class="rating">{{ review.score }}</text>
            </view>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <view class="review-images" v-if="review.images?.length || review.image_urls?.length">
            <image
              v-for="(img, index) in (review.images || review.image_urls || [])"
              :key="index"
              :src="typeof img === 'string' ? img : img.url"
              mode="aspectFill"
              class="review-image"
              @tap="previewReviewImage(index, review.images || review.image_urls)"
            ></image>
          </view>
          <view class="review-time">{{ review.createTime || review.created_at }}</view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btns">
        <view class="action-btn" @tap="toggleFavorite">
          <uni-icons
            :type="companionInfo.isFavorite ? 'heart-filled' : 'heart'"
            size="24"
            :color="companionInfo.isFavorite ? '#ff4d4f' : '#666'"
          ></uni-icons>
          <text class="btn-label">{{ companionInfo.isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
        <!-- <view class="action-btn" @tap="goToChat">
          <uni-icons type="chatbubble" size="24" color="#666"></uni-icons>
          <text class="btn-label">私聊</text>
        </view> -->
      </view>
      <button class="order-btn" @tap="goToCreateOrder" :disabled="!selectedService">
        立即下单
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCompanionDetail, getCompanionServices, getCompanionReviews } from '@/api/companion'
import { addFavorite, removeFavorite } from '@/api/user'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const mainText = computed(() => {
  return appStore.getConfig.mainText
})

const companionId = ref('')
const companionInfo = ref({})
const services = ref([])
const reviews = ref([])
const selectedService = ref(null)
const loading = ref(false)

// 轮播图列表 - 兼容相册/头像作为兜底
const bannerList = computed(() => {
  // 优先使用backgroundImages字段，无则使用相册，最后使用头像兜底
  if (companionInfo.value.backgroundImages?.length) {
    return companionInfo.value.backgroundImages
  } else if (companionInfo.value.gallery?.length || companionInfo.value.images?.length) {
    return companionInfo.value.gallery || companionInfo.value.images
  } else {
    return [companionInfo.value.avatarUrl || companionInfo.value.avatar]
  }
})

// 游戏选择
const games = ref([])
const selectedGame = ref({})

onMounted(() => {
  uni.setNavigationBarTitle({
    title: `${mainText.value}师详情`
  })
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  companionId.value = options.id

  loadCompanionDetail()
  loadServices()
  loadReviews()
})

const loadCompanionDetail = async () => {
  loading.value = true
  try {
    const res = await getCompanionDetail(companionId.value)
    if (res.code === 200) {
      companionInfo.value = {
        ...res.data,
        avatarUrl: res.data.avatar,
      }
    }
  } catch (error) {
    console.error('获取详情失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadServices = async () => {
  try {
    const res = await getCompanionServices(companionId.value)
    if (res.code === 200) {
      services.value = res.data || []

      // 提取游戏列表
      const gameMap = {}
      services.value.forEach(item => {
        if (!gameMap[item.gameId]) {
          gameMap[item.gameId] = {
            gameId: item.gameId,
            gameName: item.gameName
          }
        }
      })
      games.value = Object.values(gameMap)

      // 处理URL中的gameId
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.options
      const urlGameId = options.gameId ? Number(options.gameId) : null

      if (urlGameId && games.value.length) {
        const target = games.value.find(g => g.gameId === urlGameId)
        selectedGame.value = target || games.value[0]
      } else if (games.value.length) {
        selectedGame.value = games.value[0]
      }

      // 默认选中第一个服务
      if (filteredServices.value.length) {
        selectedService.value = filteredServices.value[0]
      }
    }
  } catch (error) {
    console.error('获取服务失败', error)
    uni.showToast({ title: '服务加载失败', icon: 'none' })
  }
}

// 切换游戏
const selectGame = (game) => {
  selectedGame.value = game
  if (filteredServices.value.length) {
    selectedService.value = filteredServices.value[0]
  }
}

// 根据选中游戏过滤服务
const filteredServices = computed(() => {
  if (!selectedGame.value?.gameId) return []
  return services.value.filter(s => s.gameId === selectedGame.value.gameId)
})

const loadReviews = async () => {
  try {
    const res = await getCompanionReviews(companionId.value, { page: 1, pageSize: 3 })
    if (res.code === 200) {
      reviews.value = res.data || []
    }
  } catch (error) {
    console.error('获取评价失败', error)
  }
}

const selectService = (service) => {
  selectedService.value = service
}

const toggleFavorite = async () => {
  try {
    // 后端 AddFavoriteDto/RemoveFavoriteDto 字段为 ItemId(int)，需传数字
    if (companionInfo.value.isFavorite) {
      await removeFavorite({ ItemId: Number(companionId.value) })
      companionInfo.value.isFavorite = false
      uni.showToast({ title: '取消收藏', icon: 'success' })
    } else {
      await addFavorite({ ItemId: Number(companionId.value) })
      companionInfo.value.isFavorite = true
      uni.showToast({ title: '收藏成功', icon: 'success' })
    }
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const goToChat = () => {
  uni.navigateTo({
    url: `/pages/message/detail?companionId=${companionId.value}`
  })
}

const goToCreateOrder = () => {
  if (!selectedService.value) {
    uni.showToast({ title: '请先选择服务', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/order/create?companionId=${companionId.value}&serviceId=${selectedService.value.id}`
  })
}

const goToAllReviews = () => {
  uni.navigateTo({
    url: `/pages/companion/reviews?id=${companionId.value}`
  })
}

const previewImage = (index) => {
  uni.previewImage({
    urls: companionInfo.value.gallery || [],
    current: index
  })
}

const previewReviewImage = (index, images) => {
  uni.previewImage({
    urls: images || [],
    current: index
  })
}
</script>

<style lang="scss" scoped>
.companion-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.companion-header {
  position: relative;
  height: 400rpx;
  overflow: hidden;

  // 轮播图样式
  .bg-swiper {
    width: 100%;
    height: 100%;
    
    .bg-image {
      width: 100%;
      height: 100%;
    }
  }

  .header-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
    z-index: 1;
  }

  .header-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx;
    color: #fff;
    z-index: 2;

    .avatar-row {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        margin-right: 20rpx;
      }

      .online-status {
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 24rpx;

        &.online {
          background-color: #52c41a;
        }

        &.busy {
          background-color: #FFB800;
        }
      }
    }

    .name-row {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .name {
        font-size: 36rpx;
        font-weight: bold;
        margin-right: 16rpx;
      }

      .vip-badge {
        display: flex;
        align-items: center;
        padding: 4rpx 12rpx;
        background-color: rgba(255, 215, 0, 0.2);
        border-radius: 20rpx;
        border: 1rpx solid rgba(255, 215, 0, 0.5);

        text {
          font-size: 20rpx;
          color: #FFD700;
          margin-left: 4rpx;
        }
      }
    }

    .stats-row {
      display: flex;

      .stat-item {
        display: flex;
        align-items: center;
        margin-right: 30rpx;
        font-size: 24rpx;

        .stat-value {
          margin: 0 6rpx;
          font-weight: bold;
          color: #FFD700;
        }
      }
    }
  }
}

/* 轮播图指示器样式自定义 */
::v-deep .uni-swiper-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: rgba(255,255,255,0.5);
  border-radius: 6rpx;
  margin: 0 6rpx;
}
::v-deep .uni-swiper-dot-active {
  background-color: #fff;
  width: 24rpx;
}
::v-deep .uni-swiper-dots {
  bottom: 20rpx;
}

/* 游戏标签样式 */
.game-tags-section {
  background: #fff;
  padding: 20rpx 20rpx;
  margin-bottom: 20rpx;

  .game-scroll {
    white-space: nowrap;
  }

  .game-tag {
    display: inline-block;
    padding: 12rpx 24rpx;
    margin-right: 16rpx;
    border-radius: 10rpx;
    background: #f5f5f5;
    font-size: 26rpx;
    color: #666;

    &.active {
      background: #3b82f6;
      color: #fff;
    }
  }
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .tag {
    padding: 8rpx 20rpx;
    margin: 0 16rpx 16rpx 0;
    background-color: #f0f0f0;
    color: #666;
    font-size: 24rpx;
    border-radius: 8rpx;
  }
}

.services-section, .intro-section, .gallery-section, .reviews-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tips {
      font-size: 24rpx;
      color: #999;
    }

    .more {
      font-size: 26rpx;
      color: #999;
      font-weight: normal;
    }
  }
}

.service-list {
  .service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    margin-bottom: 16rpx;
    border: 2rpx solid #f0f0f0;
    border-radius: 12rpx;
    transition: all 0.3s;

    &.active {
      border-color: #3b82f6;
      background-color: #f0f9ff;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .service-info {
      flex: 1;

      .service-name {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }

      .service-desc {
        font-size: 24rpx;
        color: #999;
      }
    }

    .service-price {
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

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.gallery-scroll {
  white-space: nowrap;

  .gallery-image {
    display: inline-block;
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    margin-right: 16rpx;
  }
}

.review-list {
  .review-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .user-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        margin-right: 16rpx;
      }

      .user-info {
        flex: 1;
        display: flex;
        align-items: center;

        .user-name {
          font-size: 28rpx;
          color: #333;
          margin-right: 16rpx;
        }

        .rating {
          margin-left: 6rpx;
          color: #FFB800;
          font-size: 24rpx;
        }
      }
    }

    .review-content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16rpx;
    }

    .review-images {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 16rpx;

      .review-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        margin-right: 12rpx;
        margin-bottom: 12rpx;
      }
    }

    .review-time {
      font-size: 22rpx;
      color: #999;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .action-btns {
    display: flex;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40rpx;

      .btn-label {
        font-size: 22rpx;
        color: #666;
        margin-top: 4rpx;
      }
    }
  }

  .order-btn {
    flex: 1;
    height: 80rpx;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
    border: none;

    &::after {
      border: none;
    }

    &[disabled] {
      background-color: #ccc;
    }
  }
}
</style>