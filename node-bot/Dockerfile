
FROM node:22-alpine AS builder
WORKDIR /build
RUN npm install -g bun
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production
COPY --link . .

FROM node:22-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /build /usr/src/app
ENTRYPOINT [ "node", "." ]