# AI 教学助手 MVP

这是一个独立的 AI 教育工具 Demo，不依赖数据库、不做登录、不做后台管理。

## 安装依赖

```bash
npm install
```

## 配置环境变量

编辑 `.env.local`：

```bash
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4o-mini
```

如果使用 DeepSeek：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

没有配置 API Key 时，页面会使用内置 Demo 结果，方便现场先看效果。

## 启动项目

```bash
npm run dev
```

打开：

```bash
http://localhost:3000
```

## Demo 测试

页面默认已经填好：

- 学段/年级：高中
- 学科：地理
- 教材版本：人教版
- 课题：气候变化

点击“生成教学方案”，会输出：

- 教案结构
- PPT 大纲
- 课堂互动问题
- 课后练习
