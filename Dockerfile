# syntax=docker/dockerfile:1

FROM node:21.1.0
COPY ["package.json", "package-lock.json*", "tsconfig.json", "/app/"]


WORKDIR /app
COPY src/ /app/src/
COPY config /app/config/
RUN MKDIR -p /app/out
RUN npm install\
        && npm install typescript -g
RUN tsc
