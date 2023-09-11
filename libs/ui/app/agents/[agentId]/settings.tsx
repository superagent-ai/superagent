"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Agent } from "@/types/agent"
import { LLM } from "@/types/llm"
import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
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
import { MultiSelect } from "@/components/ui/multi-select"
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

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  llms: z.string(),
  isActive: z.boolean().default(true),
  llmModel: z.string().nonempty({
    message: "Model is required",
  }),
  prompt: z.string(),
  tools: z.array(z.string()),
})

interface Tool {
  id: string
  name: string
}

interface SettingsProps {
  tools: Tool[]
  agent: Agent
  profile: Profile
}

export default function Settings({ agent, tools, profile }: SettingsProps) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agent.name,
      description: agent.description,
      llms: agent.llms?.[0].llm.provider,
      llmModel: agent.llmModel,
      isActive: true,
      prompt: agent.prompt,
      tools: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { tools } = values
    console.log(tools)

    try {
      await api.patchAgent(agent.id, values)
      // Create and remove tools based on agent.tools which is the original data
      const originalToolIds = agent.tools.map((tool: any) => tool.tool.id)
      const newToolIds = tools

      const toolsToCreate = newToolIds.filter(
        (id: string) => !originalToolIds.includes(id)
      )
      const toolsToRemove = originalToolIds.filter(
        (id: string) => !newToolIds.includes(id)
      )

      for (const toolId of toolsToCreate) {
        await api.createAgentTool(agent.id, toolId)
      }

      for (const toolId of toolsToRemove) {
        await api.deleteAgentTool(agent.id, toolId)
      }

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

  return (
    <div className="relative flex max-w-md flex-1 flex-col p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
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
          <div className="flex flex-col space-y-2">
            <FormLabel>Model</FormLabel>
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
                          key={agent.llms[0].llm.provider}
                          value={agent.llms[0].llm.provider}
                        >
                          {agent.llms[0].llm.provider}
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
                          .find((llm) => llm.id === "OPENAI")
                          ?.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
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
          <div className="absolute inset-x-0 bottom-0 flex p-4">
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
    </div>
  )
}
