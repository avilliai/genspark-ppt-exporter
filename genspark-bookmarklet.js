/**
 * Genspark PPT Exporter - Bookmarklet (书签脚本)
 * 无需安装油猴插件，直接在浏览器书签中添加本代码即可使用。
 * 
 * 使用方式：
 * 在浏览器中新建书签，网址（URL）填入下方代码。在 Genspark 幻灯片页面点击该书签即可唤出导出菜单。
 */

javascript:(function(){
  if(window.__gpExporterInjected){
    alert('⚡ Genspark Exporter 已激活，请查看右下角悬浮按钮！');
    return;
  }
  window.__gpExporterInjected = true;

  // Load external bundle dependencies
  const scripts = [
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'
  ];

  function loadScript(idx) {
    if (idx >= scripts.length) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/avilliai/genspark-ppt-exporter@main/genspark-exporter.user.js';
      document.body.appendChild(s);
      return;
    }
    const s = document.createElement('script');
    s.src = scripts[idx];
    s.onload = () => loadScript(idx + 1);
    document.body.appendChild(s);
  }

  loadScript(0);
})();
