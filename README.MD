# Property Investment Management API

## Description

Cette API gère un système d'investissement immobilier. Elle permet aux agents de gérer des propriétés et aux investisseurs de consulter et d'investir dans des propriétés. Les principales fonctionnalités incluent :
- Gestion des propriétés par les agents (création, mise à jour, suppression).
- Gestion des investissements par les utilisateurs.
- Visualisation du portefeuille (liste des investissements d'un utilisateur).
- Gestion des revenus locatifs et des transactions.

---

## Fonctionnalités

- **Authentification avec JWT** :
  - Connexion pour les agents et les investisseurs.
  - Gestion des rôles pour sécuriser les endpoints.

- **Gestion des propriétés** :
  - Agents peuvent ajouter, modifier et supprimer des propriétés.
  - Investisseurs peuvent consulter uniquement les propriétés ouvertes.

- **Portefeuille utilisateur** :
  - Liste des investissements de l'utilisateur.
  - Détails des parts détenues dans chaque propriété.

- **Transactions financières** :
  - Gestion des dépôts, retraits et remboursements.

---

## Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Node.js](https://nodejs.org/) (v14 ou supérieur)
- [MySQL](https://www.mysql.com/)

---

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/DamienBataillard/Architecturegit
   cd Architecture
    ```
2. Installez les dépendances :
    ```bash
    npm install
    ```
3. Configurez les variables d'environnement : Créez un fichier .env à la racine du projet avec les informations suivantes :
    ```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=mot_de_passe
    DB_NAME=nom_de_la_base
    JWT_SECRET=your_secret_key
    PORT=3000
    ```
4. Synchronisez la base de données :
    ```bash
    npm run db:sync
    ```
5. Lancez le serveur :    
    ```bash
    npm start
    ```
Le serveur sera accessible à l'adresse http://localhost:3000.

6. Importer la collection Postman :
    Téléchargez la collection Postman depuis ce dépôt : postman/my-collection.json.
    Ouvrez Postman.
    Cliquez sur Import en haut à gauche.
    Sélectionnez le fichier .json téléchargé.
    La collection sera ajoutée à votre espace Postman.

7. API Endpoints
    Authentification
    Méthode	Endpoint	Description
    POST	/api/auth/login	Connexion et génération de JWT.
    Propriétés
    Méthode	Endpoint	Description
    GET	/api/properties	Liste des propriétés accessibles.
    POST	/api/properties	Création d'une nouvelle propriété (agent).
    PUT	/api/properties/:id	Mise à jour d'une propriété (agent).
    DELETE	/api/properties/:id	Suppression d'une propriété (agent).
    Investissements
    Méthode	Endpoint	Description
    POST	/api/investments	Créer un nouvel investissement.
    GET	/api/investments/:userId	Liste des investissements d'un utilisateur.
    Transactions
    Méthode	Endpoint	Description
    GET	/api/transactions/:userId	Liste des transactions d'un utilisateur.
    Contribution
