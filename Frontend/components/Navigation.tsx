import React from 'react';
import { ViewState } from '../types';
import { CURRENT_USER } from '../constants';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems: { id: ViewState; icon: string; label: string }[] = [
    { id: 'chat', icon: 'chat', label: '消息' },
    { id: 'contacts', icon: 'group', label: '联系人' },
    { id: 'media', icon: 'explore', label: '发现' },
    { id: 'security', icon: 'security', label: '安全与隐私' },
    { id: 'settings', icon: 'settings', label: '设置' },
  ];

  return (
    <div className="w-64 flex-none border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-[#111722] flex flex-col justify-between p-4 hidden md:flex z-50">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" style={{ backgroundImage: `url("${CURRENT_USER.avatar}")` }}></div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal truncate">{CURRENT_USER.name}</h1>
            <p className="text-slate-500 dark:text-[#92a4c9] text-xs font-normal leading-normal">在线</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${currentView === item.id
                  ? 'bg-primary/10 dark:bg-[#232f48] text-primary dark:text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-[#92a4c9] dark:hover:bg-[#232f48]'
                }`}
            >
              <span className={`material-symbols-outlined text-xl ${currentView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <p className="text-sm font-medium leading-normal">{item.label}</p>
            </button>
          ))}
          <button
            onClick={() => onChangeView('calls')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${currentView === 'calls'
                ? 'bg-primary/10 dark:bg-[#232f48] text-primary dark:text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-[#92a4c9] dark:hover:bg-[#232f48]'
              }`}
          >
            <span className={`material-symbols-outlined text-xl ${currentView === 'calls' ? 'fill-1' : ''}`}>call</span>
            <p className="text-sm font-medium leading-normal">通话</p>
          </button>
        </div>
      </div>
      <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-600 text-center">
        v2.4.3
      </div>
    </div>
  );
};

export default Navigation;