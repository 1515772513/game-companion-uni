
import { get, post, put, del } from '../utils/request'

// 获取游戏下拉列表
export const getGameList = () => {
  return get('/game/select-options')
}