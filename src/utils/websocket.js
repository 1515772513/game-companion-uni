/**
 * WebSocket 封装
 */
import { useAppStore } from '@/store/app'

class WebSocketClient {
  constructor() {
    this.ws = null
    this.url = import.meta.env.VITE_APP_WS_BASE_URL
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.reconnectDelay = 3000
    this.heartbeatInterval = 30000
    this.isManualClose = false
    this.listeners = {}
  }

  /**
   * 连接 WebSocket
   */
  connect(token) {
    if (this.ws) {
      console.log('WebSocket 已连接')
      return
    }

    const wsUrl = `${this.url}?token=${token}`

    this.ws = uni.connectSocket({
      url: wsUrl,
      success: () => {
        console.log('WebSocket 连接成功')
      }
    })

    this.ws.onOpen(() => {
      console.log('WebSocket 连接已打开')

      const appStore = useAppStore()
      appStore.setWsConnected(true)

      // 开始心跳
      this.startHeartbeat()

      // 清除重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    })

    this.ws.onMessage((res) => {
      console.log('收到消息:', res.data)
      this.handleMessage(res.data)
    })

    this.ws.onError((error) => {
      console.error('WebSocket 错误:', error)

      const appStore = useAppStore()
      appStore.setWsConnected(false)
    })

    this.ws.onClose(() => {
      console.log('WebSocket 连接已关闭')

      const appStore = useAppStore()
      appStore.setWsConnected(false)

      // 停止心跳
      this.stopHeartbeat()

      // 如果不是手动关闭，则重连
      if (!this.isManualClose) {
        this.reconnect()
      }
    })
  }

  /**
   * 发送消息
   */
  send(data) {
    if (!this.ws) {
      console.error('WebSocket 未连接')
      return false
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      this.ws.send({
        data: message,
        success: () => {
          console.log('发送消息成功:', message)
        },
        fail: (error) => {
          console.error('发送消息失败:', error)
        }
      })
      return true
    } catch (error) {
      console.error('发送消息异常:', error)
      return false
    }
  }

  /**
   * 处理收到的消息
   */
  handleMessage(data) {
    try {
      let message = data

      // 尝试解析 JSON
      if (typeof data === 'string') {
        try {
          message = JSON.parse(data)
        } catch (e) {
          // 不是 JSON 格式，保持原样
        }
      }

      // 触发对应事件的监听器
      const eventType = message.type || 'message'
      this.trigger(eventType, message)

      // 触发通用消息监听器
      this.trigger('message', message)
    } catch (error) {
      console.error('处理消息异常:', error)
    }
  }

  /**
   * 监听事件
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * 取消监听
   */
  off(event, callback) {
    if (!this.listeners[event]) return

    if (callback) {
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    } else {
      delete this.listeners[event]
    }
  }

  /**
   * 触发事件
   */
  trigger(event, data) {
    if (!this.listeners[event]) return

    this.listeners[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('监听器执行异常:', error)
      }
    })
  }

  /**
   * 开始心跳
   */
  startHeartbeat() {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 重连
   */
  reconnect() {
    if (this.reconnectTimer) {
      return
    }

    console.log('WebSocket 重连中...')

    this.reconnectTimer = setTimeout(() => {
      const token = uni.getStorageSync('token')
      if (token) {
        this.connect(token)
      }
    }, this.reconnectDelay)
  }

  /**
   * 关闭连接
   */
  close() {
    this.isManualClose = true

    // 停止心跳
    this.stopHeartbeat()

    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // 关闭连接
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    const appStore = useAppStore()
    appStore.setWsConnected(false)
  }

  /**
   * 获取连接状态
   */
  getReadyState() {
    if (!this.ws) return -1
    // uni-app 的 WebSocket 没有直接提供 readyState
    // 这里通过 appStore 来判断
    const appStore = useAppStore()
    return appStore.wsConnected ? 1 : 0
  }
}

// 创建单例
const ws = new WebSocketClient()

export default ws
