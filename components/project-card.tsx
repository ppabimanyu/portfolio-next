import { Safari } from "./ui/safari";
import { GithubIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";

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
    <div className="border border-border rounded-lg bg-card p-4 w-full h-fit space-y-2 transition-all bg-linear-to-br from-bacground via-background to-background hover:to-primary/10 hover:shadow hover:scale-[101%]">
      <Safari
        url={project.linkLive}
        mode="simple"
        imageSrc={project.thumbnail}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold line-clamp-1 overflow-hidden">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
          {project.description}
        </p>
      </div>
      <div className="flex gap-1">
        {project.techStack.slice(0, 4).map((stack) => (
          <span
            key={stack}
            className="text-xs text-muted-foreground border px-2 py-0.5 rounded-full"
          >
            {stack}
          </span>
        ))}
      </div>
      <div className="flex gap-2 justify-between items-center mt-4">
        <div className="flex gap-2">
          {project.linkLive && (
            <a
              href={project.linkLive}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size={"sm"}>
                <SquareArrowOutUpRight />
                Live
              </Button>
            </a>
          )}
          {project.linkGithub && (
            <a
              href={project.linkGithub}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size={"sm"}>
                <GithubIcon /> GitHub
              </Button>
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {project.studyCase}
        </p>
      </div>
    </div>
  );
}
