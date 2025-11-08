"""
高级项目成本估算器模块
支持更多功能：风险评估、历史数据分析、自定义配置等
"""

import json
import pickle
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import numpy as np


@dataclass
class ProjectRisk:
    """项目风险评估数据类"""
    probability: float  # 风险发生概率 0-1
    impact: float      # 风险影响程度 0-1
    description: str   # 风险描述
    category: str      # 风险类别


@dataclass
class HistoricalProject:
    """历史项目数据类"""
    name: str
    actual_hours: float
    estimated_hours: float
    actual_cost: float
    estimated_cost: float
    complexity: str
    team_size: int
    duration: int
    completion_date: datetime
    success_factors: List[str]


class AdvancedCostEstimator:
    """高级项目成本估算器类"""
    
    def __init__(self, config_file: Optional[str] = None):
        """
        初始化高级估算器
        
        Args:
            config_file: 配置文件路径
        """
        self.default_config = {
            'base_cost_per_hour': 100,
            'complexity_factors': {
                'low': 1.0,
                'medium': 1.5,
                'high': 2.0,
                'enterprise': 3.0
            },
            'industry_multipliers': {
                'technology': 1.0,
                'finance': 1.2,
                'healthcare': 1.3,
                'education': 0.9,
                'ecommerce': 1.1
            },
            'team_experience_factors': {
                'junior': 1.2,
                'intermediate': 1.0,
                'senior': 0.9,
                'expert': 0.8
            },
            'risk_contingency_rate': 0.15,  # 15%风险准备金
            'inflation_rate': 0.03  # 3%年通胀率
        }
        
        self.config = self.default_config.copy()
        if config_file and os.path.exists(config_file):
            self.load_config(config_file)
        
        self.historical_projects: List[HistoricalProject] = []
        self.risk_database: List[ProjectRisk] = self._init_risk_database()
        
    def _init_risk_database(self) -> List[ProjectRisk]:
        """初始化风险数据库"""
        return [
            ProjectRisk(0.3, 0.7, "需求变更频繁", "需求风险"),
            ProjectRisk(0.2, 0.8, "技术栈不熟悉", "技术风险"),
            ProjectRisk(0.4, 0.6, "团队成员不稳定", "人力资源风险"),
            ProjectRisk(0.25, 0.9, "第三方依赖延期", "供应链风险"),
            ProjectRisk(0.15, 0.5, "预算限制", "财务风险"),
            ProjectRisk(0.35, 0.7, "客户沟通不畅", "沟通风险"),
        ]
    
    def load_config(self, config_file: str) -> None:
        """加载配置文件"""
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
                self.config.update(user_config)
        except Exception as e:
            print(f"配置文件加载失败: {e}")
    
    def save_config(self, config_file: str) -> None:
        """保存配置文件"""
        try:
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"配置文件保存失败: {e}")
    
    def load_historical_data(self, data_file: str) -> None:
        """加载历史项目数据"""
        try:
            with open(data_file, 'rb') as f:
                self.historical_projects = pickle.load(f)
        except Exception as e:
            print(f"历史数据加载失败: {e}")
    
    def save_historical_data(self, data_file: str) -> None:
        """保存历史项目数据"""
        try:
            with open(data_file, 'wb') as f:
                pickle.dump(self.historical_projects, f)
        except Exception as e:
            print(f"历史数据保存失败: {e}")
    
    def add_historical_project(self, project: HistoricalProject) -> None:
        """添加历史项目数据"""
        self.historical_projects.append(project)
    
    def estimate_cost_advanced(self, project_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        高级成本估算
        
        Args:
            project_params: 项目参数字典
                - hours: 预估工时
                - complexity: 复杂度
                - team_size: 团队规模
                - duration: 项目持续时间（天）
                - industry: 行业类型
                - team_experience: 团队经验水平
                - start_date: 项目开始日期
        
        Returns:
            详细的成本估算结果
        """
        # 基础参数提取
        hours = project_params.get('hours', 0)
        complexity = project_params.get('complexity', 'medium')
        team_size = project_params.get('team_size', 1)
        duration = project_params.get('duration', 1)
        industry = project_params.get('industry', 'technology')
        team_experience = project_params.get('team_experience', 'intermediate')
        start_date = project_params.get('start_date', datetime.now())
        
        # 获取配置因子
        complexity_factor = self.config['complexity_factors'].get(complexity, 1.5)
        industry_multiplier = self.config['industry_multipliers'].get(industry, 1.0)
        experience_factor = self.config['team_experience_factors'].get(team_experience, 1.0)
        
        # 基础成本计算
        base_cost = hours * self.config['base_cost_per_hour'] * complexity_factor
        
        # 各种调整因子
        team_factor = 1 + (team_size - 1) * 0.1
        duration_factor = min(1.2, 1 + duration * 0.01)
        
        # 基于历史数据的准确性调整
        accuracy_adjustment = self._calculate_accuracy_adjustment(project_params)
        
        # 通胀调整（如果项目在未来开始）
        inflation_adjustment = self._calculate_inflation_adjustment(start_date)
        
        # 计算总成本
        subtotal = base_cost * team_factor * duration_factor * industry_multiplier * experience_factor
        subtotal *= accuracy_adjustment * inflation_adjustment
        
        # 风险准备金
        risk_assessment = self.assess_project_risks(project_params)
        risk_contingency = subtotal * self.config['risk_contingency_rate'] * risk_assessment['overall_risk_factor']
        
        total_cost = subtotal + risk_contingency
        
        return {
            'base_cost': base_cost,
            'subtotal': subtotal,
            'total_cost': total_cost,
            'risk_contingency': risk_contingency,
            'cost_per_hour': total_cost / hours if hours > 0 else 0,
            'factors': {
                'complexity_factor': complexity_factor,
                'industry_multiplier': industry_multiplier,
                'experience_factor': experience_factor,
                'team_factor': team_factor,
                'duration_factor': duration_factor,
                'accuracy_adjustment': accuracy_adjustment,
                'inflation_adjustment': inflation_adjustment
            },
            'risk_assessment': risk_assessment,
            'confidence_level': self._calculate_confidence_level(project_params)
        }
    
    def _calculate_accuracy_adjustment(self, project_params: Dict[str, Any]) -> float:
        """基于历史数据计算准确性调整因子"""
        if not self.historical_projects:
            return 1.0
        
        # 找到相似的历史项目
        similar_projects = [
            p for p in self.historical_projects
            if p.complexity == project_params.get('complexity', 'medium') and
               abs(p.team_size - project_params.get('team_size', 1)) <= 2
        ]
        
        if not similar_projects:
            return 1.0
        
        # 计算平均估算准确性
        accuracy_ratios = [p.estimated_hours / p.actual_hours for p in similar_projects]
        avg_accuracy = np.mean(accuracy_ratios)
        
        # 如果历史估算偏低，增加调整因子
        return min(1.3, max(0.8, avg_accuracy))
    
    def _calculate_inflation_adjustment(self, start_date: datetime) -> float:
        """计算通胀调整因子"""
        if isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        
        today = datetime.now()
        if start_date <= today:
            return 1.0
        
        years_delay = (start_date - today).days / 365.25
        inflation_factor = (1 + self.config['inflation_rate']) ** years_delay
        
        return min(1.5, inflation_factor)  # 最多50%的通胀调整
    
    def assess_project_risks(self, project_params: Dict[str, Any]) -> Dict[str, Any]:
        """评估项目风险"""
        relevant_risks = []
        
        # 基于项目参数筛选相关风险
        complexity = project_params.get('complexity', 'medium')
        team_size = project_params.get('team_size', 1)
        duration = project_params.get('duration', 1)
        
        for risk in self.risk_database:
            risk_relevance = 1.0
            
            # 复杂度越高，技术风险越大
            if risk.category == "技术风险" and complexity in ['high', 'enterprise']:
                risk_relevance *= 1.5
            
            # 团队规模越大，人力资源风险越大
            if risk.category == "人力资源风险" and team_size > 5:
                risk_relevance *= 1.3
            
            # 持续时间越长，各种风险越大
            if duration > 60:
                risk_relevance *= 1.2
            
            adjusted_probability = min(1.0, risk.probability * risk_relevance)
            adjusted_impact = risk.impact
            
            if adjusted_probability > 0.1:  # 只考虑概率大于10%的风险
                relevant_risks.append({
                    'description': risk.description,
                    'category': risk.category,
                    'probability': adjusted_probability,
                    'impact': adjusted_impact,
                    'expected_value': adjusted_probability * adjusted_impact
                })
        
        # 按期望值排序
        relevant_risks.sort(key=lambda x: x['expected_value'], reverse=True)
        
        # 计算总体风险因子
        overall_risk_factor = sum(risk['expected_value'] for risk in relevant_risks)
        overall_risk_factor = min(2.0, overall_risk_factor)  # 最大风险因子为2.0
        
        return {
            'overall_risk_factor': overall_risk_factor,
            'risk_count': len(relevant_risks),
            'top_risks': relevant_risks[:5],  # 返回前5个风险
            'risk_level': self._get_risk_level(overall_risk_factor)
        }
    
    def _get_risk_level(self, risk_factor: float) -> str:
        """根据风险因子确定风险等级"""
        if risk_factor < 0.3:
            return "低风险"
        elif risk_factor < 0.7:
            return "中等风险"
        elif risk_factor < 1.2:
            return "高风险"
        else:
            return "极高风险"
    
    def _calculate_confidence_level(self, project_params: Dict[str, Any]) -> float:
        """计算估算置信度"""
        confidence = 0.8  # 基础置信度
        
        # 如果有历史数据，提高置信度
        if self.historical_projects:
            similar_count = len([
                p for p in self.historical_projects
                if p.complexity == project_params.get('complexity', 'medium')
            ])
            confidence += min(0.15, similar_count * 0.03)
        
        # 参数完整性检查
        required_params = ['hours', 'complexity', 'team_size', 'duration']
        provided_params = sum(1 for param in required_params if param in project_params)
        confidence += (provided_params / len(required_params)) * 0.05
        
        return min(1.0, confidence)
    
    def generate_project_report(self, project_params: Dict[str, Any], 
                              result: Dict[str, Any]) -> str:
        """生成详细的项目报告"""
        report = []
        report.append("=" * 60)
        report.append("项目成本估算报告")
        report.append("=" * 60)
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # 项目基本信息
        report.append("【项目基本信息】")
        report.append(f"预估工时: {project_params.get('hours', 0)} 小时")
        report.append(f"复杂度: {project_params.get('complexity', 'medium')}")
        report.append(f"团队规模: {project_params.get('team_size', 1)} 人")
        report.append(f"项目周期: {project_params.get('duration', 1)} 天")
        report.append(f"行业类型: {project_params.get('industry', 'technology')}")
        report.append(f"团队经验: {project_params.get('team_experience', 'intermediate')}")
        report.append("")
        
        # 成本分析
        report.append("【成本分析】")
        report.append(f"基础成本: ¥{result['base_cost']:,.2f}")
        report.append(f"调整后小计: ¥{result['subtotal']:,.2f}")
        report.append(f"风险准备金: ¥{result['risk_contingency']:,.2f}")
        report.append(f"总成本: ¥{result['total_cost']:,.2f}")
        report.append(f"单位小时成本: ¥{result['cost_per_hour']:,.2f}")
        report.append("")
        
        # 调整因子
        report.append("【调整因子详情】")
        factors = result['factors']
        for factor_name, factor_value in factors.items():
            report.append(f"{factor_name}: {factor_value:.3f}")
        report.append("")
        
        # 风险评估
        risk_assessment = result['risk_assessment']
        report.append("【风险评估】")
        report.append(f"总体风险等级: {risk_assessment['risk_level']}")
        report.append(f"总体风险因子: {risk_assessment['overall_risk_factor']:.3f}")
        report.append(f"识别风险数量: {risk_assessment['risk_count']}")
        
        if risk_assessment['top_risks']:
            report.append("\n主要风险:")
            for i, risk in enumerate(risk_assessment['top_risks'], 1):
                report.append(f"  {i}. {risk['description']} "
                            f"(概率: {risk['probability']:.1%}, "
                            f"影响: {risk['impact']:.1%})")
        
        report.append("")
        report.append(f"【估算置信度: {result['confidence_level']:.1%}】")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def validate_parameters_advanced(self, project_params: Dict[str, Any]) -> List[str]:
        """高级参数验证"""
        errors = []
        
        # 基础验证
        if 'hours' not in project_params or project_params['hours'] <= 0:
            errors.append("工时必须大于0")
        
        if 'complexity' in project_params:
            valid_complexities = list(self.config['complexity_factors'].keys())
            if project_params['complexity'] not in valid_complexities:
                errors.append(f"复杂度必须是以下之一: {valid_complexities}")
        
        if 'team_size' in project_params and project_params['team_size'] <= 0:
            errors.append("团队规模必须大于0")
        
        if 'duration' in project_params and project_params['duration'] <= 0:
            errors.append("项目持续时间必须大于0")
        
        # 高级验证
        if 'industry' in project_params:
            valid_industries = list(self.config['industry_multipliers'].keys())
            if project_params['industry'] not in valid_industries:
                errors.append(f"行业类型必须是以下之一: {valid_industries}")
        
        if 'team_experience' in project_params:
            valid_experiences = list(self.config['team_experience_factors'].keys())
            if project_params['team_experience'] not in valid_experiences:
                errors.append(f"团队经验必须是以下之一: {valid_experiences}")
        
        return errors