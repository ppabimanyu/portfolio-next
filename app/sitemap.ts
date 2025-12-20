import { env } from "@/env";
import { MetadataRoute } from "next";
import { allPosts, allProjects } from "content-collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/writing/${post.slug}`,
    lastModified: post.publishDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projects = allProjects.map((project) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/writing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts,
    ...projects,
  ];
}
