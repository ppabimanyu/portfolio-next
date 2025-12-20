import { allProjects } from "@/.content-collections/generated";
import PlainCard from "@/components/plain-card";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, SquareArrowOutUpRight } from "lucide-react";
import PrimaryButton from "@/components/primary-button";
import Link from "next/link";
import Typography from "@/components/typography";
import { env } from "@/env";
import { profileData } from "@/lib/data";
import Image from "next/image";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  if (!project) {
    return {
      title: "Not Found",
      description: "Project not found",
    };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: "website",
      locale: "id_ID",
      url: `${env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`,
      siteName: profileData.name,
      emails: profileData.email,
      images: [
        {
          url: project.thumbnail,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      title: project.name,
      description: project.description,
      card: "summary_large_image",
      creator: "@ppabimanyu",
      images: [project.thumbnail],
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  if (!project) {
    notFound();
  }
  return (
    <article className="space-y-4 max-w-4xl mx-auto mb-12">
      <PlainCard className="flex justify-between items-center gap-4">
        <div className="space-y-4 flex-2/3">
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground uppercase">
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
          <div className="flex flex-wrap gap-2">
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
        <div className="flex-1/3 hidden md:block p-2 rounded-3xl border">
          {/* <Safari
            url={project.linkLive}
            mode="simple"
            imageSrc={project.thumbnail}
          /> */}
          <Image
            src={project.thumbnail}
            alt={project.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </PlainCard>
      <div className="space-y-4">
        <Typography html={project.html} />
      </div>
    </article>
  );
}
