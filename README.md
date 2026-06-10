# 智课

智课是 Web First 的 AI 教学课堂演示系统，面向代理商推广、学校试讲和未来课堂方案展示。

当前主路线：

- Web 优先：打开网址即可演示
- Demo Classroom：固定最佳课堂案例，稳定可展示
- AI 生成：联网时调用 DeepSeek，失败时自动 fallback 到 Demo
- 经销商销售版：多账号登录、水印归属、每日 AI 次数限制与轻量后台
- Desktop 备用：Electron 仅作为离线 Demo Package，不再作为主产品路线

## 为什么 Web First

智课真正核心不是桌面软件，而是 AI 教学演示体验。

Web 版本更适合当前代理商阶段：

- 不需要下载安装
- 不需要处理 Windows 兼容问题
- 不依赖本地路径
- 代理商打开网址即可试讲
- 更适合大屏、投影、iPad 和浏览器展示
- 更容易部署、更新和远程支持

Electron 版本保留为备用，只用于无网络或特殊学校环境的离线 Demo。

## v1.5 经销商销售版

智课 AI 当前支持本地轻量账号体系，用于河北经销商销售演示阶段：

- 管理员后台：账号、模型、API Key、使用次数
- 多账号演示：管理员、经销商、学校试用、Demo
- 账号水印：工作台、AI 内容、复制和导出内容附加账号水印
- 每日次数：不同账号可配置不同 AI 生成上限
- 本地存储：第一版使用 localStorage，不引入数据库和 SaaS 后台

默认账号：

| 账号 | 密码 | 角色 | 每日次数 | 水印 |
| --- | --- | --- | --- | --- |
| admin | admin123 | admin | 999 | 智课AI管理后台 |
| hebei | 123456 | agent | 50 | 河北经销商演示版 |
| school | 123456 | school | 20 | 学校试用版 |
| demo | 123456 | demo | 10 | 智课AI演示版 |

> 安全说明：当前账号、API Key 管理和使用记录为本地演示版能力，数据保存在浏览器 localStorage。正式生产环境需要接入服务端鉴权和数据库后再对外开放完整管理能力。

## 代理商演示方式

代理商打开 Web 地址后：

1. 登录 Demo 账号
2. 进入 Demo Classroom
3. 选择固定课堂案例
4. 点击“开始 AI 课堂演示”
5. 进入全屏课堂模式

## Demo Classroom

内置固定 Demo：

- 气候变化
- 洋流
- 中国地形
- 地震

固定 Demo 不扣 AI 使用次数，适合代理商现场快速展示。

## AI 使用次数

每个账号的每日 AI 生成次数由后台配置。默认经销商账号 `hebei` 为 50 次/天，学校试用账号为 20 次/天，Demo 账号为 10 次/天。

扣次数的行为：

- AI 教案生成
- AI PPT 生成
- AI 互动题生成
- AI 课后练习生成
- AI 新课程生成

不扣次数的行为：

- 查看 Demo Classroom
- 浏览固定课堂
- 全屏课堂演示
- 查看 Demo PPT

## AI Fallback

智课需要部署到 CloudBase 云托管 / Node SSR 服务。AI 生成按钮会调用服务端 `/api/generate`，由服务端读取 DeepSeek Key。

如果 DeepSeek 不可用、网络超时或 AI 返回结构异常，服务端会自动 fallback 到内置 Demo 数据。

fallback 提示：

```text
当前 AI 服务不可用，已切换至 Demo 模式。
```

目标是：

```text
演示永不崩溃。
```

## DeepSeek 配置

智课统一使用 DeepSeek V4 Flash。DeepSeek API Key 只放在服务端环境变量中，不要使用 `NEXT_PUBLIC_DEEPSEEK_API_KEY`，也不要把真实 Key 上传到 GitHub。

1. 在项目根目录创建 `.env.local`
2. 填入 `DEEPSEEK_API_KEY`
3. 运行 `npm run dev`
4. 上线前运行 `npm run build`
5. 腾讯云部署时，在云托管环境变量中配置同样的 Key

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=60000
```

AI 请求由服务端 `/api/generate` 发起：

```bash
POST https://api.deepseek.com/chat/completions
model=deepseek-v4-flash
thinking.type=disabled
```

服务端统一读取 `DEEPSEEK_API_KEY`。没有配置 API Key 时，系统会使用内置 Demo fallback。

## 本地开发

安装依赖：

```bash
npm install --legacy-peer-deps
```

启动开发：

```bash
npm run dev
```

打开：

```bash
http://localhost:3000
```

构建 Web：

```bash
npm run build
```

生产启动：

```bash
npm start
```

## Web 部署

推荐部署平台：

- 腾讯云 CloudBase
- Vercel
- Railway
- Cloudflare Pages

部署要点：

- 配置 DeepSeek 环境变量
- Demo 数据已内置
- 不需要数据库
- 不需要 Redis
- 不需要 SaaS 后台

## CloudBase 部署

智课必须使用 CloudBase 云托管 / Node SSR 部署，不要部署到静态网站托管。

当前生产环境：

```bash
环境名称：zhike-prod
地域：上海
```

项目已包含：

- `cloudbaserc.json`
- `cloudbase.json`
- `.env.example`
- `DEPLOY_CHECKLIST.md`

### 1. 安装 CloudBase CLI

```bash
npm install -g @cloudbase/cli
```

安装后确认：

```bash
tcb -v
```

### 2. 登录 CloudBase

```bash
cloudbase login
```

或：

```bash
tcb login
```

### 3. 确认环境

CloudBase 环境 ID 使用：

```bash
zhike-prod
```

项目配置已写入 `cloudbaserc.json`：

```json
{
  "envId": "zhike-prod"
}
```

### 4. 配置环境变量

在 CloudBase 云托管环境变量中配置：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
NEXT_PUBLIC_APP_NAME=智课
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_DEMO_MODE=true
```

不要配置 `NEXT_PUBLIC_DEEPSEEK_API_KEY`，避免 API Key 暴露到浏览器。

### 5. 本地构建检查

```bash
npm install
npm run build
```

确认 API Route 已被识别：

```bash
npm run build
```

### 6. 部署

```bash
tcb app deploy
```

如果本机只安装了 `cloudbase` 命令，也可以使用：

```bash
cloudbase app deploy
```

### 7. 域名绑定与 HTTPS

部署完成后，在 CloudBase 控制台完成：

1. 进入 Web 应用
2. 绑定自定义域名 `zhikeclassroom.com`
3. 开启 HTTPS 证书
4. 等待 DNS 生效

完成后代理商访问：

```bash
https://zhikeclassroom.com
```

登录：

```bash
hebei / 123456
```

即可进入 Demo Classroom。

### 8. 部署后检查

参考：

```bash
DEPLOY_CHECKLIST.md
```

## PWA 预留

项目已包含：

- `public/manifest.json`
- `theme-color`
- 应用图标

后续可以支持“添加到桌面”，用 Web 方式获得接近 App 的入口体验。

## Desktop 备用

Electron 仍保留，但定位调整为：

```text
Offline Demo Package
```

可用于：

- 无网络学校场景
- 固定课堂演示
- 离线 Demo 备用

不再重点开发：

- 自动更新
- 安装器
- 本地数据库
- 本地模型
- 代码签名
- macOS notarization

## Electron 备用命令

```bash
npm run electron:build
npm run dist:win
npm run dist:win:mirror
npm run dist:mac
```

注意：Desktop 打包需要下载 Electron runtime，网络环境可能影响打包速度。Web 版本不受影响。
