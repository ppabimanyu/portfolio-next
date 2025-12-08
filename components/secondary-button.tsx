"use client";

import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SecondaryButtonProps = React.ComponentProps<"button">;

export default function SecondaryButton({
  children,
  className,
  ...props
}: SecondaryButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-transparent border text-foreground hover:bg-foreground/10 transition-all",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
