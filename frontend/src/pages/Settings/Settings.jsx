import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  HelpCircle,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building,
  Calendar,
} from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, updateTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '+86 138 0013 8000',
    company: user?.company || '',
    role: user?.role || 'user',
    department: '金融科技部',
    joinDate: '2023-03-15',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    deadlineReminders: true,
    weeklyReports: false,
    systemAlerts: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'CNY',
    autoSave: true,
  });

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'appearance', label: '外观设置', icon: Palette },
    { id: 'system', label: '系统设置', icon: Database },
    { id: 'data', label: '数据管理', icon: Download },
    { id: 'help', label: '帮助支持', icon: HelpCircle },
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('个人资料已保存');
    } catch (error) {
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('密码已修改');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert('密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    alert('数据导出功能暂未实现');
  };

  const handleImportData = () => {
    alert('数据导入功能暂未实现');
  };

  const handleBackupData = () => {
    alert('数据备份功能暂未实现');
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">基本信息</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              姓名
            </label>
            <Input
              type="text"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              邮箱
            </label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              电话
            </label>
            <Input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
              prefix={<Phone className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              公司
            </label>
            <Input
              type="text"
              value={profileForm.company}
              onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
              prefix={<Building className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              部门
            </label>
            <select
              value={profileForm.department}
              onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
              className="input"
            >
              <option value="金融科技部">金融科技部</option>
              <option value="数据工程部">数据工程部</option>
              <option value="移动开发部">移动开发部</option>
              <option value="质量保证部">质量保证部</option>
              <option value="产品管理部">产品管理部</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              入职日期
            </label>
            <Input
              type="date"
              value={profileForm.joinDate}
              onChange={(e) => setProfileForm(prev => ({ ...prev, joinDate: e.target.value }))}
              prefix={<Calendar className="w-4 h-4 text-neutral-400" />}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSaveProfile}
            loading={loading}
          >
            保存更改
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Password Change */}
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">修改密码</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              当前密码
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              新密码
            </label>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              确认新密码
            </label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            icon={<Shield className="w-4 h-4" />}
            onClick={handleChangePassword}
            loading={loading}
          >
            修改密码
          </Button>
        </div>
      </Card>

      {/* Security Info */}
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">安全信息</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <p className="text-sm font-medium text-neutral-900">双因素认证</p>
              <p className="text-xs text-neutral-500">增强账户安全性</p>
            </div>
            <Badge color="error" size="sm">未启用</Badge>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <p className="text-sm font-medium text-neutral-900">最后登录时间</p>
              <p className="text-xs text-neutral-500">从 IP 192.168.1.100</p>
            </div>
            <span className="text-sm text-neutral-600">2025-01-12 14:30</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-neutral-900">登录设备</p>
              <p className="text-xs text-neutral-500">Chrome on macOS</p>
            </div>
            <Button variant="ghost" size="sm">管理</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">通知设置</h3>

        <div className="space-y-6">
          {Object.entries({
            emailNotifications: { label: '邮件通知', description: '接收重要更新的邮件通知' },
            pushNotifications: { label: '推送通知', description: '在浏览器中接收实时通知' },
            projectUpdates: { label: '项目更新', description: '项目状态变更时通知' },
            deadlineReminders: { label: '截止日期提醒', description: '任务截止前提醒' },
            weeklyReports: { label: '周报', description: '每周接收项目进展报告' },
            systemAlerts: { label: '系统警报', description: '系统维护和更新通知' },
          }).map(([key, config]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">{config.label}</p>
                <p className="text-xs text-neutral-500">{config.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => alert('通知设置已保存')}
          >
            保存设置
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-8">
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">外观设置</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-4">
              主题模式
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { mode: 'light', label: '浅色', description: '默认浅色主题' },
                { mode: 'dark', label: '深色', description: '深色护眼主题' },
                { mode: 'auto', label: '自动', description: '跟随系统设置' },
              ].map((theme) => (
                <button
                  key={theme.mode}
                  onClick={() => updateTheme({ mode: theme.mode })}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    theme.mode === theme.mode
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-medium text-neutral-900">{theme.label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-8">
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">系统偏好设置</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              语言
            </label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
              className="input"
            >
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              时区
            </label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="input"
            >
              <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
              <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
              <option value="America/New_York">纽约时间 (UTC-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              日期格式
            </label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="input"
            >
              <option value="YYYY-MM-DD">2025-01-12</option>
              <option value="DD/MM/YYYY">12/01/2025</option>
              <option value="MM/DD/YYYY">01/12/2025</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              时间格式
            </label>
            <select
              value={systemSettings.timeFormat}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="input"
            >
              <option value="24h">24小时制</option>
              <option value="12h">12小时制</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => alert('系统设置已保存')}
          >
            保存设置
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-8">
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">数据管理</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
              className="justify-start"
            >
              导出个人数据
            </Button>

            <Button
              variant="secondary"
              icon={<Upload className="w-4 h-4" />}
              onClick={handleImportData}
              className="justify-start"
            >
              导入数据
            </Button>

            <Button
              variant="secondary"
              icon={<Database className="w-4 h-4" />}
              onClick={handleBackupData}
              className="justify-start"
            >
              备份数据
            </Button>

            <Button
              variant="secondary"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => alert('数据同步功能暂未实现')}
              className="justify-start"
            >
              同步数据
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">数据备份提醒</p>
                <p className="text-xs text-yellow-700 mt-1">
                  建议定期备份您的数据，以防意外丢失。系统会自动创建每日备份。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-8">
      <Card variant="default" size="lg">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">帮助与支持</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-neutral-50 rounded-lg">
              <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">帮助中心</h4>
              <p className="text-sm text-neutral-600 mb-4">查找常见问题和使用指南</p>
              <Button variant="primary" size="sm">访问帮助</Button>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-lg">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">联系支持</h4>
              <p className="text-sm text-neutral-600 mb-4">获得技术支持和问题解答</p>
              <Button variant="primary" size="sm">发送邮件</Button>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <h4 className="text-md font-semibold text-neutral-900 mb-4">快速链接</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                用户手册
              </a>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                视频教程
              </a>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                API 文档
              </a>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                系统状态
              </a>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <h4 className="text-md font-semibold text-neutral-900 mb-4">系统信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">版本：</span>
                <span className="text-neutral-900">v1.0.0</span>
              </div>
              <div>
                <span className="text-neutral-500">更新时间：</span>
                <span className="text-neutral-900">2025-01-12</span>
              </div>
              <div>
                <span className="text-neutral-500">许可证：</span>
                <span className="text-neutral-900">企业版</span>
              </div>
              <div>
                <span className="text-neutral-500">用户ID：</span>
                <span className="text-neutral-900">{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container-desktop py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-bold text-neutral-900">
          系统设置
        </h1>
        <p className="text-body-base text-neutral-600 mt-1">
          管理您的账户和系统偏好
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'appearance' && renderAppearanceTab()}
            {activeTab === 'system' && renderSystemTab()}
            {activeTab === 'data' && renderDataTab()}
            {activeTab === 'help' && renderHelpTab()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;