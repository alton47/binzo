-- 1. Organizations
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text default 'TZS',
  created_at timestamp with time zone default now()
);

-- 2. Profiles (Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  organization_id uuid references organizations,
  name text,
  role text check (role in ('admin', 'seller')) default 'seller',
  created_at timestamp with time zone default now()
);

-- 3. Products
create table products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations not null,
  name text not null,
  price numeric not null,
  stock integer default 0,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 4. Sales
create table sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations not null,
  product_id uuid references products not null,
  sold_by uuid references profiles not null,
  quantity integer not null,
  sold_price numeric not null,
  created_at timestamp with time zone default now()
);