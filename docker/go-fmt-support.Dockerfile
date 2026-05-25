FROM node:25-bookworm

ARG GO_FMT_REF=v0.1.1

RUN npm install -g pnpm@10.33.0 \
    && git clone --depth 1 --branch "${GO_FMT_REF}" https://github.com/oullin/go-fmt.git /opt/go-fmt \
    && cd /opt/go-fmt \
    && pnpm install --frozen-lockfile --filter support...

WORKDIR /work
