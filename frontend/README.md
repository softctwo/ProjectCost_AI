# 项目成本智能评估系统 - 前端原型

## 🎯 项目概述

基于Figma设计指南开发的高保真交互式前端原型，实现了项目的核心功能和用户界面。

## ✨ 核心特性

### 🎨 设计系统
- **完整的Design System**: 基于Figma指南的颜色、字体、组件系统
- **响应式设计**: 支持Desktop、Tablet、Mobile三种设备
- **主题系统**: 支持浅色/深色主题切换
- **动画效果**: 使用Framer Motion实现流畅的页面转场和微交互

### 🔧 组件库
- **基础组件**: Button, Input, Card, Badge等
- **业务组件**: ProjectCard, MetricCard, StepIndicator等
- **表单组件**: 支持验证、状态管理的表单元素
- **布局组件**: 响应式网格系统

### 📱 核心页面
- **登录页**: 美观的渐变背景登录界面
- **仪表板**: 项目概览和关键指标展示
- **项目列表**: 支持网格/列表视图切换，高级筛选
- **创建项目向导**: 4步智能评估流程 (核心功能)
- **项目详情**: 多Tab页面设计

### 🤖 交互功能
- **4步创建项目向导**:
  - Step 1: SOW文档上传 + 基础信息
  - Step 2: 项目范围配置 (数据源、接口表)
  - Step 3: 复杂度评估 (交互式问卷)
  - Step 4: 评估结果展示 (Hero卡片 + 详细分析)
- **项目卡片交互**: 悬停效果、点击导航、快速操作
- **侧边栏导航**: 折叠式导航，支持移动端
- **主题切换**: 浅色/深色主题实时切换

## 🛠️ 技术栈

- **框架**: React 18 + React Router 6
- **样式**: Tailwind CSS + Ant Design
- **动画**: Framer Motion
- **图标**: Lucide React
- **HTTP客户端**: Axios
- **构建工具**: Create React App
- **类型检查**: TypeScript (可选)

## 📁 项目结构

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UI/                    # 基础UI组件
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── index.js
│   │   └── Business/             # 业务组件
│   │       ├── ProjectCard.jsx
│   │       ├── MetricCard.jsx
│   │       └── StepIndicator.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   └── useProjectEstimation.js
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── Login.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── CreateProjectWizard.jsx
│   │   │   └── ProjectDetail.jsx
│   │   ├── Timesheet/
│   │   │   └── Timesheet.jsx
│   │   ├── Analytics/
│   │   │   └── DataAnalytics.jsx
│   │   └── Settings/
│   │       └── Settings.jsx
│   ├── services/
│   │   └── api.js
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.jsx
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm start
```

### 3. 访问应用
- 开发环境: http://localhost:3000
- 登录测试: 使用任意用户名和密码登录

## 🎮 功能演示

### 1. 登录流程
- 美观的渐变背景登录页面
- 支持记住登录状态
- 加载动画和错误处理

### 2. 仪表板
- 关键指标卡片 (项目数、进度、团队、风险)
- 最近项目列表
- 活动流和待办任务
- 响应式布局

### 3. 项目管理
- 项目卡片展示 (支持网格/列表视图)
- 高级筛选和搜索
- 项目状态和进度可视化
- 团队成员头像显示

### 4. 创建项目向导 ⭐
这是最核心的功能，展示了完整的智能评估流程：

#### Step 1: 基础信息
- SOW文档拖拽上传
- 进度条动画
- 表单验证

#### Step 2: 项目范围
- 数据源芯片管理 (可删除)
- 接口表可编辑表格
- 实时统计更新

#### Step 3: 复杂度评估
- 5维度复杂度评估
- 交互式单选按钮
- 实时计算复杂度系数
- 帮助说明面板

#### Step 4: 评估结果
- Hero卡片展示关键指标
- 详细评估明细表格
- 相似项目对比
- 风险提示和建议

### 5. 响应式设计
- **Desktop (1440px+)**: 12列网格布局
- **Tablet (768px)**: 8列网格布局
- **Mobile (375px)**: 4列网格布局
- 移动端侧边栏自适应

### 6. 主题切换
- 浅色/深色主题
- 系统主题检测
- 主题偏好持久化

## 🎨 设计系统详解

### 颜色系统
完全遵循Figma设计规范：
- **Primary**: #2196F3 (蓝色主色)
- **Neutral**: 完整的灰度系统 (0-900)
- **Semantic**: 成功/警告/错误/信息色
- **Status**: 项目状态专用色

### 字体系统
- **字体**: Inter (Google Fonts)
- **Heading**: H1-H6 (36px-16px)
- **Body**: Large/Base/Small (18px-14px)
- **Code**: Monaco 等宽字体

### 组件规范
- **Button**: 3变体 × 3尺寸 × 4状态
- **Input**: 4类型 × 3尺寸 × 6状态
- **Card**: 3变体 × 3尺寸
- **Badge**: 5颜色 × 2尺寸

## 🎯 核心功能演示

### 创建项目向导
这是最重要的功能，展示了完整的AI评估流程：

1. **Step 1**: SOW文档上传 + 基础信息
   - 拖拽上传支持
   - 实时进度条
   - 表单验证

2. **Step 2**: 项目范围配置
   - 数据源系统管理
   - 接口表配置
   - 动态统计

3. **Step 3**: 复杂度评估
   - 5维度评估
   - 实时计算
   - 交互式问卷

4. **Step 4**: 评估结果
   - Hero卡片展示
   - 详细分析
   - 相似项目对比

### 项目管理
- 网格/列表视图切换
- 高级筛选
- 状态可视化
- 团队管理

### 仪表板
- 关键指标展示
- 项目概览
- 活动流
- 响应式布局

## 📱 响应式适配

### Desktop (1440px+)
- 12列网格系统
- 侧边栏固定
- 完整功能

### Tablet (768px)
- 8列网格系统
- 顶部导航
- 简化布局

### Mobile (375px)
- 4列网格系统
- 折叠式导航
- 移动端优化

## 🎪 动画效果

### 页面转场
- 淡入淡出效果
- 滑动动画
- 缩放动画

### 微交互
- 按钮悬停效果
- 卡片悬停
- 加载动画
- 状态切换

### 列表动画
- 列表项渐进显示
- 网格项错落动画
- 滚动加载

## 🔌 API集成

### 已配置
- Axios实例配置
- 请求/响应拦截器
- 错误处理
- JWT认证 (模拟)

### API端点
- 项目管理API
- 评估API
- 认证API
- 分析API

## 🎨 主题系统

### 主题选项
- **浅色主题**: 默认浅色主题
- **深色主题**: 深色背景主题
- **系统主题**: 跟随系统偏好

### 主题切换
- 顶部导航切换按钮
- 状态持久化
- 平滑过渡动画

## 📊 设计规范

### 组件规范
- 所有组件都遵循Figma设计规范
- 支持多种状态变体
- 一致的间距和边距

### 交互规范
- 符合Web可访问性标准
- 支持键盘导航
- 触摸友好的交互区域

## 🚀 部署指南

### 开发环境
```bash
npm start
```

### 构建生产
```bash
npm run build
```

### 预览构建
```bash
npm run build && npm run preview
```

## 📋 后续计划

### Phase 2: 功能完善
- [ ] 完整的表单验证
- [ ] 文件上传进度
- [ ] 甘特图视图
- [ ] 成本跟踪图表

### Phase 3: 数据集成
- [ ] 实际API集成
- [ ] 实时数据更新
- [ ] WebSocket支持
- [ ] 数据缓存

### Phase 4: 高级功能
- [ ] 高级筛选
- [ ] 导出功能
- [ ] 打印支持
- [ ] 国际化

## 🤝 贡献指南

### 开发环境
1. Fork项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

### 代码规范
- 使用ESLint和Prettier
- 遵循React最佳实践
- 编写测试用例
- 更新文档

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues]
- 技术支持: [技术支持]

## 📄 许可证

MIT License

---

**构建日期**: 2025-10-13
**版本**: v1.0.0-prototype
**状态**: ✅ 完成并测试