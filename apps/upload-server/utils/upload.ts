import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import crypto from 'crypto';

// 上传配置
export const uploadConfig = {
  // 上传目录
  uploadDir: path.join(process.cwd(), 'uploads'),
  // 允许的文件类型
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
  // 文件大小限制 (10MB)
  maxSize: 10 * 1024 * 1024,
};

// 文件信息接口
export interface UploadFileInfo {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

/**
 * 生成唯一文件名
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const basename = path.basename(originalName, ext);
  const timestamp = Date.now();
  const hash = crypto.randomBytes(8).toString('hex');
  return `${basename}_${timestamp}_${hash}${ext}`;
}

/**
 * 确保上传目录存在
 */
export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(uploadConfig.uploadDir)) {
    await fs.mkdir(uploadConfig.uploadDir, { recursive: true });
  }
}

/**
 * 验证文件类型
 */
export function validateFileType(mimetype: string): boolean {
  return uploadConfig.allowedMimeTypes.includes(mimetype);
}

/**
 * 验证文件大小
 */
export function validateFileSize(size: number): boolean {
  return size <= uploadConfig.maxSize;
}

/**
 * 获取文件 URL
 */
export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}
