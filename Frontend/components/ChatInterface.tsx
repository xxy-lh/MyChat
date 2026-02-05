import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CHATS, CONTACTS } from '../constants';
import { getFriends } from '../services/friends';
import { User } from '../services/user';
import { wsService, ChatMessage } from '../services/websocket';

interface ChatInterfaceProps {
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  unreadMessages?: Record<string, number>;
  friendsOnlineStatus?: Record<string, boolean>;
}

interface LocalMessage {
  id?: string;
  text: string;
  time: string;
  isMe: boolean;
  senderId?: string;
}

const EMOJIS = ['😀', '😂', '🥰', '👍', '❤️', '🎉', '🔥', '🤔', '👀', '👋'];

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedChatId,
  onSelectChat,
  unreadMessages = {},
  friendsOnlineStatus = {}
}) => {
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, LocalMessage[]>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'channels'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [friends, setFriends] = useState<User[]>([]);

  // 加载好友列表
  const loadFriends = useCallback(async () => {
    try {
      const friendList = await getFriends();
      setFriends(friendList);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  }, []);

  // 组件挂载时加载好友列表
  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // 订阅 WebSocket 消息
  useEffect(() => {
    // 获取当前用户 ID
    const currentUserStr = sessionStorage.getItem('currentUser');
    const currentUserId = currentUserStr ? JSON.parse(currentUserStr).id : null;

    if (!currentUserId) return;

    // 订阅消息
    const unsubscribe = wsService.onMessage((message: ChatMessage) => {
      const formattedMsg: LocalMessage = {
        id: message.id,
        text: message.text,
        time: new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMe: message.senderId === currentUserId,
        senderId: message.senderId,
      };

      // 添加到对应的聊天窗口
      const chatId = message.senderId === currentUserId ? selectedChatId : message.senderId;
      setLocalMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), formattedMsg]
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [selectedChatId]);

  // 查找选中的好友或使用静态聊天数据
  const activeFriend = friends.find(f => f.id === selectedChatId);
  const activeChat = !activeFriend
    ? (CHATS.find(c => c.id === selectedChatId) || CHATS[0] || {
      id: 'system',
      userId: 'system',
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0
    })
    : null;

  // 如果选中的是好友，使用好友信息；否则使用传统的 CONTACTS
  const activeContact = activeFriend
    ? activeFriend
    : (activeChat && !activeChat.isGroup ? CONTACTS.find(c => c.id === activeChat.userId) : null);

  const activeName = activeFriend ? activeFriend.name : (activeContact ? activeContact.name : (activeChat?.groupName || '未知'));
  const activeAvatar = activeFriend
    ? (activeFriend.avatar || `https://ui-avatars.com/api/?name=${activeFriend.name}`)
    : (activeContact ? activeContact.avatar : (activeChat?.isGroup ? `https://ui-avatars.com/api/?name=${activeChat?.groupName}&background=random` : ''));
  const isOnline = activeFriend ? activeFriend.status === 'ONLINE' : activeContact?.status === 'online';

  // Filter chats based on active tab AND search query
  const filteredChats = CHATS.filter(chat => {
    const contact = !chat.isGroup ? CONTACTS.find(c => c.id === chat.userId) : null;
    const nameToCheck = chat.isGroup ? (chat.groupName || '') : (contact?.name || '');
    const lastMessageToCheck = chat.lastMessage || '';

    const matchesSearch = nameToCheck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessageToCheck.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

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

    // 获取当前用户 ID
    const currentUserStr = sessionStorage.getItem('currentUser');
    const currentUserId = currentUserStr ? JSON.parse(currentUserStr).id : null;

    const newMessage: LocalMessage = {
      text: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      senderId: currentUserId,
    };

    // 本地立即显示消息（乐观更新）
    setLocalMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    // 通过 WebSocket 发送消息
    if (wsService.isConnected()) {
      wsService.sendMessage(selectedChatId, inputText, 'text');
    } else {
      console.warn('[Chat] WebSocket 未连接，消息将在重连后发送');
    }

    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachments(false);
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
      <aside className="w-full md:w-[360px] lg:w-[400px] flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 h-full z-20">
        <header className="flex items-center justify-between px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">消息</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleHeaderAction('新建聊天/群组')}
              className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">group_add</span>
            </button>
            <button
              onClick={() => handleHeaderAction('聊天设置')}
              className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>
        <div className="px-5 pb-2 shrink-0">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-zinc-400 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2.5 pl-10 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-900 rounded-lg border border-transparent focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 placeholder-slate-400 dark:placeholder-zinc-500 transition-all"
              placeholder="搜索消息..."
              type="text"
            />
          </div>
        </div>
        <div className="px-5 shrink-0">
          <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'all' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">全部</span>
              {activeTab === 'all' && <span className="absolute bottom-0 w-full h-[3px] bg-slate-900 dark:bg-white rounded-t-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'groups' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">群组</span>
              {activeTab === 'groups' && <span className="absolute bottom-0 w-full h-[3px] bg-slate-900 dark:bg-white rounded-t-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`relative flex flex-col items-center justify-center pb-3 pt-3 transition-colors ${activeTab === 'channels' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'}`}
            >
              <span className="text-sm font-bold tracking-[0.015em]">频道</span>
              {activeTab === 'channels' && <span className="absolute bottom-0 w-full h-[3px] bg-slate-900 dark:bg-white rounded-t-full"></span>}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-zinc-500">
              <span className="material-symbols-outlined text-3xl mb-2">group</span>
              <p className="text-sm">暂无好友</p>
              <p className="text-xs mt-1">添加好友后将在这里显示</p>
            </div>
          ) : (
            friends
              .filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (friend.handle || '').toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((friend) => {
                const avatar = friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}`;
                const isSelected = friend.id === selectedChatId;
                // 优先使用实时在线状态，其次使用好友原始状态
                const isOnline = friendsOnlineStatus[friend.id] !== undefined
                  ? friendsOnlineStatus[friend.id]
                  : friend.status === 'ONLINE';
                const unreadCount = unreadMessages[friend.id] || 0;

                return (
                  <div
                    key={friend.id}
                    onClick={() => onSelectChat(friend.id)}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer ${isSelected ? 'bg-slate-100 dark:bg-zinc-800 border-l-[3px] border-slate-900 dark:border-white' : 'hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border-l-[3px] border-transparent'}`}
                  >
                    <div className="relative shrink-0">
                      <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 bg-slate-200 dark:bg-zinc-700" style={{ backgroundImage: `url("${avatar}")` }}></div>
                      {isOnline && <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{friend.name}</p>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                          <p className="text-slate-400 dark:text-zinc-500 text-xs">{isOnline ? '在线' : ''}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`${isSelected ? 'text-slate-600 dark:text-zinc-300' : 'text-slate-500 dark:text-zinc-400'} text-sm truncate`}>{friend.handle || '点击开始聊天'}</p>
                      </div>
                    </div>
                  </div>
                )
              })
          )}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-black relative min-w-0">
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
              {isOnline && <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>}
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{activeName}</h2>
              <p className={`${isOnline ? 'text-green-500' : 'text-slate-400 dark:text-zinc-500'} text-xs font-medium`}>{isOnline ? '在线' : '离线'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 text-slate-500 dark:text-zinc-400">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="搜索记录">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block" title="语音通话">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block" title="视频通话">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="更多信息">
              <span className="material-symbols-outlined">view_sidebar</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-100 dark:bg-zinc-950">

          <div className="flex justify-center my-4">
            <span className="bg-white/80 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">历史消息</span>
          </div>

          <div className="flex gap-3 max-w-[85%] sm:max-w-[70%]">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
            <div className="flex flex-col gap-1">
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl rounded-bl-sm text-slate-900 dark:text-white shadow-sm">
                <p className="text-sm leading-relaxed">
                  {activeChat?.isGroup
                    ? `欢迎加入 ${activeName} 群组！让我们开始讨论吧。`
                    : `你好！这是与 ${activeName} 的聊天记录。`}
                </p>
              </div>
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] pl-1">{activeChat?.lastMessageTime || '刚刚'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 self-end max-w-[85%] sm:max-w-[70%] items-end">
            <div className="bg-slate-900 dark:bg-white p-3 rounded-xl rounded-br-sm text-white dark:text-black shadow-sm">
              <p className="text-sm leading-relaxed">好的，我在线。</p>
            </div>
            <div className="flex items-center gap-1 pr-1">
              <span className="text-slate-400 dark:text-zinc-500 text-[10px]">刚刚</span>
              <span className="material-symbols-outlined text-[14px] text-green-500">done_all</span>
            </div>
          </div>

          {/* Dynamic Local Messages */}
          {localMessages[selectedChatId]?.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isMe ? 'flex-col items-end self-end' : 'flex-row items-end self-start'} gap-1 max-w-[85%] sm:max-w-[70%]`}>
              {!msg.isMe && (
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 self-end mb-1" style={{ backgroundImage: `url("${activeAvatar}")` }}></div>
              )}
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-xl shadow-sm ${msg.isMe ? 'bg-slate-900 dark:bg-white text-white dark:text-black rounded-br-sm' : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 ${msg.isMe ? 'justify-end pr-1' : 'pl-1'}`}>
                  <span className="text-slate-400 dark:text-zinc-500 text-[10px]">{msg.time}</span>
                  {msg.isMe && <span className="material-symbols-outlined text-[14px] text-green-500">done</span>}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-slate-200 dark:border-zinc-800 relative">
          {/* Attachments Menu */}
          {showAttachments && (
            <div className="absolute bottom-20 left-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-20 w-40 animate-fade-in-up">
              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-900 dark:text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-purple-500">image</span>
                照片/视频
              </button>
              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-900 dark:text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-blue-500">description</span>
                文件
              </button>
              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-900 dark:text-white text-sm text-left transition-colors">
                <span className="material-symbols-outlined text-red-500">location_on</span>
                位置
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-3 z-20 w-64">
              <div className="grid grid-cols-5 gap-2">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 rounded p-1 transition-colors"
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
              className={`p-2.5 rounded-full transition-colors shrink-0 ${showAttachments ? 'text-slate-900 dark:text-white bg-slate-200 dark:bg-zinc-800' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 bg-slate-100 dark:bg-zinc-900 rounded-xl flex items-center min-h-[48px] px-2 shadow-inner border border-transparent focus-within:border-slate-300 dark:focus-within:border-zinc-700 transition-colors">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 resize-none py-3 px-2 text-sm max-h-[120px]"
                placeholder="输入消息..."
                rows={1}
                style={{ minHeight: '24px' }}
              ></textarea>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-yellow-500' : 'text-slate-400 dark:text-zinc-500 hover:text-yellow-500'}`}
              >
                <span className="material-symbols-outlined">sentiment_satisfied</span>
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="p-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black rounded-full shadow-lg transition-all shrink-0 flex items-center justify-center group active:scale-95"
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