import { createClient } from "@supabase/supabase-js";

// Public (anon) credentials — safe to expose client-side. Access is
// restricted by Row Level Security policies on the Supabase project
// (see the `booking_schema_init` migration): anonymous users can read
// active services/staff/schedules and INSERT a new appointment, but
// cannot read, update, or delete existing appointments.
const SUPABASE_URL = "https://ferznukzbfvzhjefcrye.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
