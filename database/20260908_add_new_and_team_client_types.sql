begin;

alter table public.client_profiles
  drop constraint if exists client_profiles_client_type_check;

alter table public.client_profiles
  add constraint client_profiles_client_type_check
  check (client_type in ('new', 'regular', 'ambassador', 'team'));

create or replace function public.hub_update_client_type(
  p_client_id uuid,
  p_client_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_hub_admin() then
    raise exception 'Hub admin access required';
  end if;

  if p_client_type not in ('new', 'regular', 'ambassador', 'team') then
    raise exception 'Invalid client type';
  end if;

  update public.client_profiles
  set client_type = p_client_type,
      updated_at = now()
  where id = p_client_id;

  if not found then
    raise exception 'Client not found';
  end if;
end;
$$;

revoke all on function public.hub_update_client_type(uuid, text) from public;
revoke all on function public.hub_update_client_type(uuid, text) from anon;
grant execute on function public.hub_update_client_type(uuid, text) to authenticated;

commit;
