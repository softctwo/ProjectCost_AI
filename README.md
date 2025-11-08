# ProjectCost AI

基于人工智能的高级项目成本估算工具

## 🌟 功能特性

### 核心功能
- 🎯 **智能成本估算**: 基于工时、复杂度、团队规模和项目持续时间进行综合成本估算
- 🔧 **参数验证**: 自动验证项目参数的有效性
- 📊 **详细分析**: 提供基础成本、总成本、单位小时成本等多个维度的分析
- 🧪 **全面测试**: 包含单元测试和集成测试，确保代码质量
- 📈 **高覆盖率**: 代码测试覆盖率达到 94%

### 高级功能
- 🏢 **行业调整**: 支持金融、医疗、教育、电商等多个行业的成本调整
- 👥 **团队经验**: 根据团队经验水平（初级/中级/高级/专家）调整成本估算
- ⚠️ **风险评估**: 内置风险评估模型，自动计算风险准备金
- 📈 **历史数据分析**: 支持历史项目数据导入，提高估算准确性
- 🔄 **通胀调整**: 支持基于项目开始时间的通胀调整
- 📋 **详细报告**: 自动生成专业的项目成本估算报告
- 💻 **命令行界面**: 提供交互式和批处理模式
- ⚙️ **配置管理**: 支持自定义配置文件

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd projectcost_ai

# 安装依赖
pip install -r requirements.txt
```

## 快速开始

### 基础使用

```python
from src.cost_estimator import ProjectCostEstimator

# 创建估算器实例
estimator = ProjectCostEstimator()

# 定义项目参数
project_params = {
    'hours': 160,           # 预估工时
    'complexity': 'medium', # 复杂度: 'low', 'medium', 'high'
    'team_size': 3,         # 团队规模
    'duration': 30          # 项目持续时间（天）
}

# 验证参数
errors = estimator.validate_parameters(project_params)
if errors:
    print(f"参数错误: {errors}")
else:
    # 估算成本
    result = estimator.estimate_cost(project_params)
    print(f"总成本: ¥{result['total_cost']:,.2f}")
```

### 高级使用

```python
from src.advanced_estimator import AdvancedCostEstimator
from datetime import datetime, timedelta

# 创建高级估算器实例
estimator = AdvancedCostEstimator('config.json')

# 定义高级项目参数
advanced_params = {
    'hours': 250,
    'complexity': 'high',  # 支持 'enterprise' 级别
    'team_size': 6,
    'duration': 90,
    'industry': 'finance',  # 行业类型
    'team_experience': 'senior',  # 团队经验
    'start_date': datetime.now() + timedelta(days=30)  # 开始时间
}

# 高级成本估算
result = estimator.estimate_cost_advanced(advanced_params)
print(f"总成本: ¥{result['total_cost']:,.2f}")
print(f"风险准备金: ¥{result['risk_contingency']:,.2f}")
print(f"置信度: {result['confidence_level']:.1%}")
print(f"风险等级: {result['risk_assessment']['risk_level']}")

# 生成详细报告
report = estimator.generate_project_report(advanced_params, result)
print(report)
```

### 命令行界面

```bash
# 交互式模式
python src/cli.py

# 批处理模式
python src/cli.py --batch projects.json --output results.json

# 使用自定义配置
python src/cli.py --config my_config.json
```

### 运行示例

```bash
# 基础示例
python example.py

# 高级功能演示
python advanced_example.py
```

## 运行测试

```bash
# 运行所有测试
pytest -v

# 运行测试并生成覆盖率报告
pytest --cov=src --cov-report=html

# 查看详细的覆盖率报告
open htmlcov/index.html
```

## 项目结构

```
projectcost_ai/
├── src/
│   ├── __init__.py             # 包初始化
│   ├── cost_estimator.py       # 基础成本估算器
│   ├── advanced_estimator.py   # 高级成本估算器
│   └── cli.py                  # 命令行界面
├── tests/
│   ├── __init__.py             # 测试包初始化
│   ├── test_cost_estimator.py  # 基础估算器单元测试
│   ├── test_advanced_estimator.py  # 高级估算器单元测试
│   └── test_integration.py     # 集成测试
├── example.py                  # 基础使用示例
├── advanced_example.py         # 高级功能演示
├── config.json                 # 配置文件示例
├── requirements.txt            # 项目依赖
├── pytest.ini                 # 测试配置
└── README.md                   # 项目文档
```

## 成本估算模型

### 基础模型

ProjectCost AI 基础模型使用以下公式：

1. **基础成本** = 工时 × 基础时薪(¥100) × 复杂度因子
   - 低复杂度因子: 1.0
   - 中等复杂度因子: 1.5  
   - 高复杂度因子: 2.0

2. **团队因子** = 1 + (团队规模 - 1) × 0.1
   - 每增加1名团队成员，成本增加10%

3. **持续时间因子** = min(1.2, 1 + 持续时间 × 0.01)
   - 最长增加20%的成本

4. **总成本** = 基础成本 × 团队因子 × 持续时间因子

### 高级模型

高级模型在基础模型之上增加了更多调整因子：

1. **基础成本** = 工时 × 基础时薪 × 复杂度因子
   - 支持企业级复杂度: 3.0

2. **行业乘数** - 根据行业类型调整:
   - 技术: 1.0, 金融: 1.2-1.3, 医疗: 1.4, 教育: 0.9, 电商: 1.1-1.2

3. **团队经验因子**:
   - 初级: 1.3, 中级: 1.0, 高级: 0.9, 专家: 0.8

4. **准确性调整** - 基于历史项目数据调整

5. **通胀调整** - 基于项目开始时间计算

6. **风险评估** - 自动识别项目风险并计算风险准备金

7. **最终成本** = 基础成本 × 所有可能因子 + 风险准备金

## 测试覆盖

- ✅ **37个测试用例全部通过**
- ✅ **94%的核心功能代码覆盖率**
- ✅ **包含单元测试和集成测试**
- ✅ **覆盖边界情况和异常场景**
- ✅ **高级估算器完整测试**
- ✅ **命令行界面功能验证**

## 贡献

欢迎提交 Issue 和 Pull Request！请确保：

1. 添加适当的测试用例
2. 保持代码覆盖率不低于80%
3. 遵循现有的代码风格

## 许可证

MIT License
