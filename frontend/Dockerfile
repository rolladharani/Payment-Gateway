# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm config set fetch-retries 5 \
#  && npm config set fetch-retry-mintimeout 20000 \
#  && npm config set fetch-retry-maxtimeout 120000 \
#  && npm install --legacy-peer-deps --no-audit --no-fund



# COPY . .

# RUN npm run build

# # serve build with nginx
# FROM nginx:alpine
# COPY --from=0 /app/build /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
