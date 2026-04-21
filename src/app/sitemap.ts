import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nucha-innovation.com'

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/portfolio', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/villas', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/services', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/philosophy', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/booking', priority: 0.9, changeFrequency: 'monthly' as const },
  ]

  return staticPages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
