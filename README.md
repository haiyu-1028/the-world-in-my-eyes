# 镜中世界 · 线上画廊

## 文件说明

| 文件 | 作用 | 大小限制 |
|------|------|----------|
| `index.html` | 主程序（前台+后台全部功能） | 无限制 |
| `data.json` | 文字数据（展览/专栏/策展人/浏览量） | 建议 < 1MB |
| `photos.json` | 照片数据（base64 编码） | GitHub 单文件 100MB |
| `theme.json` | 外观配置（背景/字体/颜色） | 几 KB |
| `.nojekyll` | 告诉 GitHub 不要处理成 Jekyll 站点 | 空文件 |

## 核心架构：分离式存储

```
data.json    → 只存文字（展览名/策展陈述/专栏正文/浏览量）
photos.json  → 只存照片（base64，按 photo_xxx 编号引用）
theme.json   → 只存外观（颜色/字体）

data.json 里的展览 → groups[].photos[] 存的是 photos.json 的 key
                         例如 "photo_1718..." → photos["photo_1718..."] = "data:image/jpeg;base64,..."
```

## 为什么这样设计？

1. **data.json 永远很小**：只有文字，几 KB，不怕超 5MB localStorage 限制
2. **photos.json 可以很大**：GitHub 单文件限制 100MB，够存几百张高清图
3. **改文字不用重新传照片**：改了展览介绍，只导出 data.json 上传即可
4. **照片质量更高**：压缩质量从 85% 提升到 95%，最大宽度 2400px

## 操作流程

### 第一次部署
1. 把这 5 个文件一起上传到 GitHub 仓库根目录
2. Settings → Pages → Source: Deploy from a branch → main / (root) → Save
3. 等 2 分钟 → 浏览器开 `https://haiyu-1028.github.io/the-world-in-my-eyes/` → Cmd+Shift+R

### 日常更新（改文字内容）
1. 打开网站 → 点右上角「⚙ 管理」→ 登录（海屿 / mse20221028）
2. 改展览/专栏/策展人信息
3. 后台左侧点「⚙ 设置」
4. 点「📤 导出数据」→ 下载 data.json
5. 上传到 GitHub 覆盖旧的 data.json
6. 等 1 分钟 → 强刷页面

### 上传照片
1. 后台点「🖼 上传」
2. 选展览 → 填组照标题 → 点虚线框选图片（可多选）
3. 点「⬆ 上传并保存组照」
4. 去「⚙ 设置」
5. 点「📤 导出数据」→ 下载 data.json
6. 点「📷 导出照片」→ 下载 photos.json
7. **两个文件都上传到 GitHub 覆盖旧的**
8. 等 1 分钟 → 强刷 → 照片出现

### 修改外观
1. 后台 →「🎨 外观」→ 改背景/字体/颜色
2. 去「⚙ 设置」→「📤 导出外观」→ 下载 theme.json
3. 上传覆盖 GitHub 上的 theme.json

## 重要提醒

> **GitHub Pages 是"只读"的静态托管。**
> 你在网页上做的所有修改，只存在浏览器内存里。
> **必须手动导出 → 上传覆盖 → 等 1-2 分钟 → 强刷**，别人才能看到。

## 登录信息

- 账号：`海屿`
- 密码：`mse20221028`

## 常见问题

| 问题 | 解决 |
|------|------|
| 页面空白/404 | 检查 Settings → Pages 是否 Deploy from a branch + main + /(root) |
| 照片不显示 | 确认 photos.json 和 data.json 都上传了，且 data 里的 photoRef 在 photos.json 中存在 |
| 改了没变化 | 等 1-2 分钟 + Cmd+Shift+R 强刷 |
| 存储已满提示 | 去设置 → 清空所有照片 → 重新上传（或删除不用的照片） |
| 字体上传没反应 | 确认文件后缀是 .ttf/.otf/.woff/.woff2，且大小 < 5MB |
