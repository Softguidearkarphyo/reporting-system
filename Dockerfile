FROM node:22-alpine AS build-stage
WORKDIR /src
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV NODE_OPTIONS=--max_old_space_size=8192

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS production-stage
WORKDIR /src

RUN npm install serve

COPY --from=build-stage /src/dist ./dist

EXPOSE 5173
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
