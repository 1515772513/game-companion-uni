<template>
  <view class="login-page">
    <view class="login-content">
      <!-- Logo -->
      <view class="logo-section">
        <image class="logo-image" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="logo-text">游戏陪玩</text>
      </view>

      <!-- 登录按钮 -->
      <view class="login-actions">
        <button class="login-btn" @click="handleWxLogin">
          <uni-icons type="weixin" size="20" color="#fff"></uni-icons>
          <text>微信快速登录</text>
        </button>
      </view>

      <!-- 用户协议 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="isAgreed" color="#FF6B00" />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click.stop="handleUserProtocol">《用户协议》</text>
              和
              <text class="link" @click.stop="handlePrivacyPolicy">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const isAgreed = ref(false)

// 微信登录
const handleWxLogin = async () => {
  // 检查是否同意协议
  if (!isAgreed.value) {
    uni.showToast({
      title: '请先阅读并同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }

  try {
    // 获取微信登录code
    const loginRes = await uni.login({
      provider: 'weixin'
    })

    if (loginRes[1].code) {
      // 调用登录接口
      const res = await userStore.login(loginRes[1].code)

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 延迟跳转
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    } else {
      throw new Error('获取微信登录code失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'none'
    })
  }
}

// 协议勾选
const handleAgreementChange = (e) => {
  isAgreed.value = e.detail.value.includes('agree')
}

// 用户协议
const handleUserProtocol = () => {
  console.log('查看用户协议')
}

// 隐私政策
const handlePrivacyPolicy = () => {
  console.log('查看隐私政策')
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
}

.login-content {
  width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 120rpx;
}

.logo-image {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
  border-radius: 50%;
  background-color: #fff;
}

.logo-text {
  font-size: 40rpx;
  font-weight: 500;
  color: #fff;
}

.login-actions {
  width: 100%;
  margin-bottom: 60rpx;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90rpx;
  background-color: #07c160;
  border-radius: 45rpx;
  font-size: 32rpx;
  color: #fff;
  border: none;
}

.login-btn::after {
  border: none;
}

.login-btn text {
  margin-left: 10rpx;
}

.agreement {
  width: 100%;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
}

.agreement-text {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.link {
  color: #fff;
  text-decoration: underline;
}
</style>
