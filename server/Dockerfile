#FROM openjdk:latest as buildstage
#WORKDIR /app
#COPY mvnw .
#COPY .mvn .mvn
#COPY pom.xml .
#COPY src src
#RUN ./mvnw package
#COPY target/*.jar app.jar
#
#FROM openjdk:latest
#COPY --from=buildstage /app/app.jar .
#ENTRYPOINT ["java", "-jar", "app.jar"]
FROM openjdk:latest as build
# Set the current working directory inside the image
WORKDIR /app

# Copy maven executable to the image
COPY target/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

