export interface Stat {
  title: string
  link: string
  publisher: string
  source_name: string
  published_on: string
  created_at: string
  tag1: string | null
  tag2: string | null
  tag3: string | null
  tag4: string | null
  tag5: string | null
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  author_url: string | null
  post_type: string
  tags: string[] | null
  stat_count: number | null
  featured: boolean
  meta_description: string | null
  published_at: string | null
  updated_at: string | null
}

export interface TagClassification {
  tag: string
  facet: 'industry' | 'threat' | 'technology' | 'audience' | 'metric' | 'geography' | 'compliance' | 'workforce' | 'other'
}

export interface MatrixIntersection {
  industry: string
  threat: string
  count: number
}

export interface ReportCluster {
  publisher: string
  source_name: string
  stat_count: number
  years: string[]
}

export interface ClusterConfig {
  id: string
  label: string
  industry: string
  threats: string[]
  enabled: boolean
}
