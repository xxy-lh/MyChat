import React from 'react';

/**
 * 安全与隐私组件
 * 显示浏览历史（图片、视频、链接）和账号绑定设置
 */
const SecurityPrivacy: React.FC = () => {
    // 模拟的浏览历史数据
    const browsingHistory = {
        images: [
            { id: 1, url: 'https://picsum.photos/200/200?random=1', name: '图片1.jpg', time: '2024-01-18 10:30' },
            { id: 2, url: 'https://picsum.photos/200/200?random=2', name: '图片2.png', time: '2024-01-17 15:20' },
            { id: 3, url: 'https://picsum.photos/200/200?random=3', name: '截图.jpg', time: '2024-01-16 09:45' },
        ],
        videos: [
            { id: 1, name: '会议录像.mp4', duration: '15:30', time: '2024-01-18 09:00' },
            { id: 2, name: '教程视频.mp4', duration: '08:45', time: '2024-01-15 14:30' },
        ],
        links: [
            { id: 1, url: 'https://example.com/article', title: '技术文章分享', time: '2024-01-18 11:00' },
            { id: 2, url: 'https://github.com', title: 'GitHub 仓库', time: '2024-01-17 16:30' },
            { id: 3, url: 'https://docs.google.com', title: '在线文档', time: '2024-01-16 13:15' },
        ],
    };

    // 账号绑定状态
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isBindingPhone, setIsBindingPhone] = React.useState(false);
    const [isBindingEmail, setIsBindingEmail] = React.useState(false);

    const handleBindPhone = () => {
        if (phoneNumber) {
            alert(`手机号 ${phoneNumber} 绑定成功！`);
            setIsBindingPhone(false);
        }
    };

    const handleBindEmail = () => {
        if (email) {
            alert(`邮箱 ${email} 绑定成功！`);
            setIsBindingEmail(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white relative overflow-hidden">
            {/* Header */}
            <header className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">security</span>
                    <h2 className="text-2xl font-bold tracking-tight">安全与隐私</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">管理你的浏览记录和账号安全</p>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* 账号绑定 */}
                    <section className="bg-surface-light dark:bg-[#1e2126] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">link</span>
                            <h3 className="text-lg font-bold">账号绑定</h3>
                        </div>

                        {/* 手机号绑定 */}
                        <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">phone_android</span>
                                </div>
                                <div>
                                    <div className="font-medium">手机号</div>
                                    <div className="text-sm text-slate-500">用于登录和找回密码</div>
                                </div>
                            </div>
                            {isBindingPhone ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="tel"
                                        placeholder="输入手机号"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm w-40"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                    <button
                                        onClick={handleBindPhone}
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                    >
                                        确认
                                    </button>
                                    <button
                                        onClick={() => setIsBindingPhone(false)}
                                        className="px-3 py-2 text-slate-500 hover:text-slate-700"
                                    >
                                        取消
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsBindingPhone(true)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    绑定手机号
                                </button>
                            )}
                        </div>

                        {/* 邮箱绑定 */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">mail</span>
                                </div>
                                <div>
                                    <div className="font-medium">邮箱</div>
                                    <div className="text-sm text-slate-500">用于接收重要通知</div>
                                </div>
                            </div>
                            {isBindingEmail ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        placeholder="输入邮箱地址"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm w-48"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        onClick={handleBindEmail}
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                    >
                                        确认
                                    </button>
                                    <button
                                        onClick={() => setIsBindingEmail(false)}
                                        className="px-3 py-2 text-slate-500 hover:text-slate-700"
                                    >
                                        取消
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsBindingEmail(true)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    绑定邮箱
                                </button>
                            )}
                        </div>
                    </section>

                    {/* 浏览过的图片 */}
                    <section className="bg-surface-light dark:bg-[#1e2126] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">image</span>
                                <h3 className="text-lg font-bold">浏览过的图片</h3>
                                <span className="text-sm text-slate-500">({browsingHistory.images.length})</span>
                            </div>
                            <button className="text-sm text-primary hover:underline">清除全部</button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {browsingHistory.images.map((img) => (
                                <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">visibility</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 浏览过的视频 */}
                    <section className="bg-surface-light dark:bg-[#1e2126] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">play_circle</span>
                                <h3 className="text-lg font-bold">浏览过的视频</h3>
                                <span className="text-sm text-slate-500">({browsingHistory.videos.length})</span>
                            </div>
                            <button className="text-sm text-primary hover:underline">清除全部</button>
                        </div>
                        <div className="space-y-3">
                            {browsingHistory.videos.map((video) => (
                                <div key={video.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                                    <div className="size-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-red-500">videocam</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{video.name}</div>
                                        <div className="text-sm text-slate-500">{video.duration} • {video.time}</div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 浏览过的链接 */}
                    <section className="bg-surface-light dark:bg-[#1e2126] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">link</span>
                                <h3 className="text-lg font-bold">浏览过的链接</h3>
                                <span className="text-sm text-slate-500">({browsingHistory.links.length})</span>
                            </div>
                            <button className="text-sm text-primary hover:underline">清除全部</button>
                        </div>
                        <div className="space-y-2">
                            {browsingHistory.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                            <span className="material-symbols-outlined text-blue-500 text-lg">language</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{link.title}</div>
                                            <div className="text-sm text-slate-500 truncate">{link.url}</div>
                                        </div>
                                        <div className="text-xs text-slate-400">{link.time}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* 隐私设置 */}
                    <section className="bg-surface-light dark:bg-[#1e2126] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-orange-500">shield</span>
                            <h3 className="text-lg font-bold">隐私设置</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">自动清除浏览记录</div>
                                    <div className="text-sm text-slate-500">每30天自动清除浏览历史</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">阻止读取剪贴板</div>
                                    <div className="text-sm text-slate-500">禁止应用访问你的剪贴板内容</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default SecurityPrivacy;
