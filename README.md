# 第N实验室 | The Nth Room

实验室主页使用普通高清电路板照片作静态主视觉，包含可横向滚动的 PCB 制作、焊接和 3D 打印机主题卡片，以及从 `assets/site-data.js` 读取的近期培训安排。三个主题分别链接到 `courses/` 下的独立页面。

三个课程页通过 `videos/` 中的 MP4 文件使用相对路径播放。当前 `videos/` 文件是桌面 `视频\视频\A` 原件的硬链接，本机播放不额外复制视频数据。`.gitattributes` 将 MP4 交由 Git LFS 跟踪；GitHub Pages workflow 会将网页播放器改为读取公开仓库的 LFS 媒体地址，因此仓库需要公开，且 LFS 用量需在账号额度内。

## 内容配置

编辑 `assets/site-data.js`：

- `trainingStartWeek`：每周安排表的首周周一日期，使用 `YYYY-MM-DD`。
- `training`：已确认的培训活动，以 `weekStart` 周一日期归入对应周，可添加时间、标题和说明；后续未确认周次自动显示“待安排”。
- `announcement`：本周讲解公告。
- `share.url` 与 `share.code`：每周百度网盘链接和提取码。
- `qq.number` 与 `qq.url`：群号和实际加群链接。
- `assets/embedded-board.jpg`：主页的电路板主视觉。

未填写的培训、公告、网盘或QQ群信息会显示为待更新，不会生成虚假日程或入口。

## 预览与发布

本地可直接打开 `index.html`。推送到 `main` 后，`.github/workflows/pages.yml` 会将静态页面发布到 GitHub Pages。将项目复制到另一台电脑时，需确保 `videos/` 中包含实际视频文件。

主视觉照片来自 Unsplash 的电路板图片；用户可在 `index.html` 页脚找到来源入口。
