#!/usr/bin/env python3
"""
ProjectCost AI 命令行界面
提供交互式和批处理模式的成本估算工具
"""

import argparse
import json
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

# 添加当前目录到 Python 路径
sys.path.insert(0, os.path.dirname(__file__))

from cost_estimator import ProjectCostEstimator
from advanced_estimator import AdvancedCostEstimator, HistoricalProject


class ProjectCostCLI:
    """项目成本估算命令行界面"""
    
    def __init__(self):
        self.basic_estimator = ProjectCostEstimator()
        self.advanced_estimator = AdvancedCostEstimator()
    
    def run_interactive_mode(self):
        """运行交互式模式"""
        print("=" * 60)
        print("🚀 ProjectCost AI - 项目成本估算工具")
        print("=" * 60)
        print()
        
        while True:
            print("请选择操作:")
            print("1. 基础成本估算")
            print("2. 高级成本估算")
            print("3. 批量估算")
            print("4. 查看历史数据")
            print("5. 添加历史项目")
            print("6. 配置管理")
            print("7. 生成示例报告")
            print("0. 退出")
            print()
            
            choice = input("请输入选项 (0-7): ").strip()
            
            if choice == '0':
                print("感谢使用 ProjectCost AI！")
                break
            elif choice == '1':
                self._basic_estimation_interactive()
            elif choice == '2':
                self._advanced_estimation_interactive()
            elif choice == '3':
                self._batch_estimation_interactive()
            elif choice == '4':
                self._view_historical_data()
            elif choice == '5':
                self._add_historical_project_interactive()
            elif choice == '6':
                self._config_management_interactive()
            elif choice == '7':
                self._generate_sample_report()
            else:
                print("无效选项，请重新选择。")
                print()
    
    def _basic_estimation_interactive(self):
        """交互式基础估算"""
        print("\n--- 基础成本估算 ---")
        
        try:
            params = {}
            params['hours'] = float(input("预估工时: "))
            params['complexity'] = input("复杂度 (low/medium/high): ").strip().lower()
            params['team_size'] = int(input("团队规模: "))
            params['duration'] = int(input("项目持续时间(天): "))
            
            # 验证参数
            errors = self.basic_estimator.validate_parameters(params)
            if errors:
                print("参数错误:")
                for error in errors:
                    print(f"  - {error}")
                return
            
            # 估算成本
            result = self.basic_estimator.estimate_cost(params)
            
            print("\n📊 估算结果:")
            print(f"基础成本: ¥{result['base_cost']:,.2f}")
            print(f"总成本: ¥{result['total_cost']:,.2f}")
            print(f"单位小时成本: ¥{result['cost_per_hour']:,.2f}")
            print(f"团队因子: {result['team_factor']:.2f}")
            print(f"持续时间因子: {result['duration_factor']:.2f}")
            
        except ValueError as e:
            print(f"输入错误: {e}")
        except Exception as e:
            print(f"估算失败: {e}")
        
        print()
    
    def _advanced_estimation_interactive(self):
        """交互式高级估算"""
        print("\n--- 高级成本估算 ---")
        
        try:
            params = {}
            params['hours'] = float(input("预估工时: "))
            params['complexity'] = input("复杂度 (low/medium/high/enterprise): ").strip().lower()
            params['team_size'] = int(input("团队规模: "))
            params['duration'] = int(input("项目持续时间(天): "))
            params['industry'] = input("行业类型: ").strip().lower()
            params['team_experience'] = input("团队经验 (junior/intermediate/senior/expert): ").strip().lower()
            
            start_date_str = input("开始日期 (YYYY-MM-DD, 留空为今天): ").strip()
            if start_date_str:
                params['start_date'] = datetime.strptime(start_date_str, '%Y-%m-%d')
            
            # 验证参数
            errors = self.advanced_estimator.validate_parameters_advanced(params)
            if errors:
                print("参数错误:")
                for error in errors:
                    print(f"  - {error}")
                return
            
            # 估算成本
            result = self.advanced_estimator.estimate_cost_advanced(params)
            
            print("\n📊 详细估算结果:")
            print(f"基础成本: ¥{result['base_cost']:,.2f}")
            print(f"调整后小计: ¥{result['subtotal']:,.2f}")
            print(f"风险准备金: ¥{result['risk_contingency']:,.2f}")
            print(f"总成本: ¥{result['total_cost']:,.2f}")
            print(f"单位小时成本: ¥{result['cost_per_hour']:,.2f}")
            
            print(f"\n🎯 风险评估:")
            risk_assessment = result['risk_assessment']
            print(f"风险等级: {risk_assessment['risk_level']}")
            print(f"风险因子: {risk_assessment['overall_risk_factor']:.3f}")
            
            if risk_assessment['top_risks']:
                print("主要风险:")
                for i, risk in enumerate(risk_assessment['top_risks'][:3], 1):
                    print(f"  {i}. {risk['description']}")
            
            print(f"\n📈 置信度: {result['confidence_level']:.1%}")
            
            # 询问是否生成详细报告
            generate_report = input("\n是否生成详细报告? (y/n): ").strip().lower()
            if generate_report == 'y':
                report = self.advanced_estimator.generate_project_report(params, result)
                print("\n" + report)
                
                # 询问是否保存报告
                save_report = input("是否保存报告到文件? (y/n): ").strip().lower()
                if save_report == 'y':
                    filename = f"project_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
                    with open(filename, 'w', encoding='utf-8') as f:
                        f.write(report)
                    print(f"报告已保存到: {filename}")
            
        except ValueError as e:
            print(f"输入错误: {e}")
        except Exception as e:
            print(f"估算失败: {e}")
        
        print()
    
    def _batch_estimation_interactive(self):
        """交互式批量估算"""
        print("\n--- 批量估算 ---")
        
        # 输入项目数量
        try:
            num_projects = int(input("要估算的项目数量: "))
            if num_projects <= 0:
                print("项目数量必须大于0")
                return
            
            results = []
            for i in range(num_projects):
                print(f"\n项目 {i+1}:")
                params = {}
                params['hours'] = float(input("  预估工时: "))
                params['complexity'] = input("  复杂度 (low/medium/high/enterprise): ").strip().lower()
                params['team_size'] = int(input("  团队规模: "))
                params['duration'] = int(input("  项目持续时间(天): "))
                params['industry'] = input("  行业类型: ").strip().lower()
                params['team_experience'] = input("  团队经验 (junior/intermediate/senior/expert): ").strip().lower()
                
                # 验证并估算
                errors = self.advanced_estimator.validate_parameters_advanced(params)
                if errors:
                    print(f"  参数错误，跳过项目 {i+1}")
                    continue
                
                result = self.advanced_estimator.estimate_cost_advanced(params)
                results.append({
                    'project_id': i+1,
                    'params': params,
                    'result': result
                })
            
            # 显示批量结果
            print(f"\n📊 批量估算结果 ({len(results)} 个项目):")
            print("-" * 80)
            print(f"{'ID':<4} {'工时':<8} {'复杂度':<12} {'总成本':<15} {'风险等级':<10} {'置信度':<8}")
            print("-" * 80)
            
            for item in results:
                params = item['params']
                result = item['result']
                print(f"{item['project_id']:<4} "
                     f"{params['hours']:<8} "
                     f"{params['complexity']:<12} "
                     f"¥{result['total_cost']:<14,.2f} "
                     f"{result['risk_assessment']['risk_level']:<10} "
                     f"{result['confidence_level']:<8.1%}")
            
            # 询问是否保存结果
            save_results = input("\n是否保存批量结果? (y/n): ").strip().lower()
            if save_results == 'y':
                filename = f"batch_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                with open(filename, 'w', encoding='utf-8') as f:
                    # 转换 datetime 对象为字符串以便 JSON 序列化
                    serializable_results = []
                    for item in results:
                        serializable_item = {
                            'project_id': item['project_id'],
                            'params': item['params'],
                            'result': item['result']
                        }
                        serializable_results.append(serializable_item)
                    json.dump(serializable_results, f, indent=2, ensure_ascii=False)
                print(f"结果已保存到: {filename}")
            
        except ValueError as e:
            print(f"输入错误: {e}")
        except Exception as e:
            print(f"批量估算失败: {e}")
        
        print()
    
    def _view_historical_data(self):
        """查看历史数据"""
        print("\n--- 历史数据 ---")
        
        if not self.advanced_estimator.historical_projects:
            print("暂无历史数据")
            print()
            return
        
        print(f"共有 {len(self.advanced_estimator.historical_projects)} 个历史项目:")
        print("-" * 80)
        print(f"{'项目名':<20} {'实际工时':<10} {'预估工时':<10} {'准确率':<8} {'复杂度':<12}")
        print("-" * 80)
        
        for project in self.advanced_estimator.historical_projects:
            accuracy = project.estimated_hours / project.actual_hours if project.actual_hours > 0 else 0
            print(f"{project.name:<20} "
                 f"{project.actual_hours:<10.1f} "
                 f"{project.estimated_hours:<10.1f} "
                 f"{accuracy:<8.1%} "
                 f"{project.complexity:<12}")
        
        print()
    
    def _add_historical_project_interactive(self):
        """交互式添加历史项目"""
        print("\n--- 添加历史项目 ---")
        
        try:
            name = input("项目名称: ").strip()
            actual_hours = float(input("实际工时: "))
            estimated_hours = float(input("预估工时: "))
            actual_cost = float(input("实际成本: "))
            estimated_cost = float(input("预估成本: "))
            complexity = input("复杂度 (low/medium/high/enterprise): ").strip().lower()
            team_size = int(input("团队规模: "))
            duration = int(input("项目持续时间(天): "))
            
            completion_date_str = input("完成日期 (YYYY-MM-DD): ").strip()
            completion_date = datetime.strptime(completion_date_str, '%Y-%m-%d')
            
            success_factors_input = input("成功因素 (用逗号分隔): ").strip()
            success_factors = [factor.strip() for factor in success_factors_input.split(',') if factor.strip()]
            
            project = HistoricalProject(
                name=name,
                actual_hours=actual_hours,
                estimated_hours=estimated_hours,
                actual_cost=actual_cost,
                estimated_cost=estimated_cost,
                complexity=complexity,
                team_size=team_size,
                duration=duration,
                completion_date=completion_date,
                success_factors=success_factors
            )
            
            self.advanced_estimator.add_historical_project(project)
            print(f"历史项目 '{name}' 已添加成功！")
            
            # 询问是否保存历史数据
            save_data = input("是否保存历史数据到文件? (y/n): ").strip().lower()
            if save_data == 'y':
                filename = input("历史数据文件名 (默认: historical_data.pkl): ").strip()
                if not filename:
                    filename = "historical_data.pkl"
                self.advanced_estimator.save_historical_data(filename)
                print(f"历史数据已保存到: {filename}")
            
        except ValueError as e:
            print(f"输入错误: {e}")
        except Exception as e:
            print(f"添加失败: {e}")
        
        print()
    
    def _config_management_interactive(self):
        """交互式配置管理"""
        print("\n--- 配置管理 ---")
        
        while True:
            print("当前配置:")
            print(f"1. 基础时薪: ¥{self.advanced_estimator.config['base_cost_per_hour']}")
            print(f"2. 风险准备金率: {self.advanced_estimator.config['risk_contingency_rate']:.1%}")
            print(f"3. 通胀率: {self.advanced_estimator.config['inflation_rate']:.1%}")
            print("4. 保存配置")
            print("5. 加载配置")
            print("0. 返回主菜单")
            
            choice = input("请选择操作 (0-5): ").strip()
            
            if choice == '0':
                break
            elif choice == '1':
                try:
                    new_rate = float(input("新的基础时薪: "))
                    self.advanced_estimator.config['base_cost_per_hour'] = new_rate
                    print("基础时薪已更新")
                except ValueError:
                    print("输入错误")
            elif choice == '2':
                try:
                    new_rate = float(input("新的风险准备金率 (0-1): "))
                    if 0 <= new_rate <= 1:
                        self.advanced_estimator.config['risk_contingency_rate'] = new_rate
                        print("风险准备金率已更新")
                    else:
                        print("风险准备金率必须在0-1之间")
                except ValueError:
                    print("输入错误")
            elif choice == '3':
                try:
                    new_rate = float(input("新的通胀率 (0-1): "))
                    if 0 <= new_rate <= 1:
                        self.advanced_estimator.config['inflation_rate'] = new_rate
                        print("通胀率已更新")
                    else:
                        print("通胀率必须在0-1之间")
                except ValueError:
                    print("输入错误")
            elif choice == '4':
                filename = input("配置文件名 (默认: config.json): ").strip()
                if not filename:
                    filename = "config.json"
                self.advanced_estimator.save_config(filename)
                print(f"配置已保存到: {filename}")
            elif choice == '5':
                filename = input("配置文件名 (默认: config.json): ").strip()
                if not filename:
                    filename = "config.json"
                if os.path.exists(filename):
                    self.advanced_estimator.load_config(filename)
                    print(f"配置已从 {filename} 加载")
                else:
                    print(f"配置文件 {filename} 不存在")
            else:
                print("无效选项")
            
            print()
    
    def _generate_sample_report(self):
        """生成示例报告"""
        print("\n--- 生成示例报告 ---")
        
        sample_params = {
            'hours': 250,
            'complexity': 'high',
            'team_size': 6,
            'duration': 90,
            'industry': 'finance',
            'team_experience': 'senior',
            'start_date': datetime.now() + timedelta(days=30)
        }
        
        try:
            result = self.advanced_estimator.estimate_cost_advanced(sample_params)
            report = self.advanced_estimator.generate_project_report(sample_params, result)
            
            print("\n" + report)
            
            save_report = input("是否保存示例报告? (y/n): ").strip().lower()
            if save_report == 'y':
                filename = f"sample_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(report)
                print(f"示例报告已保存到: {filename}")
            
        except Exception as e:
            print(f"生成示例报告失败: {e}")
        
        print()
    
    def run_batch_mode(self, input_file: str, output_file: str):
        """运行批处理模式"""
        try:
            # 读取输入文件
            with open(input_file, 'r', encoding='utf-8') as f:
                projects = json.load(f)
            
            results = []
            
            for project in projects:
                project_id = project.get('id', len(results) + 1)
                params = project.get('params', {})
                use_advanced = project.get('advanced', True)
                
                try:
                    if use_advanced:
                        result = self.advanced_estimator.estimate_cost_advanced(params)
                    else:
                        result = self.basic_estimator.estimate_cost(params)
                    
                    results.append({
                        'project_id': project_id,
                        'success': True,
                        'result': result,
                        'params': params
                    })
                    
                except Exception as e:
                    results.append({
                        'project_id': project_id,
                        'success': False,
                        'error': str(e),
                        'params': params
                    })
            
            # 保存结果
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False, default=str)
            
            print(f"批处理完成: {len(results)} 个项目，结果保存到 {output_file}")
            
            # 显示摘要
            successful = sum(1 for r in results if r['success'])
            failed = len(results) - successful
            print(f"成功: {successful}, 失败: {failed}")
            
        except Exception as e:
            print(f"批处理失败: {e}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='ProjectCost AI - 项目成本估算工具')
    parser.add_argument('--batch', '-b', help='批处理模式：输入JSON文件')
    parser.add_argument('--output', '-o', help='批处理模式：输出JSON文件')
    parser.add_argument('--config', '-c', help='配置文件路径')
    parser.add_argument('--version', '-v', action='version', version='ProjectCost AI 1.0.0')
    
    args = parser.parse_args()
    
    cli = ProjectCostCLI()
    
    # 加载配置文件
    if args.config and os.path.exists(args.config):
        cli.advanced_estimator.load_config(args.config)
        print(f"已加载配置文件: {args.config}")
    
    # 运行模式
    if args.batch:
        if not args.output:
            print("批处理模式需要指定输出文件 (--output)")
            sys.exit(1)
        cli.run_batch_mode(args.batch, args.output)
    else:
        cli.run_interactive_mode()


if __name__ == "__main__":
    main()