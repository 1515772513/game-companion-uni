/**
 * 应用全局状态管理
 */
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 系统信息
    systemInfo: null,

    // 网络状态
    networkType: 'unknown',

    // 位置信息
    location: null,

    // 未读消息数
    unreadCount: 0,

    // WebSocket 连接状态
    wsConnected: false,

    // 页面加载状态
    loading: false
  }),

  getters: {
    // 是否是 iOS
    isIOS: (state) => {
      return state.systemInfo?.platform === 'ios'
    },

    // 状态栏高度
    statusBarHeight: (state) => {
      return state.systemInfo?.statusBarHeight || 0
    },

    // 导航栏高度
    navigationBarHeight: (state) => {
      const platform = state.systemInfo?.platform || 'android'
      const height = platform === 'ios' ? 44 : 48
      return state.statusBarHeight + height
    },

    // 安全区域
    safeArea: (state) => {
      return state.systemInfo?.safeArea || {}
    },

    // 屏幕宽度
    screenWidth: (state) => {
      return state.systemInfo?.screenWidth || 375
    },

    // 屏幕高度
    screenHeight: (state) => {
      return state.systemInfo?.screenHeight || 667
    }
  },

  actions: {
    /**
     * 初始化系统信息
     */
    initSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.systemInfo = systemInfo
      return systemInfo
    },

    /**
     * 监听网络状态
     */
    watchNetworkStatus() {
      // 获取当前网络类型
      uni.getNetworkType({
        success: (res) => {
          this.networkType = res.networkType
        }
      })

      // 监听网络状态变化
      uni.onNetworkStatusChange((res) => {
        this.networkType = res.networkType

        if (!res.isConnected) {
          uni.showToast({
            title: '网络已断开',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: '网络已连接',
            icon: 'none'
          })
        }
      })
    },

    /**
     * 获取位置信息
     */
    async getLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            this.location = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            resolve(this.location)
          },
          fail: (error) => {
            console.error('获取位置失败:', error)
            reject(error)
          }
        })
      })
    },

    /**
     * 设置加载状态
     */
    setLoading(loading) {
      this.loading = loading

      if (loading) {
        uni.showLoading({
          title: '加载中...',
          mask: true
        })
      } else {
        uni.hideLoading()
      }
    },

    /**
     * 设置未读消息数
     */
    setUnreadCount(count) {
      this.unreadCount = count

      // 设置 tabBar 徽标
      if (count > 0) {
        uni.setTabBarBadge({
          index: 2,
          text: count > 99 ? '99+' : count.toString()
        })
      } else {
        uni.removeTabBarBadge({
          index: 2
        })
      }
    },

    /**
     * 设置 WebSocket 连接状态
     */
    setWsConnected(connected) {
      this.wsConnected = connected
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'app-store',
        storage: {
          getItem: (key) => uni.getStorageSync(key),
          setItem: (key, value) => uni.setStorageSync(key, value)
        },
        paths: ['systemInfo', 'location']
      }
    ]
  }
})
