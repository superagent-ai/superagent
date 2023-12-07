"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { useAsync } from "react-use"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { MultiSelect } from "@/components/ui/multi-select"
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  profile: Profile
}

interface Datasource {
  id: string
  name: string
}

interface Tool {
  id: string
  name: string
}

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  isActive: z.boolean().default(true),
  llmModel: z.string().nonempty({
    message: "Model is required",
  }),
  tools: z.array(z.string()),
  datasources: z.array(z.string()),
  prompt: z.string(),
})

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      llmModel: "GPT_3_5_TURBO_16K_0613",
      isActive: true,
      tools: [],
      datasources: [],
      prompt: "You are an helpful AI Assistant",
    },
  })
  const { value: llms = [] } = useAsync(async () => {
    const { data } = await api.getLLMs()
    return data
  }, [])
  const { value: tools = [] } = useAsync(async () => {
    const { data } = await api.getTools()
    return data
  }, [])
  const { value: datasources = [] } = useAsync(async () => {
    const { data } = await api.getDatasources()
    return data
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { tools, datasources } = values
      const { data: agent } = await api.createAgent({
        ...values,
        llmModel: siteConfig.defaultLLM,
      })

      for (const toolId of tools) {
        await api.createAgentTool(agent.id, toolId)
      }

      for (const datasourceId of datasources) {
        await api.createAgentDatasource(agent.id, datasourceId)
      }

      toast({
        description: "New agent created!",
      })
      router.refresh()
      router.push(`/agents/${agent.id}`)
    } catch (error: any) {
      toast({
        description: error?.message,
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
        <Dialog>
          <DialogTrigger
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            <p>New Agent</p>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Create new agent</DialogTitle>
                  <DialogDescription>
                    Attach datasources and APIs to you agent to make it more
                    powerful.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                  {llms.length === 0 && (
                    <Alert className="flex justify-between">
                      <div className="flex flex-col">
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription className="text-gray-500">
                          You haven&apos;t configured a LLM.
                        </AlertDescription>
                      </div>
                      <Link passHref href="/llms">
                        <Button size="sm">Configure</Button>
                      </Link>
                    </Alert>
                  )}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g My agent" {...field} />
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
                            placeholder="E.g this agent is an expert at..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {tools.length > 0 && (
                    <FormField
                      control={form.control}
                      name="tools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>APIs</FormLabel>
                          <FormControl>
                            <MultiSelect
                              placeholder="Select API..."
                              data={tools.map((tool: Tool) => ({
                                value: tool.id,
                                label: tool.name,
                              }))}
                              onChange={(values: { value: string }[]) => {
                                field.onChange(values.map(({ value }) => value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {datasources.length > 0 && (
                    <FormField
                      control={form.control}
                      name="datasources"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Datasources</FormLabel>
                          <FormControl>
                            <MultiSelect
                              placeholder="Select datasource..."
                              data={datasources.map(
                                (datasource: Datasource) => ({
                                  value: datasource.id,
                                  label: datasource.name,
                                })
                              )}
                              onChange={(values: { value: string }[]) => {
                                field.onChange(values.map(({ value }) => value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button
                    disabled={llms.length === 0}
                    type="submit"
                    size="sm"
                    className="w-full"
                  >
                    {form.control._formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Create agent"
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
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    router.push(`/agents/${(row.original as any).id}`)
                  }
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  )
}
