import React, { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { User } from '../services/user';

interface SettingsProfileProps {
    currentUser: User | null;
    onLogout: () => void;
    onUserUpdate: (user: User) => void;
    isDarkMode?: boolean;
    onToggleTheme?: () => void;
}

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'storage' | 'appearance' | 'language';

const SettingsProfile: React.FC<SettingsProfileProps> = ({ currentUser, onLogout, onUserUpdate, isDarkMode, onToggleTheme }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const user = currentUser || CURRENT_USER;

    const settingsItems: { id: SettingsTab; icon: string; label: string }[] = [
        { id: 'account', icon: 'person', label: '我的账号' },
        { id: 'privacy', icon: 'lock', label: '隐私与安全' },
        { id: 'notifications', icon: 'notifications', label: '通知' },
        { id: 'storage', icon: 'database', label: '数据与存储' },
        { id: 'appearance', icon: 'palette', label: '外观' },
        { id: 'language', icon: 'language', label: '语言' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">编辑个人资料</h2>
                            <p className="text-slate-500 dark:text-zinc-400">更新您的个人信息并管理账户隐私。</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                            <div className="relative group cursor-pointer">
                                <div className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-zinc-800 shadow-md" style={{ backgroundImage: `url('${user.avatar || CURRENT_USER.avatar}')` }}></div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center sm:items-start flex-1 gap-4 w-full">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name || CURRENT_USER.name}</h3>
                                    <p className="text-slate-500 dark:text-zinc-400">{user.handle || CURRENT_USER.handle}</p>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">更换头像</button>
                                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">移除</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-900 dark:text-white">badge</span>
                                个人信息
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">显示名称</span>
                                    <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-zinc-500" type="text" defaultValue={user.name || CURRENT_USER.name} />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">用户名</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">@</span>
                                        <input className="w-full h-12 px-4 pl-9 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-zinc-500" type="text" defaultValue={user.handle?.replace('@', '') || CURRENT_USER.handle?.replace('@', '')} />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">手机号码</span>
                                    <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-zinc-500" type="tel" defaultValue={user.phone || CURRENT_USER.phone} />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">邮箱地址</span>
                                    <input className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-zinc-500" type="email" defaultValue={user.email || CURRENT_USER.email} placeholder="example@email.com" />
                                </label>
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">个人简介</span>
                                    <textarea className="w-full p-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-zinc-500 resize-none" rows={3} defaultValue={user.bio || CURRENT_USER.bio}></textarea>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button className="px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-200 shadow-lg transition-all hover:scale-[1.02]">
                                保存修改
                            </button>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">外观设置</h2>
                            <p className="text-slate-500 dark:text-zinc-400">自定义应用的外观和主题。</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined">dark_mode</span>
                                主题模式
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => onToggleTheme && isDarkMode && onToggleTheme()}
                                    className={`p-6 rounded-xl border-2 transition-all ${!isDarkMode ? 'border-slate-900 dark:border-white bg-slate-50' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'}`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-16 bg-white rounded-lg shadow-md flex items-center justify-center border border-slate-200">
                                            <span className="material-symbols-outlined text-3xl text-yellow-500">light_mode</span>
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">日间模式</span>
                                        {!isDarkMode && <span className="text-xs text-green-600">✓ 当前使用</span>}
                                    </div>
                                </button>
                                <button
                                    onClick={() => onToggleTheme && !isDarkMode && onToggleTheme()}
                                    className={`p-6 rounded-xl border-2 transition-all ${isDarkMode ? 'border-slate-900 dark:border-white bg-zinc-800' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'}`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-16 bg-zinc-900 rounded-lg shadow-md flex items-center justify-center border border-zinc-700">
                                            <span className="material-symbols-outlined text-3xl text-blue-400">dark_mode</span>
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">夜间模式</span>
                                        {isDarkMode && <span className="text-xs text-green-400">✓ 当前使用</span>}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">隐私与安全</h2>
                            <p className="text-slate-500 dark:text-zinc-400">管理您的隐私设置和账户安全。</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">两步验证</p>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">保护您的账户安全</p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">设置</button>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">活动设备</p>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">查看已登录的设备</p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">查看</button>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">通知设置</h2>
                            <p className="text-slate-500 dark:text-zinc-400">管理消息通知和提醒。</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                            {['消息通知', '群组通知', '声音提醒', '桌面通知'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100 dark:border-zinc-800">
                                    <span className="font-medium text-slate-900 dark:text-white">{item}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'storage':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">数据与存储</h2>
                            <p className="text-slate-500 dark:text-zinc-400">管理缓存和存储设置。</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                            <div className="flex items-center justify-between py-3 mb-4">
                                <span className="font-medium text-slate-900 dark:text-white">存储空间使用</span>
                                <span className="text-sm text-slate-500 dark:text-zinc-400">1.2 GB / 5 GB</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
                                <div className="bg-slate-900 dark:bg-white h-2 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                            <button className="mt-6 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">清除缓存</button>
                        </div>
                    </div>
                );

            case 'language':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">语言设置</h2>
                            <p className="text-slate-500 dark:text-zinc-400">选择您的首选语言。</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-2">
                            {['简体中文', 'English', '繁體中文', '日本語'].map((lang, i) => (
                                <button key={i} className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${i === 0 ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                                    {lang} {i === 0 && <span className="float-right text-green-600 dark:text-green-400">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-black relative">
            <div className="flex h-full w-full flex-row overflow-hidden">
                {/* Settings Sidebar */}
                <aside className="hidden lg:flex w-80 min-w-[320px] flex-col border-r border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 z-20">
                    <div className="flex flex-col gap-4 p-4 pb-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">设置</h1>
                            <button className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-[20px]">search</span>
                            </div>
                            <input className="block w-full rounded-lg border-none bg-white dark:bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-slate-300 dark:focus:ring-zinc-600 focus:outline-none" placeholder="搜索设置..." type="text" />
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                        {settingsItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === item.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                        <div className="my-2 border-t border-slate-200 dark:border-zinc-800 mx-3"></div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all">
                            <span className="material-symbols-outlined">help</span>
                            <span className="text-sm font-medium">帮助与支持</span>
                        </button>
                    </nav>
                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar || CURRENT_USER.avatar}')` }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user.name || CURRENT_USER.name}</p>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user.phone || CURRENT_USER.phone}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-[20px]">expand_more</span>
                        </div>
                    </div>
                </aside>

                {/* Main Settings Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:px-20 scroll-smooth bg-slate-50 dark:bg-black">
                    <div className="max-w-3xl mx-auto pb-20">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsProfile;