// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "app.config";

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    enabled: false,
  } as any,
});
