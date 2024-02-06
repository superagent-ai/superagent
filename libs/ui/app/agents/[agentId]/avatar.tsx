/* eslint-disable @next/next/no-img-element */
"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { RxImage } from "react-icons/rx"
import { v4 as uuid } from "uuid"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

interface AvatarProps {
  accept: string
  onSelect: (url: string) => Promise<void>
  imageUrl: string
}

export default function Avatar({ accept, onSelect, imageUrl }: AvatarProps) {
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    setIsLoading(true)

    if (file) {
      const path = `public/${uuid()}`
      const { error } = await supabase.storage
        .from("superagent")
        .upload(path, file, { contentType: file.type })

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("superagent").getPublicUrl(path)
      console.log(publicUrl)
      await onSelect(publicUrl)
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <Input
        className="hidden"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
      />
      <div
        className="relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border hover:animate-pulse"
        onClick={triggerFileInput}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <img src={imageUrl} width={80} height={80} alt="Avatar" />
            <div className="absolute bottom-0 right-0 flex flex-col items-center justify-center rounded-md bg-background p-2">
              <RxImage />
            </div>
          </>
        )}
      </div>
    </>
  )
}
