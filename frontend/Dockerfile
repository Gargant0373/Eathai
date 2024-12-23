# Frontend Dockerfile
FROM node:16 AS builder

WORKDIR /app
COPY ./frontend /app

# Install dependencies and build the app
RUN npm install && npm run build

# Final stage: Minimal image to store build artifacts
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/dist /app
