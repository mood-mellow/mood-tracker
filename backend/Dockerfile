# Build
FROM gradle:jdk21 AS build
WORKDIR /app
COPY backend/build.gradle ./
COPY backend/src ./src
RUN gradle bootJar --no-daemon

# Run
FROM eclipse-temurin:21 AS runtime
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
