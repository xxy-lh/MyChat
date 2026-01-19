import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import ContactsDiscovery from './components/ContactsDiscovery';
import SettingsProfile from './components/SettingsProfile';
import SharedMedia from './components/SharedMedia';
import SecurityPrivacy from './components/SecurityPrivacy';
import Login from './components/Login';
import { ViewState } from './types';
import { CONTACTS } from './constants';
import { getCurrentUser, User } from './services/user';
import { logout as logoutUser } from './services/auth';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('contacts');
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // 从 localStorage 加载主题偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }
  }, []);

  // 获取用户信息
  const fetchUserInfo = async () => {
    setIsLoadingUser(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Token失效，清除登录状态
      handleLogout();
    } finally {
      setIsLoadingUser(false);
    }
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    // 登录成功后获取用户信息
    fetchUserInfo();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('contacts');
  };

  const handleStartChat = (userId: string) => {
    setSelectedChatId(userId);
    setCurrentView('chat');
  };

  const CallsInterface = () => (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white relative overflow-hidden">
      <header className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10 flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">通话记录</h2>
        <button className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-all">
          <span className="material-symbols-outlined">add_call</span>
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {CONTACTS.slice(0, 3).map((contact, idx) => (
            <div key={contact.id} className="bg-surface-light dark:bg-[#1e2126] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${contact.avatar}")` }}></div>
                <div>
                  <h3 className="font-bold text-base">{contact.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className={`material-symbols-outlined text-[16px] ${idx === 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {idx === 0 ? 'call_missed' : 'call_made'}
                    </span>
                    <span>{idx === 0 ? '未接来电 • 今天, 10:23' : '呼出 • 昨天'}</span>
                  </div>
                </div>
              </div>
              <button className="size-10 rounded-full bg-slate-100 dark:bg-[#2c3b59] text-slate-900 dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined">call</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />;
      case 'contacts':
        return <ContactsDiscovery onStartChat={handleStartChat} />;
      case 'media':
        // Mapping discovery button to SharedMedia for demo purposes
        return <SharedMedia />;
      case 'settings':
        return <SettingsProfile currentUser={currentUser} onLogout={handleLogout} onUserUpdate={setCurrentUser} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
      case 'calls':
        return <CallsInterface />;
      case 'security':
        return <SecurityPrivacy />;
      default:
        return <ContactsDiscovery onStartChat={handleStartChat} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Global Navigation Sidebar */}
      <Navigation
        currentView={currentView}
        onChangeView={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default App;