import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  Upload,
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/UI';

const Timesheet = () => {
  const [timesheets, setTimesheets] = useState([
    {
      id: 1,
      date: '2025-01-12',
      project: '某银行1104报送项目',
      task: '需求分析',
      hours: 8,
      status: 'approved',
      description: '完成客户需求文档编写和评审',
      overtime: 0,
    },
    {
      id: 2,
      date: '2025-01-11',
      project: '建设银行EAST系统',
      task: '系统设计',
      hours: 7.5,
      status: 'pending',
      description: '系统架构设计和数据库设计',
      overtime: 0,
    },
    {
      id: 3,
      date: '2025-01-10',
      project: '招商银行监管报送',
      task: '开发',
      hours: 9,
      status: 'rejected',
      description: '报表模块开发',
      overtime: 1,
      rejectReason: '工时描述不够详细',
    },
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    project: 'all',
    dateRange: 'week',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: '',
    description: '',
    overtime: 0,
  });

  const projects = [
    '某银行1104报送项目',
    '建设银行EAST系统',
    '招商银行监管报送',
    '浦发银行数据报送',
  ];

  const tasks = [
    '需求分析',
    '系统设计',
    '开发',
    '测试',
    '部署',
    '项目管理',
    '会议',
    '培训',
  ];

  const statusConfig = {
    approved: { label: '已批准', color: 'success', icon: CheckCircle },
    pending: { label: '待审核', color: 'warning', icon: AlertCircle },
    rejected: { label: '已拒绝', color: 'error', icon: XCircle },
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTimesheet) {
      // Update existing timesheet
      setTimesheets(prev =>
        prev.map(sheet =>
          sheet.id === editingTimesheet.id
            ? { ...sheet, ...formData, status: 'pending' }
            : sheet
        )
      );
      setEditingTimesheet(null);
    } else {
      // Add new timesheet
      const newTimesheet = {
        id: Date.now(),
        ...formData,
        status: 'pending',
      };
      setTimesheets(prev => [newTimesheet, ...prev]);
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      project: '',
      task: '',
      hours: '',
      description: '',
      overtime: 0,
    });
    setShowAddForm(false);
  };

  const handleEdit = (timesheet) => {
    setEditingTimesheet(timesheet);
    setFormData({
      date: timesheet.date,
      project: timesheet.project,
      task: timesheet.task,
      hours: timesheet.hours,
      description: timesheet.description,
      overtime: timesheet.overtime,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定要删除这条工时记录吗？')) {
      setTimesheets(prev => prev.filter(sheet => sheet.id !== id));
    }
  };

  const filteredTimesheets = timesheets.filter(sheet => {
    const matchesSearch =
      sheet.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filter.status === 'all' || sheet.status === filter.status;
    const matchesProject = filter.project === 'all' || sheet.project === filter.project;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const totalHours = filteredTimesheets.reduce((sum, sheet) => sum + parseFloat(sheet.hours), 0);
  const totalOvertime = filteredTimesheets.reduce((sum, sheet) => sum + parseFloat(sheet.overtime), 0);

  return (
    <div className="container-desktop py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">
            工时填报
          </h1>
          <p className="text-body-base text-neutral-600 mt-1">
            记录和管理您的工时
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => alert('导入功能暂未实现')}
          >
            导入
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('导出功能暂未实现')}
          >
            导出
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddForm(true)}
          >
            添加工时
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="default" size="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">本周工时</p>
              <p className="text-2xl font-bold text-neutral-900">{totalHours}h</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">加班工时</p>
              <p className="text-2xl font-bold text-neutral-900">{totalOvertime}h</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">待审核</p>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredTimesheets.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">已批准</p>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredTimesheets.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="default" size="lg" className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700">筛选:</span>
          </div>

          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input text-sm py-2 px-3"
          >
            <option value="all">所有状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
          </select>

          <select
            value={filter.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="input text-sm py-2 px-3"
          >
            <option value="all">所有项目</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="搜索项目、任务或描述..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card variant="default" size="lg" className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              {editingTimesheet ? '编辑工时' : '添加工时'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setEditingTimesheet(null);
              }}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                日期
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                项目
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                className="input"
                required
              >
                <option value="">选择项目</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                任务类型
              </label>
              <select
                value={formData.task}
                onChange={(e) => setFormData(prev => ({ ...prev, task: e.target.value }))}
                className="input"
                required
              >
                <option value="">选择任务</option>
                {tasks.map(task => (
                  <option key={task} value={task}>{task}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                工时
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="8"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                加班工时
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                value={formData.overtime}
                onChange={(e) => setFormData(prev => ({ ...prev, overtime: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                工作描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="input"
                placeholder="描述您的工作内容..."
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTimesheet(null);
                }}
              >
                取消
              </Button>
              <Button variant="primary" type="submit">
                {editingTimesheet ? '更新' : '添加'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Timesheets List */}
      <Card variant="default" size="lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">项目</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">任务</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">工时</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">加班</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.map((timesheet, index) => (
                <motion.tr
                  key={timesheet.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900">{timesheet.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-48">
                      <p className="text-sm text-neutral-900 truncate" title={timesheet.project}>
                        {timesheet.project}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-neutral-600">{timesheet.task}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-neutral-900">{timesheet.hours}h</span>
                  </td>
                  <td className="py-3 px-4">
                    {timesheet.overtime > 0 ? (
                      <span className="text-sm font-medium text-orange-600">+{timesheet.overtime}h</span>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      color={statusConfig[timesheet.status].color}
                      size="sm"
                      icon={statusConfig[timesheet.status].icon}
                    >
                      {statusConfig[timesheet.status].label}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(timesheet)}
                        disabled={timesheet.status === 'approved'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(timesheet.id)}
                        disabled={timesheet.status === 'approved'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredTimesheets.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">暂无工时记录</p>
              <p className="text-neutral-400 text-sm mt-1">点击上方"添加工时"按钮开始记录</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Timesheet;