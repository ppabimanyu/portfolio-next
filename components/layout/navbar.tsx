"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import { profileData } from "@/lib/data";
import { Menu, X } from "lucide-react";

const navData = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Writing", href: "/writing" },
];

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={cn("py-4", className)}>
      <div className="max-w-7xl flex flex-wrap justify-between items-center mx-auto px-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={profileData.profileUrl}
              alt={`${profileData.name}'s avatar`}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {profileData.name.split(" ")[0].slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold hidden sm:inline">
            {profileData.name}
          </span>
          <span
            className="h-1 w-1 bg-foreground rounded-full hidden sm:block"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold hidden sm:inline">
            {profileData.jobTitle}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navData.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-semibold flex items-center gap-1 transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/resume.pdf" download>
              <div className="rounded-full border-primary text-primary border px-2 py-1.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Download CV
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="max-w-7xl mx-auto pt-4 pb-2 space-y-4">
          <div className="flex flex-col gap-2">
            {navData.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "text-sm font-semibold py-2 px-3 rounded-md transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/resume.pdf" download onClick={closeMenu}>
            <div className="rounded-full border-primary text-primary border px-3 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-center">
              Download CV
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
