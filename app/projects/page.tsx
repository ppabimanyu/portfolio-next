import ProjectCard from "@/components/project-card";
import { allProjects } from "content-collections";
import Link from "next/link";

export default function Projects() {
  return (
    <div className="w-full space-y-12 mb-12">
      <div className="flex gap-4 justify-between items-end">
        <div className="flex-1/2">
          <h4 className="uppercase text-sm text-muted-foreground">
            Selected works
          </h4>
          <h1 className="text-2xl font-semibold">
            Projects built with care and calm
          </h1>
          <p className="text-sm text-muted-foreground">
            A closer look at shipped products, internal tools, and personal
            experiments. Each project balances resilient backends with clear,
            minimal interfaces.
          </p>
        </div>
        <div className="flex-1/2 flex flex-col items-end">
          <div className="flex gap-2 items-center">
            <p className="text-sm text-muted-foreground">
              {allProjects.length} projects
            </p>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <p className="text-sm text-muted-foreground">
              Last updated{" "}
              {allProjects.toSorted((a, b) => b.year - a.year)[0].year}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Mostly using Next.js, Nest.js, and PostgreSQL.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProjects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
