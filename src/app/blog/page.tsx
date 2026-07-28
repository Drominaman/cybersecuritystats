import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/static-data'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Statistical roundups and trend analysis drawn from our index of cybersecurity research reports.',
}

function PostRow({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block p-5 hover:bg-[var(--surface)] transition-colors">
      <div className="flex items-center gap-3 mb-2 text-xs text-[var(--muted)]">
        <span>{post.post_type === 'roundup' ? 'Roundup' : 'Analysis'}</span>
        {post.published_at && (
          <>
            <span>/</span>
            <span>{formatDate(post.published_at)}</span>
          </>
        )}
        {post.stat_count ? (
          <>
            <span>/</span>
            <span>{post.stat_count} stats</span>
          </>
        ) : null}
      </div>

      <h2 className="text-xl font-black tracking-tight leading-snug mb-2">{post.title}</h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{post.excerpt}</p>
    </Link>
  )
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Blog</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">Blog</h1>
        <p className="text-[var(--muted)] mt-4">
          Statistical roundups and trend analysis drawn from the reports we index.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="border border-[var(--border)] p-8 text-sm text-[var(--muted)]">
          No posts published yet.
        </div>
      )}
    </div>
  )
}
