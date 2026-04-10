import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: null,
    // 用户token
    token: '',
    // 用户ID
    userId: null,
    // 用户昵称
    nickname: '',
    // 用户头像
    avatar: '',
    // 手机号
    phone: '',
    // 是否登录
    isLogin: false
  }),

  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
    // 获取token
    getToken: (state) => state.token,
    // 判断是否登录
    getIsLogin: (state) => state.isLogin
  },

  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      if (userInfo) {
        this.userId = userInfo.id
        this.nickname = userInfo.nickname
        this.avatar = userInfo.avatar
        this.phone = userInfo.phone
        this.isLogin = true
      }
    },

    // 设置token
    setToken(token) {
      this.token = token
      this.isLogin = !!token
      // 持久化存储
      if (token) {
        uni.setStorageSync('token', token)
      } else {
        uni.removeStorageSync('token')
      }
    },

    // 从本地存储恢复token
    restoreToken() {
      const token = uni.getStorageSync('token')
      if (token) {
        this.token = token
        this.isLogin = true
      }
    },

    // 登录
    async login(loginData) {
      try {
        // 这里调用登录API
        // const res = await loginApi(loginData)
        // 模拟登录成功
        const mockData = {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            id: '1',
            nickname: '游戏玩家',
            avatar: '/static/images/default-avatar.png',
            phone: loginData.phone || '13800138000'
          }
        }

        this.setToken(mockData.token)
        this.setUserInfo(mockData.userInfo)

        // 持久化用户信息
        uni.setStorageSync('userInfo', mockData.userInfo)

        return { success: true, data: mockData }
      } catch (error) {
        console.error('登录失败:', error)
        return { success: false, message: error.message }
      }
    },

    // 退出登录
    logout() {
      this.userInfo = null
      this.token = ''
      this.userId = null
      this.nickname = ''
      this.avatar = ''
      this.phone = ''
      this.isLogin = false

      // 清除本地存储
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')

      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      })
    },

    // 从本地恢复用户信息
    restoreUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.setUserInfo(userInfo)
      }
      this.restoreToken()
    },

    // 更新用户信息
    updateUserInfo(data) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...data }
        if (data.nickname) this.nickname = data.nickname
        if (data.avatar) this.avatar = data.avatar
        if (data.phone) this.phone = data.phone
        // 更新本地存储
        uni.setStorageSync('userInfo', this.userInfo)
      }
    }
  }
})
