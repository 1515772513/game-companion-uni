<template>
  <view>
    <router-view  class="page-container"/>
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { getSystemConfig } from '@/api/home'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'

const userStore = useUserStore()
const appStore = useAppStore()

onLaunch(() => {
  console.log('App Launch')

  uni.getSystemInfo({
    success: function (res) {
      // px转换到rpx的比例
      const pxToRpxScale = 750 / res.windowWidth
      const systems = {
        ktxStatusHeight: res.statusBarHeight * pxToRpxScale, // 状态栏的高度
        navigationHeight: 44 * pxToRpxScale, // 导航栏的高度
        ktxWindowWidth: res.windowWidth * pxToRpxScale, // window的宽度
        ktxWindowHeight: res.windowHeight * pxToRpxScale, // window的高度
        ktxScreentHeight: res.screenHeight * pxToRpxScale // 屏幕的高度
      }
      const app = createApp()
      app.config.globalProperties.$system = systems
      app.config.globalProperties.$lineHeight = systems.ktxStatusHeight + systems.navigationHeight
      provide('$system', systems)
      provide('$lineHeight', systems.ktxStatusHeight + systems.navigationHeight)
    }
  })

  // 获取系统配置
  getSystemConfig().then(res => {
    appStore.setConfig(res.data)
  })

  if (uni.getStorageSync('userInfo')) {
    userStore.restoreUserInfo(uni.getStorageSync('userInfo'))
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import './static/styles/global.scss';
</style>
