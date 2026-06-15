<template>
  <view class="companion-detail-page">
    <!-- 顶部轮播背景图（可编辑） -->
    <view class="companion-header">
      <swiper class="bg-swiper" autoplay circular :interval="5000" :disable="!isEdit">
        <swiper-item v-for="(banner, index) in bannerList" :key="index">
          <image :src="banner.url || banner" mode="aspectFill" class="bg-image"></image>
        </swiper-item>
      </swiper>
      <view class="header-mask"></view>
      <view class="header-content">
        <view class="avatar-row">
          <image :src="info.avatarUrl || info.avatar" mode="aspectFill" class="avatar"></image>
          <view class="online-status"
            :class="{ online: info.onlineStatus === 'online', busy: info.onlineStatus === 'busy' }">
            {{ info.onlineStatus === 'online' ? '在线' : (info.onlineStatus === 'busy' ? '接单中' : '离线') }}
          </view>
        </view>

        <!-- 昵称：查看/编辑 -->
        <view class="name-row">
          <input v-if="isEdit" v-model="info.nickname" class="name-input" placeholder="请输入昵称" maxlength="20" />
          <text v-else class="name">{{ info.nickname }}</text>
          <view class="vip-badge" v-if="info.isVip">
            <uni-icons type="vip-filled" size="14" color="#FFD700"></uni-icons>
            <text>VIP</text>
          </view>
        </view>

        <view class="stats-row">
          <view class="stat-item">
            <uni-icons type="star-filled" size="14" color="#FFB800"></uni-icons>
            <text class="stat-value">{{ info.rating }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">已接</text>
            <text class="stat-value">{{ info.orderCount }}</text>
            <text class="stat-label">单</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">好评率</text>
            <text class="stat-value">{{ info.goodRate }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 服务标签（可编辑） -->
    <view class="tags-section">
      <view v-if="isEdit" class="edit-tag-box">
        <view class="tag" v-for="(tag, idx) in info.tags" :key="idx" @tap="delTag(idx)">
          {{ tag }} ×
        </view>
        <input v-model="tagText" class="tag-input" placeholder="添加标签" @confirm="addTag" />
      </view>
      <view v-else class="tag" v-for="tag in info.tags" :key="tag">{{ tag }}</view>
    </view>

    <!-- 服务价格（可编辑） -->
    <view class="services-section">
      <view class="section-title">
        我的服务
        <view class="tips">（服务类型：线上）</view>
      </view>
      <view class="service-list">
        <view class="service-item" v-for="service in myServices" :key="service.id">
          <view class="service-info">
            <text class="service-name">{{ service.serviceTypeName }}</text>
            <text class="service-desc">{{ service.gameName }}</text>
          </view>
          <!-- 后端 PUT /companion/my-info 暂不支持逐条修改服务价格，此处仅展示 -->
          <view class="service-price">
            <text class="price">¥{{ service.price }}</text>
            <text class="unit">/{{ service.priceUnit || '局' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 个人简介（可编辑） -->
    <view class="intro-section">
      <view class="section-title">个人简介</view>
      <textarea v-if="isEdit" v-model="info.intro" class="intro-input" placeholder="介绍一下自己~" maxlength="200"></textarea>
      <text v-else class="intro-text">{{ info.intro || '这个人很懒，什么都没留下~' }}</text>
    </view>

    <!-- 相册/背景图（查看用） -->
    <view class="gallery-section" v-if="info.gallery?.length || info.images?.length">
      <view class="section-title">相册</view>
      <scroll-view scroll-x class="gallery-scroll">
        <image v-for="(img, index) in (info.gallery || info.images || [])" :key="index"
          :src="typeof img === 'string' ? img : img.url" mode="aspectFill" class="gallery-image"></image>
      </scroll-view>
    </view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-bar">
    <button class="edit-btn" v-if="!isEdit" @tap="isEdit = true">
      编辑资料
    </button>
    <button class="save-btn" v-else @tap="saveMyInfo" :disabled="loading">
      {{ loading ? '保存中...' : '保存修改' }}
    </button>
  </view>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { getCompanionProfile, updateCompanionProfile, getCompanionServices } from '@/api/companion'
  import { uploadFiles } from '@/api/file'
  import { useAppStore } from '@/store/app'

  const appStore = useAppStore()
  const mainText = computed(() => appStore.getConfig.mainText)

  // ============= 数据 =============
  const isEdit = ref(false)
  const loading = ref(false)
  const info = ref({})
  const myServices = ref([])
  const tagText = ref('')

  // 轮播背景图
  const bannerList = computed(() => {
    if (info.value.backgroundImages?.length) return info.value.backgroundImages
    if (info.value.gallery?.length) return info.value.gallery
    return [info.value.avatarUrl || info.value.avatar]
  })

  // ============= 加载我的信息 =============
  onMounted(async () => {
    uni.setNavigationBarTitle({
      title: `我的${mainText.value}师信息`
    })
    loadMyInfo()
  })

  const loadMyInfo = async () => {
    const res = await getCompanionProfile()
    if (res.code === 200) {
      info.value = res.data
      if (res.data.id) await loadServices(res.data.id)
    }
  }

  const loadServices = async (id) => {
    try {
      const res = await getCompanionServices(id)
      if (res.code === 200) {
        myServices.value = res.data || []
      }
    } catch (error) {
      console.error('获取服务失败', error)
      uni.showToast({ title: '服务加载失败', icon: 'none' })
    }
  }

  // ============= 标签编辑 =============
  const addTag = () => {
    const t = tagText.value.trim()
    if (!t) return
    if (info.value.tags?.includes(t)) return

    if ((info.value.tags || []).length === 0) {
      info.value.tags = [t]
    } else {
      info.value.tags.push(t)
    }
    tagText.value = ''
  }
  const delTag = (idx) => {
    info.value.tags.splice(idx, 1)
  }

  // ============= 保存 =============
  const saveMyInfo = async () => {
    loading.value = true
    try {
      // 对应后端 UpdateCompanionInfoRequest，仅支持 nickname / bio / tags（简介字段后端为 bio）
      const params = {
        nickname: info.value.nickname,
        bio: info.value.intro,
        tags: info.value.tags
      }
      const res = await updateCompanionProfile(params)
      if (res.code === 200) {
        uni.showToast({ title: '保存成功', icon: 'success' })
        isEdit.value = false
        loadMyInfo()
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  /* 完全沿用你原页面的样式 */
  .companion-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 120rpx;
  }

  .companion-header {
    position: relative;
    height: 400rpx;
    overflow: hidden;

    .bg-swiper {
      width: 100%;
      height: 100%;
    }

    .bg-image {
      width: 100%;
      height: 100%;
    }

    .header-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
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
      }

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
        background: rgba(0, 0, 0, 0.5);
        font-size: 24rpx;
      }

      .name-row {
        margin-bottom: 16rpx;
        display: flex;
        align-items: center;
      }

      .name {
        font-size: 36rpx;
        font-weight: bold;
        margin-right: 16rpx;
        color: #fff;
      }

      .name-input {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        background: none;
        border-bottom: 1rpx solid #fff;
        padding: 0 4rpx;
      }

      .vip-badge {
        display: flex;
        align-items: center;
        padding: 4rpx 12rpx;
        background: rgba(255, 215, 0, 0.2);
        border-radius: 20rpx;
        border: 1rpx solid rgba(255, 215, 0, 0.5);

        text {
          color: #FFD700;
          font-size: 20rpx;
          margin-left: 4rpx;
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

  .game-tags-section,
  .tags-section,
  .services-section,
  .intro-section,
  .gallery-section {
    background: #fff;
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
    }
  }

  .tags-section {
    display: flex;
    flex-wrap: wrap;

    .tag {
      padding: 8rpx 20rpx;
      margin: 0 16rpx 16rpx 0;
      background: #f0f0f0;
      color: #666;
      font-size: 24rpx;
      border-radius: 8rpx;
    }

    .edit-tag-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .tag-input {
      padding: 10rpx 16rpx;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
      font-size: 26rpx;
      width: 200rpx;
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

      .price-edit-box {
        display: flex;
        align-items: center;
        color: #3b82f6;
        font-size: 32rpx;

        .price-input {
          width: 100rpx;
          border: 1rpx solid #3b82f6;
          border-radius: 6rpx;
          text-align: center;
          margin: 0 8rpx;
          font-size: 28rpx;
        }
      }
    }
  }

  .intro-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }

  .intro-input {
    width: 100%;
    height: 120rpx;
    border: 1rpx solid #eee;
    border-radius: 12rpx;
    padding: 16rpx;
    font-size: 26rpx;
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

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 99;

    .edit-btn,
    .save-btn {
      width: 100%;
      height: 88rpx;
      border-radius: 44rpx;
      font-size: 30rpx;
    }

    .edit-btn {
      background: #fff;
      color: #3b82f6;
      border: 1rpx solid #3b82f6;
    }

    .save-btn {
      background: #3b82f6;
      color: #fff;
    }
  }
</style>