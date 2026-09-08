-- Keeps appointment reporting fields synchronized with the selected service.
-- Applied to Supabase project ferznukzbfvzhjefcrye on 2026-09-08.

create or replace function public.sync_appointment_service_reference()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_category text;
  v_duration integer;
  v_price_label text;
  v_service_changed boolean := false;
begin
  if new.service_id is null then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    v_service_changed := new.service_id is distinct from old.service_id;
  end if;

  select category, duration_minutes, price_label
    into v_category, v_duration, v_price_label
  from public.services
  where id = new.service_id;

  if not found then
    raise exception 'Unknown service_id %', new.service_id;
  end if;

  new.service_category := v_category;

  if new.booking_duration is null
     or (v_service_changed and new.booking_duration is not distinct from old.booking_duration) then
    new.booking_duration := v_duration;
  end if;

  if new.price_cents is null
     or (v_service_changed and new.price_cents is not distinct from old.price_cents) then
    if v_price_label ~ '^\$[0-9]+([.][0-9]{1,2})?$' then
      new.price_cents := round((replace(v_price_label, '$', '')::numeric) * 100)::integer;
    elsif v_service_changed then
      new.price_cents := null;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_appointment_service_reference()
from public, anon, authenticated;

drop trigger if exists appointments_sync_service_reference on public.appointments;
create trigger appointments_sync_service_reference
before insert or update of service_id, service_category, booking_duration, price_cents
on public.appointments
for each row execute function public.sync_appointment_service_reference();
