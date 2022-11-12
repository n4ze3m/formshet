FROM node:18-slim as build
WORKDIR /app

RUN apt update
RUN npm --no-update-notifier --no-fund --global install pnpm@7.14.2

COPY . .

RUN pnpm install

RUN pnpm build

FROM node:18-slim
WORKDIR /app

RUN apt update && apt -y install --no-install-recommends ca-certificates git git-lfs openssh-client curl jq cmake sqlite3 openssl psmisc python3
RUN apt-get clean autoclean && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN npm --no-update-notifier --no-fund --global install pnpm@7.14.2
# Copy API
COPY --from=build /app/app/api/build/ .
COPY --from=build /app/app/api/prisma/ ./prisma
COPY --from=build /app/app/api/package.json .
# Copy UI
COPY --from=build /app/app/ui/dist/ ./public

RUN pnpm install -p

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "start"]