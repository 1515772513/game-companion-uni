<template>
  <view class="reviews-page">
    <!-- 顶部导航栏 -->
    <!-- <view class="uni-navbar">
      <view class="navbar-left" @tap="goBack">
        <text class="back-icon">
          <uni-icon name="arrow-left"></uni-icon>
        </text>
      </view>
      <view class="navbar-title">用户评价</view>
    </view> -->

    <!-- 评价统计 -->
    <view class="review-stats" v-if="stats.total > 0">
      <view class="stats-left">
        <text class="star-icon">★</text>
        <text class="score">{{ stats.score }}</text>
        <text class="label">总评分</text>
      </view>
      <view class="stats-right">
        <view class="stat-item" v-for="(item, index) in 5" :key="index">
          <text class="star-text">{{ 5 - index }}星</text>
          <view class="progress-bar">
            <view class="progress" :style="{width: stats.rateList[4 - index] + '%'}"></view>
          </view>
          <text class="rate-text">{{ stats.rateList[4 - index] }}%</text>
        </view>
      </view>
    </view>

    <!-- 评价列表 -->
    <view class="review-list">
      <!-- 加载中 -->
      <view class="loading-box" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="!loading && reviews.length === 0">
        <text class="empty-text">暂无用户评价</text>
      </view>

      <!-- 评价项 -->
      <view class="review-item" v-for="review in reviews" :key="review.id">
        <view class="review-header">
          <image :src="review.userAvatar || '/static/images/default-avatar.png'" mode="aspectFill" class="user-avatar"></image>
          <view class="user-info">
            <text class="user-name">{{ review.userName }}</text>
            <view class="star-row">
              <text class="star" v-for="i in review.score" :key="i">★</text>
            </view>
          </view>
          <text class="review-time">{{ review.createTime }}</text>
        </view>
        <text class="review-content">{{ review.content }}</text>
        <view class="review-images" v-if="review.images && review.images.length > 0">
          <image
            v-for="(img, index) in review.images"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="review-image"
            @tap="previewImage(index, review.images)"
          ></image>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore && !loading">
        <text class="load-text">上拉加载更多</text>
      </view>
      <view class="load-more" v-if="loadingMore">
        <text class="load-text">加载中...</text>
      </view>
      <view class="load-more" v-if="!hasMore && reviews.length > 0">
        <text class="load-text">没有更多了~</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompanionReviews } from '@/api/companion'

const companionId = ref('')
const reviews = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

const stats = ref({
  total: 0,
  score: '5.0',
  rateList: [0, 0, 0, 0, 0]
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  companionId.value = options.id
  loadReviews()
})

// 获取全部评价
const loadReviews = async (isLoadMore = false) => {
  if (!companionId.value) return
  
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    reviews.value = []
    page.value = 1
    hasMore.value = true
  }

  try {
    const res = await getCompanionReviews(companionId.value, {
      page: page.value,
      pageSize: pageSize.value
    })
    
    if (res.code === 200) {
      const list = res.data || []
      
      if (isLoadMore) {
        reviews.value.push(...list)
      } else {
        reviews.value = list
      }

      hasMore.value = list.length === pageSize.value
      if (hasMore.value) {
        page.value++
      }

      if (!isLoadMore && reviews.value.length > 0) {
        calcReviewStats()
      }
    }
  } catch (error) {
    console.error('获取全部评价失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 计算统计数据
const calcReviewStats = () => {
  const total = reviews.value.length
  let scoreSum = 0
  const countList = [0, 0, 0, 0, 0]

  reviews.value.forEach(item => {
    const score = item.score || 5
    scoreSum += score
    if (score >= 1 && score <= 5) {
      countList[score - 1]++
    }
  })

  const rateList = countList.map(item => {
    return total > 0 ? Math.round((item / total) * 100) : 0
  })

  stats.value = {
    total,
    score: total > 0 ? (scoreSum / total).toFixed(1) : '5.0',
    rateList
  }
}

// 下拉刷新
const onPullDownRefresh = async () => {
  await loadReviews()
  uni.stopPullDownRefresh()
}

// 上拉加载更多
const onReachBottom = () => {
  if (hasMore.value && !loadingMore.value) {
    loadReviews(true)
  }
}

// 预览图片
const previewImage = (index, urls) => {
  uni.previewImage({ urls, current: index })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

defineExpose({
  onPullDownRefresh,
  onReachBottom
})
</script>

<style scoped>
.reviews-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 导航栏 */
.uni-navbar {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
}

.navbar-left {
  margin-right: 15px;
}

.back-icon {
  font-size: 18px;
  color: #333;
}

.navbar-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
  flex: 1;
  text-align: center;
}

/* 评价统计 */
.review-stats {
  background: #fff;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.stats-left {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #f0f0f0;
  padding-right: 15px;
}

.star-icon {
  color: #ffb800;
  font-size: 24px;
}

.score {
  font-size: 22px;
  font-weight: bold;
  color: #ffb800;
  margin: 5px 0;
}

.label {
  font-size: 12px;
  color: #999;
}

.stats-right {
  flex: 1;
  padding-left: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.star-text {
  width: 60px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 0 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #ffb800;
  border-radius: 3px;
}

.rate-text {
  width: 50px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* 评价列表 */
.review-list {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 0 15px;
}

.loading-box {
  padding: 40px 0;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.empty {
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.review-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.star-row {
  display: flex;
}

.star {
  color: #ffb800;
  font-size: 12px;
  margin-right: 2px;
}

.review-time {
  font-size: 12px;
  color: #999;
}

.review-content {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.load-more {
  padding: 20px 0;
  text-align: center;
}

.load-text {
  font-size: 13px;
  color: #999;
}
</style>