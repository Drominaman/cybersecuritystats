export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify leaves "</script>" intact, so a title containing it would
  // close the tag and inject markup. Escaping "<" keeps the JSON valid and
  // makes breakout impossible regardless of what the data contains.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CyberSecurityStats',
    url: 'https://cybersecuritystats.com',
    description:
      'Cybersecurity statistics organized by industry and threat type from 700+ published industry reports.',
  }
}

export function datasetSchema({
  name,
  description,
  url,
  keywords,
  statCount,
}: {
  name: string
  description: string
  url: string
  keywords: string[]
  statCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    keywords,
    variableMeasured: 'cybersecurity statistics',
    measurementTechnique: 'aggregation from published industry reports',
    distribution: {
      '@type': 'DataDownload',
      contentUrl: url,
      encodingFormat: 'text/html',
    },
    size: `${statCount} data points`,
    creator: {
      '@type': 'Organization',
      name: 'CyberSecurityStats',
      url: 'https://cybersecuritystats.com',
    },
    temporalCoverage: '2024/2026',
  }
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function organizationSchema(publisher: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: publisher,
    url: `https://cybersecuritystats.com/publishers/${publisher.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  }
}
