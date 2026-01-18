package com.example.mychat.user;

import com.example.mychat.infrastructure.web.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户控制器
 * 
 * 提供用户相关 REST API
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取当前登录用户信息
     * 
     * GET /api/v1/users/me
     */
    @GetMapping("/me")
    public Result<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDTO userDTO = UserDTO.fromEntity(user);
        return Result.success(userDTO);
    }

    /**
     * 获取联系人列表
     * 
     * GET /api/v1/users/contacts
     */
    @GetMapping("/contacts")
    public Result<List<UserDTO>> getContacts(@AuthenticationPrincipal User user) {
        List<UserDTO> contacts = userService.getContacts(user.getId());
        return Result.success(contacts);
    }

    /**
     * 根据ID获取用户信息
     * 
     * GET /api/v1/users/{id}
     */
    @GetMapping("/{id}")
    public Result<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserDTO(id);
        if (userDTO == null) {
            return Result.notFound("用户不存在");
        }
        return Result.success(userDTO);
    }

    /**
     * 搜索用户
     * 
     * GET /api/v1/users/search?keyword=xxx
     */
    @GetMapping("/search")
    public Result<List<UserDTO>> searchUsers(@RequestParam String keyword) {
        List<UserDTO> users = userService.searchUsers(keyword);
        return Result.success(users);
    }

    /**
     * 更新个人资料
     * 
     * PUT /api/v1/users/me
     */
    @PutMapping("/me")
    public Result<UserDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {

        UserDTO updated = userService.updateProfile(
                user.getId(),
                request.getName(),
                request.getBio(),
                request.getLocation(),
                request.getAvatar());

        return Result.success("资料更新成功", updated);
    }

    /**
     * 更新资料请求体
     */
    @lombok.Data
    public static class UpdateProfileRequest {
        private String name;
        private String bio;
        private String location;
        private String avatar;
    }
}
