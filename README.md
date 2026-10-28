# Genspark Slides Exporter (PPTX / PDF / ZIP / HTML)

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Python-3.9+-brightgreen.svg" alt="Python">
  <img src="https://img.shields.io/badge/Browser-Edge%20%7C%20Chrome%20%7C%20Firefox-orange.svg" alt="Browser">
  <img src="https://img.shields.io/badge/Release-v1.0.0-success.svg" alt="Release">
</p>

> ⚡ **免费一键将 Genspark AI 生成的幻灯片导出为标准 16:9 PPTX、高清 PDF、离线 ZIP 包与交互式演示网页，无视 Plus 会员付费墙限制。**

[English](#english) | [中文说明](#中文说明)

---

## 效果预览 / Preview

<p align="center">
  <img src="assets/preview_slide_1.png" width="48%" alt="Slide 1 Preview" />
  <img src="assets/preview_slide_2.png" width="48%" alt="Slide 2 Preview" />
</p>

---

## 中文说明

### 🌟 项目背景与痛点
[Genspark AI](https://www.genspark.ai/) 是一款顶尖的人工智能生产力引擎，其 **AI Slides / 幻灯片生成** 能够自动调研生成排版精美、含有丰富矢量数据图表的演示文稿。

然而，**Genspark 的幻灯片导出功能（PPTX / PDF）被严格锁定在 Plus / Pro / Team 会员付费墙后**。

本项目通过深度解析 Genspark 幻灯片的底层渲染架构（纯 HTML / SVG / CSS 1920×1080 渲染引擎），提供全套开源免会员导出方案：
1. **浏览器油猴插件（Userscript）**：在 Genspark 页面右下角注入悬浮按钮，一键免会员直接导出 PPTX、离线 ZIP 包与原始 JSON。
2. **零安装书签脚本（Bookmarklet）**：无需安装任何扩展，浏览器书签栏一点即用。
3. **Python 4K 超清离线渲染器（CLI）**：利用 Playwright / 本地 Edge 浏览器无头模式，以 4K Retina 视网膜超采样（Device Scale Factor = 2.0）将幻灯片无损渲染并合成为标准 16:9 PowerPoint（`.pptx`）、高清 PDF 以及交互式网页播放器。

---

### ✨ 核心特性
- 🔓 **无视会员墙**：无需付费升级 Plus / Pro 会员，永久免费导出。
- 🖥️ **4K 视网膜级画质**：默认 2.0x 渲染采样（3840×2160），字迹与矢量图表极度锐利。
- 📊 **标准 16:9 宽屏 PPTX**：导出的 `.pptx` 完美适配 Microsoft PowerPoint、WPS Office、Apple Keynote 及 Google Slides。
- 📑 **高清多页 PDF**：一键生成无水印、高分辨率的印刷级多页 PDF。
- 📦 **完整离线 HTML 演示包**：打包全部 100% 原始矢量 HTML、SVG、CSS 与独立播放器（`index.html`），脱网状态下也能全屏播放。

---

### 🚀 使用方法

#### 方式一：油猴脚本（Tampermonkey，推荐）
1. 安装浏览器扩展：[Tampermonkey (油猴)](https://www.tampermonkey.net/) 或 Violentmonkey。
2. 点击安装脚本：[genspark-exporter.user.js](https://raw.githubusercontent.com/avilliai/genspark-ppt-exporter/main/genspark-exporter.user.js)。
3. 打开 Genspark 任意演示文稿页面（例如 `https://www.genspark.ai/agents?id=...`），页面右下角将出现 **`⚡ 免费导出 PPT`** 悬浮按钮。
4. 点击即可一键导出 PPTX、离线 ZIP 包或原始 JSON。

#### 方式二：零安装书签脚本（Bookmarklet）
如果您不想安装油猴插件，可以直接在浏览器中添加书签：
1. 新建浏览器书签，名称填写 `导出 Genspark PPT`。
2. 网址（URL）粘贴 [genspark-bookmarklet.js](genspark-bookmarklet.js) 中的代码。
3. 在 Genspark 幻灯片页面点击该书签，右下角即可唤出导出菜单。

#### 方式三：Python 4K 超清渲染器（画质最高、支持批量）
适合追求极致 4K 画质、本地离线存档或批处理的用户。

##### 1. 安装依赖
```bash
git clone https://github.com/avilliai/genspark-ppt-exporter.git
cd genspark-ppt-exporter

pip install -r requirements.txt
playwright install chromium
```
> *注：Windows 环境下若已安装 Microsoft Edge，脚本将自动优先调用系统自带的 Edge 浏览器。*

##### 2. 运行导出
从 Genspark 页面使用油猴脚本下载 `genspark-slides-data.json`，然后运行：

```bash
# 自动生成 PPTX + PDF + 交互式 HTML 播放器
python genspark_exporter.py genspark-slides-data.json -o ./output

# 自定义超分辨率采样倍率（默认 2.0，即 3840x2160）
python genspark_exporter.py genspark-slides-data.json -o ./output --scale 2.0

# 仅导出 PPTX
python genspark_exporter.py genspark-slides-data.json -o ./output -f pptx
```

导出的目录结构如下：
```text
output/
├── Iceland_SDG_Performance.pptx    # 标准 16:9 PPTX 文件
├── Iceland_SDG_Performance.pdf     # 高清 PDF 文件
├── index.html                      # 离线全屏演示播放器
├── images/                         # 4K 幻灯片超清截图 (slide_01.png ~ slide_10.png)
└── html/                           # 纯矢量 HTML/CSS 源代码
```

---

<a name="english"></a>
## English Description

### 🌟 Overview
[Genspark AI](https://www.genspark.ai/) is an AI productivity platform capable of generating structured, highly polished presentations with rich charts and typography.

However, **exporting slides to PPTX / PDF is locked behind a Plus / Pro paywall**.

**Genspark Slides Exporter** provides a complete free suite to extract, render, and convert Genspark presentations into standard **PPTX**, **PDF**, **ZIP**, and **offline HTML players**.

### ✨ Features
- 🔓 **Bypass Paywall**: Export slides without requiring a Plus/Pro membership.
- 🖥️ **Ultra HD / 4K Retina Rendering**: Rendered at 2.0x device scale factor (3840×2160) for crystal-clear projection.
- 📊 **Standard 16:9 PPTX**: Compatible with PowerPoint, WPS, Keynote, and Google Slides.
- 📑 **Lossless PDF**: Multi-page high-DPI document ready for printing.
- 📦 **Offline HTML Pack (ZIP)**: Includes vector HTML slides and a standalone browser viewer (`index.html`) with keyboard navigation (`←`/`→`/`Space`/`F`).

### 🚀 Quick Start
- **Userscript**: Install [genspark-exporter.user.js](https://raw.githubusercontent.com/avilliai/genspark-ppt-exporter/main/genspark-exporter.user.js) via Tampermonkey.
- **Bookmarklet**: Use code from [genspark-bookmarklet.js](genspark-bookmarklet.js).
- **Python CLI**: Run `python genspark_exporter.py genspark-slides-data.json -o ./output`.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
