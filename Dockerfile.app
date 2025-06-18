FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN npm install --legacy-peer-deps --omit=dev
COPY . .

FROM node:22-alpine AS dev
WORKDIR /app

COPY --from=builder /app ./
RUN npm install --legacy-peer-deps --omit=dev

# install required for file watching
RUN npm install -g nodemon 
EXPOSE 4000
CMD ["nodemon", "--watch", "src", "--ext", "ts", "--legacy-watch", "--exec", "npx nest start --watch"]