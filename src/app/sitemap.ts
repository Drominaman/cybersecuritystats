import type { MetadataRoute } from 'next'
import { getEnabledClusters } from '@/data/clusters'
import { getAllPublishers, getAllBlogPosts, getStatsForPublisher, getStatsForReport } from '@/lib/static-data'
import { slugify } from '@/lib/utils'

const BASE = 'https://cybersecuritystats.com'

const THREAT_SLUGS = [
  'ransomware', 'fraud', 'phishing', 'data-breach', 'ddos',
  'cyber-attack', 'insider-threat', 'cloud-threats', 'account-compromise',
  'ai-threats', 'deepfakes', 'malware', 'supply-chain',
  'social-engineering', 'business-email-compromise', 'identity-theft',
]

const COMPARISONS = [
  'ransomware-vs-phishing', 'ransomware-vs-data-breach',
  'phishing-vs-data-breach', 'insider-threat-vs-cyber-attack',
  'fraud-vs-phishing', 'ransomware-vs-ddos',
  'malware-vs-ransomware', 'deepfakes-vs-phishing',
  'fraud-vs-identity-theft', 'supply-chain-vs-insider-threat',
]

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clusters = getEnabledClusters()
  const publishers = await getAllPublishers()

  const urls: MetadataRoute.Sitemap = []

  // Homepage
  urls.push({ url: BASE, changeFrequency: 'daily', priority: 1.0 })

  // Industry overview pages
  for (const cluster of clusters) {
    urls.push({
      url: `${BASE}/industry/${cluster.id}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // Matrix intersection pages
    for (const threat of cluster.threats) {
      urls.push({
        url: `${BASE}/industry/${cluster.id}/${slugify(threat)}`,
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }
  }

  // Threat overview pages
  for (const threat of THREAT_SLUGS) {
    urls.push({
      url: `${BASE}/threats/${threat}`,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  }

  // Compare pages
  for (const comp of COMPARISONS) {
    urls.push({
      url: `${BASE}/compare/${comp}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  // Publishers index
  urls.push({
    url: `${BASE}/publishers`,
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Individual publisher pages are deliberately absent. They carry noindex, and
  // a sitemap that lists pages we ask Google not to index sends two conflicting
  // instructions. The publishers index above still links to them, so readers and
  // crawlers can reach them.

  // Report pages. These are the bulk of the site and 436 of them have no
  // publisher page linking to them, since publisher pages stop at the top 200
  // while reports are built for every publisher with 3+ statistics. Without
  // them here a crawler has no route to those at all.
  //
  // The filter has to match generateStaticParams in reports/[publisher]/[report]
  // exactly — that route sets dynamicParams = false, so anything listed here but
  // not prebuilt would 404.
  for (const pub of publishers.filter((p) => p.count >= 3)) {
    const seen = new Set<string>()
    for (const stat of getStatsForPublisher(pub.publisher)) {
      if (!stat.source_name || seen.has(stat.source_name)) continue
      seen.add(stat.source_name)
      // Match the noindex rule on the report page itself: stubs are neither
      // indexed nor advertised.
      const statsInReport = getStatsForReport(pub.publisher, stat.source_name).length
      if (statsInReport < 5) continue
      urls.push({
        url: `${BASE}/reports/${slugify(pub.publisher)}/${slugify(stat.source_name)}`,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // Blog
  const posts = getAllBlogPosts()
  if (posts.length > 0) {
    urls.push({
      url: `${BASE}/blog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    for (const post of posts) {
      urls.push({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: post.updated_at || post.published_at || undefined,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return urls
}
