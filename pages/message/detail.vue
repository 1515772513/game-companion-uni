<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <view class="chat-header">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="left" size="24" color="#333"></uni-icons>
      </view>
      <view class="header-info">
        <text class="name">{{ chatInfo.name }}</text>
        <text class="status" :class="{ online: chatInfo.isOnline }">
          {{ chatInfo.isOnline ? '在线' : '离线' }}
        </text>
      </view>
      <view class="more-btn" @tap="showMore">
        <uni-icons type="more" size="24" color="#333"></uni-icons>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-container"
      scroll-y
      :scroll-into-view="scrollToView"
      :scroll-with-animation="true"
    >
      <view
        class="message-item"
        v-for="(message, index) in messages"
        :key="message.id"
        :id="`msg-${index}`"
        :class="message.isSelf ? 'self' : 'other'"
      >
        <image :src="message.avatar" mode="aspectFill" class="avatar"></image>
        <view class="message-content">
          <text class="text" v-if="message.type === 'text'">{{ message.content }}</text>
          <image v-else-if="message.type === 'image'" :src="message.content" mode="widthFix" class="image" @tap="previewImage(message.content)"></image>
          <view class="time">{{ message.createTime }}</view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入栏 -->
    <view class="input-bar">
      <view class="input-left">
        <view class="icon-btn" @tap="chooseImage">
          <uni-icons type="image" size="24" color="#666"></uni-icons>
        </view>
      </view>
      <input
        v-model="inputText"
        class="input"
        placeholder="请输入消息"
        placeholder-class="placeholder"
        @confirm="sendMessage"
      />
      <view class="input-right">
        <button class="send-btn" @tap="sendMessage" :disabled="!inputText.trim()">发送</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getConversationDetail, getMessageList, sendTextMessage, sendImageMessage, uploadChatImage } from '@/api/message'

const conversationId = ref('')
const chatInfo = ref({})
const messages = ref([])
const inputText = ref('')
const scrollToView = ref('')

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

  if (options.id) {
    conversationId.value = options.id
  } else if (options.companionId) {
    await createConversation(options.companionId)
  }

  await loadChatInfo()
  await loadMessages()
})

const createConversation = async (companionId) => {
  try {
    const res = await uni.request({
      url: '/api/message/conversation/create',
      method: 'POST',
      data: { companionId }
    })
    if (res.data.code === 200) {
      conversationId.value = res.data.data.id
    }
  } catch (error) {
    console.error('创建会话失败', error)
  }
}

const loadChatInfo = async () => {
  try {
    const res = await getConversationDetail(conversationId.value)
    if (res.code === 200) {
      chatInfo.value = res.data
      uni.setNavigationBarTitle({
        title: res.data.name
      })
    }
  } catch (error) {
    console.error('获取会话信息失败', error)
  }
}

const loadMessages = async () => {
  try {
    const res = await getMessageList(conversationId.value, { page: 1, pageSize: 100 })
    if (res.code === 200) {
      messages.value = res.data.list || []
      scrollToBottom()
    }
  } catch (error) {
    console.error('获取消息列表失败', error)
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim()) return

  const content = inputText.value
  inputText.value = ''

  try {
    const res = await sendTextMessage(conversationId.value, { content })
    if (res.code === 200) {
      messages.value.push({
        id: Date.now(),
        type: 'text',
        content,
        isSelf: true,
        createTime: formatTime(new Date()),
        avatar: chatInfo.value.myAvatar
      })
      scrollToBottom()
    }
  } catch (error) {
    console.error('发送消息失败', error)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      try {
        const uploadRes = await uploadChatImage(res.tempFilePaths[0])
        if (uploadRes.code === 200) {
          const imageUrl = uploadRes.data.url
          const sendRes = await sendImageMessage(conversationId.value, { imageUrl })
          if (sendRes.code === 200) {
            messages.value.push({
              id: Date.now(),
              type: 'image',
              content: imageUrl,
              isSelf: true,
              createTime: formatTime(new Date()),
              avatar: chatInfo.value.myAvatar
            })
            scrollToBottom()
          }
        }
      } catch (error) {
        console.error('发送图片失败', error)
      }
    }
  })
}

const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollToView.value = `msg-${messages.value.length - 1}`
    }
  })
}

const formatTime = (date) => {
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

const goBack = () => {
  uni.navigateBack()
}

const showMore = () => {
  uni.showActionSheet({
    itemList: ['清空聊天记录', '举报'],
    success: (res) => {
      if (res.tapIndex === 0) {
        clearMessages()
      }
    }
  })
}

const clearMessages = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空聊天记录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await uni.request({
            url: `/api/message/conversation/${conversationId.value}/messages`,
            method: 'DELETE'
          })
          messages.value = []
        } catch (error) {
          console.error('清空消息失败', error)
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .back-btn, .more-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .name {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 4rpx;
    }

    .status {
      font-size: 22rpx;
      color: #999;

      &.online {
        color: #52c41a;
      }
    }
  }
}

.message-container {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;

  .message-item {
    display: flex;
    margin-bottom: 30rpx;

    &.self {
      flex-direction: row-reverse;

      .message-content {
        margin-right: 20rpx;
        margin-left: 0;

        .text {
          background-color: #3b82f6;
          color: #fff;
        }
      }
    }

    &.other {
      .message-content {
        margin-left: 20rpx;

        .text {
          background-color: #fff;
          color: #333;
        }
      }
    }

    .avatar {
      width: 72rpx;
      height: 72rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }

    .message-content {
      max-width: 500rpx;

      .text {
        padding: 20rpx 24rpx;
        border-radius: 12rpx;
        font-size: 28rpx;
        line-height: 1.6;
        word-break: break-all;
      }

      .image {
        max-width: 100%;
        border-radius: 12rpx;
      }

      .time {
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .input-left {
    display: flex;
    margin-right: 20rpx;

    .icon-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .input {
    flex: 1;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }

  .input-right {
    margin-left: 20rpx;

    .send-btn {
      width: 120rpx;
      height: 70rpx;
      background-color: #3b82f6;
      color: #fff;
      border-radius: 35rpx;
      font-size: 28rpx;
      border: none;
      line-height: 70rpx;

      &::after {
        border: none;
      }

      &[disabled] {
        background-color: #ccc;
      }
    }
  }
}

.placeholder {
  color: #999;
}
</style>
