"""
项目成本估算器的测试用例
"""

import pytest
import sys
import os

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from cost_estimator import ProjectCostEstimator


class TestProjectCostEstimator:
    """项目成本估算器测试类"""
    
    def setup_method(self):
        """每个测试方法前的设置"""
        self.estimator = ProjectCostEstimator()
    
    def test_init(self):
        """测试初始化"""
        assert self.estimator.base_cost_per_hour == 100
        assert 'low' in self.estimator.complexity_factors
        assert 'medium' in self.estimator.complexity_factors
        assert 'high' in self.estimator.complexity_factors
    
    def test_estimate_cost_basic(self):
        """测试基本成本估算"""
        params = {
            'hours': 40,
            'complexity': 'medium',
            'team_size': 2,
            'duration': 10
        }
        result = self.estimator.estimate_cost(params)
        
        # 验证返回的字段
        assert 'base_cost' in result
        assert 'total_cost' in result
        assert 'cost_per_hour' in result
        assert 'team_factor' in result
        assert 'duration_factor' in result
        
        # 验证计算结果
        expected_base_cost = 40 * 100 * 1.5  # hours * base_rate * complexity_factor
        assert result['base_cost'] == expected_base_cost
        assert result['total_cost'] > expected_base_cost  # 团队和持续时间因素应该增加成本
    
    def test_estimate_cost_low_complexity(self):
        """测试低复杂度项目成本估算"""
        params = {
            'hours': 80,
            'complexity': 'low',
            'team_size': 1,
            'duration': 20
        }
        result = self.estimator.estimate_cost(params)
        
        expected_base_cost = 80 * 100 * 1.0  # low complexity factor
        assert result['base_cost'] == expected_base_cost
    
    def test_estimate_cost_high_complexity(self):
        """测试高复杂度项目成本估算"""
        params = {
            'hours': 100,
            'complexity': 'high',
            'team_size': 3,
            'duration': 30
        }
        result = self.estimator.estimate_cost(params)
        
        expected_base_cost = 100 * 100 * 2.0  # high complexity factor
        assert result['base_cost'] == expected_base_cost
    
    def test_estimate_cost_default_values(self):
        """测试默认值"""
        params = {'hours': 20}
        result = self.estimator.estimate_cost(params)
        
        # 应该使用默认的复杂度 'medium'
        expected_base_cost = 20 * 100 * 1.5
        assert result['base_cost'] == expected_base_cost
        
        # 团队规模默认为1
        assert result['team_factor'] == 1.0
    
    def test_estimate_cost_zero_hours(self):
        """测试零工时的情况"""
        params = {'hours': 0}
        result = self.estimator.estimate_cost(params)
        
        assert result['base_cost'] == 0
        assert result['total_cost'] == 0
        assert result['cost_per_hour'] == 0
    
    def test_estimate_cost_large_team(self):
        """测试大型团队的成本计算"""
        params = {
            'hours': 160,
            'complexity': 'medium',
            'team_size': 10,
            'duration': 60
        }
        result = self.estimator.estimate_cost(params)
        
        # 大型团队的团队因子应该更高
        expected_team_factor = 1 + (10 - 1) * 0.1  # 1.9
        assert result['team_factor'] == expected_team_factor
    
    def test_validate_parameters_valid(self):
        """测试有效参数验证"""
        valid_params = {
            'hours': 40,
            'complexity': 'medium',
            'team_size': 2,
            'duration': 10
        }
        errors = self.estimator.validate_parameters(valid_params)
        assert errors == []
    
    def test_validate_parameters_missing_hours(self):
        """测试缺少工时参数"""
        params = {
            'complexity': 'medium',
            'team_size': 2
        }
        errors = self.estimator.validate_parameters(params)
        assert len(errors) > 0
        assert any("工时必须大于0" in error for error in errors)
    
    def test_validate_parameters_negative_hours(self):
        """测试负工时参数"""
        params = {
            'hours': -10,
            'complexity': 'medium'
        }
        errors = self.estimator.validate_parameters(params)
        assert len(errors) > 0
        assert any("工时必须大于0" in error for error in errors)
    
    def test_validate_parameters_invalid_complexity(self):
        """测试无效的复杂度参数"""
        params = {
            'hours': 40,
            'complexity': 'invalid'
        }
        errors = self.estimator.validate_parameters(params)
        assert len(errors) > 0
        assert any("复杂度必须是以下之一" in error for error in errors)
    
    def test_validate_parameters_negative_team_size(self):
        """测试负团队规模"""
        params = {
            'hours': 40,
            'team_size': -1
        }
        errors = self.estimator.validate_parameters(params)
        assert len(errors) > 0
        assert any("团队规模必须大于0" in error for error in errors)
    
    def test_validate_parameters_negative_duration(self):
        """测试负持续时间"""
        params = {
            'hours': 40,
            'duration': -5
        }
        errors = self.estimator.validate_parameters(params)
        assert len(errors) > 0
        assert any("项目持续时间必须大于0" in error for error in errors)
    
    def test_cost_per_hour_calculation(self):
        """测试单位小时成本计算"""
        params = {
            'hours': 50,
            'complexity': 'high',
            'team_size': 2,
            'duration': 15
        }
        result = self.estimator.estimate_cost(params)
        
        # 验证单位小时成本计算
        expected_cost_per_hour = result['total_cost'] / 50
        assert result['cost_per_hour'] == expected_cost_per_hour
    
    def test_duration_factor_limit(self):
        """测试持续时间因子的上限"""
        params = {
            'hours': 100,
            'complexity': 'medium',
            'duration': 1000  # 很大的持续时间
        }
        result = self.estimator.estimate_cost(params)
        
        # 持续时间因子最大应该是1.2
        assert result['duration_factor'] == 1.2


class TestEdgeCases:
    """边界情况测试"""
    
    def setup_method(self):
        """设置测试环境"""
        self.estimator = ProjectCostEstimator()
    
    def test_empty_parameters(self):
        """测试空参数字典"""
        params = {}
        result = self.estimator.estimate_cost(params)
        
        assert result['base_cost'] == 0
        assert result['total_cost'] == 0
    
    def test_minimum_values(self):
        """测试最小值"""
        params = {
            'hours': 1,
            'complexity': 'low',
            'team_size': 1,
            'duration': 1
        }
        result = self.estimator.estimate_cost(params)
        
        assert result['base_cost'] == 100  # 1 * 100 * 1.0
        assert result['total_cost'] > 100