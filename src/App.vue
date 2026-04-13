<template>
  <view>
    <router-view  class="page-container"/>
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

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
