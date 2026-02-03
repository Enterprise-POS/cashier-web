# Dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Copy only dependency files (cached unless dependencies change)
# Always make sure to run 'npm run build' locally before go to docker
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Builder
FROM node:22-slim AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build with optimizations
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files for standalone mode
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# # Security: Run as non-root user
# RUN addgroup --system --gid 1001 nodejs && \
#     adduser --system --uid 1001 nextjs && \
#     chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
