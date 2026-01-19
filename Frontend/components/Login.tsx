import React, { useState } from 'react';
import { login, register } from '../services/auth';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 清空所有表单
  const clearForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    clearForm();
    setIsRegisterMode(!isRegisterMode);
  };

  // 跳转到注册（带提示）
  const goToRegister = () => {
    clearForm();
    setIsRegisterMode(true);
  };

  // 跳转到登录（注册成功后）
  const goToLogin = (message?: string) => {
    clearForm();
    setIsRegisterMode(false);
    if (message) {
      setSuccessMessage(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // 前端验证
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (username.trim().length < 2 || username.trim().length > 20) {
      setError('用户名长度必须在2-20位之间');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    if (password.length < 6 || password.length > 32) {
      setError('密码长度必须在6-32位之间');
      return;
    }
    if (isRegisterMode) {
      if (!confirmPassword.trim()) {
        setError('请确认密码');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // 注册
        await register(username.trim(), password);
        // 注册成功 - 跳转到登录界面
        goToLogin('🎉 注册成功！请使用您的用户名登录');
      } else {
        // 登录
        const result = await login(username.trim(), password);
        // 登录成功 - 进入主界面
        if (result.user) {
          localStorage.setItem('userId', result.user.id);
        }
        onLogin();
      }
    } catch (err: any) {
      console.error('Login/Register error:', err);
      const errorMessage = err.message || (isRegisterMode ? '注册失败，请重试' : '登录失败');

      // 如果是"该用户名尚未注册"，提供引导
      if (!isRegisterMode && errorMessage.includes('尚未注册')) {
        setError('该用户名尚未注册');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 检查是否显示"去注册"引导按钮
  const showRegisterGuide = !isRegisterMode && error.includes('尚未注册');

  return (
    <div className="bg-background-light font-display h-screen flex items-center justify-center p-4 relative overflow-hidden text-gray-800">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]"></div>
      </div>
      <main className="w-full max-w-[960px] min-h-[600px] bg-white rounded-2xl shadow-2xl flex overflow-hidden z-10 relative ring-1 ring-black/5">
        <div className="hidden md:flex w-5/12 bg-surface-dark relative flex-col justify-between p-10 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl text-white">chat_bubble</span>
            </div>
            <span className="text-xl font-bold tracking-tight">TeleChat</span>
          </div>
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-[240px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="relative bg-surface-dark/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="material-symbols-outlined text-[64px] text-primary">lock_person</span>
              </div>
              <div className="absolute -right-4 top-1/2 bg-surface-dark border border-white/10 p-3 rounded-xl shadow-xl transform rotate-12 animate-bounce" style={{ animationDuration: "3s" }}>
                <span className="material-symbols-outlined text-[32px] text-blue-300">verified_user</span>
              </div>
              <div className="absolute -left-2 top-1/3 bg-surface-dark border border-white/10 p-3 rounded-xl shadow-xl transform -rotate-12 animate-bounce" style={{ animationDuration: "4s" }}>
                <span className="material-symbols-outlined text-[32px] text-indigo-300">encrypted</span>
              </div>
            </div>
            <div className="mt-8 text-center space-y-2">
              <h2 className="text-2xl font-bold">安全连接，自由畅聊</h2>
              <p className="text-gray-400 text-sm leading-relaxed">无缝跨平台同步，端到端加密。<br />打造最安全高效的沟通体验。</p>
            </div>
          </div>
          <div className="relative z-10 text-xs text-gray-500 text-center">
            © 2024 TeleChat Inc. 保留所有权利。
          </div>
        </div>
        <div className="w-full md:w-7/12 bg-white relative p-8 sm:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="absolute top-0 right-0 cursor-pointer group" title="Scan to Login">
            <div className="w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent absolute top-0 right-0 transition-all group-hover:from-primary/20 rounded-bl-3xl"></div>
            <div className="absolute top-3 right-3 text-primary transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
            </div>
          </div>
          <div className="max-w-[380px] w-full mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isRegisterMode ? '创建账号' : '欢迎回来'}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {isRegisterMode ? '注册一个新的 TeleChat 账号' : '请登录您的 TeleChat 账号'}
              </p>
            </div>

            {/* 成功提示 */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600 text-sm">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {successMessage}
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
                {/* 未注册时显示引导按钮 */}
                {showRegisterGuide && (
                  <button
                    type="button"
                    className="mt-2 w-full py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    onClick={goToRegister}
                  >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    立即注册
                  </button>
                )}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">用户名</label>
                <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-xl">person</span>
                  </div>
                  <input
                    className="block w-full border-0 bg-transparent py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
                    name="username"
                    placeholder="输入用户名（2-20位）"
                    type="text"
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">密码</label>
                </div>
                <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                  </div>
                  <input
                    className="block w-full border-0 bg-transparent py-2.5 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
                    name="password"
                    placeholder="输入密码（6-32位）"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 注册时显示确认密码 */}
              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">确认密码</label>
                  <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                    </div>
                    <input
                      className="block w-full border-0 bg-transparent py-2.5 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
                      name="confirmPassword"
                      placeholder="再次输入密码"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-blue-600 hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  )}
                  {isRegisterMode ? '注册' : '登录'}
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 mt-4 text-sm">
                <span className="text-gray-500">
                  {isRegisterMode ? '已有账号？' : '还没有账号？'}
                </span>
                <button
                  type="button"
                  className="font-bold text-primary hover:text-blue-700 hover:underline transition-colors"
                  onClick={toggleMode}
                >
                  {isRegisterMode ? '立即登录' : '立即注册'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;