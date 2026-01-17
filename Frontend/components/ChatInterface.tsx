import React, { useState, useEffect, useRef } from 'react';
import { CHATS, CONTACTS } from '../constants';

interface ChatInterfaceProps {
  selectedChatId: string;
  onSelectChat: (id: string) => void;
}

interface LocalMessage {
  text: string;
  time: string;
  isMe: boolean;
}

const EMOJIS = ['😀', '😂', '🥰', '👍', '❤️', '🎉', '🔥', '🤔', '👀', '👋'];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChatId, onSelectChat }) => {
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, LocalMessage[]>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'channels'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = CHATS.find(c => c.id === selectedChatId) || CHATS[0] || {
    id: 'system',
    userId: 'system',
    lastMessage: '',
    lastMessageTime: '',
    unreadCount: 0
  };
  const activeContact = !activeChat.isGroup
    ? CONTACTS.find(c => c.id === activeChat.userId)
    : null;

  const activeName = activeContact ? activeContact.name : (activeChat.groupName || '未知');
  const activeAvatar = activeContact ? activeContact.avatar : (activeChat.isGroup ? `https://ui-avatars.com/api/?name=${activeChat.groupName}&background=random` : '');
  const isOnline = activeContact?.status === 'online';

  // Filter chats based on active tab AND search query
  const filteredChats = CHATS.filter(chat => {
    // 1. Text Search Filter
    const contact = !chat.isGroup ? CONTACTS.find(c => c.id === chat.userId) : null;
    const nameToCheck = chat.isGroup ? (chat.groupName || '') : (contact?.name || '');
    const lastMessageToCheck = chat.lastMessage || '';

    const matchesSearch = nameToCheck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessageToCheck.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Tab Filter
    if (activeTab === 'all') return true;
    if (activeTab === 'groups') return chat.isGroup;
    if (activeTab === 'channels') return chat.isGroup && (chat.groupName?.includes('频道') || chat.groupName?.includes('Channel'));
    return true;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, selectedChatId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: LocalMessage = {
      text: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setLocalMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachments(false);

    // Simulate reply
    setTimeout(() => {
      const reply: LocalMessage = {
        text: `收到！这是来自 ${activeName} 的自动回复。`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setLocalMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), reply]
      }));
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleHeaderAction = (action: string) => {
    alert(`功能演示：${action}`);
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="flex h-full w-full">
      {/* Chat List Sidebar */}
      <aside className="w-full md:w-[360px] lg:w-[400px] flex flex-col border-r border-border-dark bg-surface-dark shrink-0 h-full z-20">
        <header className="flex items-center justify-between px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-base font-bold leading-tight">消息</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleHeaderAction('新建聊天/群组')}
              className="flex items-center justify-center size-10 rounded-full hover:bg-border-dark transition-colors text-[#92a4c9] hover:text-white"
            >
              <span className="material-symbols-outlined">group_add</span>
            </button>
            <button
              onClick={() => handleHeaderAction('聊天设置')}
              className="flex items-center justify-center size-10 rounded-full hover:bg-border-dark transition-colors text-[#92a4c9] hover:text-white"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>
        <div className="px-5 pb-2 shrink-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#92a4c9] group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2.5 pl-10 text-sm text-white bg-background-dark rounded-lg border border-transparent focus:ring-1 focus:ring-primary focus:border-primary placeholder-[#64748b] transition-all"
              placeholder="搜索消息..."
              type="text"
            />
          </div>
        </div>
        <div className="px-5 shrink-0">
          <div className="flex border-b border-border-dark gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'all' ? 'text-primary' : 'text-[#92a4c9] hover:text-white'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">全部</span>
              {activeTab === 'all' && <span className="absolute bottom-0 w-full h-[3px] bg-primary rounded-t-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'groups' ? 'text-primary' : 'text-[#92a4c9] hover:text-white'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">群组</span>
              {activeTab === 'groups' && <span className="absolute bottom-0 w-full h-[3px] bg-primary rounded-t-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'channels' ? 'text-primary' : 'text-[#92a4c9] hover:text-white'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">频道</span>
              {activeTab === 'channels' && <span className="absolute bottom-0 w-full h-[3px] bg-primary rounded-t-full"></span>}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#64748b]">
              <span className="material-symbols-outlined text-3xl mb-2">chat_bubble_outline</span>
              <p className="text-sm">未找到相关消息</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const contact = !chat.isGroup ? CONTACTS.find(c => c.id === chat.userId) : null;
              const avatar = contact ? contact.avatar : (chat.isGroup ? `https://ui-avatars.com/api/?name=${chat.groupName}&background=random` : '');
              const name = contact ? contact.name : chat.groupName;
              const isSelected = chat.id === selectedChatId;

              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer ${isSelected ? 'bg-border-dark/50 border-l-[3px] border-primary' : 'hover:bg-border-dark/30 transition-colors border-l-[3px] border-transparent'}`}
                >
                  <div className="relative shrink-0">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12" style={{ backgroundImage: `url("${avatar}")` }}></div>
                    {contact?.status === 'online' && <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-surface-dark rounded-full"></div>}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-white text-sm font-bold truncate">{name}</p>
                      <p className="text-[#92a4c9] text-xs">{chat.lastMessageTime}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`${isSelected ? 'text-white/90' : 'text-[#92a4c9]'} text-sm truncate`}>{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full ml-2">{chat.unreadCount}</span>}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col h-full bg-background-dark relative min-w-0">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border-dark bg-background-dark/95 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
              {isOnline && <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-background-dark rounded-full"></div>}
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-base font-bold leading-tight">{activeName}</h2>
              <p className={`${isOnline ? 'text-primary' : 'text-gray-500'} text-xs font-medium`}>{isOnline ? '在线' : '离线'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 text-[#92a4c9]">
            <button className="p-2 rounded-full hover:bg-border-dark hover:text-white transition-colors" title="搜索记录">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 rounded-full hover:bg-border-dark hover:text-white transition-colors hidden sm:block" title="语音通话">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="p-2 rounded-full hover:bg-border-dark hover:text-white transition-colors hidden sm:block" title="视频通话">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button className="p-2 rounded-full hover:bg-border-dark hover:text-white transition-colors" title="更多信息">
              <span className="material-symbols-outlined">view_sidebar</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" style={{ backgroundImage: 'radial-gradient(#1f293a 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#101622' }}>

          <div className="flex justify-center my-4">
            <span className="bg-surface-dark/80 text-[#92a4c9] text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">历史消息</span>
          </div>

          <div className="flex gap-3 max-w-[85%] sm:max-w-[70%]">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
            <div className="flex flex-col gap-1">
              <div className="bg-surface-dark p-3 rounded-xl rounded-bl-sm text-white shadow-sm">
                <p className="text-sm leading-relaxed">
                  {activeChat.isGroup
                    ? `欢迎加入 ${activeName} 群组！让我们开始讨论吧。`
                    : `你好！这是与 ${activeName} 的聊天记录。`}
                </p>
              </div>
              <span className="text-[#64748b] text-[10px] pl-1">{activeChat.lastMessageTime}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 self-end max-w-[85%] sm:max-w-[70%] items-end">
            <div className="bg-primary p-3 rounded-xl rounded-br-sm text-white shadow-sm">
              <p className="text-sm leading-relaxed">好的，我在线。</p>
            </div>
            <div className="flex items-center gap-1 pr-1">
              <span className="text-[#64748b] text-[10px]">刚刚</span>
              <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
            </div>
          </div>

          {/* Dynamic Local Messages */}
          {localMessages[selectedChatId]?.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isMe ? 'flex-col items-end self-end' : 'flex-row items-end self-start'} gap-1 max-w-[85%] sm:max-w-[70%]`}>
              {!msg.isMe && (
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
              )}
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-xl text-white shadow-sm ${msg.isMe ? 'bg-primary rounded-br-sm' : 'bg-surface-dark rounded-bl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 ${msg.isMe ? 'justify-end pr-1' : 'pl-1'}`}>
                  <span className="text-[#64748b] text-[10px]">{msg.time}</span>
                  {msg.isMe && <span className="material-symbols-outlined text-[14px] text-primary">done</span>}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 p-4 bg-background-dark/95 backdrop-blur-sm border-t border-border-dark relative">
          {/* Attachments Menu */}
          {showAttachments && (
            <div className="absolute bottom-20 left-4 bg-surface-dark border border-border-dark rounded-xl shadow-xl p-2 flex flex-col gap-1 z-20 w-40 animate-fade-in-up">
              <button className="flex items-center gap-3 p-2 hover:bg-border-dark rounded-lg text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-purple-400">image</span>
                照片/视频
              </button>
              <button className="flex items-center gap-3 p-2 hover:bg-border-dark rounded-lg text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-blue-400">description</span>
                文件
              </button>
              <button className="flex items-center gap-3 p-2 hover:bg-border-dark rounded-lg text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-red-400">location_on</span>
                位置
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-20 bg-surface-dark border border-border-dark rounded-xl shadow-xl p-3 z-20 w-64">
              <div className="grid grid-cols-5 gap-2">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-border-dark rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-3 max-w-[960px] mx-auto">
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className={`p-2.5 rounded-full transition-colors shrink-0 ${showAttachments ? 'text-primary bg-primary/10' : 'text-[#92a4c9] hover:text-white hover:bg-surface-dark'}`}
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 bg-surface-dark rounded-xl flex items-center min-h-[48px] px-2 shadow-inner border border-transparent focus-within:border-border-dark transition-colors">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-[#64748b] resize-none py-3 px-2 text-sm max-h-[120px]"
                placeholder="输入消息..."
                rows={1}
                style={{ minHeight: '24px' }}
              ></textarea>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-yellow-400' : 'text-[#92a4c9] hover:text-yellow-400'}`}
              >
                <span className="material-symbols-outlined">sentiment_satisfied</span>
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="p-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all shrink-0 flex items-center justify-center group active:scale-95"
            >
              <span className="material-symbols-outlined group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">send</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;