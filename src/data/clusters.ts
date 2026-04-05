import type { ClusterConfig } from '@/types'

// Controls which industry clusters are live on the site.
// Launch gradually: enable one cluster at a time, let it build
// topical authority via interlinking before enabling the next.
export const CLUSTERS: ClusterConfig[] = [
  // WAVE 1 — Launch first (strongest data)
  {
    id: 'healthcare',
    label: 'Healthcare',
    industry: 'Healthcare',
    threats: ['Ransomware', 'Data Breach', 'Phishing', 'Cloud Threats', 'Account Compromise'],
    enabled: true,
  },
  {
    id: 'financial-services',
    label: 'Financial Services',
    industry: 'Financial Services',
    threats: ['Fraud', 'Ransomware', 'Data Breach', 'Phishing', 'DDoS', 'Cyber Attack'],
    enabled: true,
  },

  // WAVE 2 — Enable after Wave 1 indexes (~2-4 weeks)
  {
    id: 'education',
    label: 'Education',
    industry: 'Education',
    threats: ['AI Threats', 'Phishing', 'Ransomware', 'Data Breach'],
    enabled: true,
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    industry: 'Manufacturing',
    threats: ['Ransomware', 'Supply Chain'],
    enabled: false,
  },
  {
    id: 'retail',
    label: 'Retail',
    industry: 'Retail',
    threats: ['Fraud', 'Ransomware'],
    enabled: false,
  },

  // WAVE 3 — Enable after Wave 2 indexes
  {
    id: 'government',
    label: 'Government',
    industry: 'Government',
    threats: ['Fraud', 'Ransomware', 'AI Threats'],
    enabled: true,
  },
  {
    id: 'transportation',
    label: 'Transportation',
    industry: 'Transportation',
    threats: ['Fraud'],
    enabled: false,
  },
  {
    id: 'energy',
    label: 'Energy',
    industry: 'Energy',
    threats: ['Ransomware', 'Phishing'],
    enabled: false,
  },
  {
    id: 'technology',
    label: 'Technology',
    industry: 'Technology',
    threats: ['Ransomware'],
    enabled: false,
  },
]

export function getEnabledClusters(): ClusterConfig[] {
  return CLUSTERS.filter((c) => c.enabled)
}

export function getClusterByIndustry(industry: string): ClusterConfig | undefined {
  return CLUSTERS.find(
    (c) => c.enabled && c.industry.toLowerCase() === industry.toLowerCase()
  )
}
