# Usar una imagen base de Debian
FROM debian:bullseye-slim

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV LEETCODE_SERVICE_COOKIE_DIR=/usr/cookies
ENV LEETCODE_SERVICE_SCREENSHOTS_DIR=/usr/screenshots
ENV LEETCODE_SERVICE_MOCK_DIR=/usr/mocks
ENV LEETCODE_PROFILE_NAME=OVERRIDE_DEFAULT_LEETCODE_PROFILE_NAME
ENV GITHUB_USERNAME=OVERRIDE_DEFAULT_GITHUB_USERNAME
ENV GITHUB_PASSWORD=OVERRIDE_DEFAULT_GITHUB_PASSWORD
ENV GITHUB_TOPT_SECRET=OVERRIDE_DEFAULT_GITHUB_TOPT_SECRET
ENV GITHUB_PROFILE_NAME=OVERRIDE_DEFAULT_GITHUB_PROFILE_NAME
ENV PORT=9994

# Configuración inicial e instalación de dependencias
RUN apt-get update --fix-missing && apt-get install -y \
    wget \
    gnupg \
    build-essential \
    python3 \
    python3-pip \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    chromium \
    bzip2 \
    ffmpeg \
    libasound2 \
    libdbus-glib-1-2 \
    libc6 \
    fonts-liberation \
    libx11-xcb1 \
    x11-apps \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    byzanz \
    libfontconfig1 \
    libgtk-3-0 \
    x11-xserver-utils \
    && rm -rf /var/lib/apt/lists/*

# Crear un alias o renombrar el binario de Chromium a google-chrome
RUN ln -s /usr/bin/chromium /usr/bin/google-chrome \
    && ln -s /usr/bin/chromium /usr/bin/google-chrome-stable

# Configuración adicional (Node.js, Yarn, etc.)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
# Set up the working directory in the container
WORKDIR /leetcode-service

# Copy package.json and package-lock.json to the working directory
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile || pnpm install

# Copy the rest of the application code
COPY . .
RUN npm run build

RUN mkdir -p ${LEETCODE_SERVICE_COOKIE_DIR}
RUN mkdir -p ${LEETCODE_SERVICE_SCREENSHOTS_DIR}
RUN mkdir -p ${LEETCODE_SERVICE_MOCK_DIR}

# Expose the port your app runs on
EXPOSE ${PORT}

CMD ["npm", "run", "start"]
