"use client"

import { useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Profile } from "@/types/profile"
import { User } from "@/types/user"
import { Button } from "@/components/ui/button"

interface SettingsClientPageProps {
  profile: Profile
  user: User
}

const SettingsClientPage: React.FC<SettingsClientPageProps> = ({
  profile,
  user,
}) => {
  const supabase = createClientComponentClient()
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  return <Button onClick={handleSignOut}>Sign out</Button>
}
