FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Skip test compilation because legacy tests rely on old JUnit/PowerMock stack.
RUN mvn -B clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]