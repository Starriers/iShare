#!/bin/bash

# 启动后端服务脚本
# 如果Maven编译有问题，建议在IDE中运行

echo "正在启动后端服务..."

# 检查Java版本
JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
echo "Java版本: $JAVA_VERSION"

# 尝试使用Maven运行
cd "$(dirname "$0")"
mvn spring-boot:run -DskipTests -s /tmp/maven-settings.xml

echo ""
echo "如果启动失败，请："
echo "1. 在IDE（IntelliJ IDEA/Eclipse）中打开项目"
echo "2. 确保安装了Lombok插件"
echo "3. 运行 IShareApplication.main() 方法"
echo "4. 或者使用: java -jar target/ishare-2.0.jar (需要先编译成功)"
