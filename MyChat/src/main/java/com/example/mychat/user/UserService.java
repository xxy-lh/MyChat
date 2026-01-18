package com.example.mychat.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 用户服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("unused") // 预留的 API 方法可能暂未使用
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 键前缀
    private static final String USER_ONLINE_KEY = "user:online:";
    private static final long ONLINE_EXPIRE_SECONDS = 300; // 5分钟过期

    /**
     * 加载用户详情（Spring Security 使用）
     */
    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String phone) throws UsernameNotFoundException {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + phone));
    }

    /**
     * 根据ID获取用户
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * 根据手机号获取用户
     */
    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    /**
     * 检查手机号是否已注册
     */
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    /**
     * 检查用户名是否已存在
     */
    public boolean existsByHandle(String handle) {
        return userRepository.existsByHandle(handle);
    }

    /**
     * 保存用户
     */
    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * 获取用户信息 DTO
     */
    public UserDTO getUserDTO(Long userId) {
        return userRepository.findById(userId)
                .map(UserDTO::fromEntity)
                .orElse(null);
    }

    /**
     * 更新用户在线状态
     */
    @Transactional
    public void updateOnlineStatus(Long userId, User.UserStatus status) {
        LocalDateTime now = LocalDateTime.now();
        userRepository.updateUserStatus(userId, status, now);

        // 同步更新 Redis
        String key = USER_ONLINE_KEY + userId;
        if (status == User.UserStatus.ONLINE) {
            redisTemplate.opsForValue().set(key, "1", ONLINE_EXPIRE_SECONDS, TimeUnit.SECONDS);
        } else {
            redisTemplate.delete(key);
        }

        log.debug("用户 {} 状态更新为 {}", userId, status);
    }

    /**
     * 刷新在线状态（心跳）
     */
    public void refreshOnlineStatus(Long userId) {
        String key = USER_ONLINE_KEY + userId;
        redisTemplate.expire(key, ONLINE_EXPIRE_SECONDS, TimeUnit.SECONDS);
    }

    /**
     * 检查用户是否在线
     */
    public boolean isUserOnline(Long userId) {
        String key = USER_ONLINE_KEY + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * 搜索用户
     */
    public List<UserDTO> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword).stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 获取联系人列表（示例：获取所有用户作为联系人）
     * TODO: 实际应用中应该根据好友关系查询
     */
    public List<UserDTO> getContacts(Long userId) {
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(userId))
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 更新用户资料
     */
    @Transactional
    public UserDTO updateProfile(Long userId, String name, String bio, String location, String avatar) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (name != null)
                        user.setName(name);
                    if (bio != null)
                        user.setBio(bio);
                    if (location != null)
                        user.setLocation(location);
                    if (avatar != null)
                        user.setAvatar(avatar);
                    userRepository.save(user);
                    return UserDTO.fromEntity(user);
                })
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
    }
}
