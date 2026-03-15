-- Supabase Database Schema for Kenyan Survey Hub

-- Enable RLS
alter table if exists public.profiles enable row level security;
alter table if exists public.surveys enable row level security;
alter table if exists public.survey_responses enable row level security;
alter table if exists public.transactions enable row level security;
alter table if exists public.packages enable row level security;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  phone_number text,
  is_active boolean default false,
  package_id text default 'basic',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Packages table
create table if not exists public.packages (
  id text primary key,
  name text not null,
  price integer not null,
  daily_earning_limit integer not null,
  features text[] not null,
  color text not null,
  badge text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Surveys table
create table if not exists public.surveys (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  reward integer not null,
  duration text not null,
  questions_count integer not null default 0,
  is_premium boolean default false,
  required_package text references public.packages(id),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Survey responses table
create table if not exists public.survey_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  survey_id text not null,
  answers jsonb not null default '{}',
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reward_earned integer not null default 0,
  unique(user_id, survey_id)
);

-- Transactions table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('withdrawal', 'activation', 'upgrade', 'survey_earning')),
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  phone_number text,
  reference text,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- RLS Policies

-- Profiles: Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Surveys: Everyone can view active surveys
create policy "Anyone can view active surveys"
  on public.surveys for select
  using ( is_active = true );

-- Survey responses: Users can only view/submit their own
create policy "Users can view own responses"
  on public.survey_responses for select
  using ( auth.uid() = user_id );

create policy "Users can insert own responses"
  on public.survey_responses for insert
  with check ( auth.uid() = user_id );

-- Transactions: Users can only view their own
create policy "Users can view own transactions"
  on public.transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check ( auth.uid() = user_id );

-- Packages: Everyone can view
create policy "Anyone can view packages"
  on public.packages for select
  to authenticated, anon
  using ( true );

-- Insert default packages
insert into public.packages (id, name, price, daily_earning_limit, features, color, badge)
values 
  ('basic', 'Basic', 0, 300, array['Access to basic surveys', 'KSH 300 daily earning limit', '24hr withdrawal processing'], '#6B7280', 'Free'),
  ('starter', 'Starter', 350, 800, array['Access to starter surveys', 'KSH 800 daily earning limit', 'Priority support'], '#10B981', 'Popular'),
  ('pro', 'Pro', 500, 1500, array['Access to all surveys', 'KSH 1500 daily earning limit', 'Instant withdrawals', 'Priority support'], '#8B5CF6', 'Best Value'),
  ('elite', 'Elite', 1500, 5000, array['Access to premium surveys', 'KSH 5000 daily earning limit', 'Instant withdrawals', 'Dedicated support', 'Bonus rewards'], '#F59E0B', 'Elite')
on conflict (id) do nothing;

-- Insert sample surveys
insert into public.surveys (title, description, category, reward, duration, questions_count, is_premium, required_package)
values 
  -- Free surveys
  ('Beverage Preferences', 'Share your favorite drink choices', 'food', 150, '1 min', 5, false, null),
  ('Fast Food Habits', 'Tell us about your dining habits', 'food', 150, '2 min', 6, false, null),
  ('Cooking Preferences', 'Home cooking vs eating out', 'food', 150, '1 min', 5, false, null),
  ('Smartphone Usage', 'How you use your phone daily', 'tech', 150, '1 min', 5, false, null),
  ('App Preferences', 'Your favorite mobile apps', 'tech', 150, '2 min', 6, false, null),
  ('Style Preferences', 'Your fashion choices', 'fashion', 150, '1 min', 5, false, null),
  ('M-Pesa Usage', 'How you use mobile money', 'finance', 150, '1 min', 5, false, null),
  ('Savings Habits', 'Your saving patterns', 'finance', 150, '1 min', 5, false, null),
  ('Commute Survey', 'Your daily commute details', 'transport', 150, '1 min', 5, false, null),
  ('Music Preferences', 'Your music taste', 'entertainment', 150, '1 min', 5, false, null),
  ('Fitness Routine', 'Your exercise habits', 'health', 150, '1 min', 5, false, null),
  ('Online Shopping', 'E-commerce preferences', 'shopping', 150, '1 min', 5, false, null),
  ('Market Habits', 'Where you shop locally', 'shopping', 150, '1 min', 5, false, null),

  -- Premium surveys (require activation)
  ('Internet Habits', 'How you browse online', 'tech', 350, '2 min', 6, true, 'starter'),
  ('Brand Awareness', 'Brands you know and love', 'fashion', 500, '2 min', 6, true, 'starter'),
  ('Streaming Habits', 'How you watch content', 'entertainment', 650, '2 min', 6, true, 'pro'),
  ('Investment Survey', 'Premium investment preferences survey', 'finance', 450, '8 min', 12, true, 'elite'),
  ('Premium Tech Review', 'Detailed technology usage review', 'tech', 350, '7 min', 15, true, 'elite')
on conflict do nothing;

-- Functions

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Function to calculate user balance
create or replace function public.get_user_balance(user_uuid uuid)
returns integer as $$
declare
  total_earnings integer;
  total_withdrawals integer;
  activation_cost integer;
  upgrade_cost integer;
begin
  -- Calculate total earnings from surveys
  select coalesce(sum(reward_earned), 0) into total_earnings
  from public.survey_responses
  where user_id = user_uuid;
  
  -- Calculate total withdrawals
  select coalesce(sum(amount), 0) into total_withdrawals
  from public.transactions
  where user_id = user_uuid and type = 'withdrawal' and status = 'completed';
  
  -- Calculate activation costs
  select coalesce(sum(amount), 0) into activation_cost
  from public.transactions
  where user_id = user_uuid and type = 'activation' and status = 'completed';
  
  -- Calculate upgrade costs
  select coalesce(sum(amount), 0) into upgrade_cost
  from public.transactions
  where user_id = user_uuid and type = 'upgrade' and status = 'completed';
  
  return total_earnings - total_withdrawals - activation_cost - upgrade_cost;
end;
$$ language plpgsql security definer;
