-- À exécuter une fois dans Supabase > SQL Editor.

-- Contenu du portfolio : une seule ligne (id = 1) qui contient tout le site en JSON.
create table if not exists public.portfolio (
  id int primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- Liste des comptes autorisés à modifier le site.
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.portfolio enable row level security;
alter table public.portfolio_admins enable row level security;

-- Tout le monde peut lire le portfolio.
drop policy if exists "portfolio lecture publique" on public.portfolio;
create policy "portfolio lecture publique" on public.portfolio
  for select using (true);

-- Seuls les admins peuvent créer ou modifier le contenu.
drop policy if exists "portfolio ecriture admin" on public.portfolio;
create policy "portfolio ecriture admin" on public.portfolio
  for all to authenticated
  using (exists (select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())));

-- Chaque admin peut voir sa propre ligne (nécessaire pour la règle ci-dessus).
drop policy if exists "admin voit sa ligne" on public.portfolio_admins;
create policy "admin voit sa ligne" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Après avoir créé votre compte (Authentication > Users > Add user),
-- remplacez l'adresse ci-dessous par la vôtre et exécutez cette ligne :
-- insert into public.portfolio_admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';

-- Stockage des photos et du CV envoyés depuis /admin
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-files', 'site-files', true, 10485760,
        array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin envoie fichiers" on storage.objects;
create policy "admin envoie fichiers" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-files'
    and exists (select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin remplace fichiers" on storage.objects;
create policy "admin remplace fichiers" on storage.objects for update to authenticated
  using (bucket_id = 'site-files'
    and exists (select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())));
