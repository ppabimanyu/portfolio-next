import PlainCard from "@/components/plain-card";
import PostCard from "@/components/post-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { allPosts } from "content-collections";
import { env } from "@/env";
import { profileData } from "@/lib/data";

export const metadata = {
  title: "Writing & Notes",
  description:
    "A slow, considered journal of things I learn while building backend-heavy products with calm, legible frontends. Mostly about tradeoffs, architecture, and keeping teams unblocked.",
  openGraph: {
    title: "Writing & Notes",
    description:
      "A slow, considered journal of things I learn while building backend-heavy products with calm, legible frontends. Mostly about tradeoffs, architecture, and keeping teams unblocked.",
    type: "website",
    locale: "id_ID",
    url: `${env.NEXT_PUBLIC_SITE_URL}/writing`,
    siteName: profileData.name,
    emails: profileData.email,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Writing & Notes",
      },
    ],
  },
  twitter: {
    title: "Writing & Notes",
    description:
      "A slow, considered journal of things I learn while building backend-heavy products with calm, legible frontends. Mostly about tradeoffs, architecture, and keeping teams unblocked.",
    card: "summary_large_image",
    creator: "@ppabimanyu",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/writing`,
  },
};

export default function WritingPage() {
  const orderedPosts = allPosts.toSorted(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  );

  return (
    <main className="w-full space-y-8 md:space-y-12 mb-12">
      <header className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between md:items-end">
        <div className="space-y-2">
          <p className="uppercase text-sm text-muted-foreground">
            Writing & Notes
          </p>
          <h1 className="text-xl md:text-2xl font-semibold">
            Essays on systems, interfaces, and the space in between
          </h1>
          <p className="text-sm text-muted-foreground">
            A slow, considered journal of things I learn while building
            backend-heavy products with calm, legible frontends. Mostly about
            tradeoffs, architecture, and keeping teams unblocked.
          </p>
        </div>
        <div className="flex flex-col md:items-end text-sm text-muted-foreground md:text-end">
          <div className="flex flex-wrap gap-2 items-center md:justify-end">
            <span>Selected essays</span>
            <span
              className="h-1 w-1 bg-muted-foreground rounded-full"
              aria-hidden="true"
            />
            <span>Updated weekly</span>
          </div>
          <p>Mostly engineering, occasionally product and process.</p>
        </div>
      </header>

      <section aria-label="Blog posts">
        <PlainCard className="w-full">
          {orderedPosts.map((post, i) => (
            <Link
              href={`/writing/${post.slug}`}
              key={post.slug}
              className="block"
            >
              <PostCard post={post} />
              {i < orderedPosts.length - 1 && <Separator className="my-4" />}
            </Link>
          ))}
        </PlainCard>
      </section>
    </main>
  );
}
