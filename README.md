# 🚀 NexusGrowth CRM v3.0

CRM intelligent avec IA générative pour la gestion de leads, pipeline de ventes et génération automatique de devis.

**Propulsé par Supabase** 🔥

## ✨ Nouvelles Fonctionnalités v3.0

### 🔥 Architecture Supabase (Backend-as-a-Service)
- ✅ **PostgreSQL** avec Row Level Security (RLS)
- ✅ **Supabase Auth** pour l'authentification sécurisée
- ✅ **Edge Functions** (Deno) pour l'API Gemini
- ✅ **Déploiement simplifié** - Plus besoin de gérer un backend Node.js !

### 🔐 Sécurité
- ✅ **Row Level Security (RLS)** - Isolation complète des données utilisateur
- ✅ **Authentification Supabase** - JWT automatique, sessions persistantes
- ✅ **API Gemini protégée** dans une Edge Function serveur
- ✅ **Secrets sécurisés** via Supabase Vault

### 💾 Persistance
- ✅ **Base de données PostgreSQL** hébergée par Supabase
- ✅ **Tous vos leads, tâches et devis** sauvegardés en temps réel
- ✅ **Synchronisation automatique** avec la base de données
- ✅ **Données JSONB** pour les analytics GA4

### 🎨 Améliorations UX
- ✅ **Système de notifications Toast** élégant
- ✅ **Gestion d'erreurs améliorée** avec feedback utilisateur
- ✅ **Validation des formulaires**
- ✅ **Types TypeScript strictement typés**

## 📋 Prérequis

- Node.js 18+ installé
- Un compte Supabase gratuit - [Créer un compte](https://supabase.com)
- Clé API Gemini (Google AI Studio) - [Obtenir une clé](https://aistudio.google.com/app/apikey)

## 🛠️ Installation & Configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Supabase

**📖 Consultez le guide complet : [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)**

Le guide vous explique étape par étape :
1. Comment créer votre projet Supabase
2. Comment créer les tables (leads, tasks, quotes)
3. Comment déployer l'Edge Function Gemini AI
4. Comment configurer vos variables d'environnement
5. Comment tester en local et déployer sur Vercel

### 3. Configuration locale (.env)

Créez un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Éditez `.env` avec vos clés Supabase (obtenues à l'étape 2) :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Démarrage

### Démarrer le frontend en local

```bash
npm run dev
```

L'application démarre sur http://localhost:3000

**Note:** Avec Supabase, vous n'avez pas besoin de démarrer un backend local ! 🎉

## 🔑 Première utilisation

### Créer un compte

1. Ouvrez http://localhost:3000
2. Cliquez sur **"Inscription"**
3. Remplissez le formulaire :
   - Prénom & Nom
   - Email
   - Mot de passe (minimum 6 caractères)
4. Connectez-vous avec vos identifiants

**Note:** L'authentification est gérée par Supabase Auth. Aucun compte par défaut n'existe.

## 🏗️ Architecture

```
nexuscrm/
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_initial_schema.sql  # Schéma PostgreSQL avec RLS
│   └── functions/
│       └── gemini-ai/
│           └── index.ts                       # Edge Function (Deno)
├── components/              # Composants React
│   ├── LoginPage.tsx       # Auth Supabase
│   ├── Toast.tsx           # Notifications
│   ├── Dashboard.tsx
│   ├── Pipeline.tsx
│   ├── LeadDetail.tsx
│   └── ...
├── lib/
│   └── supabase.ts         # Client Supabase initialisé
├── services/
│   └── supabase-api.ts     # API wrapper (leads, tasks, quotes, AI)
├── App.tsx                 # Application principale
└── types.ts                # Types TypeScript
```

### Flux de données

1. **Frontend** (React + TypeScript) → `services/supabase-api.ts`
2. **Supabase Client** (`lib/supabase.ts`) → Communication avec Supabase
3. **Supabase Backend** :
   - **Supabase Auth** → Gestion des utilisateurs et sessions JWT
   - **PostgreSQL** → Stockage des leads, tasks, quotes (avec RLS)
   - **Edge Function** → Appels API Gemini sécurisés

## 🔧 Technologies

### Backend (Supabase)
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security (RLS)** - Isolation des données utilisateur
- **Supabase Auth** - Authentification JWT automatique
- **Edge Functions (Deno)** - API serverless pour Gemini
- **Supabase Realtime** - Synchronisation temps réel (optionnel)

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **@supabase/supabase-js** - Client Supabase

## 📚 Structure des données (PostgreSQL)

### Table `leads`
```sql
- id (UUID)
- user_id (UUID) → auth.users
- first_name, last_name, email, phone
- company, position
- status, value, channel, score
- ga_data (JSONB) → Données Google Analytics
- interactions (JSONB) → Historique des interactions
- created_at, updated_at
```

### Table `tasks`
```sql
- id (UUID)
- user_id (UUID) → auth.users
- title, type, date, time
- completed, priority
- description, amount
- created_at
```

### Table `quotes`
```sql
- id (UUID)
- user_id (UUID) → auth.users
- lead_id (UUID) → leads
- date, status, total_amount
- items (JSONB) → Lignes de devis
- created_at, updated_at
```

## 🚀 Edge Function API

### POST `/gemini-ai`

Actions disponibles :

#### 1. Analyser un lead
```json
{
  "action": "analyze-lead",
  "lead": { /* données du lead */ }
}
```

Retourne : `{ score, summary, nextAction, dealProbability }`

#### 2. Générer un email
```json
{
  "action": "generate-email",
  "lead": { /* données du lead */ }
}
```

Retourne : `{ emailDraft }`

#### 3. Générer un devis
```json
{
  "action": "generate-quote",
  "lead": { /* données du lead */ }
}
```

Retourne : `{ items: [{ description, quantity, unitPrice, total }] }`

## 🚀 Déploiement en Production

### Option : Vercel + Supabase (Recommandé)

**📖 Consultez le guide complet : [SUPABASE-SETUP.md](./SUPABASE-SETUP.md#-étape-7--déployer-sur-vercel)**

**Résumé rapide :**

1. Créez un projet Supabase et configurez la base de données
2. Déployez l'Edge Function `gemini-ai`
3. Pushez votre code sur GitHub
4. Connectez votre repo à Vercel
5. Ajoutez les variables d'environnement :
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Déployez 🎉

**Avantages :**
- ✅ Gratuit pour commencer (plan Supabase Free + Vercel Hobby)
- ✅ Base de données PostgreSQL avec 500 MB
- ✅ 500K requêtes Edge Function / mois
- ✅ Authentification et stockage inclus
- ✅ Mise à l'échelle automatique

## 🐛 Évolution du projet

### v1.0 - Problèmes identifiés
- ❌ Clé API Gemini exposée dans le frontend
- ❌ Fausse authentification (pas de backend)
- ❌ Données perdues au refresh (pas de persistance)
- ❌ `alert()` natif pour les erreurs
- ❌ Types `any` partout en TypeScript

### v2.0 - Backend Node.js/Express + SQLite
- ✅ Backend Node.js avec Express
- ✅ Authentification JWT + bcrypt
- ✅ Persistance SQLite
- ✅ Système Toast élégant
- ✅ Types TypeScript stricts
- ⚠️ Déploiement complexe (2 services séparés)

### v3.0 - Migration Supabase (Actuel) ⭐
- ✅ **Architecture simplifiée** avec Supabase BaaS
- ✅ **PostgreSQL** au lieu de SQLite
- ✅ **Row Level Security (RLS)** pour l'isolation des données
- ✅ **Supabase Auth** au lieu de JWT manuel
- ✅ **Edge Functions** au lieu de backend Express
- ✅ **Déploiement simplifié** : 1 seul service frontend
- ✅ **Gratuit** pour commencer (plan Supabase Free)
- ✅ **Scalable** automatiquement

## 📝 Licence

MIT

## 👨‍💻 Développé avec ❤️

NexusGrowth Team - CRM Intelligence Platform

---

**🔥 Propulsé par Supabase, React 19 et Gemini AI**
# Force rebuild Fri Dec 19 03:30:03 UTC 2025
