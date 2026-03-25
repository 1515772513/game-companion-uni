/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { wxLogin, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    refreshToken: '',
    userInfo: null,
    isLogin: false
  }),

  getters: {
    // 用户ID
    userId: (state) => state.userInfo?.id || '',

    // 用户昵称
    userName: (state) => state.userInfo?.name || '',

    // 用户头像
    userAvatar: (state) => state.userInfo?.avatar || '',

    // 是否是陪玩师
    isCompanion: (state) => state.userInfo?.isCompanion || false
  },

  actions: {
    /**
     * 微信登录
     */
    async login(code) {
      try {
        const res = await wxLogin(code)
        this.token = res.token
        this.refreshToken = res.refreshToken
        this.userInfo = res.userInfo
        this.isLogin = true

        // 保存到本地存储
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('refreshToken', res.refreshToken)
        uni.setStorageSync('userInfo', res.userInfo)

        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    /**
     * 获取用户信息
     */
    async fetchUserInfo() {
      try {
        const userInfo = await getUserInfo()
        this.userInfo = userInfo
        uni.setStorageSync('userInfo', userInfo)
        return userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    /**
     * 更新用户信息
     */
    updateUserInfo(userInfo) {
      this.userInfo = {
        ...this.userInfo,
        ...userInfo
      }
      uni.setStorageSync('userInfo', this.userInfo)
    },

    /**
     * 退出登录
     */
    logout() {
      this.token = ''
      this.refreshToken = ''
      this.userInfo = null
      this.isLogin = false

      // 清除本地存储
      uni.removeStorageSync('token')
      uni.removeStorageSync('refreshToken')
      uni.removeStorageSync('userInfo')

      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/user/login'
      })
    },

    /**
     * 检查登录状态
     */
    checkLogin() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')

      if (token && userInfo) {
        this.token = token
        this.refreshToken = uni.getStorageSync('refreshToken')
        this.userInfo = userInfo
        this.isLogin = true
        return true
      }

      return false
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: {
          getItem: (key) => uni.getStorageSync(key),
          setItem: (key, value) => uni.setStorageSync(key, value)
        }
      }
    ]
  }
})
