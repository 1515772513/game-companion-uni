<template>
  <view class="create-order-page">
    <!-- 陪玩师信息 -->
    <view class="companion-section">
      <image :src="companionInfo.avatar" mode="aspectFill" class="companion-avatar"></image>
      <view class="info">
        <text class="name">{{ companionInfo.nickname }}</text>
        <text class="service">{{ selectedService?.serviceTypeName }}</text>
      </view>
      <view class="price">¥{{ selectedService?.price }}</view>
    </view>

    <!-- 服务信息 -->
    <view class="service-section">
      <view class="section-title">服务信息</view>
      <view class="info-row">
        <text class="label">服务类型</text>
        <text class="value">{{ selectedService?.serviceTypeName }}</text>
      </view>
      <view class="info-row">
        <text class="label">服务价格</text>
        <text class="value price">¥{{ selectedService?.price }}/{{ selectedService?.priceUnit }}</text>
      </view>
    </view>

    <!-- 预约时间 -->
    <view class="appointment-section" v-if="false">
      <view class="section-title">预约时间</view>
      <picker mode="date" :value="appointmentDate" @change="onDateChange">
        <view class="picker-row">
          <text class="label">选择日期</text>
          <view class="value">
            <text>{{ appointmentDate || '请选择日期' }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </picker>
      <picker mode="time" :value="appointmentTime" @change="onTimeChange">
        <view class="picker-row">
          <text class="label">选择时间</text>
          <view class="value">
            <text>{{ appointmentTime || '请选择时间' }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </picker>
    </view>

    <!-- 服务时长 -->
    <view class="duration-section">
      <view class="section-title">服务规格</view>
      <view class="duration-options">
        <view
          class="duration-item"
          v-for="item in gameRoundOptions"
          :key="item.value"
          :class="{ active: duration === item.value }"
          @tap="selectDuration(item.value)"
        >
          <text class="duration-text">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <view class="section-title">备注</view>
      <textarea
        v-model="remark"
        placeholder="请输入备注信息（选填）"
        class="remark-input"
        maxlength="200"
      ></textarea>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-section" @tap="selectCoupon">
      <view class="section-left">
        <text class="section-title">优惠券</text>
        <text class="coupon-count" v-if="availableCoupons.length > 0">{{ availableCoupons.length }}张可用</text>
      </view>
      <view class="section-right">
        <text class="coupon-text" v-if="selectedCoupon">-¥{{ selectedCoupon.discount }}</text>
        <text class="coupon-text placeholder" v-else>暂无可用</text>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail-section">
      <view class="price-row">
        <text class="label">服务费用</text>
        <text class="value">¥{{ servicePrice }}</text>
      </view>
      <view class="price-row" v-if="selectedCoupon">
        <text class="label">优惠券</text>
        <text class="value discount">-¥{{ selectedCoupon.discount }}</text>
      </view>
      <view class="price-row total">
        <text class="label">合计</text>
        <text class="value">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 底部提交栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
      <button class="submit-btn" @tap="submitOrder" :disabled="submitting">提交订单</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCompanionDetail, getCompanionServices } from '@/api/companion'
import { calculateOrderPrice, createOrder } from '@/api/order'
import { getAvailableCoupons } from '@/api/user'

const companionId = ref('')
const serviceId = ref('')
const companionInfo = ref({})
const selectedService = ref(null)
const appointmentDate = ref('')
const appointmentTime = ref('')
const duration = ref(1)
const remark = ref('')
const selectedCoupon = ref(null)
const availableCoupons = ref([])
const submitting = ref(false)

const gameRoundOptions = ref([])

const servicePrice = computed(() => {
  if (!selectedService.value) return 0
  return (selectedService.value.price * duration.value).toFixed(2)
})

const totalPrice = computed(() => {
  let price = parseFloat(servicePrice.value)
  if (selectedCoupon.value) {
    price -= selectedCoupon.value.discount
  }
  return Math.max(0, price).toFixed(2)
})

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

  companionId.value = options.companionId
  serviceId.value = options.serviceId

  await loadCompanionInfo()
  await loadServices()
  await loadCoupons()

  // 设置默认日期时间为明天
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  appointmentDate.value = tomorrow.toISOString().split('T')[0]
  appointmentTime.value = '10:00'
})

// 加载游戏局数列表
// const loadGameRoundounds = async () => {
//   if (!selectedGame.value.id) return
  
//   try {
//     const res = await getDictList(`game_level_${selectedGame.value.id}`)
//     if (res.code === 200) {
//       levelOptions.value = [
//         { id: '', name: '全部等级' },
//         ...((res.data || []).map(item => ({ id: item.dictValue, name: item.dictLabel })))
//       ]
//       // 加载完数据后，默认选中第一项
//       selectedLevel.value = levelOptions.value[0]
//     }
//   } catch (error) {
//     console.error('加载等级列表失败', error)
//   }
// }

const loadCompanionInfo = async () => {
  try {
    const res = await getCompanionDetail(companionId.value)
    if (res.code === 200) {
      companionInfo.value = res.data
    }
  } catch (error) {
    console.error('获取信息失败', error)
  }
}

const loadServices = async () => {
  try {
    const res = await getCompanionServices(companionId.value)
    if (res.code === 200) {
      const services = res.data
      selectedService.value = services.find(s => s.id == serviceId.value) || services[0]
    }
  } catch (error) {
    console.error('获取服务列表失败', error)
  }
}

const loadCoupons = async () => {
  try {
    const res = await getAvailableCoupons({
      amount: parseFloat(servicePrice.value),
      type: 'companion'
    })
    if (res.code === 200) {
      availableCoupons.value = res.data || []
    }
  } catch (error) {
    console.error('获取优惠券失败', error)
  }
}

const onDateChange = (e) => {
  appointmentDate.value = e.detail.value
}

const onTimeChange = (e) => {
  appointmentTime.value = e.detail.value
}

const selectDuration = (value) => {
  duration.value = value
}

const selectCoupon = () => {
  if (availableCoupons.value.length === 0) {
    uni.showToast({
      title: '暂无可用优惠券',
      icon: 'none'
    })
    return
  }

  uni.navigateTo({
    url: '/pages/order/coupon?coupons=' + JSON.stringify(availableCoupons.value)
  })
}

const submitOrder = async () => {
  if (!appointmentDate.value || !appointmentTime.value) {
    uni.showToast({
      title: '请选择预约时间',
      icon: 'none'
    })
    return
  }

  submitting.value = true

  try {
    const data = {
      companionId: companionId.value,
      serviceId: selectedService.value.id,
      quantity: duration.value,
      appointmentTime: `${appointmentDate.value} ${appointmentTime.value}`,
      remark: remark.value
    }

    if (selectedCoupon.value) {
      data.couponId = selectedCoupon.value.id
    }

    const res = await createOrder(data)

    if (res.code === 200) {
      uni.showToast({
        title: '下单成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/order/payment?id=${res.data.orderId}`
        })
      }, 1500)
    } else {
      uni.showToast({
        title: res.message || '下单失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('创建订单失败', error)
    uni.showToast({
      title: '下单失败，请重试',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.create-order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.companion-section, .service-section, .appointment-section, .duration-section, .remark-section, .coupon-section, .price-detail-section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
}

.companion-section {
  display: flex;
  align-items: center;

  .companion-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
  }

  .info {
    flex: 1;

    .name {
      display: block;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .service {
      font-size: 24rpx;
      color: #999;
    }
  }

  .price {
    font-size: 36rpx;
    font-weight: bold;
    color: #3b82f6;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;

  .label {
    font-size: 26rpx;
    color: #666;
  }

  .value {
    font-size: 26rpx;
    color: #333;

    &.price {
      color: #3b82f6;
      font-weight: bold;
    }
  }
}

.picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 26rpx;
    color: #666;
  }

  .value {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 26rpx;
  }
}

.duration-options {
  display: flex;
  flex-wrap: wrap;

  .duration-item {
    width: 210rpx;
    height: 80rpx;
    border: 2rpx solid #e5e5e5;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    margin-bottom: 20rpx;

    &:nth-child(3n) {
      margin-right: 0;
    }

    .duration-text {
      font-size: 28rpx;
      color: #666;
    }

    &.active {
      border-color: #3b82f6;
      background-color: #f0f9ff;

      .duration-text {
        color: #3b82f6;
        font-weight: bold;
      }
    }
  }
}

.remark-input {
  width: 100%;
  min-height: 160rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333;
}

.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-left {
    display: flex;
    flex-direction: column;

    .coupon-count {
      font-size: 24rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }

  .section-right {
    display: flex;
    align-items: center;

    .coupon-text {
      font-size: 26rpx;
      margin-right: 10rpx;

      &.placeholder {
        color: #999;
      }
    }
  }
}

.price-detail-section {
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;

    .label {
      font-size: 26rpx;
      color: #666;
    }

    .value {
      font-size: 26rpx;
      color: #333;

      &.discount {
        color: #ff4d4f;
      }
    }

    &.total {
      border-top: 1rpx solid #f0f0f0;
      padding-top: 20rpx;
      margin-top: 10rpx;

      .label {
        font-size: 28rpx;
        font-weight: bold;
      }

      .value {
        font-size: 36rpx;
        color: #3b82f6;
        font-weight: bold;
      }
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

  .price-info {
    .total-label {
      font-size: 26rpx;
      color: #333;
    }

    .total-price {
      font-size: 40rpx;
      font-weight: bold;
      color: #3b82f6;
    }
  }

  .submit-btn {
    width: 300rpx;
    height: 80rpx;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
    border: none;
    margin: 0;

    &::after {
      border: none;
    }

    &[disabled] {
      background-color: #ccc;
    }
  }
}
</style>
