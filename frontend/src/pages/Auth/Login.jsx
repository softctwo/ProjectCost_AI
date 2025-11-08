import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear errors when user starts typing
    if (localError) {
      setLocalError('');
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setLocalError('请输入用户名和密码');
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">PC</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            项目成本智能评估系统
          </h1>
          <p className="text-white/80">
            登录开始使用
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <Input
                label="用户名"
                type="text"
                name="username"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleChange}
                required
                error={localError || error}
                prefix={<div className="w-4 h-4 bg-neutral-200 rounded" />}
              />
            </div>

            {/* Password */}
            <div>
              <Input
                label="密码"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleChange}
                required
                error={localError || error}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-600">
                  记住我
                </span>
              </label>
              <button
                type="button"
                onClick={() => setLocalError('忘记密码功能暂未实现')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                忘记密码?
              </button>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-50 border border-error-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-error-600" />
                  <span className="text-sm text-error-800">
                    {localError || error}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              还没有账号？
              <button
                onClick={() => setLocalError('注册功能暂未实现')}
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                立即注册
              </button>
            </p>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-white/80 text-sm">
            © 2025 项目成本智能评估系统. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;