import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 验证手机号格式（中国手机号）
  const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 前端验证
    if (!phone.trim()) {
      setError('请输入手机号码');
      return;
    }
    if (!isValidPhone(phone.trim())) {
      setError('请输入有效的手机号（以1开头，11位数字）');
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
      if (!name.trim()) {
        setError('请输入用户名');
        return;
      }
      if (name.trim().length < 2 || name.trim().length > 20) {
        setError('用户名长度必须在2-20位之间');
        return;
      }
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
      const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
      const body = isRegisterMode
        ? {
          phone: phone.trim(),
          password,
          confirmPassword,
          name: name.trim()
        }
        : {
          phone: phone.trim(),
          password
        };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.code === 200) {
        // 登录/注册成功
        if (result.data?.accessToken) {
          localStorage.setItem('accessToken', result.data.accessToken);
          localStorage.setItem('refreshToken', result.data.refreshToken || '');
          localStorage.setItem('userId', result.data.userId?.toString() || '');
          if (result.data.user) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
          }
        }
        onLogin();
      } else {
        // 登录/注册失败 - 显示后端返回的具体错误信息
        setError(result.message || (isRegisterMode ? '注册失败，请重试' : '登录失败，请检查手机号和密码'));
      }
    } catch (err) {
      console.error('Login/Register error:', err);
      setError('网络连接失败，请检查后端服务是否运行');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-background-light font-display h-screen flex items-center justify-center p-4 relative overflow-hidden text-gray-800">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]"></div>
      </div>
      <main className="w-full max-w-[960px] min-h-[650px] bg-white rounded-2xl shadow-2xl flex overflow-hidden z-10 relative ring-1 ring-black/5">
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

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* 注册时显示用户名输入 */}
              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">用户名</label>
                  <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                    <input
                      className="block w-full border-0 bg-transparent py-2.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
                      name="name"
                      placeholder="输入用户名（2-20位）"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">手机号码</label>
                <div className="relative flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                  <div className="flex items-center gap-1 pl-3 pr-2 border-r border-gray-200 bg-gray-50 rounded-l-lg">
                    <span className="text-sm font-medium text-gray-600">+86</span>
                    <span className="material-symbols-outlined text-base text-gray-400">expand_more</span>
                  </div>
                  <input
                    className="block w-full border-0 bg-transparent py-2.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    name="phone"
                    placeholder="输入11位手机号"
                    type="tel"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">密码</label>
                  {!isRegisterMode && (
                    <a className="text-xs font-medium text-primary hover:text-blue-700 transition-colors" href="#">验证码登录</a>
                  )}
                </div>
                <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary transition-shadow">
                  <input
                    className="block w-full border-0 bg-transparent py-2.5 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
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
                    <input
                      className="block w-full border-0 bg-transparent py-2.5 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-lg"
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
            <div className="relative mt-6">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-400">其他方式登录</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-gray-500 text-xl">mail</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-gray-500 text-xl">fingerprint</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;