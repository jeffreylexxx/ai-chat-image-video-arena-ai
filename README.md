# AI Model Evolution Arena

一个适合发布到 GitHub Pages 的静态网页项目，用时间线、评分曲线、排名表和二维胜率热力图展示主流 AI 模型的发展过程。

页面分为三个板块：

- **CHAT**：OpenAI、Anthropic、Google、xAI、Meta、DeepSeek、Qwen、Kimi、MiniMax 等语言模型家族。
- **IMAGE**：OpenAI、Google、Google Nano Banana、Midjourney、Black Forest Labs、Stability 等图像模型家族。
- **VIDEO**：OpenAI Sora、Google Veo、Runway、Kling、Seedance、Wan、Pika Labs 等视频模型家族。

## 项目特性

- **代际主线模式**：每个模型家族只保留最能代表版本演进的主节点，避免把同代 preview、pro、high、不同分辨率变体全部塞进一条曲线。
- **时间单调绘制**：所有曲线渲染前都会按发布日期升序排序，同一天多个节点会做稳定时间偏移，避免垂直乱线和曲线回折。
- **即时节点提示**：鼠标移动到模型节点时立即显示模型名称、发布日期和当前指标值，不依赖浏览器默认 tooltip。
- **多指标切换**：支持 `Score / Elo`、`Rank`、`Win rate` 三种视角。
- **每日快照**：线上页面优先读取 `data/snapshot.json`；如果本地直接打开文件导致 JSON 不可读取，则使用 `app.js` 内置兜底数据。
- **自动发现**：每日更新脚本会抓取公开榜单/发布页，并根据 watchlist 与正则识别新增模型；Google 图像模型会专门识别 `Nano Banana`、`Nano Banana Pro`、`Nano Banana 2` 以及后续同名新版本。

## 本地运行

```bash
npm run start
```

然后打开：

```text
http://localhost:4173
```

如果只是快速查看，也可以直接打开 `index.html`。直接打开时浏览器可能不允许读取 `data/snapshot.json`，页面会自动使用内置兜底数据。

## 更新数据

手动刷新每日快照：

```bash
npm run update:snapshot
```

检查脚本语法：

```bash
npm run check
```

## GitHub Pages 发布

1. 把本项目推送到 GitHub 仓库。
2. 进入仓库的 **Settings → Pages**。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub Pages 构建完成。

## 每日自动更新

仓库包含 `.github/workflows/update-snapshot.yml`。它会在每天 UTC 18:10 运行一次：

1. 使用 Node.js 执行 `scripts/update-snapshot.mjs`。
2. 抓取公开 leaderboard 和模型发布页。
3. 对 watchlist 中的新模型名称做识别。
4. 更新 `data/snapshot.json`。
5. 如果快照变化，则自动提交到仓库。

默认数据抓取目标包括：

- [Arena.ai Text leaderboard](https://arena.ai/leaderboard/text)
- [LMArena leaderboard](https://lmarena.ai/leaderboard)
- [Arena.ai Text-to-Image leaderboard](https://arena.ai/leaderboard/text-to-image)
- [Arena.ai Image Edit leaderboard](https://arena.ai/leaderboard/image-edit)
- [Artificial Analysis Text-to-Video leaderboard](https://artificialanalysis.ai/embed/text-to-video-leaderboard/leaderboard/text-to-video)
- [Arena.ai Video Edit leaderboard](https://arena.ai/leaderboard/video-edit)
- [Google Nano Banana 2 announcement](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)
- [Gemini image generation overview](https://gemini.google/overview/image-generation/)

## 数据口径说明

榜单数据来自公开页面时，优先保留 leaderboard 中可观察到的模型名称、排名和分数线索。部分历史节点使用归一化估计值，以便在同一张时间演化图里展示代际趋势。自动发现的新模型会先作为候选节点写入每日快照，后续可以人工校准发布日期、Elo、胜率和排名。

这个项目更适合做“竞争格局和代际趋势展示”，不应被当作严格基准论文或官方排行榜镜像。
