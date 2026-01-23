import React, { useState, useEffect, useCallback } from 'react';
import { GROUPS, CHATS } from '../constants';
import AddContactModal from './AddContactModal';
import { getFriends } from '../services/friends';
import { User } from '../services/user';

interface ContactsDiscoveryProps {
  onStartChat: (userId: string) => void;
  onRefreshPendingCount?: () => void;
}

const ContactsDiscovery: React.FC<ContactsDiscoveryProps> = ({ onStartChat, onRefreshPendingCount }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 加载好友列表
  const loadFriends = useCallback(async () => {
    setIsLoading(true);
    try {
      const friendList = await getFriends();
      setFriends(friendList);
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 组件挂载时加载好友列表
  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleContactClick = (userId: string) => {
    // 直接使用 userId 开始聊天
    onStartChat(userId);
  };

  const handleContactAdded = () => {
    // 刷新好友列表和待处理请求数量
    loadFriends();
    onRefreshPendingCount?.();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white dark:bg-black">
      <header className="flex-none px-6 py-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 z-10">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label className="flex w-full items-center h-10 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-slate-300 dark:focus-within:ring-zinc-600 transition-all overflow-hidden">
              <div className="flex items-center justify-center pl-3 pr-2 text-slate-400 dark:text-zinc-500">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:ring-0 focus:outline-none h-full" placeholder="搜索联系人..." />
            </label>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none h-10 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>添加联系人</span>
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-slate-50 dark:bg-black">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-10 pb-10">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">联系人</h2>
              <span className="text-sm text-slate-500 dark:text-zinc-400">{friends.length} 位好友</span>
            </div>
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <div className="text-center py-10 text-slate-400 dark:text-zinc-500">
                  <span className="material-symbols-outlined text-4xl mb-2 animate-spin">progress_activity</span>
                  <p>加载中...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-10 text-slate-400 dark:text-zinc-500">
                  <span className="material-symbols-outlined text-4xl mb-2">group</span>
                  <p>暂无好友，点击"添加联系人"开始添加</p>
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => handleContactClick(friend.id)}
                    className="group bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all flex items-center gap-4 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-cover bg-center bg-slate-200 dark:bg-zinc-700" style={{ backgroundImage: `url("${friend.avatar || 'https://ui-avatars.com/api/?name=' + friend.name}")` }}></div>
                      {friend.status === 'online' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900"></div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight truncate">{friend.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-normal truncate">
                        {friend.handle || friend.bio || '暂无介绍'}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3">
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span className="text-xs font-bold">发消息</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          <hr className="border-slate-200 dark:border-zinc-800" />
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">发现</h2>
            </div>
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">热门群组</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {GROUPS.map((group) => (
                  <div key={group.id} className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-lg dark:hover:shadow-zinc-700/20 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col">
                    <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url("${group.image}")` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="bg-white p-0.5 rounded-lg">
                          <div className="w-10 h-10 rounded-md bg-cover bg-center" style={{ backgroundImage: `url("${group.logo}")` }}></div>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base leading-tight">{group.name}</h4>
                          <p className="text-slate-300 text-xs">{group.subscribers} 订阅者</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <p className="text-slate-600 dark:text-zinc-400 text-sm line-clamp-2">{group.description}</p>
                      <button className="mt-auto w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black text-slate-700 dark:text-zinc-300 py-2 rounded-lg text-sm font-semibold transition-colors">查看频道</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 添加联系人模态框 */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
};

export default ContactsDiscovery;