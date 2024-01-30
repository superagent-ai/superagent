"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { ButtonAuth } from "@/components/ui/buttonAuth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Logo from "@/components/logo"
import { GoogleIcon } from "@/components/svg/GoogleIcon"
import { MicrosoftIcon } from "@/components/svg/MicrosoftIcon"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

export default function IndexPage() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const { ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email } = values
    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      toast({
        description: `Ooops! ${error?.message}`,
      })

      return
    }

    toast({
      description: "🎉 Yay! Check your email for sign in link.",
    })
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        if (event === "SIGNED_IN") {
          window.location.href = "/agents"
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <section className="container flex h-screen max-w-md flex-col justify-center space-y-8">
      <div className="flex flex-col space-y-4 text-center">
        <p className="text-3xl font-bold">Crea una cuenta</p>
        <p className="text-muted-foreground text-sm">
          Coloca tu email debajo para crear tu cuenta
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" className="w-full">
            {form.control._formState.isSubmitting ? (
              <Spinner />
            ) : (
              "Send password"
            )}
          </Button>
        </form>
      </Form>
      <p className="my-6 text-center uppercase">Or continue with</p>
      <div className="flex flex-col gap-5">
        <ButtonAuth className="flex items-center gap-3"><GoogleIcon/> <span>Sign In with Google</span></ButtonAuth>
        <ButtonAuth className="flex items-center gap-3"><MicrosoftIcon/> <span>Sign In with Microsoft</span></ButtonAuth>
      </div>
      <p className="mx-auto w-[60%] justify-center text-center text-xs text-gray-300">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </p>
      <Toaster />
    </section>
  )
}
