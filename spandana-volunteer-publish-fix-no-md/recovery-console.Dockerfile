FROM node:20-alpine
RUN apk add --no-cache docker-cli docker-cli-compose mongodb-tools git
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install --omit=dev
COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY docs/ ./docs/
RUN mkdir -p backend/data backend/uploads backups
EXPOSE 5051
CMD ["node", "scripts/recovery/recovery-console.mjs"]
