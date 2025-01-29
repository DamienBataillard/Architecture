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

### 1️⃣ Cloner le projet

```sh
$ git clone https://github.com/DamienBataillard/Architecture.git
$ cd Architecture
```

### 2️⃣ Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez-y les informations suivantes :

```env
# Configuration de la base de données
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=your_database_port

# Configuration du serveur
PORT=your_server_port

# Clé secrète pour JWT
JWT_SECRET=your_jwt_secret_key

# Clé secrète Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Configuration SMTP pour l'envoi d'e-mails
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_password
SMTP_SECURE=true_or_false
```

### 3️⃣ Installer les dépendances
```sh
$ npm install
```

### 4️⃣ Synchroniser et peupler la base de données
```sh
$ npm run setup-db
```

Ce script crée la base de données si elle n'existe pas, applique les migrations et peuple la base de données avec des données initiales.

### 5️⃣ Lancer le serveur
```sh
$ npm start
```

Le serveur sera accessible à l'adresse **http://localhost:3000** 🎉

---

## 🔄 API Endpoints

### 🛠️ Authentification
| Méthode | Endpoint              | Description                      |
|---------|----------------------|----------------------------------|
| POST    | `/api/auth/register` | Inscription d'un utilisateur    |
| POST    | `/api/auth/login`    | Connexion et génération de JWT  |

### 🏠 Gestion des Propriétés (Agents uniquement)
| Méthode | Endpoint                | Description                          |
|---------|------------------------|--------------------------------------|
| GET     | `/api/properties`      | Liste des propriétés accessibles    |
| POST    | `/api/properties`      | Création d'une nouvelle propriété   |
| PUT     | `/api/properties/:id`  | Mise à jour d'une propriété         |
| DELETE  | `/api/properties/:id`  | Suppression d'une propriété         |

### 💰 Investissements
| Méthode | Endpoint                | Description                        |
|---------|------------------------|------------------------------------|
| POST    | `/api/investments`     | Créer un nouvel investissement    |
| GET     | `/api/investments/:userId` | Liste des investissements d'un utilisateur |

### 🔄 Transactions
| Méthode | Endpoint                | Description                        |
|---------|------------------------|------------------------------------|
| GET     | `/api/transactions/:userId` | Liste des transactions d'un utilisateur |

### 💰 Wallet & Paiements
| Méthode | Endpoint                 | Description                         |
|---------|-------------------------|-------------------------------------|
| GET     | `/api/wallets/`         | Récupérer le solde du portefeuille |
| POST    | `/api/wallets/add-funds` | Ajouter des fonds via Stripe       |

### 💸 Revenus Locatifs & Remboursements
| Méthode | Endpoint                | Description                        |
|---------|------------------------|------------------------------------|
| GET     | `/api/rental-income/:userId` | Voir les revenus locatifs          |
| POST    | `/api/refunds/process`  | Déclencher manuellement les remboursements |

---

## 📩 Configuration SMTP (Envoi d'e-mails)

Si vous utilisez **Gmail**, vous devez générer un **Mot de passe d'application** :
1. Activez la **validation en deux étapes** sur votre compte Google.
2. Générez un **Mot de passe d'application** depuis [Google Account Security](https://myaccount.google.com/security).
3. Utilisez ce mot de passe pour `SMTP_PASS` dans le fichier `.env`.

---

## ❓ Dépannage

### 📌 1. Problèmes de connexion MySQL
- Vérifiez que **MySQL est en cours d'exécution** :
```sh
$ sudo service mysql start  # Linux / Mac
$ net start MySQL  # Windows
```
- Vérifiez que les informations de votre `.env` correspondent à votre configuration MySQL.

### 📌 2. Erreurs de paiement Stripe
- Vérifiez que vous utilisez des **cartes de test Stripe** (ex: `4242 4242 4242 4242`).
- Assurez-vous que `allow_redirects: "never"` est bien configuré.

### 📌 3. Problèmes d'envoi d'e-mails
- Vérifiez que `SMTP_USER` et `SMTP_PASS` sont corrects.
- Utilisez un **Mot de passe d'application** pour Gmail au lieu de votre mot de passe principal.

---

## 🚀 Final Steps
👉 Vérifiez `.env` configuration  
👉 Installez les dépendances avec `npm install`  
👉 Exécutez `npm run setup-db` pour initialiser la base de données  
👉 Démarrez le serveur avec `npm start`  

Profitez du développement de votre **plateforme d'investissement immobilier !** 🚀

