import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-gradient-primary text-white": variant === "default",
          "bg-gradient-success text-white": variant === "success",
          "bg-gradient-accent text-white": variant === "warning",
          "bg-red-100 text-red-800": variant === "error",
          "bg-blue-100 text-blue-800": variant === "info",
          "bg-surface text-secondary border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge