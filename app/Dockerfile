# syntax=docker/dockerfile:1
# Multi-stage build: compile the Vite SPA, then serve dist/ with nginx.
#
# Build from the app/ directory (this folder is the build context):
#   docker build -t resetrix-app \
#     --build-arg VITE_API_URL=https://api.example.com \
#     --build-arg VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com \
#     --build-arg VITE_AUTH0_CLIENT_ID=... \
#     --build-arg VITE_AUTH0_AUDIENCE=https://api.resetrix.com \
#     .

FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Vite inlines these at build time; CI/deploy must pass them as --build-arg.
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ENV VITE_API_URL=$VITE_API_URL \
	VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
	VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
	VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE

RUN pnpm build

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
