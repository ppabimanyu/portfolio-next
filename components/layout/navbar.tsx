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
    active: true,
  },
  {
    name: "Projects",
    href: "/projects",
    active: false,
  },
  {
    name: "Writing",
    href: "/writing",
    active: false,
  },
];

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("py-6", className)}>
      <div className="container flex justify-between items-center mx-auto">
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
        <div className="flex items-center gap-2">
          {navData.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "text-primary inset-shadow-sm inset-shadow-primary shadow-lg rounded-full px-4 py-1"
                  : "text-muted-foreground px-4",
                "text-sm font-semibold cursor-pointer"
              )}
            >
              {item.name}
            </Link>
          ))}

          <Link href={"/resume.pdf"} download>
            <div className="rounded-full border-primary text-primary border px-2 py-1.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">
              Download CV
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
