import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
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
    if (!email) {
      setLocalError('请输入邮箱地址');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('请输入有效的邮箱地址');
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setLocalError('发送重置邮件失败，请稍后重试');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              邮件已发送
            </h1>

            <p className="text-neutral-600 mb-6">
              我们已向 <span className="font-medium text-neutral-800">{email}</span> 发送了密码重置邮件。
              请检查您的邮箱（包括垃圾邮件文件夹）并点击邮件中的链接重置密码。
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleBackToLogin}
                className="w-full"
              >
                返回登录
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                  setLocalError('');
                }}
                className="w-full"
              >
                重新发送邮件
              </Button>
            </div>

            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">
                <strong>没有收到邮件？</strong>
              </p>
              <ul className="text-xs text-neutral-500 mt-2 space-y-1">
                <li>• 检查垃圾邮件文件夹</li>
                <li>• 确认邮箱地址是否正确</li>
                <li>• 等待几分钟后重试</li>
                <li>• 联系技术支持</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleBackToLogin}
            className="text-white hover:bg-white/10"
          >
            返回登录
          </Button>
        </motion.div>

        {/* Forgot Password Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              忘记密码
            </h1>
            <p className="text-neutral-600">
              请输入您的邮箱地址，我们将向您发送密码重置链接
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Input
                label="邮箱地址"
                type="email"
                name="email"
                placeholder="请输入您注册时使用的邮箱"
                value={email}
                onChange={handleChange}
                required
                error={localError || error}
                prefix={<Mail className="w-4 h-4 text-neutral-400" />}
              />
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
              {loading ? '发送中...' : '发送重置邮件'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              记起密码了？
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 ml-1"
              >
                立即登录
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-white/80 text-sm mb-2">
              需要帮助？
            </p>
            <p className="text-white/60 text-xs">
              请联系技术支持：support@example.com 或拨打 400-123-4567
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;