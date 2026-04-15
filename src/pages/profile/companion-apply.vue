<template>
  <view class="apply-page">
    <view class="form-container">
      <!-- 基础信息 -->
      <view class="form-section">
        <view class="section-title">基础信息</view>
        
        <view class="form-item">
          <view class="label">真实姓名 <text class="required">*</text></view>
          <input 
            v-model="formData.realName" 
            class="input" 
            placeholder="请输入真实姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <view class="label">手机号码 <text class="required">*</text></view>
          <input 
            v-model="formData.phone" 
            class="input" 
            placeholder="请输入手机号码"
            type="number"
            maxlength="11"
          />
        </view>

        <view class="form-item">
          <view class="label">身份证号 <text class="required">*</text></view>
          <input 
            v-model="formData.idCard" 
            class="input" 
            placeholder="请输入身份证号码"
            maxlength="18"
          />
        </view>

        <view class="form-item">
          <view class="label">身份证正反面 <text class="required">*</text></view>
          <view class="upload-group">
            <view class="upload-item" @tap="uploadIdCard('front')">
              <image 
                v-if="formData.idCardFront" 
                :src="formData.idCardFront" 
                mode="aspectFill" 
                class="upload-img"
              ></image>
              <view v-else class="upload-placeholder">
                <uni-icons type="camera" size="30" color="#999"></uni-icons>
                <text class="upload-text">身份证正面</text>
              </view>
            </view>
            <view class="upload-item" @tap="uploadIdCard('back')">
              <image 
                v-if="formData.idCardBack" 
                :src="formData.idCardBack" 
                mode="aspectFill" 
                class="upload-img"
              ></image>
              <view v-else class="upload-placeholder">
                <uni-icons type="camera" size="30" color="#999"></uni-icons>
                <text class="upload-text">身份证反面</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 陪玩信息 -->
      <view class="form-section">
        <view class="section-title">陪玩信息</view>
        
        <view class="form-item">
          <view class="label">陪玩昵称 <text class="required">*</text></view>
          <input 
            v-model="formData.nickname" 
            class="input" 
            placeholder="请输入陪玩昵称"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <view class="label">个人简介</view>
          <textarea 
            v-model="formData.bio" 
            class="textarea" 
            placeholder="介绍一下自己，让更多人了解你"
            maxlength="200"
          ></textarea>
        </view>

        <view class="form-item">
          <view class="label">擅长标签</view>
          <view class="tags-input">
            <view 
              class="tag-item" 
              v-for="(tag, index) in formData.tags" 
              :key="index"
              @tap="removeTag(index)"
            >
              <text>{{ tag }}</text>
              <uni-icons type="clear" size="14" color="#fff"></uni-icons>
            </view>
            <input 
              v-model="tagInput" 
              class="tag-input" 
              placeholder="输入标签按回车添加"
              @confirm="addTag"
              @blur="addTag"
            />
          </view>
        </view>
      </view>

      <!-- 游戏技能 -->
      <view class="form-section">
        <view class="section-title">游戏技能</view>
        
        <view class="form-item">
          <view class="label">选择游戏 <text class="required">*</text></view>
          <picker 
            :value="gameIndex" 
            :range="gameList" 
            range-key="name" 
            @change="onGameChange"
          >
            <view class="picker">
              <text>{{ selectedGame?.name || '请选择游戏' }}</text>
              <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="label">游戏段位 <text class="required">*</text></view>
          <input 
            v-model="formData.gameRank" 
            class="input" 
            placeholder="请输入游戏段位，如：王者、钻石"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <view class="label">服务类型 <text class="required">*</text></view>
          <picker 
            :value="serviceTypeIndex" 
            :range="serviceTypeList" 
            @change="onServiceTypeChange"
          >
            <view class="picker">
              <text>{{ selectedServiceType || '请选择服务类型' }}</text>
              <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="label">单局价格(元) <text class="required">*</text></view>
          <input 
            v-model="formData.price" 
            class="input" 
            placeholder="请输入单局价格"
            type="number"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button 
          class="submit-btn" 
          @tap="submitApply" 
          :disabled="submitting"
        >
          {{ submitting ? '提交中...' : '提交申请' }}
        </button>
        <text class="tip-text">提交后将进入审核，审核通过后即可成为陪玩师</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getGameList } from '@/api/game'
import { applyCompanion } from '@/api/companion'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 表单数据（完全匹配后端 ApplyCompanionRequest）
const formData = reactive({
  realName: '',
  phone: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  nickname: '',
  bio: '',
  tags: [],
  games: [],
  gameRank: '',
  serviceType: '',
  price: 0
})

// 标签输入
const tagInput = ref('')
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
    formData.tags.push(tag)
    tagInput.value = ''
  }
}
const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

// 游戏列表
const gameList = ref([])
const selectedGame = ref(null)
const gameIndex = ref(0)
const loadGameList = async () => {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      gameList.value = res.data.map(game => ({
        id: game.value,
        name: game.label
      }))
    }
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}
const onGameChange = (e) => {
  gameIndex.value = e.detail.value
  selectedGame.value = gameList.value[e.detail.value]
  formData.games = [selectedGame.value.id]
}

// 服务类型
const serviceTypeList = ref(['1v1陪玩', '车队陪玩', '上分代练', '娱乐陪玩'])
const selectedServiceType = ref('')
const serviceTypeIndex = ref(0)
const onServiceTypeChange = (e) => {
  serviceTypeIndex.value = e.detail.value
  selectedServiceType.value = serviceTypeList.value[e.detail.value]
  formData.serviceType = serviceTypeList.value[e.detail.value]
}

// 上传身份证
const uploadIdCard = (type) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      try {
        // 调用上传接口，替换为你的上传方法
        const uploadRes = await uni.uploadFile({
          url: '/api/upload',
          filePath: tempFilePath,
          name: 'file'
        })
        const data = JSON.parse(uploadRes.data)
        if (data.code === 200) {
          if (type === 'front') {
            formData.idCardFront = data.data.url
          } else {
            formData.idCardBack = data.data.url
          }
        }
      } catch (error) {
        console.error('上传失败', error)
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
    }
  })
}

// 提交申请
const submitting = ref(false)
const submitApply = async () => {
  // 前端校验
  if (!formData.realName) {
    return uni.showToast({ title: '请输入真实姓名', icon: 'none' })
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  }
  if (!/^\d{17}[\dXx]$/.test(formData.idCard)) {
    return uni.showToast({ title: '请输入正确身份证号', icon: 'none' })
  }
  if (!formData.idCardFront || !formData.idCardBack) {
    return uni.showToast({ title: '请上传身份证正反面', icon: 'none' })
  }
  if (!formData.nickname) {
    return uni.showToast({ title: '请输入陪玩昵称', icon: 'none' })
  }
  if (!formData.games.length) {
    return uni.showToast({ title: '请选择游戏', icon: 'none' })
  }
  if (!formData.gameRank) {
    return uni.showToast({ title: '请输入游戏段位', icon: 'none' })
  }
  if (!formData.serviceType) {
    return uni.showToast({ title: '请选择服务类型', icon: 'none' })
  }
  if (!formData.price || formData.price <= 0) {
    return uni.showToast({ title: '请输入有效价格', icon: 'none' })
  }

  submitting.value = true
  try {
    const res = await applyCompanion({
      realName: formData.realName,
      phone: formData.phone,
      idCard: formData.idCard,
      idCardFrontUrl: formData.idCardFront,
      idCardBackUrl: formData.idCardBack,
      nickname: formData.nickname,
      bio: formData.bio,
      tags: formData.tags,
      games: formData.games,
      gameRank: formData.gameRank,
      serviceType: formData.serviceType,
      price: Number(formData.price)
    })

    if (res.code === 200) {
      uni.showToast({ title: '申请提交成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '申请失败', icon: 'none' })
    }
  } catch (error) {
    console.error('申请失败', error)
    uni.showToast({ title: '申请失败，请稍后重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadGameList()
})
</script>

<style lang="scss" scoped>
.apply-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.form-container {
  padding: 20rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }

  .form-item {
    margin-bottom: 30rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
      display: flex;
      align-items: center;

      .required {
        color: #ff4d4f;
        margin-left: 4rpx;
      }
    }

    .input, .textarea {
      width: 100%;
      height: 80rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;
    }

    .textarea {
      height: 160rpx;
      padding: 20rpx;
    }

    .picker {
      width: 100%;
      height: 80rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .upload-group {
      display: flex;
      gap: 20rpx;

      .upload-item {
        flex: 1;
        aspect-ratio: 4/3;
        border: 1rpx dashed #e5e5e5;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        .upload-img {
          width: 100%;
          height: 100%;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .upload-text {
            font-size: 24rpx;
            color: #999;
            margin-top: 8rpx;
          }
        }
      }
    }

    .tags-input {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      align-items: center;
      min-height: 80rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 12rpx;
      padding: 10rpx 20rpx;
      box-sizing: border-box;

      .tag-item {
        background-color: #3b82f6;
        color: #fff;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        gap: 4rpx;
      }

      .tag-input {
        flex: 1;
        min-width: 200rpx;
        height: 60rpx;
        border: none;
        font-size: 28rpx;
        outline: none;
      }
    }
  }
}

.submit-section {
  padding: 40rpx 0;
  text-align: center;

  .submit-btn {
    width: 100%;
    height: 90rpx;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
    margin-bottom: 20rpx;

    &::after {
      border: none;
    }

    &[disabled] {
      background-color: #ccc;
    }
  }

  .tip-text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>