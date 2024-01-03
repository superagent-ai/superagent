"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { VectorDb } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RxCheckCircled, RxCircle } from "react-icons/rx"
import * as z from "zod"

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
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

const pineconeSchema = z.object({
  PINECONE_API_KEY: z.string(),
  PINECONE_ENVIRONMENT: z.string(),
  PINECONE_INDEX: z.string(),
})

const qdrantSchema = z.object({
  QDRANT_API_KEY: z.string(),
  QDRANT_HOST: z.string(),
  QDRANT_INDEX: z.string(),
})

const astraDbSchema = z.object({
  ASTRA_DB_APPLICATION_TOKEN: z.string(),
  ASTRA_DB_REGION: z.string(),
  ASTRA_DB_ID: z.string(),
  ASTRA_DB_COLLECTION_NAME: z.string(),
  ASTRA_DB_KEYSPACE_NAME: z.string(),
})

const weaviateSchema = z.object({
  WEAVIATE_API_KEY: z.string(),
  WEAVIATE_URL: z.string(),
  WEAVIATE_INDEX: z.string(),
})

const formSchema = z.object({
  options: z.union([
    pineconeSchema,
    qdrantSchema,
    astraDbSchema,
    weaviateSchema,
  ]),
})

export default function VectorDbClientPage({
  vectorDbsData,
  profile,
}: {
  vectorDbsData: any[]
  profile: Profile
}) {
  const vectorDbs = useMemo(
    () => vectorDbsData.map((vectorDbData: any) => new VectorDb(vectorDbData)),
    [vectorDbsData]
  )

  return (
    <div className="grid grid-cols-5 gap-4">
      {siteConfig.vectorDbs.map((vectorDb) => (
        <VectorDbProviderCard
          api_key={profile?.api_key}
          vectorDb={vectorDb}
          vectorDbs={vectorDbs}
        />
      ))}
      <Toaster />
    </div>
  )
}

interface VectorDbProviderCardProps {
  api_key: string
  vectorDb: (typeof siteConfig.vectorDbs)[number]
  vectorDbs: VectorDb[]
}

const VectorDbProviderCard = ({
  api_key,
  vectorDb,
  vectorDbs,
}: VectorDbProviderCardProps) => {
  const api = new Api(api_key)
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState<string | null>(null)

  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      if (vectorDbs.length === 0) {
        await api.createVectorDb({ ...payload, provider: open })
      } else {
        await api.patchVectorDb(vectorDbs[0].id, { ...payload, provider: open })
      }
      toast({
        description: "Vector Database configuration saved",
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
    <div key={vectorDb.provider}>
      <Card>
        <CardHeader className="flex flex-col">
          <div className="space-y-4">
            <CardTitle>
              <div className="flex items-center space-x-2">
                {/* <Image
                src={vectorDb.logo}
                width={40}
                height={40}
                alt={vectorDb.name}
              /> */}
                <p>{vectorDb.name}</p>
              </div>
            </CardTitle>
            <CardDescription className="h-[80px]">
              {vectorDb.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-muted-foreground">
            {vectorDbs.find((obj) => obj.provider === vectorDb.provider) ? (
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
            <Button
              size="sm"
              variant="default"
              onClick={() => setOpen(vectorDb.provider)}
            >
              Configure
            </Button>
            <Dialog
              open={open === vectorDb.provider}
              onOpenChange={(value) => {
                setOpen(value ? vectorDb.provider : null)
                if (!value) form.reset()
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure {vectorDb.name}</DialogTitle>
                  <DialogDescription>
                    {vectorDb.formDescription}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                  >
                    {vectorDb.metadata.map((metadataField) => (
                      <FormField
                        key={metadataField.key}
                        control={form.control}
                        // @ts-ignore
                        name={`options.${metadataField.key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{metadataField.label}</FormLabel>
                            {metadataField.type === "input" && (
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} type="text" />
                              </FormControl>
                            )}
                            {"helpText" in metadataField && (
                              <FormDescription>
                                {metadataField.helpText as string}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <DialogFooter>
                      <Button type="submit" size="sm" className="w-full">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
