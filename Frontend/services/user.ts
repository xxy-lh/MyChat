/**
 * 用户相关 API
 */

import { apiService, ApiResponse } from './api';

export interface User {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    bio?: string;
    location?: string;
    phone?: string;
    email?: string;
    status: string;
    lastSeen?: string;
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    location?: string;
    avatar?: string;
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
    const response: ApiResponse<User> = await apiService.get('/users/me');

    // 缓存用户信息
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response.data;
};

/**
 * 更新个人资料
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
    const response: ApiResponse<User> = await apiService.put('/users/me', data);

    // 更新缓存
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response.data;
};

/**
 * 获取联系人列表
 */
export const getContacts = async (): Promise<User[]> => {
    const response: ApiResponse<User[]> = await apiService.get('/users/contacts');
    return response.data;
};

/**
 * 搜索用户
 */
export const searchUsers = async (keyword: string): Promise<User[]> => {
    const response: ApiResponse<User[]> = await apiService.get(`/users/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
};

/**
 * 根据 ID 获取用户信息
 */
export const getUserById = async (userId: string): Promise<User> => {
    const response: ApiResponse<User> = await apiService.get(`/users/${userId}`);
    return response.data;
};

/**
 * 绑定手机号
 */
export const bindPhone = async (phone: string): Promise<User> => {
    const response: ApiResponse<User> = await apiService.put('/users/me/phone', { phone });

    // 更新缓存
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response.data;
};

/**
 * 绑定邮箱
 */
export const bindEmail = async (email: string): Promise<User> => {
    const response: ApiResponse<User> = await apiService.put('/users/me/email', { email });

    // 更新缓存
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response.data;
};

/**
 * 从缓存获取当前用户
 */
export const getCachedUser = (): User | null => {
    const cached = localStorage.getItem('currentUser');
    return cached ? JSON.parse(cached) : null;
};
