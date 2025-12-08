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
import { motion, AnimatePresence } from "framer-motion";

const navData = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Writing", href: "/writing" },
];

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn("py-4", className)}
    >
      <div className="max-w-7xl flex flex-wrap justify-between items-center mx-auto px-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
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
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 relative">
            {navData.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1 transition-colors py-1",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                </span>
                {/* Animated underline */}
                {(pathname === item.href || hoveredItem === item.name) && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/resume.pdf" download>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-primary text-primary border px-2 py-1.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Download CV
              </motion.div>
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
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="max-w-7xl mx-auto pt-4 pb-2 space-y-4">
              <div className="flex flex-col gap-2">
                {navData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "text-sm font-semibold py-2 px-3 rounded-md transition-colors block",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Link href="/resume.pdf" download onClick={closeMenu}>
                  <div className="rounded-full border-primary text-primary border px-3 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-center">
                    Download CV
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
