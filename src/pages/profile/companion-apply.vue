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
        
        <!-- 游戏选择 - 底部弹窗选择器 -->
        <view class="form-item">
          <view class="label">选择游戏 <text class="required">*</text></view>
          <view class="picker" @tap="openGameSelector">
            <text>{{ selectedGame.name || '请选择游戏' }}</text>
            <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
          </view>
        </view>

        <!-- 游戏段位 - 联动Picker -->
        <view class="form-item">
          <view class="label">游戏段位 <text class="required">*</text></view>
          <picker
            :value="levelIndex"
            :range="levelOptions"
            range-key="name"
            @change="onLevelChange"
            :disabled="!selectedGame.id"
          >
            <view class="picker" :class="{ disabled: !selectedGame.id }">
              <view>{{ selectedLevel.name || '请选择段位' }}</view>
              <view>
                <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
              </view>
            </view>
          </picker>
        </view>

        <!-- 服务类型 - 统一为字典接口模式 -->
        <view class="form-item">
          <view class="label">服务类型 <text class="required">*</text></view>
          <picker
            :value="typeIndex"
            :range="typeOptions"
            range-key="name"
            @change="onTypeChange"
          >
            <view class="picker">
              <view>{{ selectedType.name || '请选择服务类型' }}</view>
              <view>
                <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
              </view>
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

    <!-- 游戏选择弹窗 -->
    <uni-popup ref="gamePopup" type="bottom" :mask-click="false">
      <view class="game-selector">
        <view class="selector-header">
          <text class="title">选择游戏</text>
          <uni-icons type="close" size="24" color="#666" @tap="closeGameSelector"></uni-icons>
        </view>
        
        <!-- 游戏搜索框 -->
        <view class="game-search-input">
          <uni-icons type="search" size="20" color="#999"></uni-icons>
          <input
            v-model="gameSearchKeyword"
            placeholder="搜索游戏"
            placeholder-class="placeholder"
            @input="filterGames"
          />
          <uni-icons
            v-if="gameSearchKeyword"
            type="clear"
            size="20"
            color="#999"
            @tap="clearGameSearch"
          ></uni-icons>
        </view>
        
        <!-- 游戏列表 -->
        <view class="game-list">
          <view 
            class="game-item"
            v-for="(game, index) in filteredGameOptions"
            :key="game.id || index"
            @tap="selectGame(game)"
          >
            <text :class="{ active: selectedGame.id === game.id }">{{ game.name }}</text>
          </view>
          
          <view class="empty" v-if="filteredGameOptions.length === 0">
            <text class="empty-text">未找到相关游戏</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { getGameList } from '@/api/game'
import { getDictList } from '@/api/dict'
import { applyCompanion } from '@/api/companion'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 表单数据
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

// ==================== 游戏选择 ====================
const gamePopup = ref(null)
const gameOptions = ref([{ id: '', name: '请选择游戏' }])
const filteredGameOptions = ref([])
const gameSearchKeyword = ref('')
const selectedGame = ref({ id: '', name: '请选择游戏' })

// 段位等级联动
const levelOptions = ref([{ id: '', name: '请选择段位' }])
const selectedLevel = ref({ id: '', name: '请选择段位' })
const levelIndex = ref(0)

// 加载游戏列表
const loadGameList = async () => {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      const items = res.data || []
      gameOptions.value = [
        { id: '', name: '请选择游戏' },
        ...items.map(game => ({ id: game.value, name: game.label }))
      ]
      filteredGameOptions.value = [...gameOptions.value]
    }
  } catch (error) {
    console.error('加载游戏列表失败', error)
  }
}

// 游戏弹窗
const openGameSelector = () => {
  gamePopup.value.open()
}
const closeGameSelector = () => {
  gamePopup.value.close()
}

// 游戏搜索
const filterGames = () => {
  const keyword = gameSearchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    filteredGameOptions.value = [...gameOptions.value]
    return
  }
  filteredGameOptions.value = gameOptions.value.filter(game => 
    game.name.toLowerCase().includes(keyword)
  )
}
const clearGameSearch = () => {
  gameSearchKeyword.value = ''
  filterGames()
}

// 选择游戏
const selectGame = (game) => {
  selectedGame.value = game
  formData.games = game.id ? [game.id] : []
  closeGameSelector()
}

// 监听游戏，加载段位
watch(selectedGame, async () => {
  selectedLevel.value = levelOptions.value[0]
  levelIndex.value = 0
  formData.gameRank = ''
  
  if (selectedGame.value.id) {
    await loadGameLevels()
  } else {
    levelOptions.value = [{ id: '', name: '请选择段位' }]
  }
}, { deep: true })

// 加载段位
const loadGameLevels = async () => {
  if (!selectedGame.value.id) return
  try {
    const res = await getDictList(`game_level_${selectedGame.value.id}`)
    if (res.code === 200) {
      levelOptions.value = [
        { id: '', name: '请选择段位' },
        ...(res.data || []).map(item => ({ 
          id: item.dictValue, 
          name: item.dictLabel 
        }))
      ]
      selectedLevel.value = levelOptions.value[0]
    }
  } catch (error) {
    console.error('加载段位列表失败', error)
  }
}

// 段位选择
const onLevelChange = (e) => {
  const index = e.detail.value
  selectedLevel.value = levelOptions.value[index]
  levelIndex.value = index
  formData.gameRank = selectedLevel.value.id || ''
}

// ==================== 服务类型（和列表页完全统一） ====================
const typeOptions = ref([{ id: '', name: '全部类型' }])
const selectedType = ref({ id: '', name: '请选择服务类型' })
const typeIndex = ref(0)

// 加载服务类型字典
const loadServiceTypes = async () => {
  try {
    const res = await getDictList('service_type')
    if (res.code === 200) {
      typeOptions.value = [
        { id: '', name: '请选择服务类型' },
        ...((res.data || []).map(item => ({ 
          id: item.dictValue, 
          name: item.dictLabel 
        })))
      ]
      selectedType.value = typeOptions.value[0]
    }
  } catch (error) {
    console.error('加载服务类型失败', error)
  }
}

// 服务类型切换
const onTypeChange = (e) => {
  const index = e.detail.value
  selectedType.value = typeOptions.value[index]
  typeIndex.value = index
  formData.serviceType = selectedType.value.id || ''
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
    return uni.showToast({ title: '请选择游戏段位', icon: 'none' })
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

onMounted(async () => {
  await loadGameList()
  await loadServiceTypes()
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
      
      &.disabled {
        color: #999;
        background-color: #fafafa;
      }
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

// 游戏选择器样式
.game-selector {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .game-search-input {
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    margin: 20rpx 30rpx;

    input {
      flex: 1;
      margin: 0 10rpx;
      font-size: 28rpx;
    }

    .placeholder {
      color: #999;
    }
  }

  .game-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 30rpx 20rpx;

    .game-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      font-size: 28rpx;
      color: #333;

      &:last-child {
        border-bottom: none;
      }

      .active {
        color: #3b82f6;
        font-weight: bold;
      }
    }

    .empty {
      padding: 50rpx 0;
      text-align: center;
      .empty-text {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}
</style>