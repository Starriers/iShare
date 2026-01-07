# 故障排查指南

## 500 错误排查步骤

### 1. 检查后端日志
在IDE的控制台中查看错误堆栈信息，常见错误包括：

#### 数据库连接错误
- 错误信息：`Communications link failure` 或 `Access denied`
- 解决：检查 `application.yml` 中的数据库配置
- 确保 Docker MySQL 容器正在运行：`docker ps | grep mysql`

#### MyBatis 映射错误
- 错误信息：`Could not find result map` 或 `Invalid bound statement`
- 解决：检查 `mapper/*.xml` 文件中的 resultType 是否正确
- 确保使用了正确的类型别名（Article, User, Comment）

#### Lombok 相关问题
- 错误信息：`找不到符号: 方法 getXxx()`
- 解决：确保IDE中启用了注解处理器

### 2. 测试数据库连接
```bash
docker exec -i frost-chain-mysql mysql -uroot -p123456 iShare -e "SELECT COUNT(*) FROM article;"
```

### 3. 测试API端点
```bash
# 测试文章列表API
curl http://localhost:8080/api/articles

# 查看详细错误信息
curl -v http://localhost:8080/api/articles
```

### 4. 检查常见问题

#### 问题1: resultType 大小写错误
- ArticleDao.xml 中 `resultType="article"` 应该是 `resultType="Article"`
- 已修复 ✅

#### 问题2: 数据库表不存在
- 运行：`docker exec -i frost-chain-mysql mysql -uroot -p123456 iShare < src/main/resources/database/iShare.sql`

#### 问题3: 端口冲突
- 检查是否有其他服务占用8080端口
- 修改 `application.yml` 中的 `server.port`

### 5. 查看完整错误日志
在IDE控制台中，查找包含以下关键词的错误：
- `Exception`
- `Error`
- `SQLException`
- `NullPointerException`

## 快速修复检查清单

- [ ] Docker MySQL 容器运行中
- [ ] 数据库表已创建
- [ ] application.yml 配置正确
- [ ] MyBatis mapper XML 文件正确
- [ ] Lombok 注解处理器已启用
- [ ] 端口8080未被占用
- [ ] 后端服务已启动（查看IDE控制台）

## 获取帮助

如果问题仍然存在，请提供：
1. IDE控制台中的完整错误堆栈
2. `curl -v http://localhost:8080/api/articles` 的输出
3. 数据库连接测试结果


