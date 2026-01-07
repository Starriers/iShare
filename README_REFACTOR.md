# iShare 重构说明

本项目已从 SSM (Spring + SpringMVC + MyBatis) 架构重构为 Spring Boot 3.2 + React 架构。

## 技术栈

### 后端
- Spring Boot 3.2.0
- MyBatis 3.0.3
- MySQL 8.0
- Druid 连接池
- SpringDoc OpenAPI (Swagger 3)

### 前端
- React 18
- React Router
- Axios
- Vite

## 项目结构

```
iShare/
├── src/main/java/org/starrier/ishare/
│   ├── IShareApplication.java          # Spring Boot 主应用类
│   ├── config/                          # 配置类
│   │   ├── WebConfig.java               # CORS 配置
│   │   └── SwaggerConfig.java           # API 文档配置
│   ├── controller/                       # REST 控制器
│   │   ├── UserRestController.java      # 用户 API
│   │   └── ArticleRestController.java   # 文章 API
│   ├── service/                          # 业务逻辑层
│   ├── dao/                              # 数据访问层
│   └── model/                            # 实体类和 DTO
│       ├── entity/                       # 实体类
│       └── dto/                          # 数据传输对象
├── src/main/resources/
│   ├── application.yml                  # Spring Boot 配置
│   └── mapper/                           # MyBatis Mapper XML
└── frontend/                             # React 前端项目
    ├── src/
    │   ├── api/                          # API 调用
    │   ├── components/                   # React 组件
    │   └── pages/                        # 页面组件
    └── vite.config.js                    # Vite 配置
```

## 运行项目

### 前置要求
- JDK 17+
- Maven 3.6+
- Node.js 20+
- MySQL 8.0+

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE iShare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入数据库脚本：
```bash
mysql -u root -p iShare < src/main/resources/database/iShare.sql
```

3. 修改 `src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/iShare?...
    username: root
    password: your_password
```

### 运行后端

```bash
# 编译项目
mvn clean install

# 运行 Spring Boot 应用
mvn spring-boot:run

# 或者
java -jar target/ishare-2.0.jar
```

后端服务将在 `http://localhost:8080` 启动。

API 文档访问地址：`http://localhost:8080/api/swagger-ui.html`

### 运行前端

```bash
cd frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

## API 端点

### 用户相关
- `POST /api/users/login` - 用户登录
- `POST /api/users/register` - 用户注册
- `GET /api/users` - 获取所有用户
- `GET /api/users/{id}` - 获取用户详情
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户

### 文章相关
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/{id}` - 获取文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/{id}` - 更新文章
- `DELETE /api/articles/{id}` - 删除文章
- `GET /api/articles/search?keyword=xxx` - 搜索文章
- `GET /api/articles/category/{categoryId}` - 按分类获取文章
- `GET /api/articles/author/{author}` - 按作者获取文章

### 评论相关
- `GET /api/articles/{id}/comments` - 获取文章评论
- `POST /api/articles/comments` - 添加评论

## 主要变更

1. **架构升级**
   - 从 SSM 升级到 Spring Boot 3.2
   - 从 JSP 升级到 React SPA
   - 前后端完全分离

2. **API 设计**
   - 所有接口改为 RESTful API
   - 统一使用 JSON 格式
   - 统一的响应格式 `ApiResponse<T>`

3. **配置简化**
   - 使用 `application.yml` 替代 XML 配置
   - 自动配置减少手动配置
   - 使用 SpringDoc 替代 Swagger 2

4. **前端现代化**
   - 使用 React Hooks
   - 组件化开发
   - 路由管理
   - API 统一管理

## 注意事项

1. 确保 MySQL 服务已启动
2. 确保数据库已创建并导入数据
3. 前后端需要同时运行才能正常使用
4. 开发环境下前端通过 Vite 代理访问后端 API

## 开发建议

1. 后端开发：使用 IDE（如 IntelliJ IDEA）打开项目
2. 前端开发：使用 VS Code 打开 `frontend` 目录
3. API 测试：使用 Swagger UI 或 Postman
4. 代码规范：遵循 Java 和 JavaScript 编码规范

## 问题排查

1. **后端启动失败**
   - 检查数据库连接配置
   - 检查端口 8080 是否被占用
   - 查看日志文件 `logs/ishare.log`

2. **前端无法连接后端**
   - 检查后端服务是否启动
   - 检查 Vite 代理配置
   - 检查浏览器控制台错误信息

3. **CORS 错误**
   - 检查 `WebConfig.java` 中的 CORS 配置
   - 确保后端允许前端域名访问
