import PlainCard from "@/components/plain-card";
import PostCard from "@/components/post-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { allPosts } from "content-collections";

export default function WritingPage() {
  return (
    <div className="w-full space-y-12 mb-12">
      <div className="flex gap-4 justify-between items-end">
        <div className="flex-1/2">
          <h4 className="uppercase text-sm text-muted-foreground">
            Writing & Notes
          </h4>
          <h1 className="text-2xl font-semibold">
            Essays on systems, interfaces, and the space in between
          </h1>
          <p className="text-sm text-muted-foreground">
            A slow, considered journal of things I learn while building
            backend-heavy products with calm, legible frontends. Mostly about
            tradeoffs, architecture, and keeping teams unblocked.
          </p>
        </div>
        <div className="flex-1/2 flex flex-col items-end">
          <div className="flex gap-2 items-center">
            <p className="text-sm text-muted-foreground">Selected essays</p>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <p className="text-sm text-muted-foreground">Updated weekly</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Mostly engineering, occasinally product and process.
          </p>
        </div>
      </div>
      <PlainCard className="w-full space-y-4">
        {allPosts.map((post, i) => (
          <Link
            href={`/posts/${post.slug}`}
            key={post.slug}
            className="space-y-4 cursor-pointer"
          >
            <PostCard post={post} />
            {i < allPosts.length - 1 && <Separator />}
          </Link>
        ))}
      </PlainCard>
    </div>
  );
}
