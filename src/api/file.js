import { uploadFile } from '@/utils/request'

// 文件上传
export function uploadFiles(filePath, options = {}) {
  return uploadFile(filePath, {
    url: '/file/upload',
    ...options
  })
}
