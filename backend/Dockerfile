FROM maven:3.8.5-openjdk-8 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM openjdk:8-jdk-slim

WORKDIR /app

COPY --from=build /app/target/bike-parts-api-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java","-jar","bike-parts-api-0.0.1-SNAPSHOT.jar"]