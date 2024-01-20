-- superagent specific setup

-- set up storage
insert into storage.buckets (id, name)
values ('superagent', 'superagent');

create policy "Enable insert access for authenticated users only"
  on storage.objects
  for insert to authenticated
  with check (bucket_id = 'superagent');

-- COMMENTED OUT FOR NOW - looks to have been added as a migration
-- -- inserts a row into public.profiles
-- create function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   insert into public.profiles (user_id)
--   values (new.id);
--   return new;
-- end;
-- $$;

-- -- trigger the function every time a user is created
-- create trigger on_auth_user_created
-- after insert on auth.users
-- for each row execute procedure public.handle_new_user();
