#!/usr/bin/env python3
"""
ProjectCost AI 高级功能示例

这个示例展示了如何使用高级功能进行项目成本估算
"""

import sys
import os
from datetime import datetime, timedelta

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from advanced_estimator import AdvancedCostEstimator, HistoricalProject, ProjectRisk


def main():
    """主函数"""
    print("=== ProjectCost AI 高级功能演示 ===\n")
    
    # 创建高级估算器实例
    estimator = AdvancedCostEstimator('config.json')
    
    print("1. 基础高级估算演示")
    print("-" * 40)
    
    # 示例1: 企业级金融系统
    enterprise_project = {
        'hours': 800,
        'complexity': 'enterprise',
        'team_size': 12,
        'duration': 180,
        'industry': 'finance',
        'team_experience': 'senior',
        'start_date': datetime.now() + timedelta(days=60)
    }
    
    result = estimator.estimate_cost_advanced(enterprise_project)
    print(f"企业级金融系统估算:")
    print(f"  总成本: ¥{result['total_cost']:,.2f}")
    print(f"  风险准备金: ¥{result['risk_contingency']:,.2f}")
    print(f"  置信度: {result['confidence_level']:.1%}")
    print(f"  风险等级: {result['risk_assessment']['risk_level']}")
    print()
    
    # 示例2: 不同行业对比
    print("2. 不同行业成本对比")
    print("-" * 40)
    
    base_params = {
        'hours': 200,
        'complexity': 'medium',
        'team_size': 4,
        'duration': 45,
        'team_experience': 'intermediate'
    }
    
    industries = ['technology', 'finance', 'healthcare', 'education', 'ecommerce']
    industry_comparison = {}
    
    for industry in industries:
        params = base_params.copy()
        params['industry'] = industry
        result = estimator.estimate_cost_advanced(params)
        industry_comparison[industry] = result['total_cost']
        print(f"{industry.capitalize():<12}: ¥{result['total_cost']:>12,.2f}")
    
    print(f"\n成本差异: 最高与最低相差 {max(industry_comparison.values()) / min(industry_comparison.values()):.2f} 倍")
    print()
    
    # 示例3: 团队经验影响分析
    print("3. 团队经验影响分析")
    print("-" * 40)
    
    experience_levels = ['junior', 'intermediate', 'senior', 'expert']
    experience_analysis = {}
    
    for experience in experience_levels:
        params = base_params.copy()
        params['team_experience'] = experience
        result = estimator.estimate_cost_advanced(params)
        experience_analysis[experience] = result['total_cost']
        print(f"{experience.capitalize():<12}: ¥{result['total_cost']:>12,.2f} "
              f"(经验因子: {result['factors']['experience_factor']:.3f})")
    
    print()
    
    # 示例4: 添加历史数据并分析
    print("4. 历史数据分析演示")
    print("-" * 40)
    
    # 模拟添加一些历史项目数据
    historical_projects = [
        HistoricalProject(
            name="电商平台开发",
            actual_hours=180,
            estimated_hours=160,
            actual_cost=25000,
            estimated_cost=22000,
            complexity="medium",
            team_size=3,
            duration=40,
            completion_date=datetime.now() - timedelta(days=120),
            success_factors=["需求明确", "技术栈熟悉", "团队稳定"]
        ),
        HistoricalProject(
            name="银行系统集成",
            actual_hours=950,
            estimated_hours=800,
            actual_cost=180000,
            estimated_cost=150000,
            complexity="enterprise",
            team_size=15,
            duration=200,
            completion_date=datetime.now() - timedelta(days=300),
            success_factors=["严格的项目管理", "经验丰富的团队"]
        ),
        HistoricalProject(
            name="移动应用开发",
            actual_hours=120,
            estimated_hours=130,
            actual_cost=18000,
            estimated_cost=19500,
            complexity="low",
            team_size=2,
            duration=25,
            completion_date=datetime.now() - timedelta(days=60),
            success_factors=["敏捷开发", "良好沟通"]
        )
    ]
    
    for project in historical_projects:
        estimator.add_historical_project(project)
    
    print(f"已添加 {len(historical_projects)} 个历史项目")
    
    # 使用历史数据提高估算准确性
    params = {
        'hours': 150,
        'complexity': 'medium',
        'team_size': 3,
        'duration': 35,
        'industry': 'ecommerce',
        'team_experience': 'intermediate'
    }
    
    result_with_history = estimator.estimate_cost_advanced(params)
    print(f"\n基于历史数据的估算结果:")
    print(f"  总成本: ¥{result_with_history['total_cost']:,.2f}")
    print(f"  准确性调整因子: {result_with_history['factors']['accuracy_adjustment']:.3f}")
    print(f"  置信度: {result_with_history['confidence_level']:.1%}")
    print()
    
    # 示例5: 风险评估演示
    print("5. 详细风险评估")
    print("-" * 40)
    
    high_risk_project = {
        'hours': 500,
        'complexity': 'high',
        'team_size': 8,
        'duration': 120,
        'industry': 'healthcare',
        'team_experience': 'junior',
        'start_date': datetime.now() + timedelta(days=90)
    }
    
    result = estimator.estimate_cost_advanced(high_risk_project)
    risk_assessment = result['risk_assessment']
    
    print(f"高风险项目评估:")
    print(f"  总成本: ¥{result['total_cost']:,.2f}")
    print(f"  风险准备金: ¥{result['risk_contingency']:,.2f} ({result['risk_contingency']/result['total_cost']:.1%})")
    print(f"  风险等级: {risk_assessment['risk_level']}")
    print(f"  识别风险数量: {risk_assessment['risk_count']}")
    
    print("\n主要风险:")
    for i, risk in enumerate(risk_assessment['top_risks'], 1):
        print(f"  {i}. {risk['description']}")
        print(f"     概率: {risk['probability']:.1%}, 影响: {risk['impact']:.1%}, "
              f"期望值: {risk['expected_value']:.3f}")
    print()
    
    # 示例6: 生成完整项目报告
    print("6. 生成完整项目报告")
    print("-" * 40)
    
    sample_project = {
        'hours': 350,
        'complexity': 'high',
        'team_size': 6,
        'duration': 90,
        'industry': 'finance',
        'team_experience': 'senior',
        'start_date': datetime.now() + timedelta(days=45)
    }
    
    result = estimator.estimate_cost_advanced(sample_project)
    report = estimator.generate_project_report(sample_project, result)
    
    print(report)
    
    # 询问是否保存报告
    save_report = input("是否保存报告到文件? (y/n): ").strip().lower()
    if save_report == 'y':
        filename = f"advanced_demo_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"报告已保存到: {filename}")
    
    print()
    print("=== 高级功能演示完成 ===")


if __name__ == "__main__":
    main()