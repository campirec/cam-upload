# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

文件上传学习/演示项目，包含前端上传界面和后端上传 API。

## 仓库结构

pnpm workspace 单仓库（pnpm 10.14.0），全局 ESM（`"type": "module"`）。

- `apps/upload-front-end` — 原生 TypeScript + Vite 前端（无框架），端口 5173
- `apps/upload-server` — Koa + multer 后端 API，端口 3000
- `packages/` — 共享包目录（暂为空）

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器
pnpm --filter upload-front-end dev

# 启动后端开发服务器（watch 模式）
pnpm --filter upload-server dev

# 启动后端（单次运行）
pnpm --filter upload-server serve
```

无构建脚本、无 lint 工具、无测试框架。手动 API 测试文件位于 `apps/upload-front-end/src/test/basic-upload.http`。

## TypeScript 配置

三层继承结构：
- `tsconfig.common.json` — 基础配置：strict、`verbatimModuleSyntax`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`
- `tsconfig.node.json` — 继承 common，`module: "NodeNext"`，用于后端
- `tsconfig.web.json` — 继承 common，`module: "ESNext"`、`moduleResolution: "bundler"`，用于前端

各 app 的 tsconfig 继承对应的 node/web 配置。

## 代码约定

- ESM 模块，import 路径使用 `.js` 扩展名
- 工厂模式：`createApp()`、`createRouter()`
- 后端使用 `tsx` 直接运行 TypeScript，无编译步骤
- 代码注释和 UI 文本使用中文

## 后端架构

入口 `main.ts` → `app.ts`（createApp，组装中间件）→ `router/index.ts`（路由定义）→ `utils/upload.ts`（上传配置与工具函数）

当前 API 端点：`POST /upload-simple`（multer 处理 multipart 文件上传）

上传文件存储在 `apps/upload-server/uploads/`，通过 koa-static 以 `/uploads` 路径提供静态访问。
