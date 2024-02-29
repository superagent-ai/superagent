"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ApiKey } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { TbCopy } from "react-icons/tb"
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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CodeBlock } from "@/components/codeblock"

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
})

export function CreateSecretKey({ profile }: { profile: any }) {
  const api = new Api(profile?.api_key)

  const { toast } = useToast()
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [createApiKeyDialogOpen, setCreateApiKeyDialogOpen] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await api.createApiKey(values)

    if (!res?.success) {
      toast({
        title: "Error",
        description: "An error occured while creating the API key",
      })
      return
    }

    const apiKey = new ApiKey(res?.data)

    router.refresh()
    if (apiKey?.apiKey) setGeneratedKey(apiKey.apiKey)

    setCreateApiKeyDialogOpen(false)
  }

  return (
    <>
      {generatedKey && (
        <Dialog
          defaultOpen={true}
          onOpenChange={() => {
            setGeneratedKey(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                You can view the API key ionce. But you can always create a new
                one.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-hidden">
              <div className="flex space-x-2">
                <Input
                  value={generatedKey}
                  readOnly
                  className="w-full"
                  placeholder="Generated API key"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey)
                    toast({
                      title: "API key copied to clipboard",
                    })
                  }}
                  variant="outline"
                >
                  <TbCopy />
                </Button>
              </div>

              <Tabs defaultValue="python">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">
                    Javascript/Typescript
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="python">
                  <CodeBlock
                    value={`from superagent.client import Superagent\n\n client = Superagent(\n   token="${generatedKey}",\n   base_url="https://api.beta.superagent.sh" # or your local environment\n)`}
                    language="python"
                  />
                </TabsContent>
                <TabsContent value="javascript">
                  <CodeBlock
                    value={`import {SuperAgentClient} from "superagentai-js";\n\n const client = new SuperAgentClient({\n   token: "${generatedKey}", \n   environment: "https://api.beta.superagent.sh" // or your local environment \n });`}
                    language="javascript"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog
        open={createApiKeyDialogOpen}
        onOpenChange={(open) => {
          setCreateApiKeyDialogOpen(open)
          form.clearErrors()
          form.reset()
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default">
            <span className="mr-1 text-lg">+ </span> Create a new API key
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new API key</DialogTitle>
            <DialogDescription>
              This API key will be used to authenticate requests to the API.
            </DialogDescription>
          </DialogHeader>

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
                    <FormControl>
                      <Input placeholder="Enter API key name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" variant="default">
                  Create API key
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}
