/**
 * 主题配置文件
 * 基于原型设计风格（蓝色主题）
 */

export default {
  // 主色调 - 蓝色系（来自原型设计）
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',

  // 辅助色 - 橙色系（保持原项目主题色作为强调色）
  accent: '#FF6B00',
  accentLight: '#FF8C00',
  accentDark: '#E65A00',

  // 渐变色
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  accentGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  blueGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',

  // 中性色
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#CCCCCC',
    inverse: '#FFFFFF'
  },

  // 背景色
  bg: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#FAFAFA',
    dark: '#1F2937',
    darker: '#111827'
  },

  // 边框色
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF'
  },

  // 阴影
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },

  // 圆角
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },

  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },

  // 字体大小
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },

  // 状态色
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
}
