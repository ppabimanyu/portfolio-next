import PlainCard from "@/components/plain-card";
import Image from "next/image";
import Link from "next/link";
import { profileData } from "@/lib/data";
import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import ProjectCard from "@/components/project-card";
import { allPosts, allProjects } from "@/.content-collections/generated";
import Contact from "@/components/contact";
import { CodeXml, Mail } from "lucide-react";

function getLatestPost() {
  if (!allPosts.length) return null;
  return allPosts.toSorted(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  )[0];
}

export default function Home() {
  const latestPost = getLatestPost();
  const featuredProjects = allProjects.slice(0, 3);
  const firstName = profileData.name.split(" ")[0];

  return (
    <main className="w-full space-y-4">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <PlainCard className="flex col-span-1 md:col-span-3 gap-4 h-full">
          <div className="space-y-4">
            <header className="space-y-2">
              <p className="uppercase text-sm text-muted-foreground">
                Currently crafting calm web experiences
              </p>
              <h1 className="text-2xl font-semibold">
                Hi, I&apos;m {firstName}
              </h1>
              <p className="text-xl italic">{profileData.tagline}</p>
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
            </header>
            <nav className="flex gap-2" aria-label="Primary actions">
              <Link href="/projects">
                <PrimaryButton className="flex gap-1">
                  <CodeXml size={16} aria-hidden="true" />
                  View Projects
                </PrimaryButton>
              </Link>
              <Link href="#contact">
                <SecondaryButton className="flex gap-1">
                  <Mail size={16} aria-hidden="true" />
                  Contact
                </SecondaryButton>
              </Link>
            </nav>
          </div>
          <div className="flex justify-end items-center">
            <div className="grid place-items-center">
              <Image
                src="/gradian-blur.svg"
                alt=""
                width={300}
                height={300}
                className="col-start-1 row-start-1"
                aria-hidden="true"
              />
              <Image
                src={profileData.profileUrl}
                alt={`${firstName}'s profile photo`}
                width={140}
                height={140}
                className="col-start-1 row-start-1 rounded-xl"
                priority
              />
            </div>
          </div>
        </PlainCard>

        {/* Latest Post */}
        {latestPost && (
          <PlainCard className="flex flex-col col-span-1 md:col-span-2 h-full">
            <article className="space-y-4 flex-1">
              <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                <time dateTime={latestPost.publishDate.toISOString()}>
                  {latestPost.publishDate.toDateString()}
                </time>
                <span aria-hidden="true" className="h-1 w-1 bg-muted-foreground rounded-full" />
                <span>{latestPost.category}</span>
                <span aria-hidden="true" className="h-1 w-1 bg-muted-foreground rounded-full" />
                <span>{latestPost.readTime}</span>
              </div>
              <h2 className="text-md font-semibold italic line-clamp-1">
                {latestPost.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {latestPost.description}
              </p>
            </article>
            <Link
              href={`/writing/${latestPost.slug}`}
              className="text-sm font-semibold text-primary hover:underline mt-4"
            >
              Read article
            </Link>
          </PlainCard>
        )}
      </section>

      {/* Tech Stack Section */}
      <section aria-labelledby="tech-stack-heading">
        <PlainCard className="space-y-2 w-full">
          <p className="uppercase text-sm text-muted-foreground">Tech Stack</p>
          <h2 id="tech-stack-heading" className="text-md font-semibold">
            Tools I reach for often
          </h2>
          <ul className="flex flex-wrap gap-2" role="list">
            {profileData.tackStack.map((item) => (
              <li
                key={item}
                className="px-2 py-1 border border-border rounded-full flex gap-1 items-center hover:bg-primary/10 transition-all hover:shadow-2xl"
              >
                <span className="h-2 w-2 bg-primary rounded-full" aria-hidden="true" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-6">
            Modern, boring, and well-tested technologies for shipping calm products.
          </p>
        </PlainCard>
      </section>

      {/* Projects Section */}
      <section aria-labelledby="projects-heading">
        <PlainCard className="space-y-4 w-full">
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <p className="uppercase text-sm text-muted-foreground">
                Selected Projects
              </p>
              <h2 id="projects-heading" className="text-md font-semibold">
                Recent Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm hover:underline text-primary"
            >
              View all projects
            </Link>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.slug}>
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            A few shipped products and experiments I&apos;m proud of.
          </p>
        </PlainCard>
      </section>

      <Contact />
    </main>
  );
}
