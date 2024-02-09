"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { TbPlus } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { UploadButton } from "@/components/upload-button"

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  type: z.string(),
  url: z.string(),
  metadata: z.any(),
})

function AddDatasource({
  profile,
  agent,
  onSuccess,
}: {
  profile: any
  agent: any
  onSuccess: () => void
}) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)

  const [open, setOpen] = React.useState(false)
  const [isDownloadingFile, setIsDownloadingFile] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<any | null>()

  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "PDF",
      metadata: null,
    },
  })
  const supportedMimeTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: vectorDbs } = await api.getVectorDbs()
      const { data: datasource } = await api.createDatasource({
        ...values,
        vectorDbId: vectorDbs[0]?.id,
      })
      await api.createAgentDatasource(agent.id, datasource.id)
      form.reset()
      toast({
        description: "Datasource created successfully",
      })
      setOpen(false)
      form.reset()
      onSuccess()
    } catch (error: any) {
      toast({
        description: error?.message,
      })
    }
  }

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

  const handleLocalFileUpload = async (file: File) => {
    setIsDownloadingFile(true)
    const storageName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
    if (!storageName) {
      throw new Error(
        "Storage name is not defined in the environment variables."
      )
    }
    const { data, error } = await supabase.storage
      .from(storageName)
      .upload(uuidv4(), file, { contentType: file.type })

    if (data?.path) {
      const publicUrl = supabase.storage
        .from(storageName)
        .getPublicUrl(data?.path).data?.publicUrl
      form.setValue("url", publicUrl)
      form.setValue("type", mapMimeTypeToFileType(file.type))
    } else {
      throw error
    }

    setIsDownloadingFile(false)

    if (error) {
      toast({
        description: "Ooops, something went wrong, please try again!",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-green-400">
          {form.control._formState.isSubmitting ? (
            <Spinner />
          ) : (
            <div className="flex items-center space-x-2">
              <TbPlus />
              <span>New</span>
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <div
            onSubmit={(event) => {
              event.stopPropagation()
            }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <DialogHeader>
                <DialogTitle>Create new datasource</DialogTitle>
                <DialogDescription>
                  Connect your to your custom datasources or files.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-2">
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g My API" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Useful for doing X..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>

                <div>
                  {!selectedFile ? (
                    <div className="relative flex flex-col items-center justify-between space-y-4 rounded-lg border border-dashed p-4">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm">Select files</p>
                        <p className="text-sm text-muted-foreground">
                          Upload local files from your device
                        </p>
                      </div>
                      <UploadButton
                        accept={supportedMimeTypes.join(",")}
                        label="Upload file"
                        onSelect={async (file) => {
                          handleLocalFileUpload(file)
                          setSelectedFile(file)
                        }}
                      />
                    </div>
                  ) : (
                    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                    <div className="flex items-center justify-between rounded-lg border border-green-900 bg-green-900 bg-opacity-20 py-1 pl-4 pr-2">
                      <p className="text-sm">{selectedFile.name}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedFile(null)}
                      >
                        <RxCross2 size="20px" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" size="sm" className="w-full">
                  {form.control._formState.isSubmitting || isDownloadingFile ? (
                    <Spinner />
                  ) : (
                    "Create datasource"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddDatasource
