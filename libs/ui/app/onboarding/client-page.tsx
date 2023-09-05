"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const formSchema = z.object({
  first_name: z.string().nonempty("Invalid first name."),
  last_name: z.string().nonempty("Invalid last name."),
  company: z.string(),
})

export default function OnboardingClientPage() {
  const api = new Api()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("OK")
    const { first_name, last_name, company } = values
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const {
      data: { token: api_key },
    } = await api.createApiKey()
    const { error } = await supabase
      .from("profiles")
      .update({ api_key, first_name, last_name, company, is_onboarded: true })
      .eq("user_id", user?.id)

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })

      return
    }

    toast({
      description: "Settings updated!",
    })

    router.push("/agents")
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
