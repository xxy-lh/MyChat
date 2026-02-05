/**
 * WebSocket 服务
 * 
 * 使用 STOMP 协议连接后端实时消息服务
 */

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// WebSocket 服务器地址
const WS_URL = 'http://localhost:8080/ws-chat';

// 消息类型定义
export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
    type: string;
}

// 在线状态变更消息
export interface PresenceMessage {
    userId: string;
    status: 'ONLINE' | 'OFFLINE';
    timestamp: string;
}

// 未读消息计数
export interface UnreadCount {
    senderId: string;
    count: number;
}

// 事件回调类型
type MessageHandler = (message: ChatMessage) => void;
type PresenceHandler = (presence: PresenceMessage) => void;
type UnreadHandler = (unread: UnreadCount) => void;
type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: StompSubscription[] = [];
    private messageHandlers: MessageHandler[] = [];
    private presenceHandlers: PresenceHandler[] = [];
    private unreadHandlers: UnreadHandler[] = [];
    private connectionHandlers: ConnectionHandler[] = [];
    private userId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    /**
     * 连接 WebSocket
     */
    connect(userId: string, token: string): void {
        if (this.client?.connected) {
            console.log('[WebSocket] 已连接，跳过重复连接');
            return;
        }

        this.userId = userId;

        this.client = new Client({
            // 使用 SockJS 作为 WebSocket 工厂
            webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
            // 连接头（用于认证）
            connectHeaders: {
                Authorization: `Bearer ${token}`,
                'user-id': userId,
            },
            // 调试日志
            debug: (str) => {
                console.log('[STOMP]', str);
            },
            // 重连延迟
            reconnectDelay: 5000,
            // 心跳
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
        });

        // 连接成功回调
        this.client.onConnect = () => {
            console.log('[WebSocket] 连接成功');
            this.reconnectAttempts = 0;
            this.notifyConnectionHandlers(true);
            this.subscribeToChannels();
        };

        // 连接断开回调
        this.client.onDisconnect = () => {
            console.log('[WebSocket] 连接断开');
            this.notifyConnectionHandlers(false);
        };

        // 错误回调
        this.client.onStompError = (frame) => {
            console.error('[WebSocket] STOMP 错误:', frame.headers['message']);
            this.notifyConnectionHandlers(false);
        };

        // 激活连接
        this.client.activate();
    }

    /**
     * 订阅消息频道
     */
    private subscribeToChannels(): void {
        if (!this.client || !this.userId) return;

        // 清理旧订阅
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];

        // 订阅个人消息队列
        const messagesSub = this.client.subscribe(
            `/user/${this.userId}/queue/messages`,
            (message: IMessage) => {
                try {
                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    console.log('[WebSocket] 收到消息:', chatMessage);
                    this.notifyMessageHandlers(chatMessage);
                } catch (e) {
                    console.error('[WebSocket] 解析消息失败:', e);
                }
            }
        );
        this.subscriptions.push(messagesSub);

        // 订阅在线状态变更
        const presenceSub = this.client.subscribe(
            `/user/${this.userId}/queue/presence`,
            (message: IMessage) => {
                try {
                    const presence: PresenceMessage = JSON.parse(message.body);
                    console.log('[WebSocket] 在线状态变更:', presence);
                    this.notifyPresenceHandlers(presence);
                } catch (e) {
                    console.error('[WebSocket] 解析在线状态失败:', e);
                }
            }
        );
        this.subscriptions.push(presenceSub);

        // 订阅未读消息更新
        const unreadSub = this.client.subscribe(
            `/user/${this.userId}/queue/unread`,
            (message: IMessage) => {
                try {
                    const unread: UnreadCount = JSON.parse(message.body);
                    console.log('[WebSocket] 未读更新:', unread);
                    this.notifyUnreadHandlers(unread);
                } catch (e) {
                    console.error('[WebSocket] 解析未读数失败:', e);
                }
            }
        );
        this.subscriptions.push(unreadSub);

        console.log('[WebSocket] 已订阅所有频道');
    }

    /**
     * 发送消息
     */
    sendMessage(receiverId: string, content: string, type: string = 'text'): void {
        if (!this.client?.connected) {
            console.error('[WebSocket] 未连接，无法发送消息');
            return;
        }

        const clientMsgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        this.client.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({
                receiverId,
                content,
                type,
                clientMsgId,
            }),
        });

        console.log('[WebSocket] 消息已发送:', { receiverId, content });
    }

    /**
     * 发送已读回执
     */
    sendReadReceipt(senderId: string): void {
        if (!this.client?.connected) {
            console.error('[WebSocket] 未连接，无法发送已读回执');
            return;
        }

        this.client.publish({
            destination: '/app/chat.read',
            body: JSON.stringify({ senderId }),
        });

        console.log('[WebSocket] 已读回执已发送:', senderId);
    }

    /**
     * 发送心跳
     */
    sendHeartbeat(): void {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: '/app/chat.heartbeat',
            body: '',
        });
    }

    /**
     * 断开连接
     */
    disconnect(): void {
        if (this.client) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions = [];
            this.client.deactivate();
            this.client = null;
            console.log('[WebSocket] 已断开连接');
        }
    }

    /**
     * 注册消息处理器
     */
    onMessage(handler: MessageHandler): () => void {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    /**
     * 注册在线状态处理器
     */
    onPresence(handler: PresenceHandler): () => void {
        this.presenceHandlers.push(handler);
        return () => {
            this.presenceHandlers = this.presenceHandlers.filter(h => h !== handler);
        };
    }

    /**
     * 注册未读数处理器
     */
    onUnread(handler: UnreadHandler): () => void {
        this.unreadHandlers.push(handler);
        return () => {
            this.unreadHandlers = this.unreadHandlers.filter(h => h !== handler);
        };
    }

    /**
     * 注册连接状态处理器
     */
    onConnection(handler: ConnectionHandler): () => void {
        this.connectionHandlers.push(handler);
        return () => {
            this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
        };
    }

    /**
     * 是否已连接
     */
    isConnected(): boolean {
        return this.client?.connected ?? false;
    }

    // 通知处理器
    private notifyMessageHandlers(message: ChatMessage): void {
        this.messageHandlers.forEach(h => h(message));
    }

    private notifyPresenceHandlers(presence: PresenceMessage): void {
        this.presenceHandlers.forEach(h => h(presence));
    }

    private notifyUnreadHandlers(unread: UnreadCount): void {
        this.unreadHandlers.forEach(h => h(unread));
    }

    private notifyConnectionHandlers(connected: boolean): void {
        this.connectionHandlers.forEach(h => h(connected));
    }
}

// 导出单例
export const wsService = new WebSocketService();
