<template>
  <view class="edit-profile-page">
    <!-- 头像 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @tap="chooseAvatar">
        <image :src="formData.avatar || userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
        <view class="edit-icon">
          <uni-icons type="camera" size="20" color="#fff"></uni-icons>
        </view>
      </view>
      <text class="tip">点击更换头像</text>
    </view>

    <!-- 基本信息 -->
    <view class="form-section">
      <view class="section-title">基本信息</view>

      <view class="form-item">
        <text class="label">昵称</text>
        <input
          v-model="formData.nickname"
          class="input"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <picker mode="selector" :range="genderOptions" @change="onGenderChange">
          <view class="picker-value">
            <text :class="{ placeholder: !formData.gender }">
              {{ formData.gender ? genderOptions[formData.gender] : '请选择性别' }}
            </text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">生日</text>
        <picker mode="date" :value="formData.birthday" @change="onBirthdayChange">
          <view class="picker-value">
            <text :class="{ placeholder: !formData.birthday }">
              {{ formData.birthday || '请选择生日' }}
            </text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>
    </view>

    <!-- 个人简介 -->
    <view class="form-section">
      <view class="section-title">个人简介</view>
      <textarea
        v-model="formData.intro"
        class="textarea"
        placeholder="介绍一下自己吧..."
        maxlength="200"
      ></textarea>
      <view class="char-count">{{ (formData.intro || '').length }}/200</view>
    </view>

    <!-- 保存按钮 -->
    <view class="bottom-bar">
      <button class="save-btn" @tap="saveProfile" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo, updateUserInfo, updateAvatar, uploadImage } from '@/api/user'

const userInfo = ref({})
const formData = ref({
  avatar: '',
  nickname: '',
  gender: '',
  birthday: '',
  intro: ''
})
const saving = ref(false)

const genderOptions = ['男', '女', '保密']

onMounted(() => {
  loadUserInfo()
})

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
      // 转换字段名
      formData.value = {
        avatar: res.data.avatar || res.data.avatar_url || '',
        nickname: res.data.nickname || '',
        gender: res.data.gender || '',
        birthday: res.data.birthday || '',
        intro: res.data.intro || ''
      }
    }
  } catch (error) {
    console.error('获取用户信息失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]

      // 上传头像
      try {
        uni.showLoading({ title: '上传中...' })

        const uploadRes = await uploadImage(tempFilePath)
        if (uploadRes.code === 200) {
          const avatarUrl = uploadRes.data.url || uploadRes.data.file_url

          // 更新头像
          const updateRes = await updateAvatar({ avatar: avatarUrl })
          if (updateRes.code === 200) {
            formData.value.avatar = avatarUrl
            uni.showToast({
              title: '头像更新成功',
              icon: 'success'
            })
          }
        }
      } catch (error) {
        console.error('上传头像失败', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  })
}

const onGenderChange = (e) => {
  formData.value.gender = parseInt(e.detail.value)
}

const onBirthdayChange = (e) => {
  formData.value.birthday = e.detail.value
}

const saveProfile = async () => {
  if (!formData.value.nickname) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }

  saving.value = true

  try {
    const res = await updateUserInfo({
      nickname: formData.value.nickname,
      gender: formData.value.gender,
      birthday: formData.value.birthday,
      intro: formData.value.intro
    })

    if (res.code === 200) {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: res.message || '保存失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('保存失败', error)
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.edit-profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;

  .avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 80rpx;
      border: 4rpx solid #f0f0f0;
    }

    .edit-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50rpx;
      height: 50rpx;
      background-color: #3b82f6;
      border-radius: 25rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3rpx solid #fff;
    }
  }

  .tip {
    font-size: 26rpx;
    color: #999;
  }
}

.form-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }

  .form-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 150rpx;
      font-size: 28rpx;
      color: #333;
      flex-shrink: 0;
    }

    .input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .picker-value {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      text {
        font-size: 28rpx;

        &.placeholder {
          color: #999;
        }
      }
    }
  }

  .textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }

  .char-count {
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .save-btn {
    width: 100%;
    height: 90rpx;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;

    &::after {
      border: none;
    }

    &[disabled] {
      background-color: #ccc;
    }
  }
}
</style>
