import { cn } from "@/lib/utils";
import React from "react";

export default function PlainCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg bg-card p-6 w-fit h-fit transition-all bg-linear-to-br from-primary/10 via-background to-background",
        className
      )}
    >
      {children}
    </div>
  );
}
