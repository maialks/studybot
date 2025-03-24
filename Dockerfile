# Estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Estágio final
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/  
# Copia explicitamente a pasta src

EXPOSE 3000
CMD ["node", "src/index.js"]  
# Caminho relativo correto