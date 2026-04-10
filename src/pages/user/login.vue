<template>
  <view class="login-page">
    <view class="login-container">
      <!-- Logo -->
      <view class="logo-section">
        <image src="/static/logo.png" mode="aspectFit" class="logo"></image>
        <text class="app-name">木子陪玩</text>
        <text class="app-slogan">专业游戏陪玩平台</text>
      </view>

      <!-- 微信登录 -->
      <!-- <view class="wechat-login-section">
        <view class="login-title">微信一键登录</view>
        <button class="wechat-login-btn" @tap="handleWechatLogin" :loading="loading">
          <uni-icons type="weixin" size="24" color="#fff"></uni-icons>
          <text>微信登录</text>
        </button>
      </view> -->

      <!-- 其他登录方式 -->
      <view class="other-login-section">
        <view class="divider">
          <text class="divider-text">手机号一键登录</text>
        </view>

        <!-- 手机号登录 -->
        <view class="phone-login-btn" @tap="goToPhoneLogin">
          <uni-icons type="phone" size="24" color="#3b82f6"></uni-icons>
          <text>手机号登录</text>
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement-section">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="agreed" color="#3b82f6" />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @tap.stop="viewAgreement('service')">《用户协议》</text>
              和
              <text class="link" @tap.stop="viewAgreement('privacy')">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { loginByWechat } from '@/api/user'

const loading = ref(false)
const agreed = ref(false)

const handleWechatLogin = async () => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    // 获取微信登录授权码
    const res = await uni.login({
      provider: 'weixin'
    })

    if (res[1].code) {
      // 调用登录接口
      const loginRes = await loginByWechat({
        code: res[1].code
      })

      if (loginRes.code === 200) {
        // 保存token
        uni.setStorageSync('token', loginRes.data.token)
        uni.setStorageSync('userInfo', loginRes.data.userInfo)

        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        uni.showToast({
          title: loginRes.message || '登录失败',
          icon: 'none'
        })
      }
    } else {
      uni.showToast({
        title: '获取微信授权码失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('微信登录失败', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goToPhoneLogin = () => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }

  uni.navigateTo({
    url: '/pages/user/phone-login'
  })
}

const handleAgreementChange = (e) => {
  agreed.value = e.detail.value.includes('agree')
}

const viewAgreement = (type) => {
  uni.navigateTo({
    url: `/pages/user/agreement?type=${type}`
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-container {
  width: 100%;
  max-width: 600rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 32rpx;
    background-color: #fff;
    margin-bottom: 30rpx;
  }

  .app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.wechat-login-section {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);

  .login-title {
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
  }

  .wechat-login-btn {
    width: 100%;
    height: 90rpx;
    background-color: #07c160;
    color: #fff;
    border-radius: 45rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    border: none;

    &::after {
      border: none;
    }

    text {
      margin-left: 16rpx;
    }
  }
}

.other-login-section {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 40rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
    }

    .divider-text {
      position: relative;
      background-color: #fff;
      padding: 0 20rpx;
      color: #999;
      font-size: 24rpx;
      z-index: 1;
    }
  }

  .phone-login-btn {
    width: 100%;
    height: 90rpx;
    border: 2rpx solid #3b82f6;
    border-radius: 45rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    font-size: 32rpx;
    transition: all 0.3s;

    &:active {
      background-color: #f0f9ff;
    }

    text {
      margin-left: 16rpx;
    }
  }
}

.agreement-section {
  padding: 0 20rpx;

  .agreement-label {
    display: flex;
    align-items: flex-start;

    .agreement-text {
      margin-left: 10rpx;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;

      .link {
        color: #fff;
        text-decoration: underline;
      }
    }
  }
}
</style>
