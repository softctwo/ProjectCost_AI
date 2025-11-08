"""
测试核心评估算法
"""

import pytest
from app.core.estimator import ProjectInfo, estimate_project, WorkloadEstimator


class TestWorkloadEstimator:
    """测试工作量评估器"""

    def test_basic_estimation(self):
        """测试基础评估功能"""
        project = ProjectInfo(
            name="测试项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=5,
            interface_tables_count=60,
            reports_count=10,
            custom_requirements_count=2
        )

        result = estimate_project(project)

        # 验证结果不为空
        assert result is not None
        assert result.total_hours > 0

        # 验证三点估算
        assert result.optimistic > 0
        assert result.most_likely > 0
        assert result.pessimistic > 0
        assert result.optimistic < result.most_likely < result.pessimistic

        # 验证PERT期望值在合理范围内
        assert result.optimistic <= result.expected <= result.pessimistic

        # 验证置信区间
        assert len(result.confidence_interval) == 2
        assert result.confidence_interval[0] < result.confidence_interval[1]

    def test_complexity_assessment(self):
        """测试复杂度评估"""
        project = ProjectInfo(
            name="高复杂度项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=15,
            interface_tables_count=200,
            reports_count=25,
            custom_requirements_count=10,
            data_volume_level="very_large"
        )

        result = estimate_project(project)

        # 验证复杂度评分
        assert result.complexity_score.total >= 0
        assert result.complexity_score.total <= 10

        # 高复杂度项目应该有更高的分数
        assert result.complexity_score.total > 6.0

        # 验证复杂度等级
        assert result.complexity_score.level in [
            "simple", "medium", "complex", "very_complex"
        ]

    def test_phase_breakdown(self):
        """测试阶段工时分解"""
        project = ProjectInfo(
            name="测试项目",
            project_type="regulatory_reporting",
            client_type="city_bank",
            data_sources_count=5,
            interface_tables_count=50,
            reports_count=8
        )

        result = estimate_project(project)

        # 验证阶段分解
        assert "项目管理" in result.phase_breakdown
        assert "需求分析" in result.phase_breakdown
        assert "开发实施" in result.phase_breakdown
        assert "测试验证" in result.phase_breakdown
        assert "培训交付" in result.phase_breakdown

        # 验证阶段工时之和等于总工时
        total = sum(result.phase_breakdown.values())
        assert abs(total - result.total_hours) < 1.0  # 允许小误差

    def test_wbs_generation(self):
        """测试WBS生成"""
        project = ProjectInfo(
            name="测试项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=3,
            interface_tables_count=30,
            reports_count=5
        )

        result = estimate_project(project)

        # 验证WBS结构
        assert len(result.wbs_structure) == 5  # 5个阶段

        # 验证每个阶段都有任务
        for phase in result.wbs_structure:
            assert "phase" in phase
            assert "wbs_code" in phase
            assert "tasks" in phase
            assert len(phase["tasks"]) > 0

    def test_small_project(self):
        """测试小型项目评估"""
        project = ProjectInfo(
            name="小型项目",
            project_type="regulatory_reporting",
            client_type="city_bank",
            data_sources_count=2,
            interface_tables_count=20,
            reports_count=3
        )

        result = estimate_project(project)

        # 小项目工时应该较少
        assert result.total_hours < 1000
        assert result.complexity_score.level in ["simple", "medium"]

    def test_large_project(self):
        """测试大型项目评估"""
        project = ProjectInfo(
            name="大型项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=12,
            interface_tables_count=180,
            reports_count=20,
            custom_requirements_count=5
        )

        result = estimate_project(project)

        # 大项目工时应该较多
        assert result.total_hours > 1500
        assert result.complexity_score.level in ["complex", "very_complex"]

    def test_confidence_level(self):
        """测试置信度等级"""
        # 简单项目 - 高置信度
        simple_project = ProjectInfo(
            name="简单项目",
            project_type="regulatory_reporting",
            client_type="city_bank",
            data_sources_count=2,
            interface_tables_count=15,
            reports_count=3
        )

        simple_result = estimate_project(simple_project)
        assert simple_result.confidence_level in ["高", "中"]

        # 复杂项目 - 低置信度
        complex_project = ProjectInfo(
            name="复杂项目",
            project_type="regulatory_reporting",
            client_type="state_owned_bank",
            data_sources_count=15,
            interface_tables_count=200,
            reports_count=25,
            custom_requirements_count=10
        )

        complex_result = estimate_project(complex_project)
        assert complex_result.confidence_level in ["中", "低"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
