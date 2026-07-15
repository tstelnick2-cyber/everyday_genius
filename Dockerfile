FROM node:22-bookworm-slim

RUN corepack enable

WORKDIR /repo

# Workspace descriptors + lib + scripts so pnpm install can resolve the graph
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY lib ./lib
COPY scripts ./scripts

# All artifacts (only api-server is built, but everything is needed for workspace resolution)
COPY artifacts ./artifacts

RUN pnpm install --frozen-lockfile && \
    pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
EXPOSE 8080

WORKDIR /repo/artifacts/api-server
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
