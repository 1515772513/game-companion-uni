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
        <view class="section-title">{{ mainText }}信息</view>
        
        <view class="form-item">
          <view class="label">{{ mainText }}昵称 <text class="required">*</text></view>
          <input 
            v-model="formData.nickname" 
            class="input" 
            placeholder="请输入{{ mainText }}昵称"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <view class="label">个人简介 <text class="required">*</text></view>
          <textarea
            v-model="formData.bio"
            class="textarea"
            placeholder="介绍一下自己，让更多人了解你"
            maxlength="200"
          ></textarea>
        </view>

        <!-- 【新增：多张背景轮播图】 -->
        <view class="form-item">
          <view class="label">背景轮播图</view>
          <view class="upload-group" style="flex-wrap: wrap;">
            <view class="upload-item" v-for="(img, idx) in backgroundImages" :key="idx" @tap="removeBackgroundImage(idx)">
              <image :src="img.url" mode="aspectFill" class="upload-img"></image>
            </view>
            <view class="upload-item" @tap="uploadBackgroundImage">
              <view class="upload-placeholder">
                <uni-icons type="plus" size="30" color="#999"></uni-icons>
              </view>
            </view>
          </view>
          <text class="tip">可上传多张，点击删除</text>
        </view>

        <!-- 擅长标签 -->
        <view class="form-item">
          <view class="label">擅长标签</view>
          
          <view class="preset-tags">
            <view 
              class="preset-tag"
              :class="{ active: selectedPresetTags.includes(tag) }"
              v-for="tag in presetTags" 
              :key="tag"
              @tap="togglePresetTag(tag)"
            >
              {{ tag }}
            </view>
          </view>
          
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
            <!-- 【新增：禁止输入逗号】 -->
            <input 
              v-model="tagInput" 
              class="tag-input" 
              placeholder="输入自定义标签，按回车添加"
              @input="tagInput = tagInput.replace(/,/g, '')"
              @confirm="addCustomTag"
              @blur="addCustomTag"
            />
          </view>
          <text class="tip">最多选择10个标签，点击可删除</text>
        </view>
      </view>

      <!-- 【改造：多游戏技能】 -->
      <view class="form-section">
        <view class="section-title">游戏技能</view>

        <view class="game-skill-group" v-for="(skill, idx) in gameSkillList" :key="idx">
          <view class="skill-header">
            <text>游戏 {{ idx + 1 }}</text>
            <text class="del-btn" @tap="removeGameSkill(idx)">删除</text>
          </view>

          <view class="form-item">
            <view class="label">选择游戏 <text class="required">*</text></view>
            <view class="picker" @tap="openGameSelector(idx)">
              <text>{{ skill.gameName || '请选择游戏' }}</text>
              <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
            </view>
          </view>

          <view class="form-item">
            <view class="label">游戏段位 <text class="required">*</text></view>
            <picker
              :value="skill.levelIndex"
              :range="skill.levelOptions"
              range-key="id"
              @change="onSkillLevelChange(idx, $event)"
              :disabled="!skill.gameId"
            >
              <view class="picker" :class="{ disabled: !skill.gameId }">
                <view>{{ skill.levelName || '请选择段位' }}</view>
                <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
              </view>
            </picker>
          </view>

          <view class="form-item">
            <view class="label">服务类型 <text class="required">*</text></view>
            <picker
              :value="skill.typeIndex"
              :range="typeOptions"
              range-key="name"
              @change="onSkillTypeChange(idx, $event)"
            >
              <view class="picker">
                <view>{{ skill.typeName || '请选择服务类型' }}</view>
                <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
              </view>
            </picker>
          </view>

          <view class="form-item">
            <view class="label">单局价格(元) <text class="required">*</text></view>
            <input 
              v-model="skill.price" 
              class="input" 
              placeholder="请输入单局价格"
              type="number"
            />
          </view>
        </view>

        <button class="add-game-btn" @tap="addGameSkill">+ 添加新游戏</button>
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
        <text class="tip-text">提交后将进入审核，审核通过后即可成为{{ mainText }}师</text>
      </view>
    </view>

    <!-- 游戏选择弹窗 -->
    <uni-popup ref="gamePopup" type="bottom" :mask-click="false">
      <view class="game-selector">
        <view class="selector-header">
          <text class="title">选择游戏</text>
          <uni-icons type="close" size="24" color="#666" @tap="closeGameSelector"></uni-icons>
        </view>
        
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
        
        <view class="game-list">
          <view 
            class="game-item"
            v-for="(game, index) in filteredGameOptions"
            :key="game.id || index"
            @tap="!isGameDisabled(game.id, idx) && selectGame(game)"
            :class="{ disabled: isGameDisabled(game.id, idx) }"
          >
            <text :class="{ active: currentSkillGameId === game.id }">{{ game.name }}</text>
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
import { uploadFiles } from '@/api/file'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const mainText = computed(() => {
  return appStore.getConfig.mainText
})

const userStore = useUserStore()

// 表单数据
const formData = reactive({
  realName: '',
  phone: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  nickname: userStore.nickname,
  bio: '',
  tags: []
})

// ==================== 标签功能 ====================
const presetTags = ref(['声音好听', '技术一流', '心态超好', '话多有趣', '全能选手', '萌新友好', '守时靠谱', '战绩可观'])
const selectedPresetTags = ref([])
const tagInput = ref('')

const togglePresetTag = (tag) => {
  const index = selectedPresetTags.value.indexOf(tag)
  if (index > -1) {
    selectedPresetTags.value.splice(index, 1)
    formData.tags = formData.tags.filter(t => t !== tag)
  } else {
    if (formData.tags.length >= 10) {
      uni.showToast({ title: '最多只能添加10个标签', icon: 'none' })
      return
    }
    selectedPresetTags.value.push(tag)
    formData.tags.push(tag)
  }
}

const addCustomTag = () => {
  const tag = tagInput.value.trim()
  if (!tag) return
  if (formData.tags.length >= 10) {
    uni.showToast({ title: '最多只能添加10个标签', icon: 'none' })
    return
  }
  if (!formData.tags.includes(tag)) {
    formData.tags.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (index) => {
  const tag = formData.tags[index]
  const presetIndex = selectedPresetTags.value.indexOf(tag)
  if (presetIndex > -1) {
    selectedPresetTags.value.splice(presetIndex, 1)
  }
  formData.tags.splice(index, 1)
}

// ==================== 游戏选择 ====================
const gamePopup = ref(null)
const gameOptions = ref([{ id: '', name: '请选择游戏' }])
const filteredGameOptions = ref([])
const gameSearchKeyword = ref('')
const currentSkillIndex = ref(0)
const currentSkillGameId = ref('')

// 已选中的所有游戏ID（去重用）
const selectedGameIds = computed(() => {
  return gameSkillList.value
    .map(item => item.gameId)
    .filter(id => id && id !== '')
})

// 判断游戏是否禁用
const isGameDisabled = (gameId, idx) => {
  if (!gameId) return false
  return selectedGameIds.value.includes(gameId)
}

// 【新增：多游戏技能】
const gameSkillList = ref([
  {
    gameId: '',
    gameName: '',
    levelOptions: [{ name: '请选择段位' }],
    levelIndex: 0,
    levelName: '',
    typeIndex: 0,
    typeName: '',
    serviceType: '',
    price: ''
  }
])

const addGameSkill = () => {
  gameSkillList.value.push({
    gameId: '',
    gameName: '',
    levelOptions: [{ name: '请选择段位' }],
    levelIndex: 0,
    levelName: '',
    typeIndex: 0,
    typeName: '',
    serviceType: '',
    price: ''
  })
}

const removeGameSkill = (idx) => {
  if (gameSkillList.value.length > 1) {
    gameSkillList.value.splice(idx, 1)
  } else {
    uni.showToast({ title: '至少保留一个游戏', icon: 'none' })
  }
}

const openGameSelector = (idx) => {
  currentSkillIndex.value = idx
  const skill = gameSkillList.value[idx]
  currentSkillGameId.value = skill.gameId || ''
  filterGames()
  gamePopup.value.open()
}

const closeGameSelector = () => {
  gamePopup.value.close()
}

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

const selectGame = (game) => {
  const idx = currentSkillIndex.value
  gameSkillList.value[idx].gameId = game.id
  gameSkillList.value[idx].gameName = game.name
  currentSkillGameId.value = game.id
  closeGameSelector()
}

watch(currentSkillGameId, async (newVal) => {
  const idx = currentSkillIndex.value
  gameSkillList.value[idx].levelOptions = [{ name: '请选择段位' }]
  gameSkillList.value[idx].levelName = ''
  if (newVal) {
    await loadSkillLevels(idx)
  }
}, { deep: true })

const loadSkillLevels = async (idx) => {
  const gameId = gameSkillList.value[idx].gameId
  if (!gameId) return
  try {
    const res = await getDictList(`game_level_${gameId}`)
    if (res.code === 200) {
      gameSkillList.value[idx].levelOptions = [
        { name: '请选择段位' },
        ...(res.data || []).map(item => ({ name: item.dictLabel, id: item.dictValue }))
      ]
    }
  } catch (error) {
    console.error('加载段位失败', error)
  }
}

const onSkillLevelChange = (idx, e) => {
  const i = e.detail.value
  gameSkillList.value[idx].levelIndex = i
  gameSkillList.value[idx].levelName = gameSkillList.value[idx].levelOptions[i].id
}

// ==================== 服务类型 ====================
const typeOptions = ref([{ id: '', name: '请选择服务类型' }])

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
    }
  } catch (error) {
    console.error('加载服务类型失败', error)
  }
}

const onSkillTypeChange = (idx, e) => {
  const i = e.detail.value
  const item = typeOptions.value[i]
  gameSkillList.value[idx].typeIndex = i
  gameSkillList.value[idx].typeName = item.name
  gameSkillList.value[idx].serviceType = item.id
}

// ==================== 上传 ====================
const uploadIdCard = (type) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      try {
        const uploadRes = await uploadFiles(tempFilePath)
        if (uploadRes.code === 200) {
          const data = uploadRes.data
          if (type === 'front') {
            formData.idCardFront = data.fileUrl
          } else {
            formData.idCardBack = data.fileUrl
          }
        }
      } catch (error) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
    }
  })
}

// 【新增：背景轮播图】
const backgroundImages = ref([])
const uploadBackgroundImage = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const upRes = await uploadFiles(res.tempFilePaths[0])
      if (upRes.code === 200) {
        backgroundImages.value.push({
          url: upRes.data.fileUrl,
          fileId: upRes.data.id,
          sort: backgroundImages.value.length + 1
        })
      }
    }
  })
}
const removeBackgroundImage = (idx) => {
  backgroundImages.value.splice(idx, 1)
}

// ==================== 提交申请 ====================
const submitting = ref(false)
const submitApply = async () => {
  if (!formData.realName) return uni.showToast({ title: '请输入真实姓名', icon: 'none' })
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) return uni.showToast({ title: '手机号错误', icon: 'none' })
  if (!/^\d{17}[\dXx]$/.test(formData.idCard)) return uni.showToast({ title: '身份证错误', icon: 'none' })
  if (!formData.idCardFront || !formData.idCardBack) return uni.showToast({ title: '请上传身份证', icon: 'none' })
  if (!formData.nickname) return uni.showToast({ title: '请输入昵称', icon: 'none' })
  if (!formData.bio || !formData.bio.trim()) return uni.showToast({ title: '请填写个人简介', icon: 'none' })

  for (let skill of gameSkillList.value) {
    if (!skill.gameId) return uni.showToast({ title: '请选择游戏', icon: 'none' })
    if (!skill.levelName) return uni.showToast({ title: '请选择段位', icon: 'none' })
    if (!skill.serviceType) return uni.showToast({ title: '请选择服务类型', icon: 'none' })
    if (!skill.price || skill.price <= 0) return uni.showToast({ title: '请输入价格', icon: 'none' })
  }

  submitting.value = true
  try {
    const gameSkills = gameSkillList.value.map(s => ({
      gameId: s.gameId,
      gameRank: s.levelName,
      serviceType: s.serviceType,
      price: Number(s.price)
    }))

    const bgImages = backgroundImages.value.map(b => ({
      fileId: b.fileId,
      sort: b.sort
    }))

    const res = await applyCompanion({
      realName: formData.realName,
      phone: formData.phone,
      idCard: formData.idCard,
      idCardFrontUrl: formData.idCardFront,
      idCardBackUrl: formData.idCardBack,
      nickname: formData.nickname,
      bio: formData.bio,
      tags: formData.tags,
      gameSkills: gameSkills,
      backgroundImages: bgImages
    })

    if (res.code === 200) {
      uni.showToast({ title: '申请成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 2000)
    } else {
      uni.showToast({ title: res.message || '申请失败', icon: 'none' })
    }
  } catch (error) {
    uni.showToast({ title: '申请失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  uni.setNavigationBarTitle({
    title: `${mainText.value}师申请`
  })
  await loadGameList()
  await loadServiceTypes()
})

async function loadGameList() {
  try {
    const res = await getGameList()
    if (res.code === 200) {
      gameOptions.value = [
        { id: '', name: '请选择游戏' },
        ...res.data.map(g => ({ id: g.value, name: g.label }))
      ]
      filteredGameOptions.value = [...gameOptions.value]
    }
  } catch (e) {
    console.error('加载游戏列表失败', e)
    uni.showToast({ title: '游戏列表加载失败', icon: 'none' })
  }
}
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

    // 预设标签样式
    .preset-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 20rpx;

      .preset-tag {
        padding: 10rpx 20rpx;
        background-color: #f5f5f5;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #666;

        &.active {
          background-color: #3b82f6;
          color: #fff;
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
        cursor: pointer;
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

    .tip {
      font-size: 22rpx;
      color: #999;
      margin-top: 8rpx;
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
// 游戏技能头部优化
.game-skill-group {
  background: #fafbfc;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid #e8e8e8;

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background: linear-gradient(90deg, #eef2ff, #f8fafc);
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #1f2937;

    .del-btn {
      color: #ff4d4f;
      font-size: 24rpx;
      padding: 6rpx 12rpx;
      border-radius: 6rpx;
      background: rgba(255,77,79,0.08);
      transition: all 0.2s;

      &:active {
        background: rgba(255,77,79,0.15);
        transform: scale(0.96);
      }
    }
  }
}

// 添加游戏按钮优化
.add-game-btn {
  width: 100%;
  height: 80rpx;
  background: #f8f9ff;
  color: #3b82f6;
  border: 1rpx dashed #c7d2fe;
  border-radius: 12rpx;
  font-size: 28rpx;
  margin-top: 10rpx;

  &::after {
    border: none;
  }
}

// 已选游戏禁用样式
.game-item.disabled {
  color: #ccc !important;
  pointer-events: none;
}
</style>