import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Calendar,
  Target,
  Activity,
} from 'lucide-react';
import { Button, Card, Badge } from '../../components/UI';
import MetricCard from '../../components/Business/MetricCard';
import ProjectCard from '../../components/Business/ProjectCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '某银行1104报送项目',
      client_name: '工商银行',
      project_type: 'regulatory_reporting',
      status: 'in_progress',
      progress: 65,
      duration: 120,
      estimated_hours: 1850,
      priority: 'high',
      risk_level: 'medium',
      team: [
        { name: '张三', avatar: null },
        { name: '李四', avatar: null },
        { name: '王五', avatar: null },
        { name: '赵六', avatar: null },
      ],
    },
    {
      id: 2,
      name: '建设银行EAST系统',
      client_name: '建设银行',
      project_type: 'regulatory_reporting',
      status: 'in_progress',
      progress: 45,
      duration: 90,
      estimated_hours: 1620,
      priority: 'medium',
      risk_level: 'low',
      team: [
        { name: '陈七', avatar: null },
        { name: '周八', avatar: null },
      ],
    },
    {
      id: 3,
      name: '招商银行监管报送',
      client_name: '招商银行',
      project_type: 'regulatory_reporting',
      status: 'planning',
      progress: 0,
      duration: 60,
      estimated_hours: 1200,
      priority: 'medium',
      risk_level: 'low',
      team: [
        { name: '吴九', avatar: null },
        { name: '郑十', avatar: null },
      ],
    },
    {
      id: 4,
      name: '浦发银行数据报送',
      client_name: '浦发银行',
      project_type: 'regulatory_reporting',
      status: 'completed',
      progress: 100,
      duration: 45,
      estimated_hours: 980,
      priority: 'low',
      risk_level: 'low',
      team: [
        { name: '王十一', avatar: null },
      ],
    },
  ]);

  const metrics = [
    {
      title: '总项目数',
      value: 12,
      unit: '个',
      color: 'primary',
      trend: 'up',
      trendValue: 8,
      icon: FileText,
      description: '本月新增 2 个项目',
    },
    {
      title: '活跃项目',
      value: 8,
      unit: '个',
      color: 'success',
      trend: 'up',
      trendValue: 12,
      icon: Target,
      description: '正在进行的项目',
    },
    {
      title: '团队成员',
      value: 24,
      unit: '人',
      color: 'warning',
      trend: 'neutral',
      trendValue: 0,
      icon: Users,
      description: '参与项目的成员',
    },
    {
      title: '风险项目',
      value: 2,
      unit: '个',
      color: 'error',
      trend: 'down',
      trendValue: 5,
      icon: AlertTriangle,
      description: '需要关注的项目',
    },
  ];

  const handleProjectClick = (project) => {
    console.log('Project clicked:', project);
    // Navigate to project detail
  };

  const handleProjectMenuClick = (project) => {
    console.log('Project menu clicked:', project);
    // Show project menu
  };

  return (
    <div className="container-desktop py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">
            仪表板
          </h1>
          <p className="text-body-base text-neutral-600 mt-1">
            项目概览和关键指标
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => console.log('Create new project')}
        >
          创建项目
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h5 font-bold text-neutral-900">
              最近项目
            </h2>
            <Button
              variant="text"
              onClick={() => console.log('View all projects')}
            >
              查看全部
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  onMenuClick={() => handleProjectMenuClick(project)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity & Tasks */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card variant="default" size="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h5 font-bold text-neutral-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                最近活动
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  user: '张三',
                  action: '提交了工时记录',
                  project: '某银行1104报送项目',
                  time: '2小时前',
                  type: 'timesheet',
                },
                {
                  user: '李四',
                  action: '完成了需求分析',
                  project: '建设银行EAST系统',
                  time: '4小时前',
                  type: 'task',
                },
                {
                  user: '王五',
                  action: '创建了新项目',
                  project: '招商银行监管报送',
                  time: '1天前',
                  type: 'project',
                },
                {
                  user: '系统',
                  action: '生成了项目评估报告',
                  project: '浦发银行数据报送',
                  time: '2天前',
                  type: 'report',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-neutral-600">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-800">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-600">
                        {activity.project}
                      </span>
                      <span className="text-xs text-neutral-400">
                        • {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card variant="default" size="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h5 font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                待办任务
              </h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  task: '审核某银行1104项目进度报告',
                  priority: 'high',
                  due: '今天',
                  project: '某银行1104报送项目',
                },
                {
                  task: '完成建设银行EAST系统需求文档',
                  priority: 'medium',
                  due: '明天',
                  project: '建设银行EAST系统',
                },
                {
                  task: '准备招商银行项目启动会议',
                  priority: 'medium',
                  due: '3天后',
                  project: '招商银行监管报送',
                },
              ].map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-800 font-medium">
                      {task.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        color={task.priority === 'high' ? 'error' : 'warning'}
                        size="sm"
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-neutral-500">
                        {task.due}
                      </span>
                      <span className="text-xs text-neutral-400">
                        • {task.project}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;