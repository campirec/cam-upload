import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import mount from 'koa-mount';
import path from 'path';

import { createRouter } from './router/index.js';

export const createApp = () => {
  const app = new Koa();

  // 静态文件服务 - 提供 uploads 目录的访问
  console.log(path.join(process.cwd(), 'uploads'))
  app.use(mount('/uploads', koaStatic(path.join(process.cwd(), 'uploads'))));

  app.use(koaBody());

  const router = createRouter();
  app.use(router.routes());
  app.use(router.allowedMethods());

  // 全局错误处理
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      ctx.status = err.status || err.statusCode || 500;
      ctx.body = {
        success: false,
        message: err.message || '服务器内部错误',
      };
      // 开发环境下输出错误堆栈
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
      }
    }
  });

  return app;
}