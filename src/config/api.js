/** Base URL for the filter API (no trailing slash). Set via VITE_API_URL at build time. */
const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')

export const FILTER_API_URL = raw

export function hasFilterApi() {
  return Boolean(FILTER_API_URL)
}

export function filterApiEndpoint(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${FILTER_API_URL}${p}`
}
