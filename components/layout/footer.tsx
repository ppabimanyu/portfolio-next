import { profileData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, Triangle } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { href: profileData.linkedIn, icon: Linkedin, label: "LinkedIn" },
  { href: profileData.github, icon: Github, label: "GitHub" },
  { href: `mailto:${profileData.email}`, icon: Mail, label: "Email" },
];

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full py-6", className)}>
      <div className="container lg:w-7xl flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mx-auto">
        <div className="text-sm flex flex-wrap gap-1 items-center justify-center md:justify-start">
          <span>Built with</span>
          <Link
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Next.js
          </Link>
          <span aria-hidden="true">·</span>
          <span>Deployed on</span>
          <Link
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-1 items-center hover:underline"
          >
            Vercel
            <Triangle size={12} className="fill-foreground" aria-hidden="true" />
          </Link>
        </div>

        <nav aria-label="Social links" className="flex gap-4 flex-wrap justify-center">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel={label !== "Email" ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline flex gap-1 items-center transition-colors"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
