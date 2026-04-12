# ── Stage 1 : build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Installer toutes les dépendances (y compris devDependencies pour tsc)
COPY package*.json ./
RUN npm ci

# Copier les sources et compiler TypeScript → dist/
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Stage 2 : production ──────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Installer uniquement les dépendances de production
COPY package*.json ./
RUN npm ci --omit=dev

# Copier uniquement le code compilé depuis le stage précédent
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
