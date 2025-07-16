FROM node:20.12.2 as base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=base /app/package*.json ./
RUN npm install --omit=dev
COPY --from=base /app/dist ./dist
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["npm run typeorm migration:run && npm run start:prod"]