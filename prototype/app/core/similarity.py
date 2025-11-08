"""
相似项目匹配算法
Similar Project Matching Algorithm
"""

from typing import List, Dict, Optional
from dataclasses import dataclass
import math
import numpy as np


@dataclass
class HistoricalProject:
    """历史项目数据"""
    id: int
    name: str
    project_type: str
    client_type: str
    data_sources_count: int
    interface_tables_count: int
    reports_count: int
    custom_requirements_count: int
    complexity_score: float
    actual_hours: float
    variance_percentage: float


@dataclass
class SimilarityResult:
    """相似度匹配结果"""
    project: HistoricalProject
    similarity_score: float
    categorical_similarity: float
    scale_similarity: float
    complexity_similarity: float
    matching_method: str


class ProjectSimilarityMatcher:
    """项目相似度匹配器"""

    def __init__(self, historical_projects: List[HistoricalProject]):
        self.historical_projects = historical_projects

    def find_similar_projects(
        self,
        target_project: Dict,
        top_k: int = 5,
        method: str = "hybrid"
    ) -> List[SimilarityResult]:
        """
        查找最相似的K个历史项目

        Args:
            target_project: 目标项目信息
            top_k: 返回Top-K个相似项目
            method: 匹配方法 (cosine, euclidean, hybrid)

        Returns:
            相似项目列表,按相似度降序排列
        """
        similarities = []

        for hist_proj in self.historical_projects:
            similarity = self._calculate_similarity(
                target_project,
                hist_proj,
                method
            )
            similarities.append(similarity)

        # 按相似度排序
        similarities.sort(key=lambda x: x.similarity_score, reverse=True)

        return similarities[:top_k]

    def _calculate_similarity(
        self,
        target: Dict,
        historical: HistoricalProject,
        method: str
    ) -> SimilarityResult:
        """
        计算两个项目之间的相似度
        """

        # 1. 分类特征相似度 (精确匹配)
        categorical_sim = self._categorical_similarity(target, historical)

        # 2. 规模相似度 (归一化距离)
        scale_sim = self._scale_similarity(target, historical)

        # 3. 复杂度相似度
        complexity_sim = self._complexity_similarity(target, historical)

        # 综合相似度 (加权平均)
        if method == "hybrid":
            total_similarity = (
                categorical_sim * 0.4 +
                scale_sim * 0.3 +
                complexity_sim * 0.3
            )
        elif method == "cosine":
            total_similarity = self._cosine_similarity(target, historical)
        elif method == "euclidean":
            total_similarity = self._euclidean_similarity(target, historical)
        else:
            total_similarity = (categorical_sim + scale_sim + complexity_sim) / 3

        return SimilarityResult(
            project=historical,
            similarity_score=round(total_similarity, 4),
            categorical_similarity=round(categorical_sim, 4),
            scale_similarity=round(scale_sim, 4),
            complexity_similarity=round(complexity_sim, 4),
            matching_method=method
        )

    def _categorical_similarity(self, target: Dict, historical: HistoricalProject) -> float:
        """
        分类特征相似度 (精确匹配)
        """
        score = 0.0

        # 项目类型匹配 (权重40%)
        if target.get("project_type") == historical.project_type:
            score += 0.6

        # 客户类型匹配 (权重20%)
        if target.get("client_type") == historical.client_type:
            score += 0.4

        return score

    def _scale_similarity(self, target: Dict, historical: HistoricalProject) -> float:
        """
        规模相似度 (归一化欧氏距离)
        """
        scale_features = [
            ("data_sources_count", 1.0),
            ("interface_tables_count", 0.5),  # 权重较低
            ("reports_count", 0.3)
        ]

        distance_squared = 0.0

        for feature, weight in scale_features:
            target_val = target.get(feature, 0)
            hist_val = getattr(historical, feature, 0)

            # 归一化差异
            max_val = max(target_val, hist_val, 1)
            normalized_diff = abs(target_val - hist_val) / max_val

            distance_squared += weight * (normalized_diff ** 2)

        # 转换为相似度 (0-1)
        distance = math.sqrt(distance_squared)
        similarity = 1 / (1 + distance)

        return similarity

    def _complexity_similarity(self, target: Dict, historical: HistoricalProject) -> float:
        """
        复杂度相似度
        """
        target_complexity = target.get("complexity_score", 5.0)
        hist_complexity = historical.complexity_score

        # 归一化差异 (复杂度范围0-10)
        diff = abs(target_complexity - hist_complexity)
        normalized_diff = diff / 10.0

        similarity = 1.0 - normalized_diff

        return max(similarity, 0.0)

    def _cosine_similarity(self, target: Dict, historical: HistoricalProject) -> float:
        """
        余弦相似度
        """
        # 构建特征向量
        target_vector = [
            target.get("data_sources_count", 0),
            target.get("interface_tables_count", 0),
            target.get("reports_count", 0),
            target.get("custom_requirements_count", 0),
            target.get("complexity_score", 5.0)
        ]

        hist_vector = [
            historical.data_sources_count,
            historical.interface_tables_count,
            historical.reports_count,
            historical.custom_requirements_count,
            historical.complexity_score
        ]

        # 计算余弦相似度
        dot_product = sum(a * b for a, b in zip(target_vector, hist_vector))
        magnitude_target = math.sqrt(sum(a ** 2 for a in target_vector))
        magnitude_hist = math.sqrt(sum(b ** 2 for b in hist_vector))

        if magnitude_target == 0 or magnitude_hist == 0:
            return 0.0

        cosine_sim = dot_product / (magnitude_target * magnitude_hist)

        return max(cosine_sim, 0.0)

    def _euclidean_similarity(self, target: Dict, historical: HistoricalProject) -> float:
        """
        欧氏相似度
        """
        target_vector = [
            target.get("data_sources_count", 0),
            target.get("interface_tables_count", 0),
            target.get("reports_count", 0),
            target.get("complexity_score", 5.0)
        ]

        hist_vector = [
            historical.data_sources_count,
            historical.interface_tables_count,
            historical.reports_count,
            historical.complexity_score
        ]

        # 标准化
        target_norm = self._normalize_vector(target_vector)
        hist_norm = self._normalize_vector(hist_vector)

        # 计算欧氏距离
        distance = math.sqrt(
            sum((a - b) ** 2 for a, b in zip(target_norm, hist_norm))
        )

        # 转换为相似度
        similarity = 1 / (1 + distance)

        return similarity

    def _normalize_vector(self, vector: List[float]) -> List[float]:
        """标准化向量 (0-1范围)"""
        if not vector:
            return []

        min_val = min(vector)
        max_val = max(vector)

        if max_val == min_val:
            return [0.5] * len(vector)

        return [(v - min_val) / (max_val - min_val) for v in vector]


class CaseBasedEstimator:
    """基于案例的评估器"""

    @staticmethod
    def estimate_from_similar_projects(
        similar_projects: List[SimilarityResult]
    ) -> Dict:
        """
        基于相似项目进行工作量评估
        """
        if not similar_projects:
            return {
                "estimate": None,
                "confidence": 0.0,
                "based_on_projects": 0
            }

        # 相似度加权平均
        total_weight = sum(proj.similarity_score for proj in similar_projects)

        if total_weight == 0:
            return {
                "estimate": None,
                "confidence": 0.0,
                "based_on_projects": len(similar_projects)
            }

        weighted_hours = sum(
            proj.project.actual_hours * proj.similarity_score
            for proj in similar_projects
        ) / total_weight

        # 考虑历史偏差率
        avg_variance = sum(
            proj.project.variance_percentage * proj.similarity_score
            for proj in similar_projects
        ) / total_weight

        # 调整估算值
        adjusted_estimate = weighted_hours * (1 + avg_variance / 100)

        # 计算置信区间
        hours_list = [p.project.actual_hours for p in similar_projects]
        std_dev = np.std(hours_list) if len(hours_list) > 1 else weighted_hours * 0.15

        confidence_interval = (
            round(adjusted_estimate - 1.96 * std_dev, 1),
            round(adjusted_estimate + 1.96 * std_dev, 1)
        )

        # 平均相似度作为置信度
        avg_similarity = total_weight / len(similar_projects)

        return {
            "estimate": round(adjusted_estimate, 1),
            "confidence_interval": confidence_interval,
            "confidence": round(avg_similarity, 2),
            "based_on_projects": len(similar_projects),
            "avg_similarity": round(avg_similarity, 4),
            "avg_variance": round(avg_variance, 2),
            "reference_projects": [
                {
                    "name": p.project.name,
                    "actual_hours": p.project.actual_hours,
                    "similarity": p.similarity_score
                }
                for p in similar_projects[:3]  # 返回前3个
            ]
        }


# 便捷函数
def find_and_estimate(
    target_project: Dict,
    historical_projects: List[HistoricalProject],
    top_k: int = 5
) -> Dict:
    """
    查找相似项目并基于它们进行评估

    Args:
        target_project: 目标项目信息
        historical_projects: 历史项目列表
        top_k: 查找Top-K个相似项目

    Returns:
        包含评估结果和相似项目信息的字典
    """
    # 查找相似项目
    matcher = ProjectSimilarityMatcher(historical_projects)
    similar = matcher.find_similar_projects(target_project, top_k=top_k)

    # 基于相似项目评估
    estimation = CaseBasedEstimator.estimate_from_similar_projects(similar)

    return {
        "similar_projects": similar,
        "estimation": estimation
    }
