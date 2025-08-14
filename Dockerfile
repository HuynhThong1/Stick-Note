# Multi-stage Dockerfile for NestJS (TypeScript) app
# 1) Builder: install deps and compile TS -> JS in /app/dist
# 2) Runner: copy minimal runtime and start

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --ignore-scripts

# Copy sources and build
COPY tsconfig.json ./
COPY src ./src
COPY index.html ./index.html
RUN npm run build

# -- Runtime stage --
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy what we need to run
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY index.html ./index.html

# Default port used by NestJS
ENV PORT=3000
EXPOSE 3000

# If your Nest app reads PORT, ensure it binds to 0.0.0.0
CMD ["node", "dist/main.js"]
