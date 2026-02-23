import Router from "@koa/router";
import multer from "@koa/multer";
import {
  ensureUploadDir,
  generateUniqueFilename,
  validateFileType,
  getFileUrl,
  uploadConfig,
  type UploadFileInfo,
} from "../utils/upload.js";

// 确保 uploads 目录存在
await ensureUploadDir();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadConfig.uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// 文件过滤器
const fileFilter = (
  _req: any,
  file: any,
  cb: any,
) => {
  // 验证文件类型
  if (!validateFileType(file.mimetype)) {
    return cb(new Error(`不支持的文件类型: ${file.mimetype}`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxSize,
  },
});

export const createRouter = () => {
  const router = new Router();

  /**
   * 简单文件上传接口
   * POST /upload-simple
   * Content-Type: multipart/form-data
   */
  router.post("/upload-simple", upload.single("file"), async (ctx) => {
    const file = ctx.file;

    if (!file) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "请选择要上传的文件",
      };
      return;
    }

    // 构建文件信息响应
    const fileInfo: UploadFileInfo = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: getFileUrl(file.filename),
    };

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "文件上传成功",
      data: fileInfo,
    };
  });

  return router;
};
