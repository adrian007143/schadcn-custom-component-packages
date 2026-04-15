import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://formkitcn.pro"
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blocks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blocks/dynamic-form-field`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blocks/login-form-template`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blocks/multistep`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blocks/form-layout`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blocks/data-table-dynamic`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blocks/redux-usage`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/introduction`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/getting-started`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/form-field`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/form-builder`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/form-layout`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/multistep-form`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/data-table`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/redux`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ]
}
