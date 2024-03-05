"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SiMicrosoftazure, SiOpenai } from "react-icons/si"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  provider: z.string(),
  apiKey: z.string().nonempty({
    message: "API key is required.",
  }),
  options: z.record(z.any()),
})

export default function LLMDialog({
  profile,
  isOpen,
  title,
  description,
  onOpenChange,
  onSave,
  workflow,
}: {
  profile: Profile
  isOpen: boolean
  title: string
  description: string
  workflow?: any
  onSave?: () => void
  onOpenChange: (change: any) => void
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      options: {},
      provider: "OPENAI",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: llm } = await api.createLLM({ ...values })
    for (const _workflow of workflow?.steps) {
      await api.createAgentLLM(_workflow.agentId, llm.id)
    }
    if (onSave) onSave()
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="openai" className="w-full">
          <TabsList>
            <TabsTrigger value="openai" className="space-x-2">
              <SiOpenai />
              <span>OPENAI</span>
            </TabsTrigger>
            <TabsTrigger value="azure-openai" className="space-x-2">
              <SiMicrosoftazure />
              <span>AZURE-OPENAI</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="openai">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 w-full space-y-4"
              >
                <div className="flex flex-col space-y-6">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your api key"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input
                    defaultValue="OPENAI"
                    name="provider"
                    className="hidden h-0 w-0"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="azure-openai">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 w-full space-y-4"
              >
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your api key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.azure_endpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Azure endpoint URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Azure endpoint URL."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.openai_api_version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API version</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your openai api version"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.azure_deployment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Azure deployment name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Azure deployment name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <input
                  defaultValue="AZURE_OPENAI"
                  name="provider"
                  className="hidden h-0 w-0"
                />
                <div className="flex justify-end">
                  <Button size="sm" type="submit">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
