"""
项目成本智能评估系统 - 功能演示脚本
Demo Script for Project Cost Estimation System
"""

import sys
sys.path.append('.')

from app.core.estimator import ProjectInfo, estimate_project
from app.core.similarity import HistoricalProject, find_and_estimate
import json


def print_section(title: str):
    """打印章节标题"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def demo_1_basic_estimation():
    """演示1: 基础工作量评估"""
    print_section("演示1: 基础工作量评估 - 规则引擎")

    # 创建项目信息
    project = ProjectInfo(
        name="某城商行1104监管报送项目",
        project_type="regulatory_reporting",
        client_type="city_bank",
        data_sources_count=6,
        interface_tables_count=85,
        reports_count=12,
        custom_requirements_count=2,
        data_volume_level="medium",
        regulation_type="1104报送"
    )

    print(f"📋 项目信息:")
    print(f"  - 项目名称: {project.name}")
    print(f"  - 项目类型: {project.project_type}")
    print(f"  - 客户类型: {project.client_type}")
    print(f"  - 数据源数量: {project.data_sources_count}个")
    print(f"  - 接口表数量: {project.interface_tables_count}张")
    print(f"  - 报表数量: {project.reports_count}个")
    print(f"  - 个性化需求: {project.custom_requirements_count}个")

    # 执行评估
    print("\n⏳ 正在评估...")
    result = estimate_project(project)

    # 输出结果
    print(f"\n✅ 评估完成!\n")

    print(f"📊 复杂度评估:")
    print(f"  - 技术复杂度: {result.complexity_score.technical}/10")
    print(f"  - 业务复杂度: {result.complexity_score.business}/10")
    print(f"  - 数据复杂度: {result.complexity_score.data}/10")
    print(f"  - 组织复杂度: {result.complexity_score.organizational}/10")
    print(f"  - 风险因素: {result.complexity_score.risk}/10")
    print(f"  - 综合分数: {result.complexity_score.total}/10")
    print(f"  - 复杂度等级: {result.complexity_score.level}")

    print(f"\n⏱  工作量评估:")
    print(f"  - 最可能工时: {result.most_likely} 人时")
    print(f"  - 乐观估算: {result.optimistic} 人时")
    print(f"  - 悲观估算: {result.pessimistic} 人时")
    print(f"  - PERT期望值: {result.expected} 人时")
    print(f"  - 标准差: {result.std_deviation} 人时")
    print(f"  - 95%置信区间: {result.confidence_interval[0]} - {result.confidence_interval[1]} 人时")
    print(f"  - 置信度等级: {result.confidence_level}")

    print(f"\n📈 各阶段工时分解:")
    for phase, hours in result.phase_breakdown.items():
        percentage = (hours / result.total_hours) * 100
        print(f"  - {phase}: {hours} 人时 ({percentage:.1f}%)")

    print(f"\n📝 WBS结构:")
    print(f"  - 总阶段数: {len(result.wbs_structure)}")
    print(f"  - 总任务数: {sum(len(phase['tasks']) for phase in result.wbs_structure)}")

    print(f"\n💡 建议:")
    print(f"  - 建议采用最可能估算: {result.most_likely} 人时")
    print(f"  - 换算: {result.most_likely / 8:.1f} 人天 或 {result.most_likely / 160:.1f} 人月")
    print(f"  - 建议预留风险缓冲: {result.most_likely * 0.15:.1f} 人时 (15%)")
    print(f"  - 最终建议工时: {result.most_likely * 1.15:.1f} 人时")


def demo_2_similar_projects():
    """演示2: 相似项目匹配与评估"""
    print_section("演示2: 相似项目匹配与案例推理")

    # 模拟历史项目数据
    historical_projects = [
        HistoricalProject(
            id=1,
            name="工商银行1104报送项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=10,
            interface_tables_count=150,
            reports_count=18,
            custom_requirements_count=2,
            complexity_score=6.8,
            actual_hours=1850.0,
            variance_percentage=12.5
        ),
        HistoricalProject(
            id=2,
            name="建设银行EAST系统",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=8,
            interface_tables_count=120,
            reports_count=15,
            custom_requirements_count=3,
            complexity_score=6.2,
            actual_hours=1620.0,
            variance_percentage=8.3
        ),
        HistoricalProject(
            id=3,
            name="招商银行监管报送",
            project_type="regulatory_reporting",
            client_type="joint_stock",
            data_sources_count=6,
            interface_tables_count=80,
            reports_count=12,
            custom_requirements_count=1,
            complexity_score=5.5,
            actual_hours=1200.0,
            variance_percentage=15.2
        ),
        HistoricalProject(
            id=4,
            name="浦发银行数据报送",
            project_type="regulatory_reporting",
            client_type="joint_stock",
            data_sources_count=5,
            interface_tables_count=60,
            reports_count=10,
            custom_requirements_count=2,
            complexity_score=4.8,
            actual_hours=980.0,
            variance_percentage=10.5
        ),
    ]

    print(f"📚 历史项目库: {len(historical_projects)}个项目\n")
    for proj in historical_projects:
        print(f"  [{proj.id}] {proj.name}")
        print(f"      规模: {proj.data_sources_count}源/{proj.interface_tables_count}表/{proj.reports_count}报")
        print(f"      实际工时: {proj.actual_hours} | 偏差: {proj.variance_percentage}%")

    # 目标项目
    target_project = {
        "name": "某城商行1104监管报送项目",
        "project_type": "regulatory_reporting",
        "client_type": "city_bank",
        "data_sources_count": 6,
        "interface_tables_count": 85,
        "reports_count": 12,
        "custom_requirements_count": 2,
        "complexity_score": 5.3
    }

    print(f"\n🎯 目标项目: {target_project['name']}")
    print(f"   规模: {target_project['data_sources_count']}源/{target_project['interface_tables_count']}表/{target_project['reports_count']}报")

    # 查找相似项目并评估
    print("\n🔍 正在搜索相似项目...")
    result = find_and_estimate(target_project, historical_projects, top_k=3)

    print(f"\n✅ 找到 {len(result['similar_projects'])} 个相似项目:\n")

    for i, sim in enumerate(result['similar_projects'], 1):
        print(f"  [{i}] {sim.project.name}")
        print(f"      相似度: {sim.similarity_score * 100:.1f}%")
        print(f"      - 分类相似度: {sim.categorical_similarity * 100:.1f}%")
        print(f"      - 规模相似度: {sim.scale_similarity * 100:.1f}%")
        print(f"      - 复杂度相似度: {sim.complexity_similarity * 100:.1f}%")
        print(f"      实际工时: {sim.project.actual_hours} 人时")
        print()

    # 评估结果
    estimation = result['estimation']

    print(f"📊 基于相似项目的评估:")
    print(f"  - 评估工时: {estimation['estimate']} 人时")
    print(f"  - 置信区间: {estimation['confidence_interval'][0]} - {estimation['confidence_interval'][1]} 人时")
    print(f"  - 置信度: {estimation['confidence'] * 100:.1f}%")
    print(f"  - 基于项目数: {estimation['based_on_projects']}个")
    print(f"  - 平均历史偏差: {estimation['avg_variance']:.1f}%")

    print(f"\n📖 参考项目:")
    for ref in estimation['reference_projects']:
        print(f"  - {ref['name']}: {ref['actual_hours']}人时 (相似度: {ref['similarity']*100:.1f}%)")


def demo_3_ensemble_estimation():
    """演示3: 多模型融合评估"""
    print_section("演示3: 多模型融合评估")

    # 项目信息
    project_info = ProjectInfo(
        name="某股份制银行EAST项目",
        project_type="regulatory_reporting",
        client_type="joint_stock",
        data_sources_count=7,
        interface_tables_count=100,
        reports_count=14,
        custom_requirements_count=3,
        data_volume_level="large",
        regulation_type="EAST"
    )

    print(f"📋 项目: {project_info.name}")
    print(f"   规模: {project_info.data_sources_count}源/{project_info.interface_tables_count}表/{project_info.reports_count}报")

    # 1. 规则引擎评估
    print(f"\n⚙️  模型1: 规则引擎评估")
    rule_result = estimate_project(project_info)
    rule_estimate = rule_result.total_hours
    print(f"   评估结果: {rule_estimate} 人时")
    print(f"   置信度: {rule_result.confidence_level}")

    # 2. 相似项目评估 (模拟)
    print(f"\n📚 模型2: 相似项目评估")
    similarity_estimate = 1450.0  # 模拟值
    print(f"   评估结果: {similarity_estimate} 人时")
    print(f"   基于3个相似项目")

    # 3. ML模型评估 (模拟)
    print(f"\n🤖 模型3: 机器学习模型")
    ml_estimate = 1380.0  # 模拟值
    print(f"   评估结果: {ml_estimate} 人时")
    print(f"   模型R²: 0.82")

    # 融合评估
    print(f"\n🔄 融合策略:")
    weights = {
        "rule_based": 0.35,
        "similarity": 0.35,
        "ml": 0.30
    }
    print(f"   - 规则引擎权重: {weights['rule_based']*100:.0f}%")
    print(f"   - 相似项目权重: {weights['similarity']*100:.0f}%")
    print(f"   - ML模型权重: {weights['ml']*100:.0f}%")

    ensemble_estimate = (
        rule_estimate * weights['rule_based'] +
        similarity_estimate * weights['similarity'] +
        ml_estimate * weights['ml']
    )

    print(f"\n✨ 融合评估结果: {ensemble_estimate:.1f} 人时")

    # 模型分歧度
    estimates = [rule_estimate, similarity_estimate, ml_estimate]
    mean = sum(estimates) / len(estimates)
    variance = sum((e - mean) ** 2 for e in estimates) / len(estimates)
    std_dev = variance ** 0.5
    disagreement = std_dev / mean

    print(f"\n📉 模型一致性分析:")
    print(f"   - 均值: {mean:.1f} 人时")
    print(f"   - 标准差: {std_dev:.1f} 人时")
    print(f"   - 分歧度: {disagreement*100:.1f}%")

    if disagreement < 0.15:
        print(f"   - 结论: 模型高度一致,评估可信度高")
    elif disagreement < 0.25:
        print(f"   - 结论: 模型基本一致,评估可信度中等")
    else:
        print(f"   - 结论: 模型分歧较大,建议进一步核实")

    print(f"\n💡 最终建议:")
    print(f"   - 采用融合评估: {ensemble_estimate:.1f} 人时")
    print(f"   - 预留15%风险缓冲: {ensemble_estimate * 0.15:.1f} 人时")
    print(f"   - 建议总工时: {ensemble_estimate * 1.15:.1f} 人时")
    print(f"   - 换算: {ensemble_estimate * 1.15 / 8:.1f} 人天 或 {ensemble_estimate * 1.15 / 160:.1f} 人月")


def demo_4_wbs_breakdown():
    """演示4: WBS详细分解"""
    print_section("演示4: WBS任务分解结构")

    project = ProjectInfo(
        name="某银行监管报送项目",
        project_type="regulatory_reporting",
        client_type="state_owned_bank",
        data_sources_count=5,
        interface_tables_count=60,
        reports_count=10,
        custom_requirements_count=1
    )

    result = estimate_project(project)

    print(f"📋 项目: {project.name}\n")

    for phase in result.wbs_structure:
        phase_hours = sum(task.get('base_hours', 0) for task in phase['tasks'])
        print(f"📦 {phase['wbs_code']}. {phase['phase']} ({phase_hours:.1f}人时)")
        print(f"─" * 80)

        for task in phase['tasks'][:10]:  # 只显示前10个任务
            hours = task.get('base_hours', 0)
            print(f"   {task['wbs_code']} {task['name']:<40} {hours:>8.1f}人时")

        if len(phase['tasks']) > 10:
            print(f"   ... 还有 {len(phase['tasks']) - 10} 个任务")

        print()

    print(f"📊 总计: {result.total_hours} 人时\n")


def main():
    """主函数"""
    print("\n" + "🌟" * 40)
    print("  项目成本智能评估系统 - 功能演示")
    print("  Project Cost Estimation System - Demo")
    print("🌟" * 40)

    try:
        # 运行所有演示
        demo_1_basic_estimation()
        demo_2_similar_projects()
        demo_3_ensemble_estimation()
        demo_4_wbs_breakdown()

        print_section("演示完成")
        print("✅ 所有功能演示完成!")
        print("\n💡 提示:")
        print("  - 启动API服务: python -m app.main")
        print("  - 访问API文档: http://localhost:8000/docs")
        print("  - 运行测试: pytest tests/")

    except Exception as e:
        print(f"\n❌ 演示过程中出现错误: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
