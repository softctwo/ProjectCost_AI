import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, User, Mail, Building } from 'lucide-react';
import { Button, Input } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setLocalError('请填写所有必填字段');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('密码长度至少6位');
      return;
    }

    if (!formData.agreeToTerms) {
      setLocalError('请同意服务条款和隐私政策');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        company: formData.company,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
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
            创建账号
          </h1>
          <p className="text-white/80">
            加入项目成本智能评估系统
          </p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Input
                label="姓名"
                type="text"
                name="fullName"
                placeholder="请输入您的姓名"
                value={formData.fullName}
                onChange={handleChange}
                required
                error={localError || error}
                prefix={<User className="w-4 h-4 text-neutral-400" />}
              />
            </div>

            {/* Company */}
            <div>
              <Input
                label="公司"
                type="text"
                name="company"
                placeholder="请输入公司名称（可选）"
                value={formData.company}
                onChange={handleChange}
                prefix={<Building className="w-4 h-4 text-neutral-400" />}
              />
            </div>

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

            {/* Email */}
            <div>
              <Input
                label="邮箱"
                type="email"
                name="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={handleChange}
                required
                error={localError || error}
                prefix={<Mail className="w-4 h-4 text-neutral-400" />}
              />
            </div>

            {/* Password */}
            <div>
              <Input
                label="密码"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="请输入密码（至少6位）"
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

            {/* Confirm Password */}
            <div>
              <Input
                label="确认密码"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={localError || error}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-600">
                  我已阅读并同意
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 mx-1"
                    onClick={() => setLocalError('服务条款页面暂未实现')}
                  >
                    服务条款
                  </button>
                  和
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 mx-1"
                    onClick={() => setLocalError('隐私政策页面暂未实现')}
                  >
                    隐私政策
                  </button>
                </span>
              </label>
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
              {loading ? '注册中...' : '创建账号'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              已有账号？
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                立即登录
              </Link>
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

export default Register;