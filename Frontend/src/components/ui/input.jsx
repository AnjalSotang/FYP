import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-1 text-base shadow-sm transition-colors text-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-navy-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }