# Étape 1 : Build de l'application Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Build en mode production
RUN npm run build -- --configuration production

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés
# Avec le nouveau builder Angular, les fichiers sont dans dist/avion-client/browser
COPY --from=build /app/dist/avion-client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
