import App from './App.vue'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import pinia from './store'

// 全局引入 uni-ui 组件
import uniTable from '@dcloudio/uni-ui/lib/uni-table/uni-table.vue'
import uniTd from '@dcloudio/uni-ui/lib/uni-td/uni-td.vue'
import uniTh from '@dcloudio/uni-ui/lib/uni-th/uni-th.vue'
import uniTr from '@dcloudio/uni-ui/lib/uni-tr/uni-tr.vue'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue'
import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue'
import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue'
import uniSwipeAction from '@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue'
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
import uniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue'
import uniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue'
import uniTag from '@dcloudio/uni-ui/lib/uni-tag/uni-tag.vue'
import uniNoticeBar from '@dcloudio/uni-ui/lib/uni-notice-bar/uni-notice-bar.vue'
import uniDataSelect from '@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue'
import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue'
import uniGridItem from '@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.vue'
import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue'
import uniCalendar from '@dcloudio/uni-ui/lib/uni-calendar/uni-calendar.vue'
import uniSection from '@dcloudio/uni-ui/lib/uni-section/uni-section.vue'

export function createApp() {
  const app = createSSRApp(App)

  // 注册状态管理
  app.use(pinia)

  // 注册 uni-ui 组件
  app.component('uni-table', uniTable)
  app.component('uni-td', uniTd)
  app.component('uni-th', uniTh)
  app.component('uni-tr', uniTr)
  app.component('uni-icons', uniIcons)
  app.component('uni-card', uniCard)
  app.component('uni-list', uniList)
  app.component('uni-list-item', uniListItem)
  app.component('uni-swipe-action', uniSwipeAction)
  app.component('uni-popup', uniPopup)
  app.component('uni-rate', uniRate)
  app.component('uni-search-bar', uniSearchBar)
  app.component('uni-tag', uniTag)
  app.component('uni-notice-bar', uniNoticeBar)
  app.component('uni-data-select', uniDataSelect)
  app.component('uni-grid', uniGrid)
  app.component('uni-grid-item', uniGridItem)
  app.component('uni-badge', uniBadge)
  app.component('uni-calendar', uniCalendar)
  app.component('uni-section', uniSection)

  return {
    app,
    Pinia
  }
}
