import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
};

export type Post = PostMeta & { content: string };

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    title: String(data.title),
    slug: String(data.slug ?? file.replace(/\.mdx$/, "")),
    date: new Date(data.date).toISOString(),
    excerpt: String(data.excerpt ?? ""),
    coverImage: String(data.coverImage ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: Math.max(1, Math.round(words / 200)),
    content,
  };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(post: Post, limit = 2) {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const score = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

export function toMeta(post: Post): PostMeta {
  const { title, slug, date, excerpt, coverImage, tags, readingTime } = post;
  return { title, slug, date, excerpt, coverImage, tags, readingTime };
}
