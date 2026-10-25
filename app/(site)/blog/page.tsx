import type { Metadata } from "next";
import { getAllPosts, toMeta } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Blog",
  description: "Hair-care notes, product insights and quality stories from HANLAR PURE.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toMeta);
  return (
    <>
      <PageHeader eyebrow="Journal" title="The Blog" intro="Notes on hair care, quality and how we make our products." />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={(i % 3) * 0.08}>
                <PostCard post={post} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
