"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RxCheckCircled, RxCircle } from "react-icons/rx"
import * as z from "zod"

import { LLM } from "@/types/llm"
import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  apiKey: z.string().nonempty({
    message: "API key is required.",
  }),
  options: z.record(z.any()),
})

export default function LLMClientPage({
  llms,
  profile,
}: {
  llms: any
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = React.useState<string | null>(null)
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      options: {},
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      options:
        Object.keys(values.options).length === 0 ? undefined : values.options,
    }
    try {
      if (llms.length === 0) {
        await api.createLLM({ ...payload, provider: open })
      } else {
        await api.patchLLM(llms[0].id, { ...payload, provider: open })
      }
      toast({
        description: "LLM configuration saved",
      })
      setOpen(null)
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {siteConfig.llms.map((llm) => (
        <div key={llm.id}>
          <Card>
            <CardHeader className="flex flex-col">
              <div className="space-y-4">
                <CardTitle>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={llm.logo}
                      width={40}
                      height={40}
                      alt={llm.name}
                    />
                    <p>{llm.name}</p>
                  </div>
                </CardTitle>
                <CardDescription className="h-[80px]">
                  {llm.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex justify-between text-sm">
                {llms.find((obj: LLM) => obj.provider === llm.id) ? (
                  <div className="flex items-center">
                    <RxCheckCircled className="mr-1 h-3 w-3 text-amber-400" />
                    Enabled
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RxCircle className="mr-1 h-3 w-3" />
                    Disabled
                  </div>
                )}
                {llm.disabled ? (
                  <Button size="sm" variant="outline" disabled={true}>
                    Coming soon
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setOpen(llm.id)}
                    >
                      Configure
                    </Button>
                    <Dialog
                      open={open === llm.id}
                      onOpenChange={(value) => {
                        setOpen(value ? llm.id : null)
                        if (!value) {
                          form.reset()
                        }
                      }}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configure {llm.name}</DialogTitle>
                          <DialogDescription>
                            Enter your OpenAI API key below. You can find your
                            key by logging into your OpenAI account.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-4"
                          >
                            {llm.id === "OPENAI" && (
                              <div className="flex flex-col space-y-2">
                                <FormField
                                  control={form.control}
                                  name="apiKey"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>API key</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your api key"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                            {llm.id === "AZURE_OPENAI" && (
                              <div className="flex flex-col space-y-2">
                                <FormField
                                  control={form.control}
                                  name="apiKey"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>API key</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your api key"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="options.openai_api_base"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>OpenAI API base</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your openai api base"
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
                                      <FormLabel>OpenAI API version</FormLabel>
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
                                  name="options.deployment_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        OpenAI deployment name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your openai deployment name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                type="submit"
                                size="sm"
                                className="w-full"
                              >
                                {form.control._formState.isSubmitting ? (
                                  <Spinner />
                                ) : (
                                  "Save settings"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      <Toaster />
    </div>
  )
}
