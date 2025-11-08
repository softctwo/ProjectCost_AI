#!/bin/bash

echo "🚀 启动项目成本智能评估系统"
echo "================================"

# 检查Python是否可用
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到Python3"
    exit 1
fi

# 检查端口3000是否被占用
if lsof -i :3000 &> /dev/null; then
    echo "⚠️  端口3000已被占用，正在尝试终止现有进程..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# 进入public目录并启动服务器
echo "📂 进入frontend/public目录..."
cd frontend/public

echo "🌐 启动HTTP服务器在端口3000..."
echo "📊 服务器信息:"
echo "   - 端口: 3000"
echo "   - 目录: $(pwd)"
echo "   - 状态: 启动中..."

# 启动服务器
python3 -m http.server 3000

echo ""
echo "✅ 服务器已启动!"
echo ""
echo "🌐 访问地址:"
echo "   📄 完整演示: http://localhost:3000/full-demo.html"
echo "   🎯 基础演示: http://localhost:3000/demo.html"
echo "   🏠 首页: http://localhost:3000/index.html"
echo ""
echo "📱 功能特性:"
echo "   - ✅ 完整的用户认证系统"
echo "   - ✅ 智能项目成本评估"
echo "   - ✅ 工时管理和分析"
echo "   - ✅ 数据可视化报表"
echo "   - ✅ 响应式设计"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""