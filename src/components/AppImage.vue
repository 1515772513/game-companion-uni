<template>
  <view class="app-image" :style="{ width: width, height: height }" @click="handleClick">
    <image
      v-if="src"
      :src="src"
      :mode="mode"
      :lazy-load="lazyLoad"
      @load="handleLoad"
      @error="handleError"
    ></image>
    <view v-else class="image-placeholder">
      <slot name="placeholder">
        <uni-icons type="image" size="40" color="#ccc"></uni-icons>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'aspectFill'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  lazyLoad: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'load', 'error'])

const isLoadError = ref(false)

const handleClick = () => {
  emit('click')
}

const handleLoad = (e) => {
  isLoadError.value = false
  emit('load', e)
}

const handleError = (e) => {
  isLoadError.value = true
  emit('error', e)
}
</script>

<style lang="scss" scoped>
.app-image {
  overflow: hidden;
  display: inline-block;
}

.app-image image {
  width: 100%;
  height: 100%;
  display: block;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
