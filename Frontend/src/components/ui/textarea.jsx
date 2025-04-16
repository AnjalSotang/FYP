import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
    className={cn(
      "flex min-h-[60px] w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-base text-white shadow-sm transition-colors placeholder:text-navy-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
