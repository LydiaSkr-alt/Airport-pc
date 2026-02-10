# Projet Airport

## Prérequis
[Lancer localement]
Avant de lancer le projet, assurez-vous d'avoir installé et configuré :

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Maven](https://maven.apache.org/)
- [Node.js et npm](https://nodejs.org/)

---

## 1. Démarrer Docker
- Ouvrir Docker Desktop et s'assurer qu'il est en fonctionnement.

---

## 2. Lancer les services avec Docker Compose et le backend 
Dans le terminal à la racine du projet, exécuter :
```bash
docker compose up --build -d 
```

---

## 3. Configurer la base de données dans IntelliJ
1. Aller dans **Database** → **Create Data Source** → **PostgreSQL**  
2. Renseigner les paramètres suivants :
   - **Name** : `airport@localhost`  
   - **User** : `postgres`  
   - **Password** : `exemple`  
   - **URL** : `jdbc:postgresql://localhost:5433/airport`  
3. Cliquer sur **Test Connection** (doit être OK)  
4. Cliquer sur **Apply**, puis **OK**

> ⚠️ La base de données est vide. Il faudra ajouter des avions, pistes et hangars depuis l’interface web.

---

## 4. Lancer le client Angular
1. Ouvrir un nouveau terminal du projet et aller dans le répertoire du client :
```bash
cd client/avion-client
```
2. Installer les dépendances :
```bash
npm install
```
3. Lancer l’application :
```bash
npm start
```

---

## 5. Accéder à l’application
- Ouvrir un navigateur et aller sur : [http://localhost:4200/](http://localhost:4200/)

---

## 6. Accées à l'application a distance 
- Se connecter au VPN de l'UGA 
- http://129.88.210.207/
- Pour le SSE (si besoin de visualiser le JSON) :  http://129.88.210.207/api/reactive/operations/stream
---
## Notes
- Pour tester le back sur postman on a mis à votre disposition des fichiers de test qui se trouve au niveau : docs --> postman
- Dans l’onglet Vols, le bouton Voir vols partenaires est inopérant en raison d’un problème d’adresses IP côté partenaires.
- À 19h10 le 18 janvier, aucune adresse IP n’avait encore été communiquée.
  

