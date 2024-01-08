import { toast } from '@/components/ui/use-toast'
import { Profile } from '@/types/profile'
import { ProfileChatwoot as TypeProfile } from '@/types/profileChatwoot'
import React, { useState } from 'react'

interface Props {
  profile?: TypeProfile
}

export const ProfileChatwoot = ({profile}: Props) => {

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        color: "green",
        description: "Copied Succesfuly",
      })
    } catch (err) {
      toast({
        color: "red",
        description: "Failed copy",
      })
    }
  }

  return (
    <div className='mt-5 w-[500px] rounded-lg border-2 p-3'>
      <h2 className='text-2xl underline underline-offset-4'>User Chatwoot</h2>

      <div className='mt-5 flex flex-col gap-3'>
        <p className='rounded-lg bg-yellow-300 p-2 text-black'><span className='mr-2 font-semibold'>User Name:</span> {profile?.available_name}</p>
        <div className='relative flex items-center rounded-lg bg-yellow-300 p-2 text-black'>
          <span className='mr-2 font-semibold'>Email: </span> {profile?.email}
          <button
            className='absolute right-0 top-0 ml-2 rounded-s-sm bg-gray-500 px-3 py-1 text-xs text-white transition-all active:scale-110'
            onClick={() => copyToClipboard(profile?.email || '')}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
