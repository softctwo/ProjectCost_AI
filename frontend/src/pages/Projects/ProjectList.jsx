import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Grid, List, Search, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/UI';
import ProjectCard from '../../components/Business/ProjectCard';

const ProjectList = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '工商银行1104报送项目',
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
    {
      id: 5,
      name: '宁波银行报表系统',
      client_name: '宁波银行',
      project_type: 'regulatory_reporting',
      status: 'completed',
      progress: 100,
      duration: 30,
      estimated_hours: 780,
      priority: 'low',
      risk_level: 'low',
      team: [
        { name: '刘十二', avatar: null },
      ],
    },
    {
      id: 6,
      name: '民生银行数据治理',
      client_name: '民生银行',
      project_type: 'regulatory_reporting',
      status: 'risk',
      progress: 35,
      duration: 180,
      estimated_hours: 2200,
      priority: 'high',
      risk_level: 'high',
      team: [
        { name: '陈十三', avatar: null },
        { name: '周十四', avatar: null },
        { name: '吴十五', avatar: null },
        { name: '郑十六', avatar: null },
        { name: '王十七', avatar: null },
      ],
    },
  ]);

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    client: '',
    project_type: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.keys(filters).every(key =>
      !filters[key] || project[key] === filters[key]
    );

    return matchesSearch && matchesFilters;
  });

  const handleProjectClick = (project) => {
    console.log('Navigate to project:', project.id);
    // Navigate to project detail
  };

  const handleProjectMenuClick = (project) => {
    console.log('Show project menu:', project.id);
    // Show project menu
  };

  const handleCreateProject = () => {
    console.log('Create new project');
    // Navigate to create project wizard
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    risk: projects.filter(p => p.status === 'risk').length,
  };

  return (
    <div className="container-desktop py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">
            项目管理
          </h1>
          <p className="text-body-base text-neutral-600 mt-1">
            共 {projects.length} 个项目
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreateProject}
        >
          创建项目
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="default" size="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">总项目</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">进行中</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {stats.inProgress}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">已完成</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card variant="default" size="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">风险项目</p>
              <p className="text-2xl font-bold text-error-600 mt-1">
                {stats.risk}
              </p>
            </div>
            <div className="p-3 bg-error-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="搜索项目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>

          {/* Filters */}
          <Button
            variant="secondary"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            筛选
          </Button>

          {/* View Mode */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">排序:</span>
          <select className="input text-sm py-1 px-2">
            <option>最新创建</option>
            <option>最近更新</option>
            <option>进度最快</option>
            <option>名称</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 bg-white border border-neutral-200 rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="form-label">项目状态</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">全部</option>
                <option value="planning">规划中</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="risk">风险</option>
              </select>
            </div>

            <div>
              <label className="form-label">优先级</label>
              <select
                className="input"
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">全部</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div>
              <label className="form-label">客户类型</label>
              <select
                className="input"
                value={filters.client}
                onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
              >
                <option value="">全部</option>
                <option value="工商银行">工商银行</option>
                <option value="建设银行">建设银行</option>
                <option value="招商银行">招商银行</option>
                <option value="浦发银行">浦发银行</option>
                <option value="宁波银行">宁波银行</option>
                <option value="民生银行">民生银行</option>
              </select>
            </div>

            <div>
              <label className="form-label">项目类型</label>
              <select
                className="input"
                value={filters.project_type}
                onChange={(e) => setFilters(prev => ({ ...prev, project_type: e.target.value }))}
              >
                <option value="">全部</option>
                <option value="regulatory_reporting">监管报送</option>
                <option value="data_migration">数据迁移</option>
                <option value="system_integration">系统集成</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="text"
              onClick={() => setFilters({
                status: '',
                priority: '',
                client: '',
                project_type: '',
              })}
            >
              重置
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowFilters(false)}
            >
              应用筛选
            </Button>
          </div>
        </motion.div>
      )}

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-h5 font-bold text-neutral-900 mb-2">
            没有找到项目
          </h3>
          <p className="text-body-base text-neutral-600 mb-6">
            {searchTerm ? '尝试调整搜索条件' : '创建第一个项目开始使用'}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateProject}
            >
              创建项目
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }
        >
          {filteredProjects.map((project, index) => (
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
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;