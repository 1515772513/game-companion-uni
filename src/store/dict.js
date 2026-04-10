import { defineStore } from 'pinia'
import { getDictList } from '@/api/dict'

export const useDictStore = defineStore('dict', {
  state: () => ({
    dictCache: {}, // 字典缓存
  }),

  actions: {
    /**
     * 获取字典数据（带缓存）
     * @param {string} type 字典类型：review_status / service_type
     */
    async loadDict(type) {
      // 有缓存直接返回
      if (this.dictCache[type]) {
        return this.dictCache[type]
      }

      try {
        const res = await getDictList(type)
        
        if (res.code === 200) {
          this.dictCache[type] = res.data
          return res.data
        }
        return []
      } catch (e) {
        console.error('加载字典失败：', type, e)
        return []
      }
    },

    // 快捷获取审核状态
    async getReviewStatus() {
      return await this.loadDict('review_status')
    },

    // 快捷获取服务类型
    async getServiceType() {
      return await this.loadDict('service_type')
    },

    // 快捷获取审核状态列表
    async getReviewStatusList() {
      return await this.loadDict('review_status')
    },

    // 订单状态
    async getOrderStatus() {
      return await this.loadDict('order_status')
    },

    // 订单类型
    async getOrderType() {
      return await this.loadDict('order_type')
    },

    // 清空缓存
    clearDict() {
      this.dictCache = {}
    },
  },
})