# 🚀 NexusGrowth CRM v2.0

CRM intelligent avec IA générative pour la gestion de leads, pipeline de ventes et génération automatique de devis.

## ✨ Nouvelles Fonctionnalités v2.0

### 🔐 Sécurité
- ✅ **Authentification JWT sécurisée** (fini les faux logins !)
- ✅ **API Gemini protégée côté serveur** (clé API cachée)
- ✅ **Sessions persistantes** avec tokens

### 💾 Persistance
- ✅ **Base de données SQLite** pour sauvegarder vos données
- ✅ **Tous vos leads, tâches et devis sont conservés**
- ✅ **Synchronisation automatique** avec le backend

### 🎨 Améliorations UX
- ✅ **Système de notifications Toast** élégant
- ✅ **Gestion d'erreurs améliorée** avec feedback utilisateur
- ✅ **Validation des formulaires**
- ✅ **Types TypeScript strictement typés**

## 📋 Prérequis

- Node.js 18+ installé
- Clé API Gemini (Google AI Studio) - [Obtenir une clé](https://aistudio.google.com/app/apikey)

## 🛠️ Installation

### 1. Installer les dépendances du backend

```bash
cd backend
npm install
```

### 2. Installer les dépendances du frontend

```bash
cd ..  # Retour à la racine
npm install
```

### 3. Configuration

#### Backend (.env)

Créez un fichier `backend/.env` :

```bash
cp backend/.env.example backend/.env
```

Éditez `backend/.env` et ajoutez votre clé API :

```env
GEMINI_API_KEY=votre_clé_api_ici
JWT_SECRET=changez_ce_secret_en_production
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@nexuscrm.com
ADMIN_PASSWORD=admin123
```

#### Frontend (.env)

Créez un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Le contenu devrait être :

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage

### Démarrer le backend (Terminal 1)

```bash
cd backend
npm run dev
```

Le backend démarre sur http://localhost:5000

### Démarrer le frontend (Terminal 2)

```bash
npm run dev
```

Le frontend démarre sur http://localhost:3000

## 🔑 Connexion

### Compte administrateur par défaut

- **Email:** `admin@nexuscrm.com`
- **Mot de passe:** `admin123`

⚠️ **Changez ce mot de passe en production !**

### Créer un nouveau compte

Cliquez sur "Inscription" sur la page de connexion.

## 🏗️ Architecture

```
nexuscrm/
├── backend/              # API Node.js/Express
│   ├── routes/          # Routes API (auth, leads, tasks, quotes, ai)
│   ├── middleware/      # Middleware d'authentification
│   ├── services/        # Database, Gemini AI
│   ├── data/           # Base de données SQLite
│   └── server.js       # Point d'entrée
├── components/          # Composants React
│   ├── LoginPage.tsx   # Page de connexion sécurisée
│   ├── Toast.tsx       # Système de notifications
│   ├── Dashboard.tsx
│   ├── Pipeline.tsx
│   ├── LeadDetail.tsx
│   └── ...
├── services/           # Services frontend
│   └── api.ts         # Client API avec authentification
├── App.tsx            # Application principale
└── types.ts           # Types TypeScript
```

## 🔧 Technologies

### Backend
- **Express.js** - Framework web
- **better-sqlite3** - Base de données
- **jsonwebtoken** - Authentification JWT
- **bcryptjs** - Chiffrement des mots de passe
- **@google/genai** - API Gemini (IA)

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur

### Leads
- `GET /api/leads` - Liste des leads
- `POST /api/leads` - Créer un lead
- `PUT /api/leads/:id` - Modifier un lead
- `PATCH /api/leads/:id/status` - Changer le statut
- `DELETE /api/leads/:id` - Supprimer un lead

### Tâches
- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `PATCH /api/tasks/:id/toggle` - Marquer comme fait/à faire
- `DELETE /api/tasks/:id` - Supprimer

### Devis
- `GET /api/quotes` - Tous les devis
- `GET /api/quotes/lead/:leadId` - Devis d'un lead
- `POST /api/quotes` - Créer un devis

### IA (Gemini)
- `POST /api/ai/analyze-lead` - Analyser un lead
- `POST /api/ai/generate-email` - Générer un email
- `POST /api/ai/generate-quote` - Générer un devis

## 🐛 Problèmes corrigés

- ❌ Clé API Gemini exposée → ✅ Sécurisée côté serveur
- ❌ Fausse authentification → ✅ JWT avec bcrypt
- ❌ Données perdues au refresh → ✅ Persistance SQLite
- ❌ `alert()` natif → ✅ Système Toast élégant
- ❌ Types `any` partout → ✅ Types stricts
- ❌ Erreurs silencieuses → ✅ Feedback utilisateur

## 📝 Licence

MIT

## 👨‍💻 Développé avec ❤️

NexusGrowth Team - CRM Intelligence Platform
