# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /src
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV NODE_OPTIONS=--max_old_space_size=8192

COPY package*.json ./
RUN npm install

FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

