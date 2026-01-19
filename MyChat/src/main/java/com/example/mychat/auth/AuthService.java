package com.example.mychat.auth;

import com.example.mychat.auth.dto.AuthResponse;
import com.example.mychat.auth.dto.LoginRequest;
import com.example.mychat.auth.dto.RegisterRequest;
import com.example.mychat.infrastructure.security.JwtTokenProvider;
import com.example.mychat.infrastructure.exception.BusinessException;
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
 * 使用用户名进行认证
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
     * 使用用户名 + 密码认证
     */
    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername();

        // 先检查用户是否存在
        if (!userService.existsByName(username)) {
            throw new BusinessException("该用户名尚未注册，请先注册账号", HttpStatus.NOT_FOUND);
        }

        // 认证用户
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            request.getPassword()));

            User user = (User) authentication.getPrincipal();
            Long userId = Objects.requireNonNull(user.getId(), "用户ID不能为空");
            String name = Objects.requireNonNull(user.getName(), "用户名不能为空");

            // 生成令牌
            String accessToken = jwtTokenProvider.generateAccessToken(userId, name);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userId, name);

            // 将 Token 存入 Redis 白名单（用于后续踢下线功能）
            saveTokenToWhitelist(userId, accessToken);

            // 更新在线状态
            userService.updateOnlineStatus(userId, User.UserStatus.ONLINE);

            log.info("用户 {} 登录成功", name);

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                    .user(UserDTO.fromEntity(user))
                    .build();
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // 密码错误
            throw new BusinessException("用户名或密码错误，请检查后重试", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * 用户注册
     * 仅需用户名和密码
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername();

        // 验证密码确认
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致", HttpStatus.BAD_REQUEST);
        }

        // 检查用户名是否已注册
        if (userService.existsByName(username)) {
            throw new BusinessException("该用户名已被注册", HttpStatus.CONFLICT);
        }

        // 创建用户（用户名同时作为 name 和 handle）
        User user = User.builder()
                .name(username)
                .handle("@" + username) // 用户名作为 handle
                .password(passwordEncoder.encode(request.getPassword()))
                .status(User.UserStatus.ONLINE)
                .build();

        user = userRepository.save(user);

        // 生成令牌
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getName());

        // 将 Token 存入 Redis 白名单
        saveTokenToWhitelist(user.getId(), accessToken);

        log.info("用户 {} 注册成功，ID: {}", user.getName(), user.getId());

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
        String username = jwtTokenProvider.getPhoneFromToken(refreshToken); // 现在存的是用户名

        // 生成新的 Access Token
        String newAccessToken = jwtTokenProvider.generateAccessToken(userId, username);

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
