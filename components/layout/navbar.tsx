"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import { profileData } from "@/lib/data";

const navData = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Writing",
    href: "/writing",
  },
];

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("py-6", className)}>
      <div className="container lg:w-7xl flex justify-between items-center mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={profileData.profileUrl} alt="@shadcn" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {profileData.name.split(" ")[0].slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold">{profileData.name}</p>
          <div className="h-1 w-1 bg-foreground rounded-full" />
          <p className="text-sm font-semibold">{profileData.jobTitle}</p>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navData.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                  "text-sm font-semibold cursor-pointer flex items-center gap-1"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href={"/resume.pdf"} download>
              <div className="rounded-full border-primary text-primary border px-2 py-1.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">
                Download CV
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
