import { profileData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, Triangle } from "lucide-react";
import Link from "next/link";

export default function Footer({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="container lg:w-7xl flex justify-between mx-auto">
        <div className="text-sm flex flex-wrap gap-1 items-center">
          <div className="flex gap-1 items-center">
            <span>Build with</span>
            <Link
              href="https://nextjs.org"
              target="_blank"
              className="flex gap-1 items-center hover:underline"
            >
              Next.js
            </Link>
          </div>
          <div className="flex gap-1 items-center">
            <span>Deployed with</span>
            <Link
              href="https://vercel.com"
              target="_blank"
              className="flex gap-1 items-center hover:underline"
            >
              Vercel
              <Triangle size={12} className="fill-foreground" />
            </Link>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Link
            href={profileData.linkedIn}
            target="_blank"
            className="text-sm text-muted-foreground hover:underline flex gap-1 items-center"
          >
            <Linkedin size={16} />
            LinkedIn
          </Link>
          <Link
            href={profileData.github}
            target="_blank"
            className="text-sm text-muted-foreground hover:underline flex gap-1 items-center"
          >
            <Github size={16} />
            GitHub
          </Link>
          <Link
            href={`mailto:${profileData.email}`}
            className="text-sm text-muted-foreground hover:underline flex gap-1 items-center"
          >
            <Mail size={16} />
            Email
          </Link>
        </div>
      </div>
    </div>
  );
}
