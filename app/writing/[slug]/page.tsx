import { allPosts } from "@/.content-collections/generated";
import Typography from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import ShareButtons from "@/components/share-buttons";
import Image from "next/image";
import { notFound } from "next/navigation";
import { env } from "@/env";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [
        {
          url: `${env.SITE_URL}${post.thumbnail}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      title: post.title,
      description: post.description,
      card: "summary_large_image",
      images: [
        {
          url: `${env.SITE_URL}${post.thumbnail}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-4 w-full max-w-4xl mx-auto mb-12">
      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground uppercase">
        <span>{post.category}</span>
        <div className="h-1 w-1 bg-muted-foreground rounded-full" />
        <span>Notes from the field</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold italic">{post.title}</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          <span>{post.author}</span>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <span>{post.publishDate.toDateString()}</span>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <span>{post.readTime}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm text-muted-foreground px-2 py-0.5 border rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <ShareButtons title={post.title} />
      <div className="w-full border rounded-3xl p-4 my-4">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={720}
          height={720}
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="space-y-8">
        <p className="text-muted-foreground text-md">{post.description}</p>
        <Separator />
        <Typography html={post.html} />
      </div>
    </article>
  );
}
