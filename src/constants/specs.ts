// src/constants/specs.ts
// 图标规格配置

import type { IconSpec } from '@/types'

// iOS 图标规格
export const IOS_SPECS: IconSpec[] = [
  // App Store
  { name: 'AppStore', size: 1024, platform: 'ios' },
  // iPhone
  { name: 'iPhone@3x', size: 180, platform: 'ios' },
  { name: 'iPhone@2x', size: 120, platform: 'ios' },
  { name: 'iPhone-Settings@3x', size: 87, platform: 'ios' },
  { name: 'iPhone-Settings@2x', size: 58, platform: 'ios' },
  { name: 'iPhone-Spotlight@3x', size: 120, platform: 'ios' },
  { name: 'iPhone-Spotlight@2x', size: 80, platform: 'ios' },
  { name: 'iPhone-Notification@3x', size: 60, platform: 'ios' },
  { name: 'iPhone-Notification@2x', size: 40, platform: 'ios' },
  // iPad
  { name: 'iPad-Pro', size: 167, platform: 'ios' },
  { name: 'iPad@2x', size: 152, platform: 'ios' },
  { name: 'iPad', size: 76, platform: 'ios' },
  { name: 'iPad-Settings@2x', size: 58, platform: 'ios' },
  { name: 'iPad-Settings', size: 29, platform: 'ios' },
  { name: 'iPad-Spotlight@2x', size: 80, platform: 'ios' },
  { name: 'iPad-Spotlight', size: 40, platform: 'ios' },
  { name: 'iPad-Notification@2x', size: 40, platform: 'ios' },
  { name: 'iPad-Notification', size: 20, platform: 'ios' },
]

// Android 图标规格
export const ANDROID_SPECS: IconSpec[] = [
  // Google Play Store
  { name: 'PlayStore', size: 512, platform: 'android' },
  // Launcher icons
  { name: 'xxxhdpi', size: 192, platform: 'android' },
  { name: 'xxhdpi', size: 144, platform: 'android' },
  { name: 'xhdpi', size: 96, platform: 'android' },
  { name: 'hdpi', size: 72, platform: 'android' },
  { name: 'mdpi', size: 48, platform: 'android' },
  // Adaptive icon foreground
  { name: 'Adaptive-xxxhdpi', size: 216, platform: 'android' },
  { name: 'Adaptive-xxhdpi', size: 162, platform: 'android' },
  { name: 'Adaptive-xhdpi', size: 108, platform: 'android' },
  { name: 'Adaptive-hdpi', size: 81, platform: 'android' },
  { name: 'Adaptive-mdpi', size: 54, platform: 'android' },
]

// 微信小程序图标规格
export const WECHAT_SPECS: IconSpec[] = [
  { name: '小程序图标', size: 81, platform: 'wechat' },
  { name: '小程序图标-大', size: 120, platform: 'wechat' },
  { name: '分享图', size: 500, platform: 'wechat' },
]

// Web 图标规格
export const WEB_SPECS: IconSpec[] = [
  { name: 'favicon-32', size: 32, platform: 'web' },
  { name: 'favicon-16', size: 16, platform: 'web' },
  { name: 'favicon-ico', size: 48, platform: 'web' },
  { name: 'apple-touch-icon', size: 180, platform: 'web' },
  { name: 'android-chrome-192', size: 192, platform: 'web' },
  { name: 'android-chrome-512', size: 512, platform: 'web' },
  { name: 'og-image', size: 1200, platform: 'web' },
]

// 按平台分组的所有规格
export const ALL_SPECS = {
  ios: IOS_SPECS,
  android: ANDROID_SPECS,
  wechat: WECHAT_SPECS,
  web: WEB_SPECS,
}

// 获取指定平台的规格
export const getSpecsByPlatform = (platform: string): IconSpec[] => {
  return ALL_SPECS[platform as keyof typeof ALL_SPECS] || []
}

// 获取常用规格（下载包默认包含）
export const ESSENTIAL_SPECS: IconSpec[] = [
  // iOS 核心
  { name: 'AppStore', size: 1024, platform: 'ios' },
  { name: 'iPhone@3x', size: 180, platform: 'ios' },
  { name: 'iPhone@2x', size: 120, platform: 'ios' },
  // Android 核心
  { name: 'PlayStore', size: 512, platform: 'android' },
  { name: 'xxxhdpi', size: 192, platform: 'android' },
  { name: 'xxhdpi', size: 144, platform: 'android' },
  // 微信
  { name: '小程序图标', size: 81, platform: 'wechat' },
  // Web
  { name: 'favicon-32', size: 32, platform: 'web' },
  { name: 'apple-touch-icon', size: 180, platform: 'web' },
]

// 规格总数
export const TOTAL_SPEC_COUNT = 
  IOS_SPECS.length + ANDROID_SPECS.length + WECHAT_SPECS.length + WEB_SPECS.length