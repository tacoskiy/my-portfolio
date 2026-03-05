FROM node:20-bookworm

WORKDIR /workspace

RUN apt-get update && apt-get install -y \
  bash \
  git \
  && rm -rf /var/lib/apt/lists/*