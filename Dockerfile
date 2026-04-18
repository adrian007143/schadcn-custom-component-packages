FROM node:22-bookworm-slim

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund

COPY . .

# Build the Next.js app image once. The registry JSON files are rebuilt again
# at container startup so Coolify runtime env vars are always applied.
RUN npx next build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "./scripts/docker-entrypoint.sh"]
