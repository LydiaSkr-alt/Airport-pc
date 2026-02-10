# Étape 1 : Build multi-modules
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

# Copier tout le projet
COPY . .

# Build le module server et ses dépendances
RUN mvn clean install -DskipTests -pl server -am
# Étape 2 : Image finale
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copier le JAR du module server
COPY --from=build /build/server/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]