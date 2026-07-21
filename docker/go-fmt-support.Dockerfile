FROM node:25-bookworm

# Immutable target of v0.1.1.
ARG GO_FMT_REF=39e504734d135cc514128ba7283435ba129c0a66

RUN npm install -g pnpm@10.33.0 \
    && git init /opt/go-fmt \
    && cd /opt/go-fmt \
    && git remote add origin https://github.com/oullin/go-fmt.git \
    && git fetch --depth 1 origin "${GO_FMT_REF}" \
    && git checkout --detach FETCH_HEAD \
    && pnpm install --frozen-lockfile --filter support...

WORKDIR /work
