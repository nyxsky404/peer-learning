import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/env";
import type { Database } from "./types";

export const supabaseMisconfigured = !supabaseUrl || !supabaseAnonKey;

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: async (...args: Parameters<typeof fetch>) => {
        console.log("SUPABASE REQUEST:", args[0]);

        const response = await fetch(...args);

        console.log(
          "SUPABASE RESPONSE:",
          response.status,
          response.url
        );

        return response;
      },
    },
  }
);