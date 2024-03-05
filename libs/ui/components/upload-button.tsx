"use client"

import { ChangeEvent, FC, useRef, useState } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Spinner } from "./ui/spinner"

interface UploadButtonProps {
  accept: string
  label: string
  onSelect: (file: File) => Promise<void>
}

export const UploadButton: FC<UploadButtonProps> = ({
  accept,
  label,
  onSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    setIsLoading(true)

    if (file) {
      await onSelect(file)
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
      <Button
        type="button"
        onClick={triggerFileInput}
        size="sm"
        variant="secondary"
      >
        {isLoading ? <Spinner /> : label}
      </Button>
    </>
  )
}
