import React from 'react';
import { ViewState } from '../types';
import { CURRENT_USER } from '../constants';
import ThemeToggle from './ThemeToggle';
import { User } from '../services/user';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: User | null;
  onLogout: () => void;
  pendingRequestCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, isDarkMode, onToggleTheme, currentUser, onLogout, pendingRequestCount = 0 }) => {
  const navItems: { id: ViewState; icon: string; label: string }[] = [
    { id: 'chat', icon: 'chat', label: '消息' },
    { id: 'contacts', icon: 'group', label: '联系人' },
    { id: 'media', icon: 'explore', label: '发现' },
    { id: 'security', icon: 'security', label: '安全与隐私' },
    { id: 'settings', icon: 'settings', label: '设置' },
  ];

  return (
    <div className="w-64 flex-none border-r border-slate-200 dark:border-zinc-800 bg-surface-light dark:bg-zinc-950 flex flex-col justify-between p-4 hidden md:flex z-50">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" style={{ backgroundImage: `url("${currentUser?.avatar || CURRENT_USER.avatar}")` }}></div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal truncate">{currentUser?.name || CURRENT_USER.name}</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-xs font-normal leading-normal">在线</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full relative ${currentView === item.id
                ? 'bg-zinc-100 dark:bg-zinc-800 text-slate-900 dark:text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
            >
              <span className={`material-symbols-outlined text-xl ${currentView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <p className="text-sm font-medium leading-normal">{item.label}</p>
              {item.id === 'contacts' && pendingRequestCount > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {pendingRequestCount > 99 ? '99+' : pendingRequestCount}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => onChangeView('calls')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${currentView === 'calls'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
          >
            <span className={`material-symbols-outlined text-xl ${currentView === 'calls' ? 'fill-1' : ''}`}>call</span>
            <p className="text-sm font-medium leading-normal">通话</p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {/* 登出按钮 */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>登出账号</span>
        </button>
        <div className="px-3 py-2 text-xs text-slate-400 dark:text-zinc-600 text-center">
          v2.4.3
        </div>
      </div>
    </div>
  );
};

export default Navigation;