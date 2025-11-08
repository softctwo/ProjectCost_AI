#!/usr/bin/env python3
"""
ProjectCost AI 使用示例

这个示例展示了如何使用 ProjectCost AI 来估算项目成本
"""

import sys
import os

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from cost_estimator import ProjectCostEstimator


def main():
    """主函数"""
    print("=== ProjectCost AI 项目成本估算工具 ===\n")
    
    # 创建估算器实例
    estimator = ProjectCostEstimator()
    
    # 示例项目参数
    example_projects = [
        {
            'name': '小型网站开发',
            'params': {
                'hours': 80,
                'complexity': 'low',
                'team_size': 2,
                'duration': 15
            }
        },
        {
            'name': '移动应用开发',
            'params': {
                'hours': 200,
                'complexity': 'medium',
                'team_size': 3,
                'duration': 45
            }
        },
        {
            'name': '企业级系统开发',
            'params': {
                'hours': 600,
                'complexity': 'high',
                'team_size': 8,
                'duration': 120
            }
        }
    ]
    
    for project in example_projects:
        print(f"项目: {project['name']}")
        print(f"参数: {project['params']}")
        
        # 验证参数
        errors = estimator.validate_parameters(project['params'])
        if errors:
            print(f"参数错误: {errors}")
            continue
        
        # 估算成本
        result = estimator.estimate_cost(project['params'])
        
        print(f"估算结果:")
        print(f"  基础成本: ¥{result['base_cost']:,.2f}")
        print(f"  总成本: ¥{result['total_cost']:,.2f}")
        print(f"  单位小时成本: ¥{result['cost_per_hour']:,.2f}")
        print(f"  团队因子: {result['team_factor']:.2f}")
        print(f"  持续时间因子: {result['duration_factor']:.2f}")
        print("-" * 50)


if __name__ == "__main__":
    main()