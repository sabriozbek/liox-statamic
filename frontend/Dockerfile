FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=https://liox-app-1084795151663.europe-west1.run.app/api
ENV VITE_API_URL=${VITE_API_URL}

RUN VITE_API_URL=${VITE_API_URL} npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
'server {' \
'    listen 8080;' \
'    server_name _;' \
'' \
'    root /usr/share/nginx/html;' \
'    index index.html;' \
'' \
'    location = /cp {' \
'        return 302 https://liox-app-1084795151663.europe-west1.run.app/cp;' \
'    }' \
'' \
'    location ^~ /cp/ {' \
'        return 302 https://liox-app-1084795151663.europe-west1.run.app$request_uri;' \
'    }' \
'' \
'    location / {' \
'        try_files $uri /index.html;' \
'    }' \
'}' \
> /etc/nginx/conf.d/default.conf

EXPOSE 8080
