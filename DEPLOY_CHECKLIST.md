# 智课 CloudBase 部署检查清单

部署命令：

```bash
npm install
npm run build
cloudbase login
tcb app deploy
```

## 页面检查

- [ ] 首页可正常打开
- [ ] 顶部显示代理商体验模式
- [ ] Web First 区块显示正常
- [ ] Demo Classroom 可访问
- [ ] AI PPT 演示页 `/ai-ppt` 可访问
- [ ] AI 教案演示页 `/lesson` 可访问
- [ ] 关于智课页 `/about` 可访问
- [ ] 联系合作页 `/contact` 可访问

## Demo 流程

- [ ] 使用 `demo01 / 123456` 可登录
- [ ] 登录后可进入 Demo Classroom
- [ ] 气候变化 Demo 可打开
- [ ] 洋流 Demo 可打开
- [ ] 中国地形 Demo 可打开
- [ ] 地震 Demo 可打开
- [ ] 点击“开始 AI 课堂演示”可进入全屏
- [ ] 全屏模式支持上一页 / 下一页
- [ ] ESC 可退出全屏

## AI 与 fallback

- [ ] CloudBase 使用云托管 / Node SSR，不是静态网站托管
- [ ] `npm start` 使用 CloudBase 注入的 `PORT`
- [ ] `/api/health` 返回正常
- [ ] `/api/generate` 可 POST 调用
- [ ] AI 生成按钮真正调用服务端 API
- [ ] DeepSeek Key 不出现在客户端源码
- [ ] AI fallback 提示显示清晰
- [ ] Demo Classroom 不扣 AI 次数
- [ ] AI 生成每日次数扣减正常

## 生产体验

- [ ] 页面无 hydration 报错
- [ ] public 静态资源可访问
- [ ] PWA manifest 可访问：`/manifest.json`
- [ ] HTTPS 正常
- [ ] 自定义域名 `zhikeclassroom.com` 可访问
- [ ] 移动端 / iPad 浏览器可打开
- [ ] Chrome / Edge / Safari 可演示
