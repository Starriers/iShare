# iShare 前后端安全防护分析

## 📋 当前安全状况

### ✅ 已实现的安全措施

1. **密码不返回前端**
   - 登录成功后，密码字段被设置为 null
   - 用户列表查询时，所有用户密码被移除

2. **CORS 配置**
   - 已配置跨域资源共享
   - 允许所有来源（生产环境需要限制）

3. **输入验证**
   - 使用 `@Valid` 注解进行参数验证
   - 注册时验证邮箱/手机号格式
   - 验证密码一致性

4. **字符编码**
   - 已配置 UTF-8 编码，防止编码攻击

---

## 🚨 严重安全问题

### 1. **密码明文存储** ⚠️ 高危
**问题：**
- 密码直接以明文存储在数据库中
- `UserServiceImpl.checkLogin()` 使用 `equals()` 直接比较明文密码

**风险：**
- 数据库泄露导致所有用户密码暴露
- 内部人员可查看所有用户密码
- 违反数据保护法规

**解决方案：**
```java
// 使用 BCrypt 加密
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserServiceImpl {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public void register(User user) {
        // 加密密码
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userDao.registerByUsernameAndPassword(user.getUsername(), encodedPassword);
    }
    
    public User checkLogin(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
}
```

### 2. **缺少身份认证和授权** ⚠️ 高危
**问题：**
- 所有 API 接口都可以匿名访问
- 没有 JWT Token 或 Session 机制
- 无法区分已登录和未登录用户
- 任何人都可以创建、修改、删除文章

**风险：**
- 恶意用户可随意操作数据
- 无法追踪操作者
- 数据完整性无法保证

**解决方案：**
```java
// 添加 Spring Security + JWT
// 1. 添加依赖
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

// 2. 创建 JWT 工具类
// 3. 创建 SecurityConfig 配置类
// 4. 创建 JwtAuthenticationFilter
// 5. 在需要认证的接口上添加 @PreAuthorize
```

### 3. **SQL 注入风险** ⚠️ 中危
**问题：**
- MyBatis 使用 `#{}` 参数化查询（已防护）
- 但部分查询使用了字符串拼接，如：`LIKE "%"#{keyword}"%"`

**风险：**
- 虽然使用了 `#{}`，但 LIKE 查询的拼接方式可能存在问题

**解决方案：**
```xml
<!-- 使用 CONCAT 函数 -->
<select id="getArticlesByKeyword" parameterType="String" resultType="Article">
    SELECT a.*,c.name as category 
    FROM article a 
    LEFT JOIN category c ON a.categoryId=c.id 
    WHERE a.title LIKE CONCAT('%', #{keyword}, '%')
    ORDER BY date DESC
</select>
```

### 4. **XSS 跨站脚本攻击** ⚠️ 中危
**问题：**
- 前端直接渲染用户输入的内容
- 文章标题、内容、评论没有进行 HTML 转义
- 恶意脚本可能被执行

**风险：**
- 窃取用户 Cookie
- 劫持用户会话
- 窃取敏感信息

**解决方案：**
```javascript
// 前端：使用 DOMPurify 库
import DOMPurify from 'dompurify';

function ArticleDetail({ article }) {
  const sanitizedContent = DOMPurify.sanitize(article.content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}

// 后端：添加 XSS 过滤器
@Component
public class XssFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) {
        XssHttpServletRequestWrapper wrappedRequest = 
            new XssHttpServletRequestWrapper((HttpServletRequest) request);
        chain.doFilter(wrappedRequest, response);
    }
}
```

### 5. **CSRF 跨站请求伪造** ⚠️ 中危
**问题：**
- 没有 CSRF Token 保护
- 恶意网站可以代表用户执行操作

**风险：**
- 用户在不知情的情况下执行操作
- 删除文章、修改数据等

**解决方案：**
```java
// Spring Security 自动提供 CSRF 保护
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.csrf(csrf -> csrf.csrfTokenRepository(
            CookieCsrfTokenRepository.withHttpOnlyFalse()
        ));
        return http.build();
    }
}

// 前端：获取 CSRF Token
axios.defaults.headers.common['X-CSRF-TOKEN'] = 
    document.querySelector('meta[name="csrf-token"]').getAttribute('content');
```

### 6. **敏感信息泄露** ⚠️ 中危
**问题：**
- 错误信息可能泄露系统信息
- 数据库连接信息在配置文件中
- Druid 监控页面暴露（虽然需要登录，但密码简单）

**风险：**
- 攻击者获取系统架构信息
- 数据库连接信息泄露

**解决方案：**
```yaml
# 使用环境变量
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/iShare}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD}

# 生产环境禁用 Druid 监控或使用强密码
spring:
  datasource:
    druid:
      stat-view-servlet:
        enabled: false  # 生产环境禁用
```

### 7. **API 接口缺少限流** ⚠️ 中危
**问题：**
- 没有请求频率限制
- 可能被恶意刷接口

**风险：**
- DDoS 攻击
- 资源耗尽
- 服务不可用

**解决方案：**
```java
// 使用 Bucket4j 或 Spring Cloud Gateway 限流
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.7.0</version>
</dependency>

@RestController
public class ArticleRestController {
    private final Bucket bucket;
    
    @GetMapping("/articles")
    public ApiResponse<List<Article>> getAllArticles() {
        if (!bucket.tryConsume(1)) {
            return ApiResponse.error(429, "请求过于频繁，请稍后再试");
        }
        // ...
    }
}
```

### 8. **文件上传安全** ⚠️ 低危（如果未来添加）
**问题：**
- 如果添加文件上传功能，需要防护

**解决方案：**
- 文件类型白名单验证
- 文件大小限制
- 文件名重命名（防止路径遍历）
- 病毒扫描
- 存储路径隔离

---

## 🔒 推荐的安全防护措施

### 后端安全措施

#### 1. **身份认证和授权**
- ✅ 实现 JWT Token 认证
- ✅ 使用 Spring Security
- ✅ 实现基于角色的访问控制（RBAC）
- ✅ Token 过期和刷新机制

#### 2. **密码安全**
- ✅ 使用 BCrypt 加密存储密码
- ✅ 密码强度验证（至少8位，包含大小写字母、数字、特殊字符）
- ✅ 密码重置功能（邮箱验证）

#### 3. **输入验证和过滤**
- ✅ 所有用户输入进行验证
- ✅ XSS 过滤
- ✅ SQL 注入防护（使用参数化查询）
- ✅ 文件上传验证

#### 4. **API 安全**
- ✅ API 限流（防止 DDoS）
- ✅ 请求签名验证
- ✅ 敏感接口需要认证
- ✅ 操作日志记录

#### 5. **数据安全**
- ✅ 敏感数据加密存储
- ✅ 数据库连接加密（SSL）
- ✅ 定期备份
- ✅ 数据脱敏（日志中不记录敏感信息）

#### 6. **HTTPS**
- ✅ 生产环境必须使用 HTTPS
- ✅ 配置 SSL/TLS 证书
- ✅ HSTS 头设置

#### 7. **安全响应头**
```java
@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public void postHandle(HttpServletRequest request, 
                                 HttpServletResponse response, 
                                 Object handler, ModelAndView modelAndView) {
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-Frame-Options", "DENY");
                response.setHeader("X-XSS-Protection", "1; mode=block");
                response.setHeader("Strict-Transport-Security", 
                    "max-age=31536000; includeSubDomains");
                response.setHeader("Content-Security-Policy", 
                    "default-src 'self'");
            }
        });
    }
}
```

### 前端安全措施

#### 1. **XSS 防护**
- ✅ 使用 DOMPurify 清理用户输入
- ✅ 避免使用 `dangerouslySetInnerHTML`
- ✅ 使用 React 的自动转义

#### 2. **CSRF 防护**
- ✅ 获取并使用 CSRF Token
- ✅ 敏感操作需要二次确认

#### 3. **敏感信息处理**
- ✅ Token 存储在 httpOnly Cookie 中（而不是 localStorage）
- ✅ 不在前端存储密码
- ✅ 敏感操作记录日志

#### 4. **内容安全策略（CSP）**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

#### 5. **依赖安全**
- ✅ 定期更新依赖包
- ✅ 使用 `npm audit` 检查漏洞
- ✅ 使用 Snyk 或 Dependabot 监控

#### 6. **错误处理**
- ✅ 不向用户暴露详细错误信息
- ✅ 统一错误处理
- ✅ 错误日志记录

---

## 📊 安全优先级

### 🔴 高优先级（立即修复）
1. **密码加密存储** - 使用 BCrypt
2. **身份认证和授权** - 实现 JWT + Spring Security
3. **SQL 注入防护** - 修复 LIKE 查询

### 🟡 中优先级（近期修复）
4. **XSS 防护** - 前后端都添加过滤
5. **CSRF 防护** - 添加 CSRF Token
6. **API 限流** - 防止恶意请求
7. **敏感信息保护** - 使用环境变量

### 🟢 低优先级（长期优化）
8. **安全响应头** - 添加安全头
9. **HTTPS** - 生产环境配置
10. **安全审计日志** - 记录所有敏感操作

---

## 🛠️ 实施建议

### 第一阶段（1-2周）
1. 实现密码加密（BCrypt）
2. 实现 JWT 认证
3. 修复 SQL 注入风险

### 第二阶段（2-3周）
4. 添加 XSS 过滤
5. 实现 CSRF 防护
6. 添加 API 限流

### 第三阶段（持续）
7. 安全响应头
8. HTTPS 配置
9. 安全审计和监控

---

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [JWT 最佳实践](https://datatracker.ietf.org/doc/html/rfc8725)
- [Web 安全指南](https://cheatsheetseries.owasp.org/)

---

**最后更新：** 2026-01-07
**分析人：** AI Assistant



