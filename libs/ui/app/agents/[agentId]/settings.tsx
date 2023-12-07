"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import Avatar from "./avatar"

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  initialMessage: z.string(),
  llms: z.string(),
  isActive: z.boolean().default(true),
  llmModel: z.string().nonempty({
    message: "Model is required",
  }),
  prompt: z.string(),
  tools: z.array(z.string()),
  datasources: z.array(z.string()),
  avatar: z.string().nullable(),
})

interface Datasource {
  id: string
  name: string
}

interface Tool {
  id: string
  name: string
}

interface SettingsProps {
  tools: Tool[]
  agent: Agent
  profile: Profile
  datasources: Datasource[]
}

export default function Settings({
  agent,
  datasources,
  tools,
  profile,
}: SettingsProps) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agent.name,
      description: agent.description,
      initialMessage: agent.initialMessage || "",
      llms: agent.llms?.[0]?.llm.provider,
      llmModel: agent.llmModel,
      isActive: true,
      prompt: agent.prompt,
      tools: [],
      datasources: [],
      avatar: agent.avatar,
    },
  })
  const avatar = form.watch("avatar")
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { tools, datasources } = values

    const updateResources = async (
      originalIds: string[],
      newIds: string[],
      createResource: (id: string) => Promise<void>,
      deleteResource: (id: string) => Promise<void>
    ) => {
      const resourcesToCreate = newIds.filter((id) => !originalIds.includes(id))
      const resourcesToRemove = originalIds.filter((id) => !newIds.includes(id))

      for (const resourceId of resourcesToCreate) {
        await createResource(resourceId)
      }

      for (const resourceId of resourcesToRemove) {
        await deleteResource(resourceId)
      }
    }

    try {
      await api.patchAgent(agent.id, values)

      const originalToolIds = agent.tools.map((tool: any) => tool.tool.id)
      await updateResources(
        originalToolIds,
        tools,
        (toolId) => api.createAgentTool(agent.id, toolId),
        (toolId) => api.deleteAgentTool(agent.id, toolId)
      )

      const originalDatasourceIds = agent.datasources.map(
        (datasource: any) => datasource.datasource.id
      )
      await updateResources(
        originalDatasourceIds,
        datasources,
        (datasourceId) => api.createAgentDatasource(agent.id, datasourceId),
        (datasourceId) => api.deleteAgentDatasource(agent.id, datasourceId)
      )

      toast({
        description: "Agent updated",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpload = React.useCallback(
    async (url: any) => {
      form.setValue("avatar", url)
    },
    [form]
  )

  return (
    <ScrollArea className="relative flex grow max-w-lg flex-1 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <Avatar
            accept=".jpg, .jpeg, .png"
            onSelect={handleUpload}
            imageUrl={avatar || agent.avatar || "/logo.png"}
          />
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
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[200px]"
                    placeholder="E.g you are an ai assistant that..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="initialMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intro message</FormLabel>
                <FormControl>
                  <Input placeholder="E.g Hi, how can I help you?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            <FormLabel>Model</FormLabel>
            {agent.llms.length > 0 ? (
              <div className="flex justify-between space-x-2">
                <FormField
                  control={form.control}
                  name="llms"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            key={agent.llms[0]?.llm.provider}
                            value={agent.llms[0]?.llm.provider}
                          >
                            {agent.llms[0]?.llm.provider}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="llmModel"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {siteConfig.llms
                            .find(
                              (llm) => llm.id === agent.llms[0].llm.provider
                            )
                            ?.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-4 rounded-lg border border-red-500 p-4">
                <p className="text-sm">Heads up!</p>
                <p className="text-muted-foreground text-sm">
                  You need to add an LLM to this agent for it work. This can be
                  done through the SDK or API.
                </p>
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="tools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>APIs</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Select api..."
                    data={tools.map((tool: any) => ({
                      value: tool.id,
                      label: tool.name,
                    }))}
                    onChange={(values: { value: string }[]) => {
                      field.onChange(values.map(({ value }) => value))
                    }}
                    selectedValues={agent.tools.map((tool: any) => ({
                      value: tool.tool.id,
                      label: tool.tool.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="datasources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datasources</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Select datasource..."
                    data={datasources.map((datasource: Datasource) => ({
                      value: datasource.id,
                      label: datasource.name,
                    }))}
                    onChange={(values: { value: string }[]) => {
                      field.onChange(values.map(({ value }) => value))
                    }}
                    selectedValues={agent.datasources.map(
                      (datasource: any) => ({
                        value: datasource.datasource.id,
                        label: datasource.datasource.name,
                      })
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="inset-x-0 bottom-0 flex py-4">
            <Button
              type="submit"
              size="sm"
              className="w-full"
              variant="secondary"
            >
              {form.control._formState.isSubmitting ? (
                <Spinner />
              ) : (
                "Update agent"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </ScrollArea>
  )
}
