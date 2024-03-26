import "client-only"

import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs"

let supabaseClient: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    })
  }
  return supabaseClient
}
