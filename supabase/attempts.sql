-- Reserva do @ no início do quiz (rodar uma vez no SQL Editor do Supabase).
create table if not exists public.attempts (
  instagram text primary key,
  created_at timestamptz not null default now()
);

-- quem já jogou antes desta mudança continua bloqueado
insert into public.attempts (instagram, created_at)
select instagram, min(created_at) from public.results group by instagram
on conflict (instagram) do nothing;

alter table public.attempts enable row level security;

-- o site só insere; não lê nem altera
create policy "anon insert attempts" on public.attempts
  for insert to anon with check (true);
