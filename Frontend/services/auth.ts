/**
 * 认证相关 API
 */

import { apiService, ApiResponse } from './api';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        name: string;
        avatar: string;
        handle: string;
        status: string;
    };
}

/**
 * 用户登录
 */
export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response: ApiResponse<AuthResponse> = await apiService.post('/auth/login', {
        username,
        password,
    });

    // 保存 token
    if (response.data) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
};

/**
 * 用户注册
 */
export const register = async (username: string, password: string, confirmPassword: string): Promise<AuthResponse> => {
    const response: ApiResponse<AuthResponse> = await apiService.post('/auth/register', {
        username,
        password,
        confirmPassword,
    });

    // 保存 token
    if (response.data) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
    try {
        await apiService.post('/auth/logout', {});
    } finally {
        // 清除本地存储
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('currentUser');
    }
};

/**
 * 刷新 Token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const response: ApiResponse<AuthResponse> = await apiService.post('/auth/refresh', {
        refreshToken,
    });

    if (response.data) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
};
