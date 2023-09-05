"use client"

import { useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"

export default function SettingsClientPage() {
  const supabase = createClientComponentClient()
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  return <Button onClick={handleSignOut}>Sign out</Button>
}
