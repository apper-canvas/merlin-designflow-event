import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-gradient-primary text-white hover:shadow-premium focus:ring-primary": variant === "default",
          "bg-gradient-accent text-white hover:shadow-accent focus:ring-accent": variant === "accent",
          "bg-surface text-primary border border-gray-200 hover:bg-gray-50 focus:ring-primary": variant === "outline",
          "text-primary hover:bg-surface focus:ring-primary": variant === "ghost",
        },
        {
          "h-8 px-3 text-xs": size === "sm",
          "h-10 px-4 text-sm": size === "default",
          "h-12 px-6 text-base": size === "lg",
        },
        "rounded-lg",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button