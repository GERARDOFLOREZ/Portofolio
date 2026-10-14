# Portfolio Gerard Lawson-Noudo

Site portfolio bilingue (FR/EN) en React + Vite, avec contenu modifiable depuis `/admin` grâce à Supabase.

## 1. Supabase
1. Ouvrez votre projet Supabase > **SQL Editor** et exécutez `supabase/schema.sql`.
2. **Authentication > Users > Add user** : créez votre compte (email + mot de passe).
3. Dans le SQL Editor, exécutez (avec votre email) :
   `insert into public.portfolio_admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
4. **Project Settings > API** : copiez l'URL du projet et la clé `anon` (publique).

## 2. Vercel
1. Importez ce dépôt GitHub dans Vercel (framework détecté : Vite).
2. Ajoutez les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
3. Déployez.

## 3. Modifier le contenu
Allez sur `votre-site.vercel.app/admin`, connectez-vous, modifiez, puis cliquez sur **Enregistrer**.
Sans Supabase, le site affiche le contenu par défaut de `src/content.js`.

## En local
```
cp .env.example .env   # puis remplissez les valeurs
npm install
npm run dev
```
