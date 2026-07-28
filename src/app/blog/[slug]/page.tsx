import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPost, getRelatedBlogPosts } from '@/lib/static-data'
import { formatDate } from '@/lib/utils'
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd'
import Markdown from '@/components/Markdown'

const BASE = 'https://cybersecuritystats.com'

export const revalidate = 86400
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const description = post.meta_description || post.excerpt

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    keywords: post.tags ?? undefined,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: [post.author],
      tags: post.tags ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const related = getRelatedBlogPosts(slug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'CyberSecurityStats',
      url: BASE,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: `${BASE}/blog/${slug}`,
    keywords: post.tags?.join(', '),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BASE },
          { name: 'Blog', url: `${BASE}/blog` },
          { name: post.title, url: `${BASE}/blog/${slug}` },
        ])}
      />

      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[var(--accent)]">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">
          {post.post_type === 'roundup' ? 'Roundup' : 'Analysis'}
        </span>
      </nav>

      <article>
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-5">{post.title}</h1>

        <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-3 pb-6 mb-8 border-b-2 border-[var(--border)] font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span>{post.post_type === 'roundup' ? 'Roundup' : 'Analysis'}</span>
          {post.published_at && (
            <>
              <span>/</span>
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </>
          )}
          {post.stat_count ? (
            <>
              <span>/</span>
              <span>{post.stat_count} stats</span>
            </>
          ) : null}
          <span>/</span>
          {post.author_url ? (
            <a
              href={post.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)]"
            >
              {post.author}
            </a>
          ) : (
            <span>{post.author}</span>
          )}
        </div>

        <Markdown content={post.content} />
      </article>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t-2 border-[var(--border)]">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border-2 border-[var(--border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-2 border-[var(--border)] p-5 mt-10">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
          Get the data
        </h2>
        <p className="text-sm leading-relaxed">
          Every figure above comes from our index of published research.{' '}
          <Link href="/newsletter" className="text-[var(--accent)] hover:underline">
            Subscribe to the newsletter
          </Link>{' '}
          for new statistics as reports are published.
        </p>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
            More from the blog
          </h2>
          <div className="border-2 border-[var(--border)] divide-y-2 divide-[var(--border)]">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="block p-4 hover:bg-[var(--surface)] transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
                  {item.post_type === 'roundup' ? 'Roundup' : 'Analysis'}
                  {item.published_at && ` / ${formatDate(item.published_at)}`}
                </div>
                <div className="font-bold text-sm leading-snug">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
