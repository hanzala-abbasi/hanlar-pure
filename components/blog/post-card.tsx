import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-off-white">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-gold-dark">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-snug transition-colors group-hover:text-gold-dark">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      </Link>
    </article>
  );
}
