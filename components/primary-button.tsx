"use client";

import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type PrimaryButtonProps = React.ComponentProps<"button">;

export default function PrimaryButton({
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-primary text-background border hover:shadow-lg hover:shadow-primary/25",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
