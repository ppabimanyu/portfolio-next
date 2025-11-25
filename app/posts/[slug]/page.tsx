import { allPosts } from "@/.content-collections/generated";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto mb-12">
      <div className="flex gap-2 items-center text-sm text-muted-foreground uppercase">
        <span>{post.category}</span>
        <div className="h-1 w-1 bg-muted-foreground rounded-full" />
        <span>Notes from the field</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold italic">{post.title}</h1>
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <span>{post.author}</span>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <span>{post.publishDate.toDateString()}</span>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <span>{post.readTime}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm text-muted-foreground px-2 py-0.5 border rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="w-full border rounded-3xl p-4 my-4">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={1000}
          height={1000}
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="space-y-4">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
}
