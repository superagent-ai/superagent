"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FilePicker } from "@apideck/file-picker-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { DataTablePagination } from "@/components/data-table-pagination"
import { UploadButton } from "@/components/upload-button"

interface DataTableProps<TData, TValue> {
  columns: (profile: Profile) => ColumnDef<TData, TValue>[]
  data: TData[]
  profile: Profile
  pagination: {
    take: number
    currentPageNumber: number
    totalPages: number
  }
}

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

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
  pagination: { currentPageNumber, take, totalPages },
}: DataTableProps<TData, TValue>) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [isLoadingFilePicker, setIsLoadingFilePicker] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [isDownloadingFile, setIsDownloadingFile] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<any | null>()
  const [selectedType, setSelectedType] = React.useState<string | null>()
  const [isOpeningVault, setIsOpeningVault] = React.useState<boolean>(false)
  const table = useReactTable({
    data,
    columns: columns(profile),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: {
        pageIndex: 0, // we are setting pageIndex to 0 because we have only the current page's data
        pageSize: take,
      },
    },
  })
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
      await api.createDatasource({
        ...values,
        vectorDbId: vectorDbs[0]?.id,
      })
      toast({
        description: "Datasource created successfully",
      })
      router.refresh()
      setOpen(false)
      setIsLoadingFilePicker(false)
      setSelectedType(null)
      form.reset()
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

  const openVault = async () => {
    // Open Vault with a valid session token
    const response = await fetch("/datasources/apideck/", {
      method: "POST",
      body: JSON.stringify({ userId: profile.user_id }),
    })
    const { data } = await response.json()
    FilePicker.open({
      token: data.session_token,
      title: "Superagent",
      subTitle: "Select a file",
      onReady: () => {
        setIsLoadingFilePicker(false)
      },
      onSelect: async (file: any) => {
        if (!supportedMimeTypes.includes(file.mime_type)) {
          toast({
            description: `File type ${file.mime_type} is not supported.`,
            variant: "destructive",
          })
          form.reset()
          return
        }

        setOpen(true)
        setIsOpeningVault(false)
        setSelectedFile(file)
        setIsDownloadingFile(true)
        const response = await fetch("/datasources/apideck/download", {
          method: "POST",
          body: JSON.stringify({
            fileId: file.id,
            userId: profile.user_id,
            mimeType: file.mime_type,
            fileName: file.name,
          }),
        })
        const { publicUrl } = await response.json()
        const fileType = mapMimeTypeToFileType(file.mime_type)

        form.setValue("url", publicUrl)
        form.setValue("type", fileType)

        setIsDownloadingFile(false)
      },
    })
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
    <div>
      <div className="flex items-center space-x-4 py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-md"
        />
        <Button
          size="sm"
          onClick={() => {
            setOpen(true)
          }}
        >
          {form.control._formState.isSubmitting || isDownloadingFile ? (
            <Spinner />
          ) : (
            "New Datasource"
          )}
        </Button>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            setSelectedType(null)
            setIsOpeningVault(false)
            if (!value) {
              form.reset()
            }
          }}
        >
          <DialogContent>
            <Form {...form}>
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
                  {!selectedType ? (
                    <div className="flex flex-col space-y-4">
                      {process.env.NEXT_PUBLIC_APIDECK_API_ID && (
                        <Alert className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <AlertTitle>Cloud Storage Services</AlertTitle>
                            <AlertDescription className="text-muted-foreground">
                              Import from Google Drive, Dropbox, Box etc.
                            </AlertDescription>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                              setIsOpeningVault(true)
                              await openVault()
                              setSelectedType("files")
                              setOpen(false)
                            }}
                          >
                            {isOpeningVault ? <Spinner /> : "Add files"}
                          </Button>
                        </Alert>
                      )}
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Local files</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Import local files.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("local")
                          }}
                        >
                          Upload files
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>YouTube</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Import from YouTube
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("youtube")
                            form.setValue("type", "YOUTUBE")
                          }}
                        >
                          Import
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Webpages</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Import from any webpage or URL.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("webpage")
                            form.setValue("type", "WEBPAGE")
                          }}
                        >
                          Add webpage
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Github</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Import a repository.
                          </AlertDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedType("github")
                            form.setValue("type", "GITHUB_REPOSITORY")
                          }}
                        >
                          Add repo
                        </Button>
                      </Alert>
                      <Alert className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <AlertTitle>Apps</AlertTitle>
                          <AlertDescription className="text-muted-foreground">
                            Connect third-party applications.
                          </AlertDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          Coming soon
                        </Button>
                      </Alert>
                    </div>
                  ) : (
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
                  )}
                  {selectedType === "youtube" && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g https://www.youtube.com/watch?v=qhygOGPlC74"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {selectedType === "webpage" && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g https://www.superagent.sh"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {selectedType === "github" && (
                    <>
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URLs</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g https://github.com/homanp/superagent"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metadata.branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g main" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {selectedType === "local" && (
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
                  )}
                  {selectedType === "files" && (
                    <div>
                      {!selectedFile ? (
                        <div className="relative flex flex-col items-center justify-between space-y-4 rounded-lg border border-dashed p-4">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm">Connect to your accounts</p>
                            <p className="text-sm text-muted-foreground">
                              Google Drive, Dropbox, Box etc.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openVault()}
                            variant="secondary"
                          >
                            Select file
                          </Button>
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
                  )}
                </div>
                {selectedType && (
                  <DialogFooter>
                    <Button type="submit" size="sm" className="w-full">
                      {form.control._formState.isSubmitting ||
                      isDownloadingFile ? (
                        <Spinner />
                      ) : (
                        "Create datasource"
                      )}
                    </Button>
                  </DialogFooter>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No datasources found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        className="py-4"
        table={table}
        currentPageNumber={currentPageNumber}
      />
      <Toaster />
    </div>
  )
}
