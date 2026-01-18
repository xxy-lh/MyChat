package com.example.mychat.auth.dto;

import com.example.mychat.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 认证响应 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * Token 类型
     */
    @Builder.Default
    private String tokenType = "Bearer";

    /**
     * Access Token 有效期（秒）
     */
    private Long expiresIn;

    /**
     * 用户信息
     */
    private UserDTO user;
}
