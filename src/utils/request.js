import { useUserStore } from '../store/user'
import { useAppStore } from '../store/app'

/**
 * 获取环境配置
 * 适配 Vite + uni-app 环境变量
 */
const getEnvConfig = () => {
  // 优先读取 Vite 环境变量
  const env = import.meta.env.VITE_APP_ENV || 'development'
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || ''
  
  return { env, baseUrl }
}

// 请求拦截器
function request(options) {
  // 获取环境配置
  const { env, baseUrl } = getEnvConfig()

  return new Promise((resolve, reject) => {
    // 获取store
    const userStore = useUserStore()
    const appStore = useAppStore()

    // 显示加载提示
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }

    // 构建请求配置
    const config = {
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': options.contentType || 'application/json',
        ...options.header
      },
      timeout: options.timeout || 30000,
      dataType: options.dataType || 'json',
      responseType: options.responseType || 'text'
    }

    // 添加token
    if (userStore.token) {
      config.header['Authorization'] = `Bearer ${userStore.token}`
    }

    // 构建完整URL
    if (!config.url.startsWith('http')) {
      const baseURL = options.baseURL || appStore.config.baseURL
      config.url = baseURL + config.url
    }

    // 发起请求
    uni.request({
      ...config,
      success: (res) => {
        // 隐藏加载提示
        if (options.loading !== false) {
          uni.hideLoading()
        }

        // 处理响应
        if (res.statusCode === 200) {
          // 判断业务状态码
          if (res.data.code === 200 || res.data.success === true) {
            resolve(res.data)
          } else {
            // 业务错误
            handleBusinessError(res.data)
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转登录
          handleUnauthorized()
          reject({ message: '未授权，请重新登录' })
        } else if (res.statusCode === 403) {
          // 无权限
          showToast('无权限访问')
          reject({ message: '无权限访问' })
        } else if (res.statusCode === 404) {
          showToast('请求的资源不存在')
          reject({ message: '请求的资源不存在' })
        } else if (res.statusCode === 500) {
          showToast('服务器错误')
          reject({ message: '服务器错误' })
        } else {
          showToast(`请求失败: ${res.statusCode}`)
          reject({ message: `请求失败: ${res.statusCode}` })
        }
      },
      fail: (error) => {
        // 隐藏加载提示
        if (options.loading !== false) {
          uni.hideLoading()
        }

        // 处理网络错误
        handleNetworkError(error)
        reject(error)
      }
    })
  })
}

// 处理业务错误
function handleBusinessError(data) {
  const message = data.message || data.msg || '操作失败'

  // 根据错误码处理
  switch (data.code) {
    case 400:
      showToast(message)
      break
    case 401:
      handleUnauthorized()
      break
    case 403:
      showToast('无权限访问')
      break
    default:
      showToast(message)
  }
}

// 处理未授权
function handleUnauthorized() {
  const userStore = useUserStore()

  // 清除用户信息
  userStore.logout()

  // 跳转登录页
  // setTimeout(() => {
  //   uni.navigateTo({
  //     url: '/pages/user/login'
  //   })
  // }, 500)
}

// 处理网络错误
function handleNetworkError(error) {
  console.error('网络请求失败:', error)

  // 检查网络状态
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === 'none') {
        showToast('网络连接失败，请检查网络')
      } else {
        showToast('网络请求失败，请稍后重试')
      }
    },
    fail: () => {
      showToast('网络请求失败，请稍后重试')
    }
  })
}

// 显示提示
function showToast(title) {
  uni.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

// GET请求
export function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

// POST请求
export function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

// PUT请求
export function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

// DELETE请求
export function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

// 文件上传
export function uploadFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    const appStore = useAppStore()

    // 显示加载提示
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '上传中...',
        mask: true
      })
    }

    const uploadURL = options.url || appStore.config.uploadURL

    uni.uploadFile({
      url: uploadURL,
      filePath: filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': `Bearer ${userStore.token}`,
        ...options.header
      },
      success: (res) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }

        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          if (data.code === 200 || data.success === true) {
            resolve(data)
          } else {
            showToast(data.message || '上传失败')
            reject(data)
          }
        } else {
          showToast('上传失败')
          reject({ message: '上传失败' })
        }
      },
      fail: (error) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
        showToast('上传失败')
        reject(error)
      }
    })
  })
}

// 文件下载
export function downloadFile(url, options = {}) {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    const appStore = useAppStore()

    // 显示加载提示
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '下载中...',
        mask: true
      })
    }

    // 构建完整URL
    let downloadURL = url
    if (!url.startsWith('http')) {
      downloadURL = appStore.config.baseURL + url
    }

    uni.downloadFile({
      url: downloadURL,
      header: {
        'Authorization': `Bearer ${userStore.token}`,
        ...options.header
      },
      success: (res) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }

        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          showToast('下载失败')
          reject({ message: '下载失败' })
        }
      },
      fail: (error) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
        showToast('下载失败')
        reject(error)
      }
    })
  })
}

export default request
