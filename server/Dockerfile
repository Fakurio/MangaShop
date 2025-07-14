FROM node:20.12.2 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["npm run typeorm migration:run && npm run start:prod"]