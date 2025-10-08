-- Tabela colaboradores conforme PRD
create extension if not exists pgcrypto;

create table if not exists colaboradores (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  nome_cola text not null,
  email_cola text unique not null,
  cargo_cola text default 'Funcionário',
  datanas_cola date,
  Cpf_cola text,
  Rg_cola text,
  Endereco_cola text,
  Bairro_cola text,
  cidade_cola text,
  Uf_cola text,
  criado_em timestamp default now()
);

-- Índices úteis
create index if not exists colaboradores_auth_user_idx on colaboradores(auth_user_id);

-- Habilitar RLS e políticas de acesso por usuário
alter table colaboradores enable row level security;

-- Permitir que usuários autenticados leiam todos os colaboradores
drop policy if exists "colaboradores_select_all" on colaboradores;
create policy "colaboradores_select_all" on colaboradores
  for select
  using (auth.role() = 'authenticated');

-- Permitir que o próprio usuário insira seu registro (via app após sign up)
drop policy if exists "colaboradores_insert_own" on colaboradores;
create policy "colaboradores_insert_own" on colaboradores
  for insert
  with check (auth.uid() = auth_user_id);

-- Permitir que o próprio usuário atualize seu registro
drop policy if exists "colaboradores_update_own" on colaboradores;
create policy "colaboradores_update_own" on colaboradores
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- (Opcional) Permitir exclusão apenas pelo próprio usuário
drop policy if exists "colaboradores_delete_own" on colaboradores;
create policy "colaboradores_delete_own" on colaboradores
  for delete
  using (auth.uid() = auth_user_id);

-- Tabela usuarios (perfil de login)
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  nome text,
  role text default 'user',
  ativo boolean default true,
  criado_em timestamp default now()
);

-- Índices úteis para usuarios
create index if not exists usuarios_auth_user_idx on usuarios(auth_user_id);
create index if not exists usuarios_email_idx on usuarios(email);

-- Habilitar RLS e políticas por usuário para usuarios
alter table usuarios enable row level security;

drop policy if exists "usuarios_select_own" on usuarios;
create policy "usuarios_select_own" on usuarios
  for select
  using (auth.uid() = auth_user_id);

drop policy if exists "usuarios_insert_own" on usuarios;
create policy "usuarios_insert_own" on usuarios
  for insert
  with check (auth.uid() = auth_user_id);

drop policy if exists "usuarios_update_own" on usuarios;
create policy "usuarios_update_own" on usuarios
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "usuarios_delete_own" on usuarios;
create policy "usuarios_delete_own" on usuarios
  for delete
  using (auth.uid() = auth_user_id);

-- Criar colaborador automaticamente ao criar usuário no auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from public.colaboradores where auth_user_id = new.id) then
    insert into public.colaboradores (auth_user_id, nome_cola, email_cola, cargo_cola)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email, 'Funcionário');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill idempotente para usuários já existentes sem registro em colaboradores
insert into public.colaboradores (auth_user_id, nome_cola, email_cola, cargo_cola)
select u.id,
       coalesce(u.raw_user_meta_data->>'full_name', u.email),
       u.email,
       'Funcionário'
from auth.users u
where not exists (
  select 1 from public.colaboradores c where c.auth_user_id = u.id
);

-- Tabela produtos conforme PRD
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  codigo_prod text not null,
  descricao_prod text not null,
  preco_venda_prod numeric(10,2) not null default 0,
  preco_custo_prod numeric(10,2) not null default 0,
  quantidade_estoque_prod integer not null default 0,
  preco_medio_prod numeric(10,2) not null default 0,
  preco_minimo_prod numeric(10,2) default 0,
  estoque_minimo_prod integer default 0,
  despesa_icms_prod numeric(10,2) default 0,
  despesa_frete_prod numeric(10,2) default 0,
  outras_despesas_prod numeric(10,2) default 0,
  foto_url_prod text,
  criado_em timestamp default now(),
  atualizado_em timestamp default now()
);

create index if not exists produtos_auth_user_idx on produtos(auth_user_id);

alter table produtos enable row level security;

drop policy if exists "produtos_select_all" on produtos;
create policy "produtos_select_all" on produtos
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "produtos_insert_own" on produtos;
create policy "produtos_insert_own" on produtos
  for insert
  with check (auth.uid() = auth_user_id);

drop policy if exists "produtos_update_own" on produtos;
create policy "produtos_update_own" on produtos
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "produtos_delete_own" on produtos;
create policy "produtos_delete_own" on produtos
  for delete
  using (auth.uid() = auth_user_id);