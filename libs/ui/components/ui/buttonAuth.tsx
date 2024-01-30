import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:opacity-75",
  {
    variants: {
      variant: {
        active: "bg-transparent text-white border border-white-100",
        default: "bg-transparent text-white border border-white-100",
        destructive: "bg-transparent text-white border border-white-100",
        outline: "bg-transparent text-white border border-white-100 hover:bg-transparent hover:text-white",
        secondary: "bg-transparent text-white border border-white-100",
        ghost: "bg-transparent text-white hover:bg-transparent hover:text-white",
        link: "bg-transparent text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonAuthProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ButtonAuth = React.forwardRef<HTMLButtonElement, ButtonAuthProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonAuth.displayName = "ButtonAuth"

export { ButtonAuth }
