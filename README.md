# 用户中心项目 - 鱼皮

基于 Nextjs 改造编程导航的 “用户中心” 项目，原技术栈为 java + react

https://www.codefather.cn/course/1790943469757837313

## 技术栈

### 前端

- Nextjs 15 App Router

- ShadcnUI 组件库

- Tailwindcss 4.x

### 后端

- Nextjs 15 App Router

- Drizzle ORM + Mysql 数据库

- tRPC 服务端框架

- Server 文件夹：后端服务端代码，api 路由，repositories 数据库访问，services 业务逻辑，utils 服务端专用工具函数，db 数据库连接、设置和工具，api tRPC 路由

### 测试

- Vitest：测试文件位于 `src/test` 目录下

- Rest Client: VsCode 插件，测试接口，位于 `src/test/rest-client` 目录下

### 其他第三方依赖

- bcrypt：密码加密

- zod：数据校验和类型定义

- lucide-react：开源图标库

- Jose: JWT 库，session 管理，兼容 Edge Runtime

## 启动项目

本地启动项目：

1. 初始化环境配置

配置好 `node.js` 和 `pnpm` 等包管理工具。当前为 `pnpm@9.1.0` 可在 `./package.json` 中更改。

复制 `.env.example` 为 `.env` 文件，并完善。

在 `Docker` 桌面端，初始化 `MySQL` 数据库。详细步骤见 `./start-database.sh`。（由 T3 Stack 构建）

2. 初始化项目

基于 T3 Stack 模板搭建

启动项目

```bash
pnpm i
pnpm db:generate
pnpm db:push
```

3. 构建

开发构建

```bash 
pnpm dev
```

生产构建

```bash
pnpm build
pnpm start
```

更多指令，见 `./package.json`