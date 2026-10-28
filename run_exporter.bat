@echo off
chcp 65001 >nul
title Genspark PPT Exporter

echo =======================================================
echo          Genspark Slides to PPTX / PDF Exporter
echo =======================================================
echo.

if "%~1"=="" (
    echo [提示] 请直接将导出的 genspark-slides-data.json 拖拽到本脚本文件上！
    echo 或者在下方输入 json 文件或包含 html 幻灯片的文件夹路径：
    echo.
    set /p INPUT_PATH="请输入路径: "
) else (
    set INPUT_PATH=%~1
)

if "%INPUT_PATH%"=="" (
    echo [错误] 未提供有效输入路径。
    pause
    exit /b 1
)

echo.
echo [*] 正在处理: %INPUT_PATH%
echo [*] 启动 4K 高清渲染器并导出 PPTX/PDF...
echo.

python "%~dp0genspark_exporter.py" "%INPUT_PATH%" -o "%~dp0output"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo [✓] 导出完成！已在 output 目录下生成 PPTX、PDF 和 HTML 文件。
    echo =======================================================
    start "" "%~dp0output"
) else (
    echo.
    echo [!] 导出过程中出现错误，请检查 Python 及依赖是否已安装。
)

pause
