"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export default function PlainCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 8px 30px -10px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      {...props}
      className={cn(
        "border border-border rounded-lg bg-card p-6 w-fit h-fit transition-all bg-linear-to-br from-primary/10 via-background to-background hover:border-primary/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
