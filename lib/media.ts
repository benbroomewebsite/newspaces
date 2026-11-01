import mediaMap from './media-map.json'
import { mediaBaseUrl } from './site'

// Paths listed in media-map.json live in an external media bucket
// (NEXT_PUBLIC_MEDIA_BASE_URL); everything else is served from public/.
export function mediaHref(href: string) {
  const objectKey = (mediaMap as Record<string, string>)[href]
  return objectKey && mediaBaseUrl ? `${mediaBaseUrl}/${objectKey.split('/').map(encodeURIComponent).join('/')}` : href
}
