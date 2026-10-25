import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug, getRelatedPosts, toMeta } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { PostCard } from "@/components/blog/post-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = getRelatedPosts(post, 2).map(toMeta);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.coverImage ? `${siteConfig.url}${post.coverImage}` : undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <article>
        <header className="bg-black pt-14 pb-16 text-center text-white md:pt-20">
          <Container className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">{post.title}</h1>
            <p className="mx-auto mt-5 max-w-xl text-white/70">{post.excerpt}</p>
          </Container>
        </header>

        {post.coverImage && (
          <Container className="max-w-4xl">
            <div className="relative -mt-8 aspect-[16/9] overflow-hidden bg-off-white">
              <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
            </div>
          </Container>
        )}

        <Container className="max-w-2xl py-14 md:py-20">
          <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-gold-dark">
            <MDXRemote source={post.content} />
          </div>

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="border border-black/15 px-3 py-1 text-xs uppercase tracking-[0.15em] text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-14 bg-black px-8 py-12 text-center text-white">
            <p className="font-serif text-3xl">Ready to try HANLAR PURE?</p>
            <p className="mt-2 text-white/70">Explore the collection and order on WhatsApp.</p>
            <ButtonLink href="/shop" className="mt-6">
              Shop Now
            </ButtonLink>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-off-white py-16 md:py-20">
          <Container className="max-w-4xl">
            <h2 className="mb-10 text-center font-serif text-4xl">Related Posts</h2>
            <div className="grid gap-12 md:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            <p className="mt-12 text-center">
              <Link href="/blog" className="text-xs uppercase tracking-[0.2em] hover:text-gold-dark">
                All posts
              </Link>
            </p>
          </Container>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
