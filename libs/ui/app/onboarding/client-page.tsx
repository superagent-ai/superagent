"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import Stripe from "stripe"
import * as z from "zod"

import { initialSamlValue } from "@/config/saml"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { stripe } from "@/lib/stripe"
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
  company: z.string().nonempty("Enter a company name"),
})

export default function OnboardingClientPage() {
  const api = new Api()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let client = null
    const { first_name, last_name, company } = values
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      toast({
        description: `Ooops! User email is missing!`,
        variant: "destructive",
      })
      return
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single()

    if (!profile.api_key) {
      const {
        data: { token: api_key },
      } = await api.createApiUser({
        email: user.email,
        firstName: first_name,
        lastName: last_name,
        company,
      })
      await supabase
        .from("profiles")
        .update({
          api_key,
        })
        .eq("user_id", user?.id)
      client = new Api(api_key)
    } else {
      client = new Api(profile.api_key)
    }

    const params: Stripe.CustomerCreateParams = {
      name: company,
      email: user.email,
      metadata: {
        first_name,
        last_name,
      },
    }
    let customer: Stripe.Customer | null = null
    let subscription: Stripe.Subscription | null = null
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      customer = await stripe.customers.create(params)
      subscription = await stripe.subscriptions.create({
        customer: customer?.id,
        items: [
          {
            price: siteConfig.paymentPlans.hobby,
          },
        ],
        trial_period_days: 7,
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
      })
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name,
        last_name,
        company,
        stripe_customer_id: customer?.id,
        stripe_plan_id: subscription?.id,
        is_onboarded: true,
      })
      .eq("user_id", user?.id)

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
        variant: "destructive",
      })

      return
    }

    const { data: workflow } = await client.createWorkflow({
      name: "My Workflow",
      description: "My new workflow",
    })

    await client.generateWorkflow(workflow.id, initialSamlValue)

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
