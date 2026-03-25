<template>
  <view class="login-page">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <view class="login-content">
      <!-- Logo -->
      <view class="logo-section">
        <view class="logo-wrapper">
          <image class="logo-image" src="/static/images/logo.png" mode="aspectFit"></image>
        </view>
        <text class="logo-text">游戏陪玩平台</text>
        <text class="logo-subtitle">专业陪玩 快乐游戏</text>
      </view>

      <!-- 登录按钮 -->
      <view class="login-actions">
        <button class="login-btn wx-login" @click="handleWxLogin">
          <view class="btn-icon">
            <uni-icons type="weixin" size="20" color="#fff"></uni-icons>
          </view>
          <text>微信快速登录</text>
        </button>
      </view>

      <!-- 用户协议 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="isAgreed" color="#3b82f6" />
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
  // TODO: 跳转到用户协议页面
}

// 隐私政策
const handlePrivacyPolicy = () => {
  console.log('查看隐私政策')
  // TODO: 跳转到隐私政策页面
}
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400rpx;
  height: 400rpx;
  top: -100rpx;
  right: -100rpx;
}

.circle-2 {
  width: 300rpx;
  height: 300rpx;
  bottom: 200rpx;
  left: -100rpx;
}

.circle-3 {
  width: 200rpx;
  height: 200rpx;
  bottom: -50rpx;
  right: 100rpx;
}

/* 登录内容 */
.login-content {
  position: relative;
  z-index: 10;
  width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 120rpx;
}

.logo-wrapper {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 40rpx;
  padding: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10rpx);
}

.logo-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
}

.logo-text {
  font-size: 44rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12rpx;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 4rpx;
}

/* 登录按钮 */
.login-actions {
  width: 100%;
  margin-bottom: 60rpx;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  font-size: 32rpx;
  color: #fff;
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;

  &.wx-login {
    background-color: #07c160;

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    }
  }
}

.login-btn::after {
  border: none;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12rpx;
}

.login-btn text {
  font-weight: 500;
}

/* 协议 */
.agreement {
  width: 100%;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
}

.agreement-text {
  flex: 1;
  margin-left: 12rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.link {
  color: #fff;
  font-weight: 500;
  text-decoration: underline;
}
</style>
