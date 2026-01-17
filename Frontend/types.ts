export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  handle?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  isRead?: boolean;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  fileSize?: string;
  fileName?: string;
}

export interface Chat {
  id: string;
  userId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
}

export interface Group {
  id: string;
  name: string;
  subscribers: string;
  description: string;
  image: string;
  logo: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'location';
  date: string;
  duration?: string;
  location?: string;
}

export type ViewState = 'chat' | 'contacts' | 'media' | 'settings' | 'calls';