# Genspark Slides Exporter (PPTX / PDF / ZIP / HTML)

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Python-3.9+-brightgreen.svg" alt="Python">
  <img src="https://img.shields.io/badge/Browser-Edge%20%7C%20Chrome%20%7C%20Firefox-orange.svg" alt="Browser">
  <img src="https://img.shields.io/badge/Tampermonkey-Supported-success.svg" alt="Tampermonkey">
</p>

[English](#english) | [中文说明](#中文说明)

---

## 中文说明

### 🌟 项目背景与痛点
[Genspark AI](https://www.genspark.ai/) 是一款非常出色的人工智能生产力工具，特别是其 **AI Slides / 幻灯片生成** 功能，能够自动根据复杂主题调研并生成排版极其精美、含有丰富矢量图表与现代排版的演示文稿。

然而，**Genspark 的幻灯片导出功能（PPTX / PDF）被锁定在 Plus / Pro / Team 付费会员墙之后**。普通用户辛苦生成的优质演示文稿无法直接下载到本地进行离线演示或二次编辑。

本项目通过解析 Genspark 幻灯片的底层矢量架构（纯 HTML / SVG / CSS 1920×1080 渲染引擎），提供了**全套免费开源的幻灯片导出与离线方案**：
1. **浏览器油猴插件（Tampermonkey Userscript）**：在 Genspark 页面右下角注入悬浮菜单，一键免会员直接导出 PPTX、离线 ZIP 包及原始 JSON。
2. **Python 4K 超清离线渲染器（CLI）**：利用 Playwright / 本地 Edge 浏览器无头模式，以 4K Retina 视网膜超采样（Device Scale Factor = 2.0）将幻灯片无损渲染并合成为标准 16:9 PowerPoint（`.pptx`）、高清 PDF 以及交互式网页播放器。

---

### ✨ 核心特性
- 🔓 **无视会员墙**：无需付费升级 Plus / Pro 会员，永久免费导出。
- 🖥️ **4K 视网膜级画质**：默认 2.0x 渲染采样（3840×2160），在大型会议投影仪或高分屏上展示依然字迹锐利。
- 📊 **标准 16:9 宽屏 PPTX**：导出的 `.pptx` 完美适配 Microsoft PowerPoint、WPS Office、Apple Keynote 及 Google Slides。
- 📑 **高清多页 PDF**：一键生成无水印、高分辨率的印刷级多页 PDF。
- 📦 **完整离线 HTML 演示包**：打包全部 100% 原始矢量 HTML、SVG、CSS 与独立播放器（`index.html`），支持脱网全屏播放。

---

### 🚀 使用方法

#### 方式一：油猴脚本（Tampermonkey / Violentmonkey，推荐）
最简单快捷的方式，直接在浏览器中一键操作。

1. 安装浏览器脚本管理器插件：[Tampermonkey (油猴)](https://www.tampermonkey.net/) 或 Violentmonkey。
2. 安装本脚本：
   - 点击安装链接：[genspark-exporter.user.js](https://raw.githubusercontent.com/avilliai/genspark-ppt-exporter/main/genspark-exporter.user.js)
   - 或在油猴管理面板中新建脚本，将本项目 `genspark-exporter.user.js` 的内容复制进去保存。
3. 打开 Genspark 任意演示文稿页面（例如 `https://www.genspark.ai/agents?id=...`），页面右下角将出现 **`⚡ 免费导出 PPT`** 悬浮按钮。
4. 点击即可选择导出：
   - **导出 PPTX (PowerPoint)**
   - **导出 完整离线 HTML 包 (ZIP)**
   - **导出 原始 JSON 数据**

---

#### 方式二：Python 4K 超清渲染器（画质最高、支持批量）

适合追求极致 4K 画质、本地离线存档或批处理的用户。

##### 1. 安装依赖
```bash
git clone https://github.com/avilliai/genspark-ppt-exporter.git
cd genspark-ppt-exporter

pip install -r requirements.txt
playwright install chromium
```
> *注：Windows 环境下若已安装 Microsoft Edge，脚本将自动优先调用系统自带的 Edge 浏览器。*

##### 2. 导出演示文稿
从 Genspark 页面使用油猴脚本下载 `genspark-slides-data.json`，或通过浏览器 DevTools 的 Network 面板复制 slides 响应数据，然后运行：

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
[Genspark AI](https://www.genspark.ai/) is a powerful AI research engine capable of generating visually stunning presentations complete with data visualizations, modern typography, and structured content.

However, **exporting slides to PPTX or PDF is restricted to paid Plus / Pro members**.

**Genspark Slides Exporter** is a free, open-source solution that extracts the underlying vector HTML/CSS slides and generates high-resolution **PPTX**, **PDF**, **ZIP**, and **standalone offline HTML presentation viewers**.

### ✨ Features
- 🔓 **Bypass Paywall**: Export slides without requiring a Plus/Pro membership.
- 🖥️ **Ultra HD / 4K Retina Rendering**: Rendered at 2.0x device scale factor (3840×2160) for crystal-clear presentation on 4K projectors and displays.
- 📊 **Standard 16:9 PPTX**: Seamlessly opens in PowerPoint, WPS, Keynote, and Google Slides.
- 📑 **Lossless PDF**: Multi-page high-DPI document.
- 📦 **Offline HTML Pack (ZIP)**: Includes vector HTML slides and a standalone browser viewer (`index.html`) with keyboard navigation (`←`/`→`/`Space`/`F`).

### 🚀 Quick Start

#### Option 1: Tampermonkey Userscript (Browser In-Page)
1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Click to install: [genspark-exporter.user.js](https://raw.githubusercontent.com/avilliai/genspark-ppt-exporter/main/genspark-exporter.user.js).
3. Visit any Genspark presentation page and click the floating **`⚡ 免费导出 PPT`** button on the bottom right.

#### Option 2: Python 4K CLI Renderer
```bash
git clone https://github.com/avilliai/genspark-ppt-exporter.git
cd genspark-ppt-exporter
pip install -r requirements.txt
playwright install chromium

# Run exporter
python genspark_exporter.py genspark-slides-data.json -o ./output
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
