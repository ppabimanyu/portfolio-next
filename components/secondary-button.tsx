import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type SecondaryButtonProps = React.ComponentProps<"button">;

export default function SecondaryButton({
  children,
  className,
  ...props
}: SecondaryButtonProps) {
  return (
    <Button
      size={"sm"}
      className={cn(
        // "rounded-full bg-transparent inset-shadow-sm inset-shadow-foreground text-foreground shadow-lg hover:bg-foreground/20 transition-all",
        "rounded-full bg-transparent border text-foreground hover:bg-foreground/10 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
