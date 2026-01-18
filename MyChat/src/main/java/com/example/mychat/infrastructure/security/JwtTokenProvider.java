package com.example.mychat.infrastructure.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 令牌提供者
 * 
 * 负责 JWT 令牌的生成、验证和解析
 */
@Slf4j
@Component
public class JwtTokenProvider {

    // JWT 密钥 (开发环境默认值，生产环境请通过配置覆盖)
    @Value("${jwt.secret:TeleChatSecretKey2024ForDevelopmentEnvironmentOnly}")
    private String jwtSecret;

    // Access Token 有效期（毫秒），默认 2 小时
    @Value("${jwt.access-token-expiration:7200000}")
    private long accessTokenExpiration;

    // Refresh Token 有效期（毫秒），默认 7 天
    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    /**
     * 获取签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        // 确保密钥长度足够（至少 256 位）
        if (keyBytes.length < 32) {
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            return Keys.hmacShaKeyFor(paddedKey);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 生成 Access Token
     * 
     * @param userId 用户ID
     * @param phone  手机号
     * @return JWT Token
     */
    public String generateAccessToken(Long userId, String phone) {
        return generateToken(userId, phone, accessTokenExpiration, "access");
    }

    /**
     * 生成 Refresh Token
     * 
     * @param userId 用户ID
     * @param phone  手机号
     * @return JWT Token
     */
    public String generateRefreshToken(Long userId, String phone) {
        return generateToken(userId, phone, refreshTokenExpiration, "refresh");
    }

    /**
     * 生成 Token
     */
    private String generateToken(Long userId, String phone, long expiration, String tokenType) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("phone", phone);
        claims.put("type", tokenType);

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 从 Token 中获取用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", Long.class);
    }

    /**
     * 从 Token 中获取手机号
     */
    public String getPhoneFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("phone", String.class);
    }

    /**
     * 获取 Token 类型
     */
    public String getTokenType(String token) {
        Claims claims = parseToken(token);
        return claims.get("type", String.class);
    }

    /**
     * 验证 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("无效的 JWT 格式");
        } catch (ExpiredJwtException ex) {
            log.error("JWT 已过期");
        } catch (UnsupportedJwtException ex) {
            log.error("不支持的 JWT");
        } catch (IllegalArgumentException ex) {
            log.error("JWT 为空或无效");
        } catch (Exception ex) {
            log.error("JWT 验证失败: {}", ex.getMessage());
        }
        return false;
    }

    /**
     * 检查 Token 是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException ex) {
            return true;
        }
    }

    /**
     * 解析 Token
     */
    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 获取 Access Token 有效期（秒）
     */
    public long getAccessTokenExpirationInSeconds() {
        return accessTokenExpiration / 1000;
    }

    /**
     * 获取 Refresh Token 有效期（秒）
     */
    public long getRefreshTokenExpirationInSeconds() {
        return refreshTokenExpiration / 1000;
    }
}
