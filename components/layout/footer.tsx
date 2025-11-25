import { profileData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function Footer({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="w-5xl flex justify-between mx-auto">
        <p className="text-sm">Build with Next.js, Deployed with Vercel</p>
        <div className="flex gap-2">
          <Link
            href={profileData.linkedIn}
            target="_blank"
            className="text-sm text-muted-foreground hover:underline"
          >
            LinkedIn
          </Link>
          <Link
            href={profileData.github}
            target="_blank"
            className="text-sm text-muted-foreground hover:underline"
          >
            GitHub
          </Link>
          <Link
            href={`mailto:${profileData.email}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            Email
          </Link>
        </div>
      </div>
    </div>
  );
}
