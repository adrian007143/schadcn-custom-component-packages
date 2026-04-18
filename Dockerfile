FROM node:22-bookworm-slim

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund

COPY . .

# Build the Next.js app image once. The registry JSON files are rebuilt again
# at container startup so Coolify runtime env vars are always applied.
RUN npx next build

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD curl --fail --silent http://127.0.0.1:3000/api/health > /dev/null || exit 1

CMD ["sh", "./scripts/docker-entrypoint.sh"]
