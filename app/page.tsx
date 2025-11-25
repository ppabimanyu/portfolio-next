import PlainCard from "@/components/plain-card";
import Image from "next/image";
import Link from "next/link";
import { profileData } from "@/lib/data";
import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import ProjectCard from "@/components/project-card";
import { allPosts } from "@/.content-collections/generated";
import Contact from "@/components/contact";
import { allProjects } from "@/.content-collections/generated";

export default function Home() {
  const lastestPost = allPosts.toSorted(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  )[0];

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <PlainCard className="flex col-span-3 gap-4 h-full">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="uppercase text-sm text-muted-foreground">
                Currently crafting calm web experiences
              </h4>
              <h1 className="text-2xl font-semibold">
                Him I&apos;m {profileData.name.split(" ")[0]},
              </h1>
              <h2 className="text-xl italic">{profileData.tagline}</h2>
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
            </div>
            <div className="flex gap-2">
              <Link href={"/projects"}>
                <PrimaryButton>View Projects</PrimaryButton>
              </Link>
              <Link href={`mailto:${profileData.email}`}>
                <SecondaryButton>Contact</SecondaryButton>
              </Link>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <div className="grid place-items-center relative">
              <Image
                src="/gradian-blur.svg"
                alt="blur"
                width={400}
                height={400}
                className="col-start-1 row-start-1"
              />
              <Image
                src={profileData.profileUrl}
                alt="profile"
                width={140}
                height={140}
                className="col-start-1 row-start-1 rounded-xl"
              />
            </div>
          </div>
        </PlainCard>
        <PlainCard className="flex col-span-2 h-full">
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <p className="text-sm text-muted-foreground">
                {lastestPost.publishDate.toLocaleDateString()}
              </p>
              <div className="h-1 w-1 bg-muted-foreground rounded-full" />
              <p className="text-sm text-muted-foreground">
                {lastestPost.category}
              </p>
              <div className="h-1 w-1 bg-muted-foreground rounded-full" />
              <p className="text-sm text-muted-foreground">
                {lastestPost.readTime}
              </p>
            </div>
            <h1 className="text-md font-semibold italic line-clamp-1 overflow-hidden">
              {lastestPost.title}
            </h1>
            <p className="text-sm text-muted-foreground line-clamp-4 overflow-hidden">
              {lastestPost.description}
            </p>
            <Link
              href={`/posts/${lastestPost.slug}`}
              className="px-0 text-sm font-semibold cursor-pointer text-primary hover:underline"
            >
              Read article
            </Link>
          </div>
          <div className="flex-1"></div>
        </PlainCard>
      </div>
      <PlainCard className="space-y-2 w-full ">
        <h2 className="uppercase text-sm text-muted-foreground">Teck stack</h2>
        <h2 className="text-md font-semibold">Tools I reach for often</h2>
        <div className="flex flex-wrap gap-2">
          {profileData.tackStack.map((item) => (
            <div
              className="px-2 py-1 border border-border rounded-full flex gap-1 items-center hover:bg-primary/10 transition-all hover:shadow-2xl"
              key={item}
            >
              <div className="h-2 w-2 bg-primary rounded-full" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Modern, boring, and well-tested technologies for shipping calm
          products.
        </p>
      </PlainCard>
      <PlainCard className="space-y-4 w-full ">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="uppercase text-sm text-muted-foreground">
              SELECTED PROJECTS
            </h2>
            <h2 className="text-md font-semibold">Recent Projects</h2>
          </div>
          <Link
            href="/projects"
            className="text-sm cursor-pointer hover:underline text-primary"
          >
            View all projects
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects.slice(0, 3).map((project) => (
            <ProjectCard project={project} key={project.name} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {" A few shipped products and experiments I'm proud of."}
        </p>
      </PlainCard>
      <Contact />
    </div>
  );
}
