"use client";

import { GithubIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

type ProjectCardProps = {
  project: {
    name: string;
    studyCase: string;
    description: string;
    techStack: string[];
    thumbnail: string;
    linkLive?: string;
    linkGithub?: string;
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="border border-border rounded-lg bg-card p-4 w-full h-fit space-y-2 transition-colors bg-linear-to-br from-bacground via-background to-background hover:to-primary/10 hover:shadow-lg group"
    >
      <div className="p-2 border rounded-3xl overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Image
            src={project.thumbnail}
            alt={project.name}
            width={500}
            height={500}
            className="rounded-lg transition-transform duration-300"
          />
        </motion.div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold line-clamp-1 overflow-hidden group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
          {project.description}
        </p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((stack, index) => (
          <motion.span
            key={stack}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="text-xs text-muted-foreground border px-2 py-0.5 rounded-full hover:border-primary/50 hover:text-primary transition-colors"
          >
            {stack}
          </motion.span>
        ))}
      </div>
      <div className="flex gap-2 justify-between items-center mt-4">
        <div className="flex gap-2">
          {project.linkLive && (
            <Button
              variant="ghost"
              size={"sm"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(project.linkLive, "_blank");
              }}
              className="hover:text-primary"
            >
              <SquareArrowOutUpRight />
              Live
            </Button>
          )}
          {project.linkGithub && (
            <Button
              variant="ghost"
              size={"sm"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(project.linkGithub, "_blank");
              }}
              className="hover:text-primary"
            >
              <GithubIcon /> GitHub
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {project.studyCase}
        </p>
      </div>
    </motion.div>
  );
}
