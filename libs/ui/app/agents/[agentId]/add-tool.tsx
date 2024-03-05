"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { json } from "@codemirror/lang-json"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColumnFiltersState } from "@tanstack/react-table"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import CodeMirror from "@uiw/react-codemirror"
import { useForm } from "react-hook-form"
import { TbPlus } from "react-icons/tb"
import * as z from "zod"

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
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

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

function AddTool({
  profile,
  agent,
  onSuccess,
}: {
  profile: any
  agent: any
  onSuccess: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
  const [open, setOpen] = React.useState(false)

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
      const { data: tool, error } = await api.createTool({
        ...values,
      })
      if (error) {
        toast({
          description: error?.message,
        })
        return
      }
      await api.createAgentTool(agent.id, tool.id)
      toast({
        description: "Tool created successfully",
      })
      form.reset()
      setOpen(false)
      onSuccess()
    } catch (error: any) {
      toast({
        description: error?.message,
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
                          {metadataField.type === "select" &&
                            "options" in metadataField && (
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tool type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {metadataField?.options?.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
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
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTool
