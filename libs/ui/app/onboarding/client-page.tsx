"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { onboardFormSchema } from "../api/onboard/form-schema"

export default function OnboardingClientPage() {
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof onboardFormSchema>>({
    resolver: zodResolver(onboardFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
    },
  })

  async function onSubmit(values: z.infer<typeof onboardFormSchema>) {
    const res = await fetch("/api/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const profile = await res.json()

    if (!res.ok || !profile) {
      return toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    }

    const api = new Api(profile?.api_key)

    const { data: workflow } = await api.createWorkflow({
      name: "My Workflow",
      description: "My new workflow",
    })

    await api.generateWorkflow(workflow.id, initialSamlValue)

    window.location.href = `/workflows/${workflow.id}`
  }

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="container max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome!</CardTitle>
                <CardDescription>
                  Tell us a bit more about yourself.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between space-x-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your company name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="sm" className="w-full">
                  {form.control._formState.isSubmitting ? <Spinner /> : "Save"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  )
}
