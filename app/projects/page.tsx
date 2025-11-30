import ProjectCard from "@/components/project-card";
import { env } from "@/env";
import { profileData } from "@/lib/data";
import { allProjects } from "content-collections";
import Link from "next/link";

export const metadata = {
  title: "Projects",
  description:
    "A closer look at shipped products, internal tools, and personal experiments. Each project balances resilient backends with clear, minimal interfaces.",
  type: "website",
  locale: "id_ID",
  siteName: env.SITE_URL,
  emails: profileData.email,
  twitter: {
    title: "Projects",
    description:
      "A closer look at shipped products, internal tools, and personal experiments. Each project balances resilient backends with clear, minimal interfaces.",
    card: "summary_large_image",
    site: env.SITE_URL,
  },
};

export default function Projects() {
  const latestYear = allProjects.toSorted((a, b) => b.year - a.year)[0]?.year;

  return (
    <main className="w-full space-y-8 md:space-y-12 mb-12">
      <header className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between md:items-end">
        <div className="space-y-2">
          <p className="uppercase text-sm text-muted-foreground">
            Selected works
          </p>
          <h1 className="text-xl md:text-2xl font-semibold">
            Projects built with care and calm
          </h1>
          <p className="text-sm text-muted-foreground">
            A closer look at shipped products, internal tools, and personal
            experiments. Each project balances resilient backends with clear,
            minimal interfaces.
          </p>
        </div>
        <div className="flex flex-col md:items-end text-sm text-muted-foreground md:text-end">
          <div className="flex flex-wrap gap-2 items-center md:justify-end">
            <span>{allProjects.length} projects</span>
            <span
              className="h-1 w-1 bg-muted-foreground rounded-full"
              aria-hidden="true"
            />
            <span>Last updated {latestYear}</span>
          </div>
          <p>Mostly using Next.js, Nest.js, and PostgreSQL.</p>
        </div>
      </header>

      <section aria-label="Project list">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
