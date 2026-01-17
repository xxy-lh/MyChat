import React from 'react';
import { CURRENT_USER } from '../constants';

const SettingsProfile: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
      <div className="flex h-full w-full flex-row overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="hidden lg:flex w-80 min-w-[320px] flex-col border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-[#111722] z-20">
            <div className="flex flex-col gap-4 p-4 pb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">设置</h1>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                    </div>
                    <input className="block w-full rounded-lg border-none bg-slate-100 dark:bg-[#232f48] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="搜索设置..." type="text" />
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {['我的账号', '隐私与安全', '通知', '数据与存储', '外观', '语言'].map((item, index) => (
                    <a key={item} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${index === 0 ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232f48] hover:text-slate-900 dark:hover:text-white'}`}>
                        <span className={`material-symbols-outlined ${index === 0 ? 'filled-icon' : ''}`}>{['person', 'lock', 'notifications', 'database', 'palette', 'language'][index]}</span>
                        <span className="text-sm font-medium">{item}</span>
                    </a>
                ))}
                <div className="my-2 border-t border-slate-200 dark:border-slate-700/50 mx-3"></div>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232f48] hover:text-slate-900 dark:hover:text-white transition-all">
                    <span className="material-symbols-outlined">help</span>
                    <span className="text-sm font-medium">帮助与支持</span>
                </a>
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#232f48] cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${CURRENT_USER.avatar}')` }}></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{CURRENT_USER.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{CURRENT_USER.phone}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                </div>
            </div>
        </aside>

        {/* Main Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:px-20 scroll-smooth">
            <div className="max-w-3xl mx-auto pb-20">
                <div className="flex flex-col gap-2 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">编辑个人资料</h2>
                    <p className="text-slate-500 dark:text-[#92a4c9]">更新您的个人信息并管理账户隐私。</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                    <div className="relative group cursor-pointer">
                        <div className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-[#232f48] shadow-md" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPf58i3kWHLfTujEYftRGyFSDU8lWvlXtMxrrWekrhmGP0nbUYbW77hdLZvAYnebnRlZiNYsPho_XVVd4iYvbnSk2qfFBOnlwpc99tEoXMo0goX_XCMWnjOXe9FUe6zElEkmtyIbeRxVU-HHuwzudfmr7-F-8_Wdj8qCzRIMwVaScu2LGYSkU6smBkQT6yrw2MaI9WvCqFDWTIzdATiA-oqJnaYPTx7bAmWsVUTX4K9g1q21tDIQmOugoQQVvMx3nO-pJLei8s1gY')` }}></div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-start flex-1 gap-4 w-full">
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{CURRENT_USER.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{CURRENT_USER.handle}</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20">更换头像</button>
                            <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-[#232f48] text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-[#324467] transition-colors">移除</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        个人信息
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">显示名称</span>
                            <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400" type="text" defaultValue={CURRENT_USER.name} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">用户名</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                                <input className="w-full h-12 px-4 pl-9 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400" type="text" defaultValue="xiaomei_design" />
                            </div>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">手机号码</span>
                            <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400" type="tel" defaultValue={CURRENT_USER.phone} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">所在地</span>
                            <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400" type="text" defaultValue={CURRENT_USER.location} />
                        </label>
                        <label className="flex flex-col gap-2 md:col-span-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">个人简介</span>
                            <textarea className="w-full p-4 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400 resize-none" rows={3} defaultValue={CURRENT_USER.bio}></textarea>
                            <span className="text-xs text-slate-500 text-right">0 / 70 字符</span>
                        </label>
                    </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800 my-10" />

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button className="px-6 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-semibold transition-colors">
                        退出登录
                    </button>
                    <button className="px-8 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]">
                        保存修改
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;