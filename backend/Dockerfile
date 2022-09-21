FROM maven:3.6.0-jdk-11-slim AS build
COPY . /home/app
RUN --mount=type=cache,target=/root/.m2 mvn -f /home/app/pom.xml clean install

FROM openjdk:11-jre-slim
RUN mkdir /static
RUN mkdir /config
COPY --from=build /home/app/rest/target/rest-1.0.0.jar /app.jar
ADD ./rest/src/main/resources/application.yml /config/application.yml
ENTRYPOINT ["java","-jar","/app.jar","--spring.config.location=/config/application.yml"]
