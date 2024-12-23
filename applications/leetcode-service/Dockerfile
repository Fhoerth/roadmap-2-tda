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
ENV DISPLAY=
ENV WAYLAND_DISPLAY=
ENV HOST_OSTYPE=

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libx11-6 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Dependencies needed by nodejs project.
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Alias to /usr/bin/google-chrome
RUN ln -s /usr/bin/chromium /usr/bin/google-chrome \
    && ln -s /usr/bin/chromium /usr/bin/google-chrome-stable

# Additional configuration (Node.js, Yarn, etc.)
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

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile || pnpm install

COPY . .
RUN npm run build

RUN mkdir -p ${LEETCODE_SERVICE_COOKIE_DIR}
RUN mkdir -p ${LEETCODE_SERVICE_SCREENSHOTS_DIR}
RUN mkdir -p ${LEETCODE_SERVICE_MOCK_DIR}

EXPOSE ${PORT}

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]