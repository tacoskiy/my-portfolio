FROM node:20-alpine

# Create workspace
WORKDIR /workspace

# Prevent accidental root usage
RUN addgroup -S nodegroup && adduser -S node -G nodegroup

# Ensure npm is default
RUN npm config set fund false \
  && npm config set audit false

# Install basic tools
RUN apk add --no-cache bash git

USER node

EXPOSE 4321