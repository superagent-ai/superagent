"use client"

import { useRouter } from "next/navigation"
import { Workflow } from "@/models/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
})

interface UpdateProps {
  workflowData: any
  api_key: string
}

export default function Update({ workflowData, api_key }: UpdateProps) {
  const workflow = new Workflow(workflowData)
  const api = new Api(api_key)
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workflow.name,
      description: workflow.description,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.patchWorkflow(workflow.id, {
        ...values,
      })
      toast({
        description: "Workflow updated successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 overflow-hidden"
      >
        <h2 className="text-lg font-bold">Workflow Settings</h2>
        <div className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g My Workflow" {...field} />
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
                  <Textarea placeholder="Useful for doing X..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" size="sm" className="w-full">
            {form.control._formState.isSubmitting ? (
              <Spinner />
            ) : (
              "Update Workflow"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
