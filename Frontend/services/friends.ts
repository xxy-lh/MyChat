/**
 * 好友相关 API
 */

import { apiService, ApiResponse } from './api';
import { User } from './user';

export interface FriendshipDTO {
    id: number;
    fromUser: User;
    toUser: User;
    status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    createdAt: string;
}

/**
 * 发送好友请求
 */
export const sendFriendRequest = async (userId: string): Promise<FriendshipDTO> => {
    const response: ApiResponse<FriendshipDTO> = await apiService.post('/friends/request', { userId });
    return response.data;
};

/**
 * 接受好友请求
 */
export const acceptFriendRequest = async (requestId: number): Promise<FriendshipDTO> => {
    const response: ApiResponse<FriendshipDTO> = await apiService.post(`/friends/accept/${requestId}`, {});
    return response.data;
};

/**
 * 拒绝好友请求
 */
export const rejectFriendRequest = async (requestId: number): Promise<void> => {
    await apiService.delete(`/friends/reject/${requestId}`);
};

/**
 * 删除好友
 */
export const deleteFriend = async (userId: number): Promise<void> => {
    await apiService.delete(`/friends/${userId}`);
};

/**
 * 获取好友列表
 */
export const getFriends = async (): Promise<User[]> => {
    const response: ApiResponse<User[]> = await apiService.get('/friends');
    return response.data;
};

/**
 * 获取待处理的好友请求
 */
export const getPendingRequests = async (): Promise<FriendshipDTO[]> => {
    const response: ApiResponse<FriendshipDTO[]> = await apiService.get('/friends/pending');
    return response.data;
};

/**
 * 获取已发送的好友请求
 */
export const getSentRequests = async (): Promise<FriendshipDTO[]> => {
    const response: ApiResponse<FriendshipDTO[]> = await apiService.get('/friends/sent');
    return response.data;
};
