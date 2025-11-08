import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Button, Card, Badge } from '../../components/UI';

const DataAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock data for analytics
  const overviewMetrics = [
    {
      title: '项目总数',
      value: 24,
      change: 8,
      changeType: 'increase',
      icon: Target,
      color: 'blue',
      description: '比上月增长 8%',
    },
    {
      title: '总工时',
      value: '1,892',
      change: 12,
      changeType: 'increase',
      icon: Clock,
      color: 'green',
      description: '比上月增长 12%',
    },
    {
      title: '项目成本',
      value: '¥286.5万',
      change: -3,
      changeType: 'decrease',
      icon: DollarSign,
      color: 'orange',
      description: '比上月减少 3%',
    },
    {
      title: '团队效率',
      value: '87%',
      change: 5,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'purple',
      description: '比上月提升 5%',
    },
  ];

  const projectPerformance = [
    {
      name: '某银行1104报送项目',
      progress: 75,
      budget: 450000,
      spent: 337500,
      status: 'on-track',
      team: 8,
      efficiency: 92,
    },
    {
      name: '建设银行EAST系统',
      progress: 60,
      budget: 680000,
      spent: 408000,
      status: 'on-track',
      team: 12,
      efficiency: 88,
    },
    {
      name: '招商银行监管报送',
      progress: 45,
      budget: 320000,
      spent: 352000,
      status: 'over-budget',
      team: 6,
      efficiency: 78,
    },
    {
      name: '浦发银行数据报送',
      progress: 90,
      budget: 280000,
      spent: 252000,
      status: 'on-track',
      team: 4,
      efficiency: 95,
    },
  ];

  const teamAnalytics = [
    {
      department: '金融科技部',
      projects: 8,
      members: 12,
      avgEfficiency: 89,
      totalHours: 892,
      completedTasks: 156,
    },
    {
      department: '数据工程部',
      projects: 6,
      members: 8,
      avgEfficiency: 85,
      totalHours: 624,
      completedTasks: 98,
    },
    {
      department: '移动开发部',
      projects: 4,
      members: 6,
      avgEfficiency: 91,
      totalHours: 376,
      completedTasks: 72,
    },
    {
      department: '质量保证部',
      projects: 6,
      members: 4,
      avgEfficiency: 93,
      totalHours: 284,
      completedTasks: 124,
    },
  ];

  const monthlyTrend = [
    { month: '1月', projects: 3, hours: 280, cost: 42 },
    { month: '2月', projects: 4, hours: 320, cost: 48 },
    { month: '3月', projects: 5, hours: 410, cost: 61.5 },
    { month: '4月', projects: 6, hours: 485, cost: 72.8 },
    { month: '5月', projects: 8, hours: 592, cost: 89 },
    { month: '6月', projects: 7, hours: 650, cost: 97.5 },
  ];

  const statusConfig = {
    'on-track': { label: '正常', color: 'success' },
    'at-risk': { label: '风险', color: 'warning' },
    'over-budget': { label: '超预算', color: 'error' },
    'delayed': { label: '延期', color: 'error' },
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card variant="default" size="lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">{Math.abs(metric.change)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</h3>
              <p className="text-sm text-neutral-600 mb-2">{metric.title}</p>
              <p className="text-xs text-neutral-500">{metric.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Chart */}
        <Card variant="default" size="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">月度趋势</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('导出图表功能暂未实现')}
            />
          </div>

          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">月度趋势图表</p>
              <p className="text-neutral-400 text-sm mt-1">显示项目数量、工时和成本趋势</p>
            </div>
          </div>
        </Card>

        {/* Project Status Distribution */}
        <Card variant="default" size="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">项目状态分布</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('导出图表功能暂未实现')}
            />
          </div>

          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">项目状态饼图</p>
              <p className="text-neutral-400 text-sm mt-1">显示各状态项目的数量分布</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-8">
      {/* Project Performance Table */}
      <Card variant="default" size="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">项目绩效分析</h3>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input text-sm py-2 px-3"
            >
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="quarter">最近一季</option>
              <option value="year">最近一年</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('导出报表功能暂未实现')}
            >
              导出报表
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">项目名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">进度</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">预算/实际</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">团队</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">效率</th>
              </tr>
            </thead>
            <tbody>
              {projectPerformance.map((project, index) => (
                <motion.tr
                  key={project.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{project.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-24">
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              project.progress >= 80 ? 'bg-green-500' :
                              project.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-neutral-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-neutral-900">
                        ¥{(project.budget / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-neutral-600">
                        ¥{(project.spent / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      color={statusConfig[project.status].color}
                      size="sm"
                    >
                      {statusConfig[project.status].label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900">{project.team}人</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-neutral-400" />
                      <span className={`text-sm font-medium ${
                        project.efficiency >= 90 ? 'text-green-600' :
                        project.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {project.efficiency}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-8">
      {/* Team Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamAnalytics.map((team, index) => (
          <motion.div
            key={team.department}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card variant="default" size="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">{team.department}</h3>
                <Badge color="info" size="sm">{team.projects}个项目</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{team.members}</p>
                  <p className="text-xs text-neutral-600">团队成员</p>
                </div>

                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{team.avgEfficiency}%</p>
                  <p className="text-xs text-neutral-600">平均效率</p>
                </div>

                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{team.totalHours}</p>
                  <p className="text-xs text-neutral-600">总工时</p>
                </div>

                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{team.completedTasks}</p>
                  <p className="text-xs text-neutral-600">完成任务</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Team Performance Comparison */}
      <Card variant="default" size="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">团队绩效对比</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('导出对比图表功能暂未实现')}
          />
        </div>

        <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">团队绩效对比图表</p>
            <p className="text-neutral-400 text-sm mt-1">显示各部门的效率、工时和任务完成情况</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container-desktop py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">
            数据分析
          </h1>
          <p className="text-body-base text-neutral-600 mt-1">
            项目绩效和团队效率分析
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => alert('自定义时间范围功能暂未实现')}
          >
            自定义时间
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('导出分析报告功能暂未实现')}
          >
            导出报告
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: '总览', icon: BarChart3 },
            { id: 'projects', label: '项目分析', icon: Target },
            { id: 'team', label: '团队分析', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${
                selectedMetric === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedMetric === 'overview' && renderOverviewTab()}
        {selectedMetric === 'projects' && renderProjectsTab()}
        {selectedMetric === 'team' && renderTeamTab()}
      </motion.div>
    </div>
  );
};

export default DataAnalytics;