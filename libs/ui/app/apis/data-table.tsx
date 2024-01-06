"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { json } from "@codemirror/lang-json"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import CodeMirror from "@uiw/react-codemirror"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  type: z.string().nonempty({
    message: "Type is required",
  }),
  metadata: z.any(),
  returnDirect: z.boolean(),
})

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
  pagination: { currentPageNumber, take, totalPages },
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [open, setOpen] = React.useState(false)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
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
      type: "BING_SEARCH",
      metadata: null,
      returnDirect: false,
    },
  })
  const type = form.watch("type")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.createTool({
        ...values,
      })
      toast({
        description: "Tool created successfully",
      })
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
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
          {form.control._formState.isSubmitting ? <Spinner /> : "New API"}
        </Button>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) {
              form.reset()
            }
          }}
        >
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Create new API connection</DialogTitle>
                  <DialogDescription>
                    Connect your agents to thousands of third-party APIs and
                    tools.
                  </DialogDescription>
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
                          <Textarea
                            placeholder="Useful for doing X..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tool type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {siteConfig.toolTypes.map((toolType) => (
                              <SelectItem
                                key={toolType.value}
                                value={toolType.value}
                              >
                                {toolType.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {siteConfig.toolTypes
                    .find((toolType) => toolType.value === type)
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
                                  onChange={field.onChange}
                                  value={
                                    "json" in metadataField
                                      ? JSON.stringify(
                                          metadataField.json,
                                          null,
                                          2
                                        )
                                      : undefined
                                  }
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
                      "Create API"
                    )}
                  </Button>
                </DialogFooter>
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
                  No tools found.
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
