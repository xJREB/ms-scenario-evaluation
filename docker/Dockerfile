# Docker image for both components that pulls from the GitHub repo

####################################################################
# Node Builder
####################################################################
FROM node:10 as nodeBuilder
WORKDIR /app

# Clone the web UI repo
RUN git clone https://github.com/xJREB/ms-scenario-evaluation.git

# Build API
RUN cd ms-scenario-evaluation/api && npm i --no-progress && npm run build

# Build frontend
RUN cd ms-scenario-evaluation/frontend && npm i --no-progress && npm run build


####################################################################
# Final Image
####################################################################
FROM node:10-alpine
WORKDIR /app

# Update repositories
RUN apk update

# Install nginx
RUN apk add nginx
RUN mkdir -p /run/nginx
RUN mkdir -p /usr/html/*
COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy API to image workdir
COPY --from=nodeBuilder /app/ms-scenario-evaluation/api/node_modules/ /app/node_modules
COPY --from=nodeBuilder /app/ms-scenario-evaluation/api/dist/ /app/api

# Copy web UI to nginx html dir
COPY --from=nodeBuilder /app/ms-scenario-evaluation/frontend/dist/ /usr/share/nginx/html

# Start command with web server and Node.js API
CMD nginx && node /app/api/index.js
