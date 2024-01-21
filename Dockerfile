# Imagen base de Node.js con TypeScript
FROM node:20.11-alpine

RUN npm install -g ts-node
# Crear un directorio para la aplicación
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Copiar los archivos fuente del proyecto
COPY . .

# Instalar las dependencias del proyecto
RUN npm install

# Compilar el proyecto TypeScript
RUN npm run build

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
