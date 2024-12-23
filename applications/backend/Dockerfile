FROM alpine:latest

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH=$JAVA_HOME/bin:$PATH

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

ENV PORT=9998
ENV MONGO_DB=OVERRIDE_DEFAULT_MONGO_DB
ENV MONGO_DB_USER=OVERRIDE_DEFAULT_MONGO_DB_USER
ENV MONGO_DB_PASSWORD=OVERRIDE_DEFAULT_MONGO_DB_PASSWORD
ENV MONGO_DB_URL=OVERRIDE_DEFAULT_MONGO_DB_URL
ENV FRONTEND_URL=OVERRIDE_DEFAULT_FRONTEND_URL
ENV LEETCODE_SERVICE_API_URL=OVERRIDE_DEFAULT_LEETCODE_SERVICE_API_URL
ENV BACKEND_MASTER_KEY=OVERRIDE_DEFAULT_BACKEND_MASTER_KEY
ENV BACKEND_AUTH_REGISTRATION_KEY=OVERRIDE_DEFAULT_BACKEND_AUTH_REGISTRATION_KEY

RUN mvn dependency:resolve
RUN mvn clean install -DskipTests
RUN mvn clean package -DskipTests

EXPOSE ${PORT}

CMD ["java", "-jar", "target/tracker-1.0-SNAPSHOT.jar", "--spring.config.location=/backend/src/main/resources/application.yml"]
