#!/bin/bash

echo "🚀 启动项目成本智能评估系统演示"
echo "================================"

# 检查Python是否可用
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到Python3"
    exit 1
fi

# 检查端口3000是否被占用
if lsof -i :3000 &> /dev/null; then
    echo "⚠️  端口3000已被占用，正在尝试终止现有进程..."
    lsof -ti :3000 | xargs kill -9
    sleep 2
fi

# 进入public目录并启动服务器
echo "📂 进入public目录..."
cd public

echo "🌐 启动HTTP服务器在端口3000..."
python3 -m http.server 3000

echo ""
echo "✅ 服务器已启动!"
echo "🌐 请在浏览器中访问: http://localhost:3000/demo.html"
echo "📄 演示页面: http://localhost:3000/demo.html"
echo "🏠 首页: http://localhost:3000/index.html"
echo ""
echo "按 Ctrl+C 停止服务器"