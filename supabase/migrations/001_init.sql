create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text not null,
  created_at timestamp default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id),
  role text check (role in ('admin','manager','seller')) default 'seller',
  full_name text,
  created_at timestamp default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  name text not null,
  price numeric not null,
  stock int not null default 0,
  created_at timestamp default now()
);

create table sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  product_id uuid references products(id),
  sold_by uuid references profiles(id),
  quantity int not null,
  sold_price numeric not null,
  created_at timestamp default now()
);