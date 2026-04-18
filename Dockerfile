FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build the Next.js app image once. The registry JSON files are rebuilt again
# at container startup so Coolify runtime env vars are always applied.
RUN npx next build

EXPOSE 3000

CMD ["sh", "./scripts/docker-entrypoint.sh"]
