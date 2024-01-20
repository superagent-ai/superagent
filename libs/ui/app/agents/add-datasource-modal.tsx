"use client"

import { ChangeEvent, FC, ReactElement, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { TbPlus } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

interface UploadButtonProps {
  accept: string
  isLoading: boolean
  onSelect: (files: File[]) => Promise<void>
}

function UploadButton({
  accept,
  isLoading,
  onSelect,
}: UploadButtonProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []

    if (files.length > 0) {
      await onSelect(files)
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
        multiple
      />
      <Button onClick={triggerFileInput} size="sm">
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Spinner />
            <span>Uploading</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <TbPlus />
            <span>Add files</span>
          </div>
        )}
      </Button>
    </>
  )
}

export default function AddDatsourceModal({
  agent,
  profile,
}: {
  agent: any
  profile: any
}) {
  const router = useRouter()
  const api = new Api(profile.api_key)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const supabase = createClientComponentClient()
  const supportedMimeTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]

  function mapMimeTypeToFileType(mimeType: string): string {
    const typeMapping: { [key: string]: string } = {
      "text/plain": "TXT",
      "application/pdf": "PDF",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "PPTX",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
      "text/markdown": "MARKDOWN",
      "text/csv": "CSV",
    }

    return typeMapping[mimeType] || "UNKNOWN"
  }

  const handleLocalFileUpload = async (files: File[]) => {
    setIsLoading(true)
    const storageName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
    if (!storageName) {
      throw new Error(
        "Storage name is not defined in the environment variables."
      )
    }

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from(storageName)
        .upload(uuidv4(), file, { contentType: file.type })

      if (data?.path) {
        const publicUrl = supabase.storage
          .from(storageName)
          .getPublicUrl(data?.path).data?.publicUrl

        const { data: datasource } = await api.createDatasource({
          name: file.name,
          description: `Useful for answering questions about ${file.name}`,
          type: mapMimeTypeToFileType(file.type),
          url: publicUrl,
        })

        await api.createAgentDatasource(agent.id, datasource.id)
        router.refresh()
        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw error
      }
    }
  }

  return (
    <UploadButton
      accept={supportedMimeTypes.join(",")}
      isLoading={isLoading}
      onSelect={async (file) => {
        handleLocalFileUpload(file)
      }}
    />
  )
}
