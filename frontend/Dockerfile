FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=https://liox-app-1084795151663.europe-west1.run.app/api
ENV VITE_API_URL=${VITE_API_URL}

RUN VITE_API_URL=${VITE_API_URL} npm run build:ssr

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.ts ./server.ts

EXPOSE 8080

CMD ["npm", "run", "start:ssr"]
