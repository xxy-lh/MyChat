package com.example.mychat.auth;

import com.example.mychat.auth.dto.AuthResponse;
import com.example.mychat.auth.dto.LoginRequest;
import com.example.mychat.auth.dto.RegisterRequest;
import com.example.mychat.infrastructure.security.JwtTokenProvider;
import com.example.mychat.infrastructure.web.GlobalExceptionHandler.BusinessException;
import com.example.mychat.user.User;
import com.example.mychat.user.UserRepository;
import com.example.mychat.user.UserService;
import com.example.mychat.user.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务
 * 处理登录、注册、令牌刷新等业务逻辑
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 键前缀
    private static final String TOKEN_WHITELIST_KEY = "user:token:";

    /**
     * 用户登录
     */
    public AuthResponse login(LoginRequest request) {
        // 先检查用户是否存在
        if (!userService.existsByPhone(request.getPhone())) {
            throw new BusinessException("该手机号尚未注册，请先注册账号", HttpStatus.NOT_FOUND);
        }

        // 认证用户
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getPhone(),
                            request.getPassword()));

            User user = (User) authentication.getPrincipal();
            Long userId = Objects.requireNonNull(user.getId(), "用户ID不能为空");
            String phone = Objects.requireNonNull(user.getPhone(), "手机号不能为空");

            // 生成令牌
            String accessToken = jwtTokenProvider.generateAccessToken(userId, phone);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userId, phone);

            // 将 Token 存入 Redis 白名单（用于后续踢下线功能）
            saveTokenToWhitelist(userId, accessToken);

            // 更新在线状态
            userService.updateOnlineStatus(userId, User.UserStatus.ONLINE);

            log.info("用户 {} 登录成功", phone);

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                    .user(UserDTO.fromEntity(user))
                    .build();
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // 密码错误
            throw new BusinessException("手机号或密码错误，请检查后重试", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * 用户注册
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 验证密码确认
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致", HttpStatus.BAD_REQUEST);
        }

        // 检查手机号是否已注册
        if (userService.existsByPhone(request.getPhone())) {
            throw new BusinessException("该手机号已注册", HttpStatus.CONFLICT);
        }

        // 创建用户
        User user = User.builder()
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .handle("@user_" + System.currentTimeMillis() % 1000000) // 生成临时用户名
                .status(User.UserStatus.ONLINE)
                .build();

        user = userRepository.save(user);

        // 生成令牌
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getPhone());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getPhone());

        // 将 Token 存入 Redis 白名单
        saveTokenToWhitelist(user.getId(), accessToken);

        log.info("用户 {} 注册成功，ID: {}", user.getPhone(), user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                .user(UserDTO.fromEntity(user))
                .build();
    }

    /**
     * 刷新令牌
     */
    public AuthResponse refreshToken(String refreshToken) {
        // 验证 Refresh Token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("无效的刷新令牌", HttpStatus.UNAUTHORIZED);
        }

        // 确保是 Refresh Token
        String tokenType = jwtTokenProvider.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BusinessException("令牌类型错误", HttpStatus.UNAUTHORIZED);
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        String phone = jwtTokenProvider.getPhoneFromToken(refreshToken);

        // 生成新的 Access Token
        String newAccessToken = jwtTokenProvider.generateAccessToken(userId, phone);

        // 更新白名单
        saveTokenToWhitelist(userId, newAccessToken);

        // 获取用户信息
        UserDTO userDTO = userService.getUserDTO(userId);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Refresh Token 保持不变
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                .user(userDTO)
                .build();
    }

    /**
     * 用户登出
     */
    public void logout(Long userId) {
        // 从白名单中移除 Token
        String key = TOKEN_WHITELIST_KEY + userId;
        redisTemplate.delete(key);

        // 更新离线状态
        userService.updateOnlineStatus(userId, User.UserStatus.OFFLINE);

        log.info("用户 {} 已登出", userId);
    }

    /**
     * 将 Token 存入白名单
     */
    private void saveTokenToWhitelist(Long userId, String token) {
        String key = TOKEN_WHITELIST_KEY + userId;
        long expireSeconds = jwtTokenProvider.getAccessTokenExpirationInSeconds();
        redisTemplate.opsForValue().set(key, token, expireSeconds, TimeUnit.SECONDS);
    }
}
