import { createClient } from "@supabase/supabase-js";

// Public (anon) credentials — safe to expose client-side. Access is
// restricted by Row Level Security policies on the Supabase project
// (see the `booking_schema_init` migration): anonymous users can read
// active services/staff/schedules and INSERT a new appointment, but
// cannot read, update, or delete existing appointments.
const SUPABASE_URL = "https://ferznukzbfvzhjefcrye.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5";

const authStorage={
  getItem(key:string){
    if(typeof window==="undefined")return null;
    const current=window.localStorage.getItem(key);
    if(current)return current;
    const legacy=window.localStorage.getItem("sb-ferznukzbfvzhjefcrye-auth-token");
    if(legacy){window.localStorage.setItem(key,legacy);return legacy;}
    return null;
  },
  setItem(key:string,value:string){if(typeof window!=="undefined")window.localStorage.setItem(key,value)},
  removeItem(key:string){if(typeof window!=="undefined")window.localStorage.removeItem(key)},
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "gloria-beauty-auth",
    storage: authStorage,
  },
});
