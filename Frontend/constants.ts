import { User, Chat, Group, MediaItem } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'User',
  avatar: '',
  status: 'online',
  handle: '@user',
  location: '',
  phone: '',
  email: '',
  bio: ''
};

export const CONTACTS: User[] = [];

export const CHATS: Chat[] = [];

export const GROUPS: Group[] = [];

export const MEDIA_ITEMS: MediaItem[] = [];