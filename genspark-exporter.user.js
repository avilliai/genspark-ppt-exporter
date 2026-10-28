// ==UserScript==
// @name         Genspark Slides Exporter (PPTX / PDF / ZIP)
// @namespace    https://github.com/avilliai/genspark-ppt-exporter
// @version      1.0.0
// @description  免费一键导出 Genspark 幻灯片为 PPTX、PDF、ZIP离线包或 JSON 数据，无视 Plus 会员付费墙限制。
// @author       avilliai
// @match        https://www.genspark.ai/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  let latestSlidesData = null;

  // Intercept fetch & XHR to capture slides project data
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
    
    if (url.includes('/api/slides_git/') || url.includes('/slides') || url.includes('slides_data')) {
      try {
        const clone = response.clone();
        clone.json().then(data => {
          if (data && (data.data?.file_contents || data.file_contents || data.data?.meta_data)) {
            latestSlidesData = data;
            console.log('[Genspark Exporter] Captured slides data:', latestSlidesData);
            showNotification('✓ 已成功捕获当前幻灯片数据！');
          }
        }).catch(() => {});
      } catch (e) {}
    }
    return response;
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener('load', function () {
      if (url.includes('/api/slides_git/') || url.includes('/slides')) {
        try {
          const data = JSON.parse(this.responseText);
          if (data && (data.data?.file_contents || data.file_contents || data.data?.meta_data)) {
            latestSlidesData = data;
            console.log('[Genspark Exporter] Captured slides data (XHR):', latestSlidesData);
            showNotification('✓ 已成功捕获当前幻灯片数据！');
          }
        } catch (e) {}
      }
    });
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  // Notification Toast
  function showNotification(msg) {
    let toast = document.getElementById('gp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gp-toast';
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 999999;
        background: #1e293b; color: #38bdf8; padding: 10px 18px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid #334155;
        transition: opacity 0.3s ease; pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      if (toast) toast.style.opacity = '0';
    }, 2500);
  }

  // Inject UI
  function initUI() {
    if (document.getElementById('gp-exporter-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'gp-exporter-btn';
    btn.innerHTML = '⚡ 免费导出 PPT';
    btn.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 999990;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #ffffff; border: none; border-radius: 50px;
      padding: 12px 22px; font-size: 14px; font-weight: 600;
      cursor: pointer; box-shadow: 0 8px 24px rgba(37,99,235,0.4);
      display: flex; align-items: center; gap: 8px;
      transition: all 0.2s ease;
    `;
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';

    const menu = document.createElement('div');
    menu.id = 'gp-exporter-menu';
    menu.style.cssText = `
      position: fixed; bottom: 80px; right: 30px; z-index: 999991;
      background: #1e293b; border: 1px solid #334155; border-radius: 12px;
      padding: 12px; display: none; flex-direction: column; gap: 8px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5); min-width: 200px;
    `;

    const createMenuItem = (text, icon, onClick) => {
      const item = document.createElement('button');
      item.innerHTML = `<span style="font-size:16px;">${icon}</span><span>${text}</span>`;
      item.style.cssText = `
        background: #0f172a; color: #f8fafc; border: 1px solid #334155;
        border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 500;
        cursor: pointer; display: flex; align-items: center; gap: 10px;
        transition: all 0.15s ease; text-align: left;
      `;
      item.onmouseover = () => { item.style.background = '#2563eb'; item.style.borderColor = '#3b82f6'; };
      item.onmouseout = () => { item.style.background = '#0f172a'; item.style.borderColor = '#334155'; };
      item.onclick = onClick;
      return item;
    };

    menu.appendChild(createMenuItem('导出 PPTX (PowerPoint)', '📊', exportPPTX));
    menu.appendChild(createMenuItem('导出 完整离线 HTML 包 (ZIP)', '📦', exportZIP));
    menu.appendChild(createMenuItem('导出 原始 JSON 数据', '💾', exportJSON));
    menu.appendChild(createMenuItem('使用 Python 4K 无损渲染器', '🚀', () => {
      window.open('https://github.com/avilliai/genspark-ppt-exporter', '_blank');
    }));

    btn.onclick = () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };

    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }

  // Get data helper
  function getSlidesData() {
    if (latestSlidesData) return latestSlidesData;
    // Check if stored in window or DOM
    try {
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const s of scripts) {
        if (s.textContent.includes('file_contents') && s.textContent.includes('01-')) {
          const match = s.textContent.match(/(\{.*"file_contents".*\})/);
          if (match) return JSON.parse(match[1]);
        }
      }
    } catch (e) {}
    return null;
  }

  // Export JSON
  function exportJSON() {
    const data = getSlidesData();
    if (!data) {
      alert('未捕获到幻灯片数据，请先在页面中翻阅查看幻灯片或刷新重试！');
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'genspark-slides-data.json');
  }

  // Export ZIP
  async function exportZIP() {
    const data = getSlidesData();
    if (!data) {
      alert('未捕获到幻灯片数据，请先在页面中翻阅查看幻灯片或刷新重试！');
      return;
    }
    const fileContents = data.data?.file_contents || data.file_contents || [];
    const meta = data.data?.meta_data || data.meta_data || {};
    const title = meta.title || 'genspark-presentation';

    showNotification('正在打包 ZIP 离线文件...');
    const zip = new JSZip();
    const htmlFolder = zip.folder('html');

    const htmlNames = [];
    fileContents.forEach((item, i) => {
      const fn = item.filename || `slide_${(i + 1).toString().padStart(2, '0')}.html`;
      htmlNames.push(`html/${fn}`);
      htmlFolder.file(fn, item.content || '');
    });

    // Add index.html viewer
    const viewerHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
body{margin:0;background:#000;color:#fff;font-family:sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden;}
header{background:#1e293b;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;}
button{background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:6px 14px;cursor:pointer;font-size:14px;}
iframe{flex:1;border:none;width:100%;height:100%;}
</style></head>
<body>
<header>
<div>${title}</div>
<div>
<button onclick="p()">◀ 上一张</button>
<span id="c" style="margin:0 15px;">1 / ${htmlNames.length}</span>
<button onclick="n()">下一张 ▶</button>
</div>
</header>
<iframe id="f" src="${htmlNames[0]}"></iframe>
<script>
const s = ${JSON.stringify(htmlNames)};
let idx = 0;
function p(){ if(idx>0){ idx--; u(); } }
function n(){ if(idx<s.length-1){ idx++; u(); } }
function u(){ document.getElementById('f').src = s[idx]; document.getElementById('c').textContent = (idx+1) + ' / ' + s.length; }
window.addEventListener('keydown', e => { if(e.key==='ArrowRight'||e.key===' ') n(); if(e.key==='ArrowLeft') p(); });
</script></body></html>`;

    zip.file('index.html', viewerHtml);
    zip.file('genspark-slides-data.json', JSON.stringify(data, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${meta.file_prefix || 'genspark-presentation'}.zip`);
    showNotification('✓ ZIP 打包下载完成！');
  }

  // Export PPTX
  async function exportPPTX() {
    const data = getSlidesData();
    if (!data) {
      alert('未捕获到幻灯片数据，请先翻动幻灯片或刷新重试！');
      return;
    }
    const fileContents = data.data?.file_contents || data.file_contents || [];
    if (!fileContents.length) {
      alert('未找到幻灯片内容！');
      return;
    }

    showNotification('正在生成 PPTX，请稍候...');

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    // Hidden iframe container for rendering
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed; left:-9999px; top:-9999px; width:1920px; height:1080px; z-index:-1;';
    document.body.appendChild(container);

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:1920px; height:1080px; border:none;';
    container.appendChild(iframe);

    try {
      for (let i = 0; i < fileContents.length; i++) {
        showNotification(`正在渲染第 ${i + 1} / ${fileContents.length} 页...`);
        const item = fileContents[i];
        
        await new Promise(resolve => {
          iframe.srcdoc = item.content || '';
          iframe.onload = () => setTimeout(resolve, 800);
        });

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const targetElement = doc.querySelector('.slide-container') || doc.body;

        const canvas = await html2canvas(targetElement, {
          width: 1920,
          height: 1080,
          scale: 1.5,
          useCORS: true,
          logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const slide = pptx.addSlide();
        slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
      }

      const meta = data.data?.meta_data || data.meta_data || {};
      const filename = `${meta.file_prefix || 'genspark-presentation'}.pptx`;
      await pptx.writeFile({ fileName: filename });
      showNotification('✓ PPTX 导出完成并已下载！');
    } catch (err) {
      console.error(err);
      alert('浏览器前端生成 PPTX 发生错误，建议使用项目提供的 Python 4K 无损导出脚本！错误信息: ' + err.message);
    } finally {
      document.body.removeChild(container);
    }
  }

  // Polling to attach UI when page loads
  const timer = setInterval(() => {
    if (document.body) {
      initUI();
      clearInterval(timer);
    }
  }, 500);

})();
