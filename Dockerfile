FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Type check — fails the build if there are any TS errors
RUN pnpm tsc --noEmit

EXPOSE 5173

CMD ["pnpm", "dev", "--", "--host", "0.0.0.0"]
