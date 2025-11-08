import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../../components/UI';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <h1 className="text-8xl font-bold text-neutral-200 mb-2">404</h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-4xl font-bold text-neutral-400">404</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              页面未找到
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              抱歉，您访问的页面不存在或已被移动。
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              variant="primary"
              icon={<Home className="w-4 h-4" />}
              onClick={handleGoHome}
              size="lg"
            >
              返回首页
            </Button>

            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleGoBack}
              size="lg"
            >
              返回上页
            </Button>

            <Button
              variant="ghost"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRefresh}
              size="lg"
            >
              刷新页面
            </Button>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              您可能在寻找
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: '仪表板', path: '/dashboard' },
                { name: '项目列表', path: '/projects' },
                { name: '创建项目', path: '/projects/new' },
                { name: '工时管理', path: '/timesheet' },
                { name: '数据分析', path: '/analytics' },
                { name: '系统设置', path: '/settings' },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="text-left p-3 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700 hover:text-primary-600"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-sm text-neutral-500">
              如果问题持续存在，请联系技术支持：
            </p>
            <div className="flex justify-center items-center gap-4 mt-2">
              <a
                href="mailto:support@example.com"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                support@example.com
              </a>
              <span className="text-neutral-300">|</span>
              <a
                href="tel:400-123-4567"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                400-123-4567
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;