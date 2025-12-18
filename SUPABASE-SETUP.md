# 🚀 Configuration Supabase - Guide Complet

Ce guide vous explique comment configurer Supabase pour votre CRM NexusGrowth.

## 📋 Prérequis

- Un compte Supabase ([créer gratuitement](https://supabase.com))
- Une clé API Gemini ([obtenir ici](https://aistudio.google.com/app/apikey))

---

## 🎯 Étape 1 : Créer un projet Supabase

1. **Allez sur [https://supabase.com](https://supabase.com)** et connectez-vous

2. **Créez un nouveau projet** :
   - Cliquez sur **"New Project"**
   - Nom : `nexuscrm` (ou votre choix)
   - Base de données : Choisissez un mot de passe sécurisé
   - Région : Choisissez **Europe West (Paris)** ou proche de vous
   - Plan : **Free** (gratuit)

3. **Attendez** 2-3 minutes que le projet soit créé

---

## 🗄️ Étape 2 : Créer les tables

1. **Allez dans SQL Editor** (icône dans la barre latérale)

2. **Créez une nouvelle query**

3. **Copiez tout le contenu** de `supabase/migrations/20250101000000_initial_schema.sql`

4. **Collez et exécutez** (bouton "Run")

5. ✅ Vous devriez voir : "Success. No rows returned"

6. **Vérifiez** dans **Table Editor** que vous avez maintenant :
   - `leads`
   - `tasks`
   - `quotes`

---

## ⚡ Étape 3 : Déployer l'Edge Function Gemini

### Option A : Via CLI Supabase (Recommandé)

```bash
# Installer le CLI Supabase
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref your-project-ref

# Déployer la fonction
supabase functions deploy gemini-ai --no-verify-jwt

# Configurer le secret
supabase secrets set GEMINI_API_KEY=votre_clé_api_gemini_ici
```

### Option B : Via Dashboard

1. **Allez dans Edge Functions** (barre latérale)

2. **Create a new function** :
   - Nom : `gemini-ai`

3. **Copiez le code** de `supabase/functions/gemini-ai/index.ts`

4. **Déployez**

5. **Configurez les secrets** :
   - Allez dans **Settings** → **Edge Functions**
   - Ajoutez `GEMINI_API_KEY` = votre clé

---

## 🔑 Étape 4 : Récupérer les clés API

1. **Allez dans Settings** → **API**

2. **Notez ces valeurs** :
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **NE JAMAIS partager** votre `service_role` key !

---

## ⚙️ Étape 5 : Configurer le frontend

1. **Éditez `.env`** à la racine du projet :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Remplacez** par vos vraies valeurs de l'étape 4

---

## 🧪 Étape 6 : Tester en local

1. **Démarrez le frontend** :
```bash
npm run dev
```

2. **Ouvrez** http://localhost:3000

3. **Créez un compte** :
   - Email : `test@example.com`
   - Mot de passe : au moins 6 caractères

4. **Connectez-vous**

5. ✅ **Ça fonctionne !**

---

## 🚢 Étape 7 : Déployer sur Vercel

1. **Allez sur [https://vercel.com](https://vercel.com)**

2. **Importez votre repo GitHub**

3. **Configurez les variables d'environnement** :
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI...
   ```

4. **Déployez**

5. ✅ **Votre CRM est en ligne !**

---

## 📊 Ajouter des données de démonstration

### Via SQL Editor

```sql
-- Insérez un lead de test (après vous être connecté)
INSERT INTO leads (
  user_id,
  first_name,
  last_name,
  email,
  company,
  position,
  status,
  value,
  channel,
  ga_data,
  last_contacted
)
VALUES (
  auth.uid(), -- Votre user ID
  'Alice',
  'Dubois',
  'alice@techstart.io',
  'TechStart SaaS',
  'CMO',
  'PROPOSITION',
  12500,
  'LinkedIn Ads',
  '{"pagesVisited": ["/tarifs", "/services/seo"], "timeOnSite": 340, "landingPage": "/landing/croissance-saas"}'::jsonb,
  NOW()
);
```

---

## 🔒 Sécurité : Row Level Security (RLS)

✅ **Déjà activée !** Votre schéma SQL inclut :

- **RLS activée** sur toutes les tables
- **Policies** : Chaque utilisateur ne voit que ses données
- **Isolation complète** entre utilisateurs

Vous pouvez vérifier dans **Authentication** → **Policies**

---

## 🎨 Personnalisation Supabase

### Changer la langue des emails

**Settings** → **Authentication** → **Email Templates**

### Activer OAuth (Google, GitHub, etc.)

**Authentication** → **Providers** → Activez Google/GitHub/etc.

### Ajouter un domaine personnalisé

**Settings** → **Custom Domains**

---

## 🐛 Dépannage

### ❌ "Invalid API key"

**Vérifiez** :
```bash
# Les variables doivent commencer par VITE_
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### ❌ "JWT expired"

**Solution** : Déconnectez-vous et reconnectez-vous

### ❌ "Row Level Security policy violation"

**Cause** : Vous essayez d'accéder aux données d'un autre utilisateur

**Solution** : Les policies RLS sont correctement configurées, c'est normal

### ❌ Edge Function ne répond pas

**Vérifiez** :
1. La fonction est bien déployée
2. `GEMINI_API_KEY` est configurée dans les secrets
3. Les logs dans **Edge Functions** → **gemini-ai** → **Logs**

---

## 📈 Monitoring

### Voir les requêtes SQL

**Database** → **Query Performance**

### Voir les logs de la fonction

**Edge Functions** → **gemini-ai** → **Logs**

### Voir les utilisateurs

**Authentication** → **Users**

---

## 💰 Limites du Plan Gratuit

| Ressource | Limite Gratuite |
|-----------|-----------------|
| Base de données | 500 MB |
| Bandwidth | 5 GB / mois |
| Edge Function | 500K requêtes / mois |
| Utilisateurs | Illimité |
| Auth requests | 50K / mois |

**Largement suffisant pour démarrer !** 🎉

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [CLI Supabase](https://supabase.com/docs/guides/cli)

---

## ✅ Checklist de Configuration

- [ ] Projet Supabase créé
- [ ] Tables créées (leads, tasks, quotes)
- [ ] Edge Function déployée
- [ ] GEMINI_API_KEY configurée
- [ ] Variables d'environnement dans .env
- [ ] Test en local réussi
- [ ] Déploiement Vercel configuré
- [ ] Application accessible en ligne

---

**🎉 Félicitations ! Votre CRM est maintenant alimenté par Supabase !**

Plus besoin de gérer un backend Node.js séparé, tout est sur Supabase ! 🚀
