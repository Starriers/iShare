package org.starrier.ishare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.starrier.ishare.model.dto.ApiResponse;
import org.starrier.ishare.model.dto.LoginRequest;
import org.starrier.ishare.model.dto.RegisterRequest;
import org.starrier.ishare.model.entity.User;
import org.starrier.ishare.service.UserService;

import java.util.List;

import static org.starrier.ishare.regular.Expression.EMAIL;
import static org.starrier.ishare.regular.Expression.PHONE;
import static org.starrier.ishare.util.Constant.*;

/**
 * User REST Controller
 * 
 * @author Starrier
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    /**
     * User login
     */
    @PostMapping("/login")
    public ApiResponse<User> login(@Valid @RequestBody LoginRequest request) {
        if (EMPTY.equals(request.getUsername()) || EMPTY.equals(request.getPassword())) {
            return ApiResponse.error(400, LOGIN_PARAM_EMPTY);
        }
        
        User user = userService.checkLogin(request.getUsername(), request.getPassword());
        if (user != null) {
            // 不返回密码
            user.setPassword(null);
            return ApiResponse.success("Login successful", user);
        } else {
            return ApiResponse.error(401, LOGIN_PARAM_ERROR);
        }
    }

    /**
     * User register
     */
    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        // 参数验证
        if (EMPTY.equals(request.getUsername()) || EMPTY.equals(request.getPassword()) || 
            EMPTY.equals(request.getRePassword())) {
            return ApiResponse.error(400, LOGIN_PARAM_EMPTY);
        }
        
        if (!request.getPassword().equals(request.getRePassword())) {
            return ApiResponse.error(400, REGISTER_PASSWORD_NOT_CONSISTENT);
        }
        
        if (!request.getUsername().matches(EMAIL) && !request.getUsername().matches(PHONE)) {
            return ApiResponse.error(400, REGISTER_USERNAME_FORMAT_ERROR);
        }
        
        if (request.getUsername().equals(userService.isExist(request.getUsername()))) {
            return ApiResponse.error(400, REGISTER_USERNAME_EXIST);
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .build();
        userService.register(user);
        return ApiResponse.success("Register successful", null);
    }

    /**
     * Get all users
     */
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = userService.findAllUser();
        // 移除密码
        users.forEach(u -> u.setPassword(null));
        return ApiResponse.success(users);
    }

    /**
     * Get user by username
     */
    @GetMapping("/search")
    public ApiResponse<List<User>> searchUsers(@RequestParam String username) {
        List<User> users = userService.findByUsername(username);
        users.forEach(u -> u.setPassword(null));
        return ApiResponse.success(users);
    }

    /**
     * Get user by id
     */
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable int id) {
        // TODO: 需要添加根据ID查询的方法到UserDao和UserService
        return ApiResponse.error(501, "Not implemented");
    }

    /**
     * Create user
     */
    @PostMapping
    public ApiResponse<Void> createUser(@RequestBody User user) {
        userService.addUser(user);
        return ApiResponse.success("User created successfully", null);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ApiResponse<Void> updateUser(@PathVariable int id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return ApiResponse.success("User updated successfully", null);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable int id) {
        userService.deleteUserById(id);
        return ApiResponse.success("User deleted successfully", null);
    }
}
