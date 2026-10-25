# STAGE 1: Build & Compile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Accept the API key as a build argument and set it as an env variable for the build step
ARG OPENWEATHER_API_KEY="RUNTIME_PLACEHOLDER"
ENV OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY

RUN npm run build


# STAGE 2: Lean Production Runner
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321

# Pass the API key runtime variable or keep it in the runner if needed
ARG OPENWEATHER_API_KEY
ENV OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:4321/api/health || exit 1

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]


