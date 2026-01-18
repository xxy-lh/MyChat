package com.example.mychat.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket 配置
 * 
 * 使用 STOMP 协议进行消息传递
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 配置消息代理
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 启用简单消息代理，用于向客户端广播消息
        // /topic - 广播消息（群聊、频道）
        // /queue - 点对点消息（私聊）
        config.enableSimpleBroker("/topic", "/queue");

        // 客户端发送消息的前缀
        config.setApplicationDestinationPrefixes("/app");

        // 用户目的地前缀（用于点对点消息）
        config.setUserDestinationPrefix("/user");
    }

    /**
     * 注册 STOMP 端点
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 注册 WebSocket 端点
        // 客户端通过 /ws-chat 建立连接
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:3000")
                .withSockJS(); // 支持 SockJS 降级
    }
}
