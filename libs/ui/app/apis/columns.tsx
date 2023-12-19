"use client"

import { useRouter } from "next/navigation"
import { json } from "@codemirror/lang-json"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColumnDef } from "@tanstack/react-table"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import CodeMirror from "@uiw/react-codemirror"
import { MoreHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast, useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  metadata: z.any(),
})

export type DataType = {
  id: string
  name: string
  type: string
  description: string
  metadata: any
}

export function DeleteButton({
  id,
  profile,
}: {
  id: string
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const handleDeleteTool = async () => {
    try {
      await api.deleteTool(id)
      toast({
        description: "API deleted successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: "Oops! Something went wrong.",
        variant: "destructive",
      })
    }
  }

  return <DropdownMenuItem onSelect={handleDeleteTool}>Delete</DropdownMenuItem>
}

export function CopyButton({ id }: { id: string }) {
  const { toast } = useToast()
  return (
    <DropdownMenuItem
      onClick={() => {
        navigator.clipboard.writeText(id)
        toast({
          description: "API ID copied to clipboard",
        })
      }}
    >
      Copy ID
    </DropdownMenuItem>
  )
}

export function EditTool({
  tool,
  profile,
}: {
  tool: DataType
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tool.name,
      description: tool.description,
      metadata: tool.metadata != "" && JSON.parse(tool.metadata),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.patchTool(tool.id, {
        type: tool.type,
        returnDirect: false,
        ...values,
      })
      toast({
        description: "Tool updated successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>Update API connection</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
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
                    <Textarea placeholder="Useful for doing X..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {siteConfig.toolTypes
              .find((toolType) => toolType.value === tool.type)
              ?.metadata.map((metadataField) => (
                <FormField
                  key={metadataField.key}
                  control={form.control}
                  name={`metadata.${metadataField.key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{metadataField.label}</FormLabel>
                      {metadataField.type === "input" && (
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      )}
                      {metadataField.type === "password" && (
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                      )}
                      {metadataField.type === "json" && (
                        <div className="overflow-hidden rounded-lg">
                          <CodeMirror
                            className="rounded-lg text-xs"
                            extensions={[json()]}
                            theme={vscodeDark}
                            onChange={(value) => {
                              try {
                                JSON.parse(value)
                                field.onChange(value)
                                form.clearErrors(
                                  `metadata.${metadataField.key}`
                                )
                              } catch (error) {
                                form.setError(`metadata.${metadataField.key}`, {
                                  type: "manual",
                                  message: "Invalid JSON",
                                })
                              }
                            }}
                            value={field.value}
                          />
                        </div>
                      )}
                      {"helpText" in metadataField && (
                        <FormDescription>
                          {metadataField.helpText}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
          </div>
          <DialogFooter>
            <Button type="submit" size="sm" className="w-full">
              {form.control._formState.isSubmitting ? (
                <Spinner />
              ) : (
                "Update API"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export const columns = (profile: Profile): ColumnDef<DataType>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "type",
    cell: ({ row, column }) => (
      <Badge variant="secondary">{row.getValue(column.id)}</Badge>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const api = row.original

      return (
        <div className="flex justify-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <CopyButton id={api.id} />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <DeleteButton id={api.id} profile={profile} />
              </DropdownMenuContent>
            </DropdownMenu>
            <EditTool tool={api} profile={profile} />
          </Dialog>
        </div>
      )
    },
  },
]
