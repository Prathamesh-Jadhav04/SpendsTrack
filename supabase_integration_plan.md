# Supabase Integration Plan - SpendsTracks

This document outlines the step-by-step plan for integrating Supabase as the backend for the SpendsTracks SaaS application. 

---

## 1. Database Schema Design (SQL)

You need to execute the following SQL script in the **Supabase SQL Editor** to create the required tables and configure Row Level Security (RLS).

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar text,
  role text not null default 'user',
  monthly_budget numeric not null default 160000,
  category_budgets jsonb not null default '{
    "food": 15000,
    "shopping": 10000,
    "transport": 5000,
    "bills": 30000,
    "entertainment": 8000,
    "groceries": 12000
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. TRANSACTIONS TABLE
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  detail text,
  amount numeric not null,
  tone text,
  icon text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null check (type in ('expense', 'income')),
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Transactions
alter table public.transactions enable row level security;

create policy "Users can CRUD their own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3. GOALS TABLE
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  target numeric not null,
  current numeric not null default 0,
  deadline timestamp with time zone not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Goals
alter table public.goals enable row level security;

create policy "Users can CRUD their own goals"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 4. RECURRING PAYMENTS TABLE
create table public.recurring_payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  amount numeric not null,
  category text not null,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
  next_date timestamp with time zone not null,
  type text not null check (type in ('expense', 'income')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Recurring Payments
alter table public.recurring_payments enable row level security;

create policy "Users can CRUD their own recurring payments"
  on public.recurring_payments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 5. CUSTOM CATEGORIES TABLE
create table public.custom_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null,
  color text not null,
  type text not null check (type in ('expense', 'income')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Custom Categories
alter table public.custom_categories enable row level security;

create policy "Users can CRUD their own custom categories"
  on public.custom_categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 2. Environment Variables (`.env.local`)

Create a `.env.local` file at the root of the project with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 3. Client Setup (`lib/supabase.ts`)

We will configure the Supabase browser/server client using `@supabase/ssr` or `@supabase/supabase-js`. Since we have server actions and components, we'll expose helper functions to create the clients.

---

## 4. Hooks Refactoring

We will rewrite the frontend hooks to perform API operations against Supabase instead of relying on `localStorage`:

1. **`useAuth`** (`components/hooks/use-auth.ts`):
   - Replace manual password hashing and user saving.
   - Use `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
   - Update `user` state based on `supabase.auth.onAuthStateChange`.

2. **`useAppData`** (`components/hooks/use-app-data.ts`):
   - Fetch initial data from `transactions`, `goals`, `recurring_payments`, `custom_categories`, and user `profiles` when the user logs in.
   - Update the state and perform backend mutations (inserts, updates, deletes) in real-time.

---

## 5. Next Steps

1. Wait for package installation to complete.
2. Setup the `.env.local` file configuration template.
3. Code the Supabase helper client in `lib/supabase.ts`.
4. Refactor `use-auth.ts` and `use-app-data.ts` files to communicate with Supabase.
