"""
核心工作量评估算法
Core Workload Estimation Algorithm
"""

from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from dataclasses import dataclass
import math


@dataclass
class ProjectInfo:
    """项目信息数据类"""
    name: str
    project_type: str
    client_type: str
    data_sources_count: int
    interface_tables_count: int
    reports_count: int
    custom_requirements_count: int = 0
    data_volume_level: str = "medium"
    regulation_type: Optional[str] = None


@dataclass
class ComplexityScore:
    """复杂度评分"""
    technical: float
    business: float
    data: float
    organizational: float
    risk: float
    total: float
    level: str  # simple, medium, complex, very_complex


@dataclass
class EstimationResult:
    """评估结果"""
    total_hours: float
    optimistic: float
    most_likely: float
    pessimistic: float
    expected: float  # PERT加权
    std_deviation: float
    confidence_interval: Tuple[float, float]
    phase_breakdown: Dict[str, float]
    wbs_structure: List[Dict]
    complexity_score: ComplexityScore
    confidence_level: str


class TaskTypeBaseline:
    """任务类型基准工时"""

    # 标准工时定额
    BASELINES = {
        # 项目管理 (10%)
        "pm_kickoff": {"base_hours": 16, "type": "fixed"},
        "pm_weekly_tracking": {"base_hours_per_week": 4, "type": "per_week"},
        "pm_milestone_review": {"base_hours_per_milestone": 8, "type": "per_milestone"},
        "pm_closure": {"base_hours": 24, "type": "fixed"},

        # 需求分析 (15%)
        "req_business_research": {"base_hours": 40, "type": "fixed"},
        "req_interview": {"base_hours_per_source": 16, "type": "per_source"},
        "req_interface_design": {"base_hours_per_table": 2, "type": "per_table"},
        "req_confirmation": {"base_hours": 24, "type": "fixed"},

        # 开发实施 (40%)
        "dev_environment_setup": {"base_hours": 16, "type": "fixed"},
        "dev_source_connection": {"base_hours_per_source": 8, "type": "per_source"},
        "dev_data_extraction": {"base_hours_per_source": 24, "type": "per_source"},
        "dev_data_transformation": {"base_hours_per_table": 6, "type": "per_table"},
        "dev_data_loading": {"base_hours_per_table": 4, "type": "per_table"},
        "dev_product_config": {"base_hours": 40, "type": "fixed"},
        "dev_custom_requirement": {"base_hours_per_req": 32, "type": "per_requirement"},
        "dev_report": {"base_hours_per_report": 12, "type": "per_report"},

        # 测试验证 (25%)
        "test_unit": {"percentage": 0.20, "type": "percentage"},  # 开发工时的20%
        "test_sit": {"base_hours_per_scenario": 8, "type": "per_scenario"},
        "test_uat_support": {"percentage": 0.15, "type": "percentage"},
        "test_trial_support": {"base_hours_per_month": 80, "type": "per_month"},
        "test_bug_fixing": {"percentage": 0.10, "type": "percentage"},

        # 培训交付 (10%)
        "delivery_training": {"base_hours": 40, "type": "fixed"},
        "delivery_documentation": {"base_hours": 40, "type": "fixed"},
        "delivery_acceptance": {"base_hours": 16, "type": "fixed"},
    }

    # 复杂度调整系数
    COMPLEXITY_MULTIPLIERS = {
        "simple": 0.8,
        "medium": 1.0,
        "complex": 1.4,
        "very_complex": 1.8
    }


class WorkloadEstimator:
    """工作量评估器"""

    def __init__(self):
        self.baseline = TaskTypeBaseline()

    def estimate(self, project_info: ProjectInfo) -> EstimationResult:
        """
        主评估方法
        """
        # 步骤1: 评估复杂度
        complexity = self._assess_complexity(project_info)

        # 步骤2: 生成WBS结构
        wbs = self._generate_wbs(project_info, complexity)

        # 步骤3: 计算基础工时
        base_hours = self._calculate_base_hours(wbs, project_info)

        # 步骤4: 应用复杂度调整
        adjusted_hours = self._apply_complexity_adjustment(base_hours, complexity)

        # 步骤5: 三点估算
        three_point = self._three_point_estimation(adjusted_hours, complexity)

        # 步骤6: 阶段分解
        phase_breakdown = self._calculate_phase_breakdown(wbs)

        return EstimationResult(
            total_hours=adjusted_hours,
            optimistic=three_point["optimistic"],
            most_likely=three_point["most_likely"],
            pessimistic=three_point["pessimistic"],
            expected=three_point["expected"],
            std_deviation=three_point["std_deviation"],
            confidence_interval=three_point["confidence_interval"],
            phase_breakdown=phase_breakdown,
            wbs_structure=wbs,
            complexity_score=complexity,
            confidence_level=self._determine_confidence_level(complexity)
        )

    def _assess_complexity(self, project_info: ProjectInfo) -> ComplexityScore:
        """
        评估项目复杂度
        """
        # 技术复杂度 (0-10)
        technical = 5.0  # 默认中等
        if project_info.data_sources_count > 10:
            technical += 2.0
        elif project_info.data_sources_count > 5:
            technical += 1.0

        if project_info.interface_tables_count > 100:
            technical += 2.0
        elif project_info.interface_tables_count > 50:
            technical += 1.0

        # 业务复杂度 (0-10)
        business = 5.0
        if project_info.regulation_type in ["1104报送", "EAST"]:
            business += 1.5

        # 数据复杂度 (0-10)
        data = 5.0
        if project_info.data_volume_level == "very_large":
            data += 2.0
        elif project_info.data_volume_level == "large":
            data += 1.0

        # 组织复杂度 (0-10)
        organizational = 5.0
        if project_info.client_type == "state_owned_bank":
            organizational += 1.0

        # 风险因素 (0-10)
        risk = 5.0
        if project_info.custom_requirements_count > 5:
            risk += 1.5

        # 计算总分
        weights = {
            "technical": 0.30,
            "business": 0.25,
            "data": 0.20,
            "organizational": 0.15,
            "risk": 0.10
        }

        total = (
            technical * weights["technical"] +
            business * weights["business"] +
            data * weights["data"] +
            organizational * weights["organizational"] +
            risk * weights["risk"]
        )

        # 确定复杂度等级
        if total < 3:
            level = "simple"
        elif total < 5:
            level = "medium"
        elif total < 7:
            level = "complex"
        else:
            level = "very_complex"

        return ComplexityScore(
            technical=round(technical, 1),
            business=round(business, 1),
            data=round(data, 1),
            organizational=round(organizational, 1),
            risk=round(risk, 1),
            total=round(total, 1),
            level=level
        )

    def _generate_wbs(self, project_info: ProjectInfo, complexity: ComplexityScore) -> List[Dict]:
        """
        生成WBS结构
        """
        wbs = []

        # 1. 项目管理阶段
        pm_phase = {
            "phase": "项目管理",
            "wbs_code": "1",
            "tasks": [
                {"wbs_code": "1.1", "name": "项目启动", "type": "pm_kickoff"},
                {"wbs_code": "1.2", "name": "项目监控", "type": "pm_weekly_tracking"},
                {"wbs_code": "1.3", "name": "里程碑评审", "type": "pm_milestone_review"},
                {"wbs_code": "1.4", "name": "项目收尾", "type": "pm_closure"},
            ]
        }
        wbs.append(pm_phase)

        # 2. 需求分析阶段
        req_tasks = [
            {"wbs_code": "2.1", "name": "业务调研", "type": "req_business_research"},
            {"wbs_code": "2.2", "name": "需求访谈", "type": "req_interview"},
            {"wbs_code": "2.3", "name": "接口表设计", "type": "req_interface_design"},
            {"wbs_code": "2.4", "name": "需求确认", "type": "req_confirmation"},
        ]
        req_phase = {"phase": "需求分析", "wbs_code": "2", "tasks": req_tasks}
        wbs.append(req_phase)

        # 3. 开发实施阶段
        dev_tasks = [
            {"wbs_code": "3.1", "name": "环境准备", "type": "dev_environment_setup"},
            {"wbs_code": "3.2", "name": "产品配置", "type": "dev_product_config"},
        ]

        # 按数据源拆分ETL任务
        for i in range(1, min(project_info.data_sources_count + 1, 6)):  # 最多展示5个
            dev_tasks.append({
                "wbs_code": f"3.3.{i}",
                "name": f"数据源{i}接入开发",
                "type": "dev_data_extraction"
            })

        # 数据转换
        dev_tasks.append({
            "wbs_code": "3.4",
            "name": "数据清洗转换",
            "type": "dev_data_transformation"
        })

        # 数据加载
        dev_tasks.append({
            "wbs_code": "3.5",
            "name": "数据加载",
            "type": "dev_data_loading"
        })

        # 报表开发
        if project_info.reports_count > 0:
            dev_tasks.append({
                "wbs_code": "3.6",
                "name": "报表开发",
                "type": "dev_report"
            })

        # 个性化开发
        if project_info.custom_requirements_count > 0:
            dev_tasks.append({
                "wbs_code": "3.7",
                "name": "个性化需求开发",
                "type": "dev_custom_requirement"
            })

        dev_phase = {"phase": "开发实施", "wbs_code": "3", "tasks": dev_tasks}
        wbs.append(dev_phase)

        # 4. 测试验证阶段
        test_tasks = [
            {"wbs_code": "4.1", "name": "单元测试", "type": "test_unit"},
            {"wbs_code": "4.2", "name": "SIT测试", "type": "test_sit"},
            {"wbs_code": "4.3", "name": "UAT测试支持", "type": "test_uat_support"},
            {"wbs_code": "4.4", "name": "试运行支持", "type": "test_trial_support"},
            {"wbs_code": "4.5", "name": "问题修复缓冲", "type": "test_bug_fixing"},
        ]
        test_phase = {"phase": "测试验证", "wbs_code": "4", "tasks": test_tasks}
        wbs.append(test_phase)

        # 5. 培训交付阶段
        delivery_tasks = [
            {"wbs_code": "5.1", "name": "用户培训", "type": "delivery_training"},
            {"wbs_code": "5.2", "name": "文档编制", "type": "delivery_documentation"},
            {"wbs_code": "5.3", "name": "项目验收", "type": "delivery_acceptance"},
        ]
        delivery_phase = {"phase": "培训交付", "wbs_code": "5", "tasks": delivery_tasks}
        wbs.append(delivery_phase)

        return wbs

    def _calculate_base_hours(self, wbs: List[Dict], project_info: ProjectInfo) -> float:
        """
        计算基础工时
        """
        total_hours = 0.0
        dev_hours = 0.0  # 开发阶段工时,用于计算百分比任务

        for phase in wbs:
            for task in phase["tasks"]:
                task_type = task["type"]
                baseline = self.baseline.BASELINES.get(task_type)

                if not baseline:
                    continue

                hours = 0.0

                if baseline["type"] == "fixed":
                    hours = baseline["base_hours"]

                elif baseline["type"] == "per_source":
                    hours = baseline["base_hours_per_source"] * project_info.data_sources_count

                elif baseline["type"] == "per_table":
                    hours = baseline["base_hours_per_table"] * project_info.interface_tables_count

                elif baseline["type"] == "per_report":
                    hours = baseline["base_hours_per_report"] * project_info.reports_count

                elif baseline["type"] == "per_requirement":
                    hours = baseline["base_hours_per_req"] * project_info.custom_requirements_count

                elif baseline["type"] == "per_week":
                    # 假设项目周期为6个月 = 26周
                    hours = baseline["base_hours_per_week"] * 26

                elif baseline["type"] == "per_milestone":
                    # 假设5个里程碑
                    hours = baseline["base_hours_per_milestone"] * 5

                elif baseline["type"] == "per_month":
                    # 假设试运行3个月
                    hours = baseline["base_hours_per_month"] * 3

                elif baseline["type"] == "per_scenario":
                    # SIT测试场景数 = 数据源数 * 5
                    scenarios = project_info.data_sources_count * 5
                    hours = baseline["base_hours_per_scenario"] * scenarios

                # 累加工时
                task["base_hours"] = hours
                total_hours += hours

                # 统计开发阶段工时
                if phase["phase"] == "开发实施":
                    dev_hours += hours

        # 计算百分比类型的任务
        for phase in wbs:
            for task in phase["tasks"]:
                task_type = task["type"]
                baseline = self.baseline.BASELINES.get(task_type)

                if baseline and baseline["type"] == "percentage":
                    if "test" in task_type:
                        # 测试相关的百分比基于开发工时
                        hours = dev_hours * baseline["percentage"]
                    else:
                        hours = total_hours * baseline["percentage"]

                    task["base_hours"] = hours
                    total_hours += hours

        return round(total_hours, 1)

    def _apply_complexity_adjustment(self, base_hours: float, complexity: ComplexityScore) -> float:
        """
        应用复杂度调整
        """
        multiplier = self.baseline.COMPLEXITY_MULTIPLIERS[complexity.level]
        adjusted = base_hours * multiplier
        return round(adjusted, 1)

    def _three_point_estimation(self, base_estimate: float, complexity: ComplexityScore) -> Dict:
        """
        三点估算 (PERT方法)
        """
        # 乐观估算: 减少20-30%
        optimistic = base_estimate * 0.75

        # 最可能估算: 基础估算
        most_likely = base_estimate

        # 悲观估算: 增加30-60%
        risk_factor = 1.3 if complexity.level in ["simple", "medium"] else 1.6
        pessimistic = base_estimate * risk_factor

        # PERT加权平均
        expected = (optimistic + 4 * most_likely + pessimistic) / 6

        # 标准差
        std_dev = (pessimistic - optimistic) / 6

        # 95%置信区间
        confidence_interval = (
            round(expected - 2 * std_dev, 1),
            round(expected + 2 * std_dev, 1)
        )

        return {
            "optimistic": round(optimistic, 1),
            "most_likely": round(most_likely, 1),
            "pessimistic": round(pessimistic, 1),
            "expected": round(expected, 1),
            "std_deviation": round(std_dev, 1),
            "confidence_interval": confidence_interval
        }

    def _calculate_phase_breakdown(self, wbs: List[Dict]) -> Dict[str, float]:
        """
        计算各阶段工时分解
        """
        breakdown = {}
        for phase in wbs:
            phase_hours = sum(task.get("base_hours", 0) for task in phase["tasks"])
            breakdown[phase["phase"]] = round(phase_hours, 1)
        return breakdown

    def _determine_confidence_level(self, complexity: ComplexityScore) -> str:
        """
        确定置信度等级
        """
        if complexity.level == "simple":
            return "高"
        elif complexity.level == "medium":
            return "中"
        else:
            return "低"


# 便捷函数
def estimate_project(project_info: ProjectInfo) -> EstimationResult:
    """
    评估项目工作量的便捷函数
    """
    estimator = WorkloadEstimator()
    return estimator.estimate(project_info)
