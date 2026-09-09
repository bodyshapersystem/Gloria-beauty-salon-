begin;

alter table public.appointments
  add column if not exists tip_cents integer not null default 0;

alter table public.appointments
  drop constraint if exists appointments_tip_cents_non_negative;

alter table public.appointments
  add constraint appointments_tip_cents_non_negative
  check (tip_cents >= 0);

create or replace function public.hub_update_appointment_details(
  p_appointment_id uuid,
  p_client_name text,
  p_client_phone text,
  p_client_email text default null,
  p_notes_internal text default null,
  p_price_cents integer default null,
  p_deposit_cents integer default null,
  p_tip_cents integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.appointments%rowtype;
  v_role text;
  v_staff uuid;
  v_client_id uuid;
  v_email text := nullif(lower(trim(p_client_email)), '');
  v_phone text := public.normalize_phone(p_client_phone);
  v_name text := lower(trim(p_client_name));
begin
  select role,staff_id into v_role,v_staff
  from public.user_profiles
  where auth_user_id=auth.uid() and active=true
  limit 1;

  if v_role is null or v_role not in ('owner','admin','staff') then
    raise exception 'Unauthorized';
  end if;

  select * into a from public.appointments where id=p_appointment_id;
  if a.id is null then
    raise exception 'Appointment not found';
  end if;

  if v_role='staff' and a.staff_id is distinct from v_staff then
    raise exception 'Not assigned to this appointment';
  end if;

  if coalesce(p_tip_cents, 0) < 0 then
    raise exception 'Tip cannot be negative';
  end if;

  select id into v_client_id
  from public.client_profiles
  where (v_email is not null and normalized_email=v_email)
     or (v_phone is not null and normalized_phone=v_phone)
     or (v_name <> '' and lower(trim(first_name || ' ' || last_name)) = v_name)
  order by
    case
      when v_email is not null and normalized_email=v_email then 0
      when v_phone is not null and normalized_phone=v_phone then 1
      else 2
    end,
    created_at asc
  limit 1;

  update public.appointments set
    client_id=coalesce(v_client_id, client_id),
    client_name=trim(p_client_name),
    client_phone=trim(p_client_phone),
    client_email=nullif(trim(p_client_email),''),
    notes_internal=nullif(trim(p_notes_internal),''),
    price_cents=p_price_cents,
    deposit_cents=p_deposit_cents,
    tip_cents=coalesce(p_tip_cents, 0)
  where id=p_appointment_id;
end;
$$;

revoke all on function public.hub_update_appointment_details(uuid, text, text, text, text, integer, integer, integer) from public;
revoke all on function public.hub_update_appointment_details(uuid, text, text, text, text, integer, integer, integer) from anon;
grant execute on function public.hub_update_appointment_details(uuid, text, text, text, text, integer, integer, integer) to authenticated;

commit;
