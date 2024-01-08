import { DialogHeader } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Api } from '@/lib/api'
import { Profile } from '@/types/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { useRouter } from "next/navigation"
import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { useAsync } from 'react-use'
import { z } from 'zod'

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

export const AgentContain = ({profile}: {profile: Profile}) => {
  const router = useRouter()
  const api = new Api(profile.api_key)

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


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: agent } = await api.createAgent({ ...values })
      await api.createAgentLLM(agent.id, llms[0]?.id)

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
    <>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Dialog>
          <DialogHeader>
            <DialogTitle>Create new agent</DialogTitle>
            <DialogDescription>
              Attach datasources and APIs to you agent to make it more
              powerful.
            </DialogDescription>
          </DialogHeader>
        </Dialog>
        <div className="flex flex-col space-y-2">
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
        </div>
      </form>
    </Form>
    </>
  )
}
