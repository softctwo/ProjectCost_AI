"""
集成测试用例
"""

import pytest
import sys
import os

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from cost_estimator import ProjectCostEstimator


class TestIntegration:
    """集成测试类"""
    
    def setup_method(self):
        """设置测试环境"""
        self.estimator = ProjectCostEstimator()
    
    def test_complete_workflow(self):
        """测试完整的工作流程"""
        # 1. 创建项目参数
        project_params = {
            'hours': 120,
            'complexity': 'high',
            'team_size': 4,
            'duration': 30
        }
        
        # 2. 验证参数
        errors = self.estimator.validate_parameters(project_params)
        assert errors == []
        
        # 3. 估算成本
        result = self.estimator.estimate_cost(project_params)
        
        # 4. 验证结果的合理性
        assert result['base_cost'] > 0
        assert result['total_cost'] > result['base_cost']
        assert result['cost_per_hour'] > 0
        assert result['team_factor'] > 1.0
        assert result['duration_factor'] > 1.0
    
    def test_multiple_projects_comparison(self):
        """测试多个项目的成本比较"""
        projects = [
            {
                'name': '小型项目',
                'params': {
                    'hours': 40,
                    'complexity': 'low',
                    'team_size': 1,
                    'duration': 5
                }
            },
            {
                'name': '中型项目',
                'params': {
                    'hours': 160,
                    'complexity': 'medium',
                    'team_size': 3,
                    'duration': 20
                }
            },
            {
                'name': '大型项目',
                'params': {
                    'hours': 500,
                    'complexity': 'high',
                    'team_size': 8,
                    'duration': 90
                }
            }
        ]
        
        results = []
        for project in projects:
            result = self.estimator.estimate_cost(project['params'])
            results.append({
                'name': project['name'],
                'total_cost': result['total_cost'],
                'cost_per_hour': result['cost_per_hour']
            })
        
        # 验证成本递增
        assert results[0]['total_cost'] < results[1]['total_cost'] < results[2]['total_cost']
        
        # 验证所有项目的单位小时成本都是合理的
        for result in results:
            assert result['cost_per_hour'] > 100  # 应该大于基础时薪
    
    def test_complexity_impact_analysis(self):
        """测试复杂度对成本的影响分析"""
        base_params = {
            'hours': 100,
            'team_size': 2,
            'duration': 15
        }
        
        complexity_results = {}
        for complexity in ['low', 'medium', 'high']:
            params = base_params.copy()
            params['complexity'] = complexity
            result = self.estimator.estimate_cost(params)
            complexity_results[complexity] = result['total_cost']
        
        # 验证复杂度对成本的影响
        assert complexity_results['low'] < complexity_results['medium'] < complexity_results['high']
        
        # 验证比例关系
        assert abs(complexity_results['medium'] / complexity_results['low'] - 1.5) < 0.01
        assert abs(complexity_results['high'] / complexity_results['low'] - 2.0) < 0.01
    
    def test_team_size_scaling(self):
        """测试团队规模的扩展效应"""
        base_params = {
            'hours': 200,
            'complexity': 'medium',
            'duration': 30
        }
        
        team_results = {}
        for team_size in [1, 2, 5, 10]:
            params = base_params.copy()
            params['team_size'] = team_size
            result = self.estimator.estimate_cost(params)
            team_results[team_size] = result['total_cost']
        
        # 验证团队规模对成本的影响（只测试我们有的数据）
        team_sizes = [1, 2, 5, 10]
        for i in range(1, len(team_sizes)):
            current_size = team_sizes[i]
            prev_size = team_sizes[i-1]
            assert team_results[current_size] > team_results[prev_size]
        
        # 验证团队因子计算
        for size in [1, 2, 5, 10]:
            expected_factor = 1 + (size - 1) * 0.1
            params = base_params.copy()
            params['team_size'] = size
            result = self.estimator.estimate_cost(params)
            assert abs(result['team_factor'] - expected_factor) < 0.001