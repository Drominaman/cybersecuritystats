import type { MetadataRoute } from 'next'
import { getEnabledClusters } from '@/data/clusters'
import { getAllPublishers } from '@/lib/queries'
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

  // Top publishers (5+ stats)
  for (const pub of publishers.filter((p) => p.count >= 5).slice(0, 200)) {
    urls.push({
      url: `${BASE}/publishers/${slugify(pub.publisher)}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return urls
}
