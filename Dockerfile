# Stage 1: Build stage
FROM node:lts-alpine AS build

# Install PNPM
RUN npm install -g pnpm

# Workdir
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package.json dan package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy
COPY . .

# Build
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL pnpm build

# Stage 2: Production stage
FROM nginx:alpine

# Install tzdata timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
    && echo "Asia/Jakarta" > /etc/timezone

# Set ENV timezone (optional)
ENV TZ=Asia/Jakarta

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Salin hasil build 
COPY --from=build /app/dist /usr/share/nginx/html

#salin config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 
EXPOSE 80

# Run
CMD ["nginx", "-g", "daemon off;"]