FROM node:22-bookworm-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    HOSTNAME=0.0.0.0 \
    PORT=8080

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 8080

CMD ["node", "server.js"]
