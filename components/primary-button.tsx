import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ComponentProps<"button">;

export default function PrimaryButton({
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      size={"sm"}
      className={cn(
        // "rounded-full bg-transparent inset-shadow-sm inset-shadow-primary text-primary shadow-lg hover:bg-primary/20 transition-all",
        "rounded-full bg-primary text-background border",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
