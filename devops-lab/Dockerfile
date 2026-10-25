FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js ./
COPY src/ ./src/
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 ENABLE_DRILLS=false
WORKDIR /app
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node server/ ./server/
COPY --chown=node:node scripts/healthcheck.mjs ./scripts/healthcheck.mjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=4s --start-period=10s --retries=3 CMD ["node", "scripts/healthcheck.mjs"]
CMD ["node", "server/index.mjs"]
