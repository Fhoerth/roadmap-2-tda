# FROM node:21-alpine as build

# WORKDIR /frontend

# ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
# ENV MODE=production
# ENV NODE_ENV=development

# COPY package.json yarn.lock .
# COPY . .

# RUN npm install -g vite
# RUN npm install -g --force yarn
# RUN yarn --ignore-platform
# RUN yarn build

# FROM nginx:stable-alpine
# COPY --from=build /frontend/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
FROM node:22-alpine as build

WORKDIR /frontend

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV MODE=production
ENV NODE_ENV=development

COPY package.json yarn.lock .yarnrc.yml postinstall.js .
COPY . .

RUN npm install -g --force yarn
RUN yarn global add vite
RUN yarn --ignore-platform
RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "serve", "-s", "dist", "-l", ${PORT}, "--single"]