package com.example.mychat.auth;

import com.example.mychat.auth.dto.AuthResponse;
import com.example.mychat.auth.dto.LoginRequest;
import com.example.mychat.auth.dto.RegisterRequest;
import com.example.mychat.infrastructure.web.Result;
import com.example.mychat.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器 - 提供登录、注册、刷新令牌、登出等 REST API
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 用户登录 - POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public Result<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return Result.success("登录成功", response);
    }

    /**
     * 用户注册 - POST /api/v1/auth/register
     */
    @PostMapping("/register")
    public Result<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return Result.success("注册成功", response);
    }

    /**
     * 刷新令牌 - POST /api/v1/auth/refresh
     */
    @PostMapping("/refresh")
    public Result<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return Result.success("令牌刷新成功", response);
    }

    /**
     * 用户登出 - POST /api/v1/auth/logout
     */
    @PostMapping("/logout")
    public Result<Void> logout(@AuthenticationPrincipal User user) {
        if (user != null) {
            authService.logout(user.getId());
        }
        return Result.success("登出成功", null);
    }

    /**
     * 刷新令牌请求体
     */
    @lombok.Data
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
}
