"""
高级项目成本估算器的测试用例
"""

import pytest
import sys
import os
import tempfile
import json
from datetime import datetime, timedelta

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from advanced_estimator import (
    AdvancedCostEstimator, 
    ProjectRisk, 
    HistoricalProject
)


class TestAdvancedCostEstimator:
    """高级项目成本估算器测试类"""
    
    def setup_method(self):
        """每个测试方法前的设置"""
        self.estimator = AdvancedCostEstimator()
    
    def test_init_default(self):
        """测试默认初始化"""
        assert self.estimator.config['base_cost_per_hour'] == 100
        assert 'enterprise' in self.estimator.config['complexity_factors']
        assert len(self.estimator.risk_database) > 0
        assert len(self.estimator.historical_projects) == 0
    
    def test_init_with_config(self):
        """测试使用配置文件初始化"""
        # 创建临时配置文件
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            config = {
                "base_cost_per_hour": 150,
                "risk_contingency_rate": 0.2
            }
            json.dump(config, f)
            config_file = f.name
        
        try:
            estimator = AdvancedCostEstimator(config_file)
            assert estimator.config['base_cost_per_hour'] == 150
            assert estimator.config['risk_contingency_rate'] == 0.2
        finally:
            os.unlink(config_file)
    
    def test_estimate_cost_advanced_basic(self):
        """测试基本高级成本估算"""
        params = {
            'hours': 100,
            'complexity': 'medium',
            'team_size': 3,
            'duration': 30,
            'industry': 'technology',
            'team_experience': 'intermediate'
        }
        result = self.estimator.estimate_cost_advanced(params)
        
        # 验证返回字段
        required_fields = [
            'base_cost', 'subtotal', 'total_cost', 'risk_contingency',
            'cost_per_hour', 'factors', 'risk_assessment', 'confidence_level'
        ]
        for field in required_fields:
            assert field in result
        
        # 验证成本逻辑
        assert result['total_cost'] > result['base_cost']
        assert result['total_cost'] > result['subtotal']
        assert result['cost_per_hour'] > 0
    
    def test_estimate_cost_with_enterprise_complexity(self):
        """测试企业级复杂度项目"""
        params = {
            'hours': 200,
            'complexity': 'enterprise',
            'team_size': 8,
            'duration': 90,
            'industry': 'finance',
            'team_experience': 'senior'
        }
        result = self.estimator.estimate_cost_advanced(params)
        
        # 企业级复杂度应该有更高的成本
        assert result['factors']['complexity_factor'] == 3.0
        assert result['factors']['industry_multiplier'] == 1.2  # finance
        assert result['factors']['experience_factor'] == 0.9  # senior
    
    def test_estimate_cost_different_industries(self):
        """测试不同行业的成本估算"""
        base_params = {
            'hours': 100,
            'complexity': 'medium',
            'team_size': 3,
            'duration': 30
        }
        
        industry_results = {}
        for industry in ['technology', 'finance', 'healthcare', 'education']:
            params = base_params.copy()
            params['industry'] = industry
            result = self.estimator.estimate_cost_advanced(params)
            industry_results[industry] = result['total_cost']
        
        # 验证行业成本差异
        assert industry_results['healthcare'] > industry_results['finance']
        assert industry_results['finance'] > industry_results['technology']
        assert industry_results['technology'] > industry_results['education']
    
    def test_estimate_cost_team_experience_impact(self):
        """测试团队经验对成本的影响"""
        base_params = {
            'hours': 120,
            'complexity': 'medium',
            'team_size': 4,
            'duration': 45
        }
        
        experience_results = {}
        for experience in ['junior', 'intermediate', 'senior', 'expert']:
            params = base_params.copy()
            params['team_experience'] = experience
            result = self.estimator.estimate_cost_advanced(params)
            experience_results[experience] = result['total_cost']
        
        # 经验越丰富，成本应该越低
        assert experience_results['junior'] > experience_results['intermediate']
        assert experience_results['intermediate'] > experience_results['senior']
        assert experience_results['senior'] > experience_results['expert']
    
    def test_inflation_adjustment(self):
        """测试通胀调整"""
        base_params = {
            'hours': 100,
            'complexity': 'medium'
        }
        
        # 今天开始的项目
        params_today = base_params.copy()
        params_today['start_date'] = datetime.now()
        result_today = self.estimator.estimate_cost_advanced(params_today)
        
        # 一年后开始的项目
        params_future = base_params.copy()
        params_future['start_date'] = datetime.now() + timedelta(days=365)
        result_future = self.estimator.estimate_cost_advanced(params_future)
        
        # 未来项目应该有通胀调整
        assert result_future['factors']['inflation_adjustment'] > 1.0
        assert result_future['total_cost'] > result_today['total_cost']
    
    def test_risk_assessment(self):
        """测试风险评估"""
        params = {
            'hours': 150,
            'complexity': 'high',
            'team_size': 8,
            'duration': 120
        }
        
        risk_assessment = self.estimator.assess_project_risks(params)
        
        # 验证风险评估结构
        assert 'overall_risk_factor' in risk_assessment
        assert 'risk_count' in risk_assessment
        assert 'top_risks' in risk_assessment
        assert 'risk_level' in risk_assessment
        
        # 高风险项目应该有较高的风险因子
        assert risk_assessment['overall_risk_factor'] > 0.5
        assert len(risk_assessment['top_risks']) > 0
        assert risk_assessment['risk_level'] in ['低风险', '中等风险', '高风险', '极高风险']
    
    def test_confidence_level_calculation(self):
        """测试置信度计算"""
        # 新项目，无历史数据
        params = {
            'hours': 100,
            'complexity': 'medium'
        }
        result = self.estimator.estimate_cost_advanced(params)
        base_confidence = result['confidence_level']
        
        # 添加历史数据
        historical_project = HistoricalProject(
            name="测试项目",
            actual_hours=95,
            estimated_hours=100,
            actual_cost=9500,
            estimated_cost=10000,
            complexity="medium",
            team_size=3,
            duration=30,
            completion_date=datetime.now() - timedelta(days=60),
            success_factors=["良好的需求分析", "稳定的技术栈"]
        )
        self.estimator.add_historical_project(historical_project)
        
        # 重新计算应该提高置信度
        result_with_history = self.estimator.estimate_cost_advanced(params)
        assert result_with_history['confidence_level'] > base_confidence
    
    def test_historical_data_accuracy_adjustment(self):
        """测试基于历史数据的准确性调整"""
        # 添加历史低估的项目
        underestimated_project = HistoricalProject(
            name="低估项目",
            actual_hours=150,
            estimated_hours=100,  # 低估了50%
            actual_cost=18000,
            estimated_cost=12000,
            complexity="medium",
            team_size=3,
            duration=40,
            completion_date=datetime.now() - timedelta(days=90),
            success_factors=[]
        )
        self.estimator.add_historical_project(underestimated_project)
        
        params = {
            'hours': 100,
            'complexity': 'medium',
            'team_size': 3
        }
        
        result = self.estimator.estimate_cost_advanced(params)
        
        # 应该有准确性调整因子 != 1.0（因为有历史数据调整）
        assert result['factors']['accuracy_adjustment'] != 1.0
    
    def test_config_operations(self):
        """测试配置文件操作"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            config_file = f.name
        
        try:
            # 保存配置
            self.estimator.config['base_cost_per_hour'] = 200
            self.estimator.save_config(config_file)
            
            # 验证配置文件内容
            with open(config_file, 'r') as f:
                saved_config = json.load(f)
                assert saved_config['base_cost_per_hour'] == 200
            
            # 加载配置到新的估算器
            new_estimator = AdvancedCostEstimator(config_file)
            assert new_estimator.config['base_cost_per_hour'] == 200
            
        finally:
            os.unlink(config_file)
    
    def test_historical_data_operations(self):
        """测试历史数据操作"""
        with tempfile.NamedTemporaryFile(suffix='.pkl', delete=False) as f:
            data_file = f.name
        
        try:
            # 添加历史项目
            project = HistoricalProject(
                name="测试项目",
                actual_hours=100,
                estimated_hours=95,
                actual_cost=12000,
                estimated_cost=11400,
                complexity="low",
                team_size=2,
                duration=20,
                completion_date=datetime.now(),
                success_factors=["良好的规划"]
            )
            self.estimator.add_historical_project(project)
            
            # 保存历史数据
            self.estimator.save_historical_data(data_file)
            
            # 加载到新的估算器
            new_estimator = AdvancedCostEstimator()
            new_estimator.load_historical_data(data_file)
            
            assert len(new_estimator.historical_projects) == 1
            assert new_estimator.historical_projects[0].name == "测试项目"
            
        finally:
            os.unlink(data_file)
    
    def test_generate_project_report(self):
        """测试项目报告生成"""
        params = {
            'hours': 200,
            'complexity': 'high',
            'team_size': 5,
            'duration': 60,
            'industry': 'finance',
            'team_experience': 'senior',
            'start_date': datetime.now() + timedelta(days=30)
        }
        
        result = self.estimator.estimate_cost_advanced(params)
        report = self.estimator.generate_project_report(params, result)
        
        # 验证报告内容
        assert "项目成本估算报告" in report
        assert "项目基本信息" in report
        assert "成本分析" in report
        assert "调整因子详情" in report
        assert "风险评估" in report
        assert f"¥{result['total_cost']:,.2f}" in report
    
    def test_validate_parameters_advanced(self):
        """测试高级参数验证"""
        # 有效参数
        valid_params = {
            'hours': 100,
            'complexity': 'high',
            'team_size': 4,
            'duration': 45,
            'industry': 'finance',
            'team_experience': 'senior'
        }
        errors = self.estimator.validate_parameters_advanced(valid_params)
        assert errors == []
        
        # 无效参数
        invalid_params = {
            'hours': -10,
            'complexity': 'invalid',
            'team_size': 0,
            'duration': -5,
            'industry': 'invalid_industry',
            'team_experience': 'invalid_experience'
        }
        errors = self.estimator.validate_parameters_advanced(invalid_params)
        assert len(errors) > 0
        assert any("工时必须大于0" in error for error in errors)
        assert any("复杂度必须是以下之一" in error for error in errors)
        assert any("团队规模必须大于0" in error for error in errors)
        assert any("项目持续时间必须大于0" in error for error in errors)
        assert any("行业类型必须是以下之一" in error for error in errors)
        assert any("团队经验必须是以下之一" in error for error in errors)


class TestProjectRisk:
    """项目风险数据类测试"""
    
    def test_project_risk_creation(self):
        """测试项目风险创建"""
        risk = ProjectRisk(
            probability=0.3,
            impact=0.7,
            description="测试风险",
            category="测试类别"
        )
        
        assert risk.probability == 0.3
        assert risk.impact == 0.7
        assert risk.description == "测试风险"
        assert risk.category == "测试类别"


class TestHistoricalProject:
    """历史项目数据类测试"""
    
    def test_historical_project_creation(self):
        """测试历史项目创建"""
        project = HistoricalProject(
            name="测试项目",
            actual_hours=100,
            estimated_hours=90,
            actual_cost=12000,
            estimated_cost=10800,
            complexity="medium",
            team_size=3,
            duration=30,
            completion_date=datetime.now(),
            success_factors=["良好的规划", "稳定的技术栈"]
        )
        
        assert project.name == "测试项目"
        assert project.actual_hours == 100
        assert project.estimated_hours == 90
        assert project.complexity == "medium"
        assert len(project.success_factors) == 2