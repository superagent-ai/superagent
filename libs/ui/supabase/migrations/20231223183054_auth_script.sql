-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (user_id)
values (new.id);
return new;
end;
$$;

-- trigger the function every time a user is created,
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();