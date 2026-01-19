import React, { useState, useEffect } from 'react';
import { searchUsers, User } from '../services/user';
import { sendFriendRequest, getPendingRequests, getSentRequests, FriendshipDTO } from '../services/friends';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactAdded?: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onContactAdded }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'search' | 'pending'>('search');
    const [pendingRequests, setPendingRequests] = useState<FriendshipDTO[]>([]);

    // 加载已发送的请求
    useEffect(() => {
        if (isOpen) {
            loadSentRequests();
            if (activeTab === 'pending') {
                loadPendingRequests();
            }
        }
    }, [isOpen, activeTab]);

    const loadSentRequests = async () => {
        try {
            const requests = await getSentRequests();
            setSentRequests(requests.map(r => r.toUser?.id || ''));
        } catch (error) {
            console.error('Failed to load sent requests:', error);
        }
    };

    const loadPendingRequests = async () => {
        try {
            const requests = await getPendingRequests();
            setPendingRequests(requests);
        } catch (error) {
            console.error('Failed to load pending requests:', error);
        }
    };

    // 搜索用户
    const handleSearch = async () => {
        if (!searchKeyword.trim()) return;

        setIsSearching(true);
        setMessage(null);

        try {
            const results = await searchUsers(searchKeyword.trim());
            setSearchResults(results);
            if (results.length === 0) {
                setMessage({ type: 'error', text: '未找到匹配的用户' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || '搜索失败' });
        } finally {
            setIsSearching(false);
        }
    };

    // 发送好友请求
    const handleSendRequest = async (userId: string) => {
        try {
            await sendFriendRequest(userId);
            setSentRequests(prev => [...prev, userId]);
            setMessage({ type: 'success', text: '好友请求已发送' });
            onContactAdded?.();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || '发送请求失败' });
        }
    };

    // 按 Enter 搜索
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 关闭模态框
    const handleClose = () => {
        setSearchKeyword('');
        setSearchResults([]);
        setMessage(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* 模态框 */}
            <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* 头部 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">添加联系人</h2>
                    <button
                        onClick={handleClose}
                        className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* 标签切换 */}
                <div className="flex border-b border-slate-200 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search'
                            ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        搜索用户
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'pending'
                            ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        好友请求
                        {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* 内容区 */}
                <div className="p-6">
                    {activeTab === 'search' ? (
                        <>
                            {/* 搜索框 */}
                            <div className="flex gap-2 mb-4">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-xl">search</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="输入用户名或手机号搜索..."
                                        className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-400 dark:focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching || !searchKeyword.trim()}
                                    className="h-12 px-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSearching ? '搜索中...' : '搜索'}
                                </button>
                            </div>

                            {/* 消息提示 */}
                            {message && (
                                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* 搜索结果 */}
                            <div className="max-h-80 overflow-y-auto space-y-2">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700"
                                    >
                                        <div
                                            className="size-12 rounded-full bg-cover bg-center shrink-0"
                                            style={{ backgroundImage: `url("${user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}")` }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-900 dark:text-white truncate">{user.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{user.handle || user.bio || '暂无介绍'}</p>
                                        </div>
                                        {sentRequests.includes(user.id) ? (
                                            <span className="px-3 py-1.5 text-sm text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-700 rounded-lg">
                                                已发送
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleSendRequest(user.id)}
                                                className="px-3 py-1.5 text-sm font-medium text-white dark:text-black bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 rounded-lg transition-colors"
                                            >
                                                添加
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {searchResults.length === 0 && !isSearching && !message && (
                                    <div className="text-center py-10 text-slate-400 dark:text-zinc-500">
                                        <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
                                        <p>搜索用户添加好友</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* 好友请求列表 */
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-zinc-500">
                                    <span className="material-symbols-outlined text-4xl mb-2">notifications_none</span>
                                    <p>暂无好友请求</p>
                                </div>
                            ) : (
                                pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700"
                                    >
                                        <div
                                            className="size-12 rounded-full bg-cover bg-center shrink-0"
                                            style={{ backgroundImage: `url("${request.fromUser?.avatar || 'https://ui-avatars.com/api/?name=' + request.fromUser?.name}")` }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-900 dark:text-white truncate">{request.fromUser?.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">{request.createdAt}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 text-sm font-medium text-white dark:text-black bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 rounded-lg transition-colors">
                                                接受
                                            </button>
                                            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 rounded-lg transition-colors">
                                                拒绝
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;
