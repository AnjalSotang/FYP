import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto border border-[#1A3467] shadow-[0px_4px_10px_rgba(0,0,0,0.6)] rounded-l">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm text-white border-separate border-spacing-0 rounded-xl",
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b border-[#1A3467]",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t border-[#1A3467] font-medium text-white", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

  const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-[#1A3467] transition-colors hover:bg-[#182F5D] hover:shadow-md",
        className
      )}
      {...props}
    />
  ));
  TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("h-12 px-4 text-left align-middle font-semibold text-white text-lg border-b border-[#1A3467]", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-3 align-middle text-white", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
