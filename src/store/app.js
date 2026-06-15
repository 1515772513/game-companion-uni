import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 系统信息
    systemInfo: null,
    // 主题色
    themeColor: '#3b82f6',
    // 页面加载状态
    loading: false,
    // 网络状态
    networkType: 'unknown',
    // 是否在线
    isOnline: true,
    // 当前页面路径
    currentPage: '',
    // 页面栈
    pageStack: [],
    // 全局配置
    config: {
      // 上传文件URL
      uploadURL: 'https://api.example.com/upload',
      // 停机维护 0: 不维护 1: 维护
      isMaintenance: 1,
      // 主体文案维护
      mainText: '游戏',
      // 手机号登录默认方式开关：'password'-密码登录(默认) | 'code'-验证码登录
      loginMode: 'password',
    },
    // 用户协议版本
    agreementVersion: '1.0.0',
    // 隐私政策版本
    privacyVersion: '1.0.0'
  }),

  getters: {
    // 获取系统信息
    getSystemInfoState: (state) => state.systemInfo,
    // 获取主题色
    getThemeColor: (state) => state.themeColor,
    // 获取加载状态
    getLoading: (state) => state.loading,
    // 获取网络状态
    networkTypeState: (state) => state.networkType,
    // 判断是否在线
    getIsOnline: (state) => state.isOnline,
    // 获取配置
    getConfig: (state) => state.config
  },

  actions: {
    // 设置主题色
    setThemeColor(color) {
      this.themeColor = color
      uni.setStorageSync('themeColor', color)
    },

    // 设置加载状态
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

    // 获取系统信息
    async getSystemInfo() {
      try {
        const res = await uni.getSystemInfo()
        this.systemInfo = res
        return res
      } catch (error) {
        console.error('获取系统信息失败:', error)
        return null
      }
    },

    // 获取网络类型
    async getNetworkType() {
      try {
        const res = await uni.getNetworkType()
        this.networkType = res.networkType
        this.isOnline = res.networkType !== 'none'
        return res
      } catch (error) {
        console.error('获取网络状态失败:', error)
        return null
      }
    },

    // 监听网络状态变化
    watchNetworkStatus() {
      uni.onNetworkStatusChange((res) => {
        this.networkType = res.networkType
        this.isOnline = res.isConnected
      })
    },

    // 设置当前页面
    setCurrentPage(page) {
      this.currentPage = page
      // 避免重复页面入栈
      if (this.pageStack[this.pageStack.length - 1] !== page) {
        this.pageStack.push(page)
      }
      // 限制栈大小
      if (this.pageStack.length > 10) {
        this.pageStack.shift()
      }
    },

    // 返回上一页
    goBack(delta = 1) {
      const pages = getCurrentPages()
      if (pages.length > delta) {
        // 从页面栈中移除
        for (let i = 0; i < delta; i++) {
          this.pageStack.pop()
        }
        uni.navigateBack({ delta })
      }
    },

    // 显示提示
    showToast(options) {
      uni.showToast({
        title: options.title || '提示',
        icon: options.icon || 'none',
        duration: options.duration || 2000,
        mask: options.mask || false
      })
    },

    // 显示模态对话框
    showModal(options) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: options.title || '提示',
          content: options.content || '',
          showCancel: options.showCancel !== false,
          cancelText: options.cancelText || '取消',
          confirmText: options.confirmText || '确定',
          success: (res) => {
            if (res.confirm) {
              resolve(true)
            } else {
              resolve(false)
            }
          },
          fail: reject
        })
      })
    },

    // 显示操作菜单
    showActionSheet(options) {
      return new Promise((resolve, reject) => {
        uni.showActionSheet({
          itemList: options.itemList || [],
          itemColor: options.itemColor || '#3b82f6',
          success: (res) => {
            resolve(res.tapIndex)
          },
          fail: reject
        })
      })
    },

    // 设置配置
    setConfig(config) {
      this.config = { ...this.config, ...config }
    },

    // 初始化应用
    async init() {
      // 获取系统信息
      await this.getSystemInfo()

      // 获取网络状态
      await this.getNetworkType()

      // 监听网络状态
      this.watchNetworkStatus()

      // 恢复主题色
      const savedThemeColor = uni.getStorageSync('themeColor')
      if (savedThemeColor) {
        this.themeColor = savedThemeColor
      }

      console.log('应用初始化完成')
    }
  }
})
