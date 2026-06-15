<template>
  <view class="login-page" :style="{ height: pageHeight + 'px' }">
    <view class="login-container">
      <!-- Logo -->
      <view class="logo-section">
        <image src="/static/logo.png" mode="aspectFit" class="logo"></image>
        <text class="app-name">木子{{ mainText }}</text>
        <text class="app-slogan">专业游戏{{ mainText }}平台</text>
      </view>

      <!-- 微信登录（仅微信小程序环境显示） -->
      <view class="wechat-login-section" v-if="isWechatEnv">
        <view class="login-title">微信一键登录</view>
        <button class="wechat-login-btn" @tap="handleWechatLogin" :loading="loading">
          <uni-icons type="weixin" size="24" color="#fff"></uni-icons>
          <text>微信登录</text>
        </button>
      </view>

      <!-- 手机号登录（非微信环境只显示此项），支持密码 / 验证码两种方式 -->
      <view class="phone-login-section">
        <view class="divider" v-if="isWechatEnv">
          <text class="divider-text">{{ loginTitle }}</text>
        </view>
        <view class="login-title" v-else>{{ loginTitle }}</view>

        <!-- 手机号 -->
        <view class="form-item">
          <uni-icons type="phone" size="20" color="#999"></uni-icons>
          <input
            class="form-input"
            type="number"
            maxlength="11"
            v-model="phone"
            placeholder="请输入手机号"
            placeholder-class="form-placeholder"
          />
        </view>

        <!-- 密码登录 -->
        <view class="form-item" v-if="loginType === 'password'">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input
            class="form-input"
            type="text"
            password
            maxlength="20"
            v-model="password"
            placeholder="请输入密码"
            placeholder-class="form-placeholder"
          />
        </view>

        <!-- 验证码登录 -->
        <view class="form-item" v-else>
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input
            class="form-input"
            type="number"
            maxlength="6"
            v-model="code"
            placeholder="请输入验证码"
            placeholder-class="form-placeholder"
          />
          <button
            class="code-btn"
            :class="{ disabled: countdown > 0 }"
            :disabled="countdown > 0"
            @tap="handleSendCode"
          >
            {{ countdown > 0 ? countdown + 's后重发' : '获取验证码' }}
          </button>
        </view>

        <button class="phone-submit-btn" :loading="phoneLoading" @tap="handlePhoneLogin">
          登录 / 注册
        </button>

        <!-- 切换登录方式 -->
        <view class="switch-login-type" @tap="toggleLoginType">
          {{ loginType === 'password' ? '使用验证码登录' : '使用密码登录' }}
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement-section">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox class="agreement-checkbox" value="agree" :checked="agreed" color="#3b82f6" />
            <view class="agreement-text">
              我已阅读并同意
              <text class="link" @tap.stop="viewAgreement('service')">《用户协议》</text>
              和
              <text class="link" @tap.stop="viewAgreement('privacy')">《隐私政策》</text>
            </view>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { sendSmsCode } from '@/api/user.js'
import { validatePhone } from '@/utils/common'

const appStore = useAppStore()

// 计算属性
const mainText = computed(() => {
  return appStore.getConfig.mainText
})

const userStore = useUserStore()

const loading = ref(false)
const agreed = ref(false)

// 是否处于微信环境（仅微信小程序支持微信一键登录）
const isWechatEnv = ref(false)
// #ifdef MP-WEIXIN
isWechatEnv.value = true
// #endif

// 手机号登录相关状态
const phone = ref('')
const code = ref('')
const password = ref('')
const phoneLoading = ref(false)
const countdown = ref(0)
let countdownTimer = null

// 登录方式：'password'-密码登录 | 'code'-验证码登录，默认取全局配置（默认密码登录）
const loginType = ref(appStore.getConfig.loginMode === 'code' ? 'code' : 'password')

const loginTitle = computed(() => {
  return loginType.value === 'password' ? '账号密码登录' : '手机验证码登录'
})

// 切换登录方式
const toggleLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'code' : 'password'
}

// 计算属性 pageHeight
const pageHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})

// 登录成功后跳转：优先返回上一页，无上一页则回到首页，避免卡在登录页
const goAfterLogin = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

// 微信一键登录
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
    const userInfo = await uni.getUserProfile({
      desc: '用于登录'
    })

    console.log('获取用户信息成功', userInfo)

    const loginRes = await uni.login()
    const wxCode = loginRes.code

    if (!wxCode) {
      uni.showToast({ title: '获取微信授权失败', icon: 'none' })
      return
    }

    const res = await userStore.loginWechat({
      openid: wxCode,
      nickName: userInfo.userInfo.nickName,
      avatar: userInfo.userInfo.avatarUrl
    })

    if (res.success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      setTimeout(goAfterLogin, 1500)
    } else {
      uni.showToast({
        title: res.message || '登录失败',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('登录错误', err)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 启动验证码倒计时
const startCountdown = (seconds = 60) => {
  countdown.value = seconds
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

// 获取短信验证码
const handleSendCode = async () => {
  if (countdown.value > 0) return

  if (!validatePhone(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  try {
    const res = await sendSmsCode({ phone: phone.value, type: 'login' })
    uni.showToast({ title: '验证码已发送', icon: 'none' })
    startCountdown(60)

    // 开发联调：后端返回 debug_code 时自动回填，正式短信接入后后端会移除该字段
    if (res && res.data && res.data.debug_code) {
      code.value = res.data.debug_code
    }
  } catch (err) {
    console.error('发送验证码失败', err)
    // 具体错误已在请求层统一提示
  }
}

// 手机号登录（密码 / 验证码）
const handlePhoneLogin = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议和隐私政策', icon: 'none' })
    return
  }
  if (!validatePhone(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  if (loginType.value === 'password') {
    if (!password.value) {
      uni.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
  } else {
    if (!code.value) {
      uni.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
  }

  phoneLoading.value = true
  try {
    const res = loginType.value === 'password'
      ? await userStore.loginByPassword({ phone: phone.value, password: password.value })
      : await userStore.loginByCode({ phone: phone.value, code: code.value })

    if (res.success) {
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(goAfterLogin, 1500)
    } else {
      uni.showToast({ title: res.message || '登录失败', icon: 'none' })
    }
  } finally {
    phoneLoading.value = false
  }
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
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
}

.login-container {
  width: 100%;
  padding-bottom: 200rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

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

.phone-login-section {
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

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 50rpx;

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

  .form-item {
    display: flex;
    align-items: center;
    height: 90rpx;
    padding: 0 24rpx;
    margin-bottom: 30rpx;
    background-color: #f7f8fa;
    border-radius: 45rpx;

    .form-input {
      flex: 1;
      height: 100%;
      margin-left: 16rpx;
      font-size: 30rpx;
      color: #333;
    }

    .form-placeholder {
      color: #bbb;
    }

    .code-btn {
      flex-shrink: 0;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 24rpx;
      margin: 0;
      font-size: 26rpx;
      color: #3b82f6;
      background-color: transparent;
      border-left: 1px solid #e5e5e5;
      border-radius: 0;

      &::after {
        border: none;
      }

      &.disabled {
        color: #bbb;
      }
    }
  }

  .phone-submit-btn {
    width: 100%;
    height: 90rpx;
    margin-top: 10rpx;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
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
  }

  .switch-login-type {
    margin-top: 30rpx;
    text-align: center;
    font-size: 26rpx;
    color: #3b82f6;
  }
}

.agreement-section {
  padding: 0 20rpx;

  .agreement-label {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .agreement-checkbox {
      ::v-deep {
        .uni-checkbox-wrapper {
          position: relative;
          top: -3rpx;
          .uni-checkbox-input {
            width: 36rpx;
            height: 36rpx;
            margin: 0;
          }
        }
      } 
    }

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
