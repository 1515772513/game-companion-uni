<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from './store/user'
import { useAppStore } from './store/app'
import ws from './utils/websocket'

const userStore = useUserStore()
const appStore = useAppStore()

onLaunch(() => {
  console.log('App Launch')

  // 初始化系统信息
  appStore.initSystemInfo()

  // 监听网络状态
  appStore.watchNetworkStatus()

  // 检查登录状态
  userStore.checkLogin()

  // 连接 WebSocket
  if (userStore.isLogin) {
    ws.connect(userStore.token)
  }
})

onShow(() => {
  console.log('App Show')

  // 重新连接 WebSocket
  if (userStore.isLogin && ws.getReadyState() !== 1) {
    ws.connect(userStore.token)
  }
})

onHide(() => {
  console.log('App Hide')

  // 断开 WebSocket
  ws.close()
})
</script>

<style lang="scss">
/* 全局样式 */
@import './static/styles/global.scss';

page {
  height: 100%;
  background-color: #f5f5f5;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
}

/* 重置样式 */
view,
scroll-view,
swiper,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: none;
}

button::after {
  border: none;
}

input,
textarea {
  font-size: 28rpx;
  color: #333;
}

/* 通用类 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-1 {
  flex: 1;
}
</style>
