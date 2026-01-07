# IDE 运行指南

## IntelliJ IDEA 设置步骤

### 1. 导入项目
1. 打开 IntelliJ IDEA
2. File -> Open -> 选择 `/Users/pro/Starrier/iShare` 目录
3. 选择 "Open as Project"
4. 等待 Maven 自动导入依赖

### 2. 配置 Lombok 插件
1. File -> Settings (Windows/Linux) 或 Preferences (Mac)
2. 进入 Plugins
3. 搜索 "Lombok"，确保已安装并启用
4. 进入 Build, Execution, Deployment -> Compiler -> Annotation Processors
5. 勾选 "Enable annotation processing"

### 3. 配置 JDK
1. File -> Project Structure (Ctrl+Alt+Shift+S / Cmd+;)
2. Project -> SDK: 选择 Java 17 或更高版本
3. Project -> Language level: 选择 17 或更高

### 4. 运行后端
1. 找到 `src/main/java/org/starrier/ishare/IShareApplication.java`
2. 右键点击文件 -> Run 'IShareApplication.main()'
3. 或者点击类名旁边的绿色运行按钮

### 5. 验证启动
- 查看控制台输出，应该看到：
  ```
  Tomcat started on port 8080 (http) with context path '/api'
  Started IShareApplication in X.XXX seconds
  ```
- 访问 http://localhost:8080/api/swagger-ui.html 查看 API 文档
- 访问 http://localhost:8080/api/articles 测试 API

## Eclipse 设置步骤

### 1. 导入项目
1. File -> Import -> Maven -> Existing Maven Projects
2. 选择 `/Users/pro/Starrier/iShare` 目录
3. 点击 Finish

### 2. 安装 Lombok
1. 下载 lombok.jar: https://projectlombok.org/download
2. 双击运行 lombok.jar
3. 选择 Eclipse 安装目录
4. 重启 Eclipse

### 3. 运行后端
1. 找到 `IShareApplication.java`
2. 右键 -> Run As -> Java Application

## 常见问题

### 问题1: Lombok 注解不生效
- 确保启用了注解处理器
- 重新构建项目 (Build -> Rebuild Project)

### 2. 端口被占用
- 修改 `application.yml` 中的 `server.port`
- 或停止占用 8080 端口的进程

### 3. 数据库连接失败
- 确保 Docker MySQL 容器正在运行
- 检查 `application.yml` 中的数据库配置

## 验证后端是否正常运行

```bash
# 测试 API
curl http://localhost:8080/api/articles

# 查看 Swagger 文档
open http://localhost:8080/api/swagger-ui.html
```
