import React, { useState } from 'react';
import { CONTACTS, GROUPS, CHATS } from '../constants';
import AddContactModal from './AddContactModal';

interface ContactsDiscoveryProps {
  onStartChat: (userId: string) => void;
}

const ContactsDiscovery: React.FC<ContactsDiscoveryProps> = ({ onStartChat }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleContactClick = (userId: string, isOnline: boolean) => {
    if (isOnline) {
      // Find associated chat ID if exists, otherwise assume a direct user map for demo
      // In a real app we would create a chat here
      const existingChat = CHATS.find(c => c.userId === userId);
      const chatIdToUse = existingChat ? existingChat.id : '1'; // Default to 1 if no match for demo
      onStartChat(chatIdToUse);
    }
  };

  const handleContactAdded = () => {
    // 刷新联系人列表（TODO: 从后端加载真实数据）
    console.log('Contact added, refreshing list...');
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
            </div>
            <div className="flex flex-col gap-2">
              {CONTACTS.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactClick(contact.id, contact.status === 'online')}
                  className={`group bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all flex items-center gap-4 ${contact.status === 'online' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${contact.avatar}")` }}></div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">{contact.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                      {contact.bio || '暂无介绍'}
                    </p>
                  </div>

                  {/* Status Indicator at the far right */}
                  <div className="ml-auto flex items-center gap-2 px-3">
                    {contact.status === 'online' ? (
                      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <div className="h-2 w-2 rounded-full bg-green-500 group-hover:bg-white animate-pulse"></div>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 group-hover:text-white">发消息</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{contact.lastSeen}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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