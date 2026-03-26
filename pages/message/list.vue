<template>
  <view class="message-list-page">
    <!-- 会话列表 -->
    <view class="conversation-list">
      <view
        class="conversation-item"
        v-for="conversation in conversations"
        :key="conversation.id"
        @tap="goToChat(conversation)"
      >
        <view class="avatar-wrapper">
          <image :src="conversation.avatar" mode="aspectFill" class="avatar"></image>
          <view class="badge" v-if="conversation.unreadCount > 0">
            {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
          </view>
        </view>
        <view class="conversation-info">
          <view class="header">
            <text class="name">{{ conversation.name }}</text>
            <text class="time">{{ conversation.lastMessageTime }}</text>
          </view>
          <view class="content">
            <text class="message">{{ conversation.lastMessage }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="conversations.length === 0">
      <image src="/static/empty-message.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无消息</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getConversationList } from '@/api/message'

const conversations = ref([])

onMounted(() => {
  loadConversations()
})

const loadConversations = async () => {
  try {
    const res = await getConversationList({ page: 1, pageSize: 50 })
    if (res.code === 200) {
      conversations.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取会话列表失败', error)
  }
}

const goToChat = (conversation) => {
  uni.navigateTo({
    url: `/pages/message/detail?id=${conversation.id}`
  })
}
</script>

<style lang="scss" scoped>
.message-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.conversation-list {
  .conversation-item {
    display: flex;
    padding: 24rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .avatar-wrapper {
      position: relative;
      margin-right: 20rpx;

      .avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 12rpx;
      }

      .badge {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        min-width: 36rpx;
        height: 36rpx;
        background-color: #ff4d4f;
        color: #fff;
        font-size: 20rpx;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8rpx;
        border: 2rpx solid #fff;
      }
    }

    .conversation-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }

        .time {
          font-size: 22rpx;
          color: #999;
        }
      }

      .content {
        .message {
          font-size: 26rpx;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0;

  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    color: #999;
    font-size: 28rpx;
  }
}
</style>
