import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    author: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return {
      ...document,
      readTime: readTime(document.content),
      slug: document._meta.fileName
        .replaceAll(" ", "-")
        .replace(".md", "")
        .toLowerCase(),
      publishDate: new Date(document.publishDate),
      html,
    };
  },
});

const readTime = (content: string) => {
  const wordsPerMinute = 300;
  const cleanText = content
    .replace(/<[^>]*>/g, "")
    .replace(/```[\s\S]*?```/g, "");
  const noOfWords = cleanText.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
};

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "*.md",
  schema: z.object({
    name: z.string(),
    year: z.number(),
    studyCase: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    thumbnail: z.string(),
    linkLive: z.string().optional(),
    linkGithub: z.string().optional(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return {
      ...document,
      slug: document._meta.fileName
        .replaceAll(" ", "-")
        .replace(".md", "")
        .toLowerCase(),
      html,
    };
  },
});

export default defineConfig({
  collections: [posts, projects],
});
