FROM oven/bun:latest
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY src/ ./src/
RUN bun run build

USER bun
EXPOSE 8100/tcp
ENTRYPOINT [ "./server" ]
