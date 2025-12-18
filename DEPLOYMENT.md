# 🚀 Guide de Déploiement NexusGrowth CRM

Ce guide vous explique comment déployer l'application complète en production.

## 🏗️ Architecture de déploiement

L'application nécessite **2 déploiements séparés** :

```
┌─────────────────┐         ┌─────────────────┐
│   Vercel        │  API    │   Render.com    │
│   (Frontend)    │◄────────┤   (Backend)     │
│   React + Vite  │  Calls  │   Node.js       │
└─────────────────┘         └─────────────────┘
```

---

## 📦 OPTION 1 : Render (Backend) + Vercel (Frontend)

### ✅ Étape 1 : Déployer le Backend sur Render

1. **Créez un compte sur [https://render.com](https://render.com)** (gratuit)

2. **Nouveau Web Service** :
   - Cliquez sur **"New +"** → **"Web Service"**
   - Connectez votre repo GitHub : `laysmocker99/nexuscrm`
   - Sélectionnez la branche : `claude/code-review-vFVka`

3. **Configuration du service** :
   ```
   Name: nexuscrm-backend
   Region: Frankfurt (ou le plus proche de vous)
   Branch: claude/code-review-vFVka
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Plan** : Sélectionnez **"Free"** (0$/mois)

5. **Variables d'environnement** :

   Cliquez sur **"Advanced"** puis ajoutez ces variables :

   ```env
   GEMINI_API_KEY=votre_clé_api_gemini_ici
   JWT_SECRET=changez_ce_secret_en_production_xyz123
   PORT=5000
   NODE_ENV=production
   ADMIN_EMAIL=admin@nexuscrm.com
   ADMIN_PASSWORD=changez_ce_mot_de_passe
   ```

   ⚠️ **IMPORTANT** :
   - Remplacez `votre_clé_api_gemini_ici` par votre vraie clé
   - Changez le `JWT_SECRET` (utilisez un générateur de mots de passe)
   - Changez `ADMIN_PASSWORD` pour plus de sécurité

6. **Déployez** : Cliquez sur **"Create Web Service"**

7. **Attendez** environ 2-3 minutes que le déploiement se termine

8. **Notez l'URL du backend** :
   ```
   https://nexuscrm-backend.onrender.com
   ```
   (Votre URL sera différente, copiez-la !)

### ✅ Étape 2 : Configurer Vercel (Frontend)

1. **Allez sur [https://vercel.com](https://vercel.com)**

2. **Trouvez votre projet** NexusCRM

3. **Settings** → **Environment Variables**

4. **Ajoutez une nouvelle variable** :
   ```
   Name: VITE_API_URL
   Value: https://nexuscrm-backend.onrender.com/api
   ```

   ⚠️ Remplacez par **VOTRE** URL Render (celle notée à l'étape 8)

5. **Pour tous les environnements** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. **Sauvegardez**

7. **Redéployez** :
   - Allez dans **"Deployments"**
   - Cliquez sur les **3 points** du dernier déploiement
   - **"Redeploy"**

### ✅ Étape 3 : Tester

1. **Attendez** 2-3 minutes que Vercel redéploie

2. **Ouvrez votre URL Vercel** : `https://nexuscrm-xxx.vercel.app`

3. **Connectez-vous** :
   - Email : `admin@nexuscrm.com`
   - Mot de passe : celui que vous avez défini (par défaut `admin123`)

4. ✅ **Ça fonctionne !**

---

## 🚂 OPTION 2 : Railway (Tout-en-Un)

Plus simple mais moins flexible :

1. **Créez un compte sur [https://railway.app](https://railway.app)**

2. **New Project** → **Deploy from GitHub repo**

3. **Sélectionnez** : `laysmocker99/nexuscrm`

4. Railway créera **2 services automatiquement** :
   - Backend (détecte `/backend`)
   - Frontend (détecte la racine)

5. **Configurez les variables** pour le backend :
   - Cliquez sur le service backend
   - **Variables** → Ajoutez les mêmes que pour Render

6. **Configurez les variables** pour le frontend :
   - Cliquez sur le service frontend
   - Ajoutez : `VITE_API_URL` avec l'URL du backend Railway

7. **Attendez le déploiement**

✅ Railway génère 2 URLs automatiquement !

---

## 🐛 Dépannage

### ❌ "Cannot read properties of undefined"

**Cause** : Le frontend ne peut pas joindre le backend

**Solution** :
```bash
# Vérifiez que VITE_API_URL est correctement définie sur Vercel
# Vérifiez que le backend Render est en ligne (pas en "sleep")
```

### ❌ "401 Unauthorized" ou "Invalid token"

**Cause** : Les JWT_SECRET ne correspondent pas

**Solution** :
- Assurez-vous que `JWT_SECRET` est identique en local et en prod
- Si vous changez `JWT_SECRET`, déconnectez-vous et reconnectez-vous

### ❌ Le backend Render "sleep" après 15 minutes

**Cause** : Le plan gratuit de Render met les services en veille

**Solutions** :
1. **Gardez-le actif** : Utilisez [cron-job.org](https://cron-job.org) pour ping le backend toutes les 10 minutes
2. **Upgrade** : Passez au plan payant ($7/mois)
3. **Utilisez Railway** : Pas de mise en veille sur le plan gratuit

### ❌ "Database is locked"

**Cause** : SQLite ne fonctionne pas bien en environnement serverless

**Solution à long terme** :
- Migrer vers PostgreSQL (disponible gratuitement sur Render)
- J'ai créé la version SQLite pour commencer simplement

---

## 📊 Coûts

| Service | Plan Gratuit | Limitations |
|---------|--------------|-------------|
| Render | ✅ 0$/mois | Sleep après 15min inactivité |
| Vercel | ✅ 0$/mois | Illimité pour projets personnels |
| Railway | ✅ 5$/mois crédit | Pas de sleep, meilleure perf |

**Total : GRATUIT** pour commencer ! 🎉

---

## 🎯 Récapitulatif

1. ✅ Déployer backend sur **Render**
2. ✅ Noter l'URL du backend
3. ✅ Configurer `VITE_API_URL` sur **Vercel**
4. ✅ Redéployer le frontend
5. ✅ Tester l'application

---

## 💡 Prochaines étapes (optionnel)

Une fois que tout fonctionne :

1. **Ajouter un nom de domaine personnalisé**
2. **Configurer PostgreSQL** au lieu de SQLite
3. **Ajouter des sauvegardes** de la base de données
4. **Monitorer** avec les outils Render/Vercel
5. **Configurer des alertes** par email

---

**Besoin d'aide ?** Toutes les infos sont dans ce guide ! 🚀
