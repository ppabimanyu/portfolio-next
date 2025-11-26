import { allProjects } from "@/.content-collections/generated";
import PlainCard from "@/components/plain-card";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Safari } from "@/components/ui/safari";
import { Github, SquareArrowOutUpRight } from "lucide-react";
import PrimaryButton from "@/components/primary-button";
import Link from "next/link";
import Typography from "@/components/typography";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  if (!project) {
    notFound();
  }
  return (
    <div className="space-y-4 max-w-4xl mx-auto mb-12">
      <PlainCard className="flex justify-between items-center gap-4">
        <div className="space-y-4 flex-2/3">
          <div className="flex gap-2 items-center text-sm text-muted-foreground uppercase">
            <span>Case study</span>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span>{project.studyCase}</span>
            {project.linkLive && (
              <>
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                <span>{project.linkLive?.split("/").pop()}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-semibold italic">{project.name}</h1>
          <p className="text-muted-foreground text-sm">{project.description}</p>
          <div className="flex gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 border rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {project.linkLive && (
              <Link href={project.linkLive} target="_blank">
                <PrimaryButton>
                  <SquareArrowOutUpRight />
                  Live
                </PrimaryButton>
              </Link>
            )}
            {project.linkGithub && (
              <Link href={project.linkGithub} target="_blank">
                <Button variant="ghost" size={"sm"}>
                  <Github />
                  GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1/3 hidden md:block">
          <Safari
            url={project.linkLive}
            mode="simple"
            imageSrc={project.thumbnail}
          />
        </div>
      </PlainCard>
      <div className="space-y-4">
        <Typography html={project.html} />
      </div>
    </div>
  );
}
