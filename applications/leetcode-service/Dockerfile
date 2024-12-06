# Usar una imagen base de Debian
FROM debian:bullseye-slim

# Configuración inicial e instalación de dependencias
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Crear un alias o renombrar el binario de Chromium a google-chrome
RUN ln -s /usr/bin/chromium /usr/bin/google-chrome \
    && ln -s /usr/bin/chromium /usr/bin/google-chrome-stable

# Verificar la instalación
RUN google-chrome --version

# Configuración adicional (Node.js, Yarn, etc.)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# Actualizar la lista de paquetes e instalar Xvfb
RUN apt-get update && apt-get install -y \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./

RUN npm install -g --force yarn
RUN npm install i

ENV UNAME=OVERRIDE_DEFAULT_UNAME
ENV PWORD=OVERRIDE_DEFAULT_PWORD

# Copy the rest of the application code
COPY . .
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "login-flow"]
