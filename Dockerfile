FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY . .
RUN npm install -g pnpm && pnpm install --force
RUN pnpm run build

FROM node:20-alpine AS proxy-builder
WORKDIR /proxy
COPY shinra-proxy/package*.json ./shinra-proxy/
COPY shinra-proxy/ ./shinra-proxy/
RUN npm install -g pnpm
RUN cd shinra-proxy && pnpm install --force && pnpm run build

FROM nginx:alpine
RUN apk add --no-cache nodejs npm
RUN npm install -g pnpm
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=proxy-builder /proxy/shinra-proxy/dist /app/shinra-proxy/dist
COPY --from=proxy-builder /proxy/shinra-proxy/package*.json /app/shinra-proxy/
COPY --from=proxy-builder /proxy/shinra-proxy/pnpm-lock.yaml /app/shinra-proxy/

WORKDIR /app/shinra-proxy
RUN pnpm install --prod --frozen-lockfile
EXPOSE 80 3000
CMD sh -c "node /app/shinra-proxy/dist/index.js & nginx -g 'daemon off;'"
