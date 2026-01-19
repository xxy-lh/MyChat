/**
 * API 基础配置和请求封装
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

class ApiService {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * 获取 Authorization header
     */
    private getAuthHeader(): Record<string, string> {
        const token = localStorage.getItem('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    /**
     * 通用请求方法
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Token 过期处理
            if (data.code === 401 && data.message.includes('Token')) {
                // 尝试刷新 token
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // 重试原请求
                    return this.request(endpoint, options);
                } else {
                    // 刷新失败，清除登录状态
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/';
                    throw new Error('登录已过期，请重新登录');
                }
            }

            if (!response.ok || data.code !== 200) {
                throw new Error(data.message || '请求失败');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('网络错误，请检查连接');
        }
    }

    /**
     * GET 请求
     */
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST 请求
     */
    async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT 请求
     */
    async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE 请求
     */
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    /**
     * 刷新 Token
     */
    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return false;

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();
            if (data.code === 200 && data.data?.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
}

// 导出单例
export const apiService = new ApiService(API_BASE_URL);
