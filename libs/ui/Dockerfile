# Etapa de construcción
FROM node:latest as builder

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM node:latest

# Configura el directorio de trabajo
WORKDIR /app

# Copia los artefactos de construcción desde la etapa de construcción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expone el puerto (por defecto Next.js usa el 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
