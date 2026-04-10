/**
 * 过滤器工具文件
 */

/**
 * 图片URL过滤器
 * 用于取环境变量VITE_APP_IMG_HOST再拼上val
 * @param {string} val - 图片相对路径
 * @returns {string} 完整的图片URL
 */
export const imgUrl = (val) => {
  if (!val) return '';

  // 如果已经是完整URL，直接返回
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }

  // 获取环境变量中的图片主机地址
  const imgHost = import.meta.env.VITE_APP_RESOURCES_URL || '';

  // 确保路径格式正确
  const cleanVal = val.startsWith('/') ? val.slice(1) : val;
  const cleanHost = imgHost.endsWith('/') ? imgHost.slice(0, -1) : imgHost;

  return `${cleanHost}/${cleanVal}`;
}

// 导出所有过滤器
export default {
  imgUrl
}