"""
项目成本估算器模块
"""

import numpy as np
from typing import Dict, List, Any


class ProjectCostEstimator:
    """项目成本估算器类"""
    
    def __init__(self):
        self.base_cost_per_hour = 100  # 基础时薪
        self.complexity_factors = {
            'low': 1.0,
            'medium': 1.5,
            'high': 2.0
        }
    
    def estimate_cost(self, project_params: Dict[str, Any]) -> Dict[str, float]:
        """
        估算项目成本
        
        Args:
            project_params: 包含项目参数的字典
                - hours: 预估工时
                - complexity: 复杂度 ('low', 'medium', 'high')
                - team_size: 团队规模
                - duration: 项目持续时间（天）
        
        Returns:
            包含成本估算结果的字典
        """
        hours = project_params.get('hours', 0)
        complexity = project_params.get('complexity', 'medium')
        team_size = project_params.get('team_size', 1)
        duration = project_params.get('duration', 1)
        
        complexity_factor = self.complexity_factors.get(complexity, 1.5)
        
        # 基础成本计算
        base_cost = hours * self.base_cost_per_hour * complexity_factor
        
        # 团队规模影响
        team_factor = 1 + (team_size - 1) * 0.1  # 每增加1人，成本增加10%
        
        # 项目持续时间影响
        duration_factor = min(1.2, 1 + duration * 0.01)  # 最长增加20%
        
        total_cost = base_cost * team_factor * duration_factor
        
        return {
            'base_cost': base_cost,
            'total_cost': total_cost,
            'cost_per_hour': total_cost / hours if hours > 0 else 0,
            'team_factor': team_factor,
            'duration_factor': duration_factor
        }
    
    def validate_parameters(self, project_params: Dict[str, Any]) -> List[str]:
        """
        验证项目参数的有效性
        
        Args:
            project_params: 项目参数字典
        
        Returns:
            错误信息列表，空列表表示参数有效
        """
        errors = []
        
        if 'hours' not in project_params or project_params['hours'] <= 0:
            errors.append("工时必须大于0")
        
        if 'complexity' in project_params:
            if project_params['complexity'] not in self.complexity_factors:
                errors.append(f"复杂度必须是以下之一: {list(self.complexity_factors.keys())}")
        
        if 'team_size' in project_params and project_params['team_size'] <= 0:
            errors.append("团队规模必须大于0")
        
        if 'duration' in project_params and project_params['duration'] <= 0:
            errors.append("项目持续时间必须大于0")
        
        return errors