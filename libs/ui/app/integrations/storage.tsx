"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

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

const supabasePgVectorSchema = z.object({
  SUPABASE_DB_URL: z.string(),
  SUPABASE_TABLE_NAME: z.string(),
})

const formSchema = z.object({
  options: z.union([
    pineconeSchema,
    qdrantSchema,
    astraDbSchema,
    weaviateSchema,
    supabasePgVectorSchema,
  ]),
})

export default function Storage({
  profile,
  configuredDBs,
}: {
  profile: any
  configuredDBs: any
}) {
  const [open, setOpen] = React.useState<boolean>()
  const [selectedDB, setSelectedDB] = React.useState<any>()
  const router = useRouter()
  const api = new Api(profile.api_key)
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

    const isExistingConnection = configuredDBs.find(
      (db: any) => db.provider === selectedDB.provider
    )

    if (isExistingConnection) {
      await api.patchVectorDb(isExistingConnection.id, {
        ...payload,
        provider: selectedDB.provider,
      })
    } else {
      await api.createVectorDb({ ...payload, provider: selectedDB.provider })
    }

    form.reset()
    router.refresh()
    setOpen(false)
  }

  return (
    <div className="container flex max-w-4xl flex-col space-y-10 pt-10">
      <div className="flex flex-col">
        <p className="text-lg font-medium">Storage</p>
        <p className="text-muted-foreground">
          Connect your vector database to store your embeddings in your own
          databases.
        </p>
      </div>
      <div className="flex-col border-b">
        {siteConfig.vectorDbs.map((vectorDb) => {
          const isConfigured = configuredDBs.find(
            (db: any) => db.provider === vectorDb.provider
          )

          return (
            <div
              className="flex items-center justify-between border-t py-4"
              key={vectorDb.provider}
            >
              <div className="flex items-center space-x-4">
                {isConfigured ? (
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted" />
                )}
                <div className="flex items-center space-x-3">
                  <Image
                    src={vectorDb.logo}
                    width="40"
                    height="40"
                    alt={vectorDb.name}
                  />
                  <p className="font-medium">{vectorDb.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDB(vectorDb)
                  setOpen(true)
                }}
              >
                Settings
              </Button>
            </div>
          )
        })}
      </div>
      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset()
          }

          setOpen(isOpen)
        }}
        open={open}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDB?.name}</DialogTitle>
            <DialogDescription>
              Connect your private {selectedDB?.name} account to Superagent.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                {selectedDB?.metadata.map((metadataField: any) => (
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
                            <Input
                              {...field}
                              placeholder={
                                "placeholder" in metadataField
                                  ? metadataField.placeholder
                                  : ""
                              }
                              type="text"
                            />
                          </FormControl>
                        )}
                        {"helpText" in metadataField && (
                          <FormDescription className="pb-2">
                            {metadataField.helpText as string}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit" size="sm">
                    {form.control._formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Save configuration"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
