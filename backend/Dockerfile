FROM alpine:latest

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH=$JAVA_HOME/bin:$PATH
ENV DB_URL=
ENV DB_USERNAME=
ENV DB_PASSWORD=

RUN apk update && apk add --no-cache \
    openjdk17 \
    maven \
    git \
    bash \
    inotify-tools \
    dos2unix

WORKDIR /backend

COPY .mvn /backend/.mvn
COPY mvnw /backend/mvnw
COPY reload.sh /backend/reload.sh
COPY eclipse-formatter.xml /backend/eclipse-formatter.xml
COPY pom.xml /backend/pom.xml
COPY src /backend/src

RUN chmod +x /backend/mvnw
RUN chmod +x /backend/reload.sh

RUN mvn dependency:resolve
RUN mvn clean install -DskipTests
RUN mvn clean package -DskipTests

ENV PORT=9998
ENV POSTGRES_DB_URL=OVERRIDE_DEFAULT_POSTGRES_DB_URL
ENV POSTGRES_DB=OVERRIDE_DEFAULT_POSTGRES_DB_URL
ENV POSTGRES_USER=OVERRIDE_DEFAULT_POSTGRES_USER
ENV POSTGRES_PASSWORD=OVERRIDE_DEFAULT_POSTGRES_PASSWORD

EXPOSE ${PORT}

# Run the Spring Boot application with DevTools enabled
# CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.profiles=dev", \
#      "-Dspring.devtools.restart.enabled=true", \
#      "-Dspring.devtools.livereload.enabled=true", \
#      "-Dspring.devtools.remote.secret=mysecret"]
CMD ["java", "-jar", "target/tracker-1.0-SNAPSHOT.jar", "--spring.config.location=/backend/src/main/resources/application.yml"]
