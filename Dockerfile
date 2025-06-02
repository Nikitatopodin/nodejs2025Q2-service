FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /root/.npm

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/main.js"]