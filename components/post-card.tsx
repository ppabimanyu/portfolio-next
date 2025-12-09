import Image from "next/image";

type PostCardProps = {
  post: {
    title: string;
    description: string;
    tags: string[];
    thumbnail: string;
    publishDate: Date;
    readTime: string;
    category: string;
    slug: string;
  };
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-8">
      <div className="flex flex-col gap-2 md:flex-2/3">
        <div className="text-sm text-muted-foreground uppercase flex flex-wrap gap-2 items-center">
          <p>
            {post.publishDate.toDateString().split(" ").slice(1, 4).join(" ")}
          </p>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <p>{post.category}</p>
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <p>{post.readTime}</p>
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold line-clamp-2 overflow-hidden">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
            {post.description}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag, i) => (
            <div
              key={tag}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              {tag}
              {i < post.tags.length - 1 && (
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-48 w-full md:flex-1/3 border p-2 rounded-3xl">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}
