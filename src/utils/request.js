/**
 * 网络请求封装
 * 基于 uni.request 封装，支持拦截器、错误处理、Token 自动刷新
 */

class Request {
  constructor() {
    this.config = {
      baseURL: import.meta.env.VITE_APP_API_BASE_URL,
      timeout: 30000,
      header: {
        'Content-Type': 'application/json'
      }
    }
    this.interceptors = {
      request: [],
      response: []
    }
  }

  /**
   * 请求拦截器
   */
  setRequestInterceptor(callback) {
    this.interceptors.request.push(callback)
  }

  /**
   * 响应拦截器
   */
  setResponseInterceptor(callback) {
    this.interceptors.response.push(callback)
  }

  /**
   * 获取 Token
   */
  getToken() {
    return uni.getStorageSync('token') || ''
  }

  /**
   * 刷新 Token
   */
  async refreshToken() {
    try {
      const refreshToken = uni.getStorageSync('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const res = await uni.request({
        url: `${this.config.baseURL}/auth/refresh`,
        method: 'POST',
        data: { refreshToken }
      })

      if (res.data.code === 200) {
        const { token, refreshToken: newRefreshToken } = res.data.data
        uni.setStorageSync('token', token)
        uni.setStorageSync('refreshToken', newRefreshToken)
        return token
      }
      throw new Error('Refresh failed')
    } catch (error) {
      // Token 刷新失败，清除登录信息
      uni.removeStorageSync('token')
      uni.removeStorageSync('refreshToken')
      uni.removeStorageSync('userInfo')

      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/user/login'
      })
      throw error
    }
  }

  /**
   * 统一请求方法
   */
  async request(options) {
    // 合并配置
    const config = {
      url: this.config.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        ...this.config.header,
        ...options.header
      },
      timeout: options.timeout || this.config.timeout
    }

    // 添加 Token
    const token = this.getToken()
    if (token) {
      config.header.Authorization = `Bearer ${token}`
    }

    // 执行请求拦截器
    for (const interceptor of this.interceptors.request) {
      await interceptor(config)
    }

    let response
    try {
      response = await uni.request(config)

      // 执行响应拦截器
      for (const interceptor of this.interceptors.response) {
        await interceptor(response)
      }

      // 处理响应
      return this.handleResponse(response[0] || response, options)
    } catch (error) {
      return this.handleError(error, options)
    }
  }

  /**
   * 处理响应
   */
  async handleResponse(response, options) {
    const { statusCode, data } = response

    // HTTP 状态码检查
    if (statusCode >= 200 && statusCode < 300) {
      // 业务状态码检查
      if (data.code === 200) {
        return data.data
      } else if (data.code === 401) {
        // Token 过期，尝试刷新
        if (!options.isRefreshing) {
          options.isRefreshing = true
          try {
            await this.refreshToken()
            return this.request(options)
          } catch (error) {
            return Promise.reject(error)
          } finally {
            options.isRefreshing = false
          }
        }
      } else {
        // 业务错误
        uni.showToast({
          title: data.message || '请求失败',
          icon: 'none',
          duration: 2000
        })
        return Promise.reject(data)
      }
    } else {
      // HTTP 错误
      let message = '网络请求失败'
      switch (statusCode) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
      }

      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })

      return Promise.reject({
        statusCode,
        message,
        data
      })
    }
  }

  /**
   * 处理错误
   */
  handleError(error, options) {
    console.error('Request Error:', error)

    let message = '网络请求失败'

    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        message = '请求超时，请检查网络'
      } else if (error.errMsg.includes('fail')) {
        message = '网络连接失败'
      }
    }

    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })

    return Promise.reject(error)
  }

  /**
   * GET 请求
   */
  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  /**
   * POST 请求
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT 请求
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE 请求
   */
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  /**
   * 文件上传
   */
  upload(url, filePath, options = {}) {
    const token = this.getToken()
    const header = {}

    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: this.config.baseURL + url,
        filePath,
        name: options.name || 'file',
        formData: options.formData || {},
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            if (data.code === 200) {
              resolve(data.data)
            } else {
              uni.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              })
              reject(data)
            }
          } else {
            reject(res)
          }
        },
        fail: (error) => {
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject(error)
        }
      })
    })
  }

  /**
   * 文件下载
   */
  download(url, options = {}) {
    const token = this.getToken()
    const header = {}

    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: this.config.baseURL + url,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject(res)
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
}

// 创建实例
const request = new Request()

// 添加请求拦截器
request.setRequestInterceptor((config) => {
  // 可以在这里添加通用参数
  return config
})

// 添加响应拦截器
request.setResponseInterceptor((response) => {
  return response
})

export default request
