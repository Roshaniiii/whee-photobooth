import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blogPosts'

const SITE_URL = 'https://wheephotobooth.site'

const ROUTE_META = {
  '/': {
    title: 'Whee! Photobooth — Free Online Photobooth & Cute Photo Strip Generator',
    description: 'Whee! Photobooth is a free online photobooth app. Choose a photostrip template, apply vintage K-pop filters, customize with doodles, and download instantly.',
  },
  '/layout': {
    title: 'Choose Photostrip Layout — Whee! Photobooth',
    description: 'Select your favorite photostrip layout and format for your online photobooth session.',
  },
  '/camera': {
    title: 'Take Photos — Whee! Photobooth',
    description: 'Snap photos with webcam or mobile camera using vintage & K-pop filters with Whee! Photobooth.',
  },
  '/customise': {
    title: 'Customise Your Photo Strip — Whee! Photobooth',
    description: 'Decorate, add stickers, adjust filters, and customize your photostrip before downloading.',
  },
  '/about': {
    title: 'About Us — Whee! Photobooth',
    description: 'Learn more about Whee! Photobooth, our mission, features, and commitment to free and private photobooth fun.',
  },
  '/contact': {
    title: 'Contact Us — Whee! Photobooth',
    description: 'Get in touch with the Whee! Photobooth team for questions, feedback, or support.',
  },
  '/blog': {
    title: 'Guides & Inspiration — Whee! Photobooth',
    description: 'Tips, posing ideas, lighting guides, and DIY crafts for the perfect online photobooth aesthetic.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Whee! Photobooth',
    description: 'Read the privacy policy for Whee! Photobooth. Learn how your data and photos are kept safe and private.',
  },
  '/terms-of-service': {
    title: 'Terms of Service — Whee! Photobooth',
    description: 'Review the terms and conditions for using Whee! Photobooth.',
  },
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function updateMeta(selector, attributeName, attributeValue, content) {
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attributeName, attributeValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function DynamicCanonical() {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    // Ensure root is '/' and subpages don't have trailing slash
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
    const canonicalUrl = normalizedPath === '/' ? SITE_URL : `${SITE_URL}${normalizedPath}`

    // 1. Update Canonical Link
    updateCanonical(canonicalUrl)

    // 2. Update Open Graph URL
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)

    // 3. Dynamic Title & Meta Description Handling
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '').replace(/\/+$/, '')
      const post = BLOG_POSTS[slug]
      if (post) {
        document.title = `${post.title} — Whee! Photobooth`
        if (post.excerpt) {
          updateMeta('meta[name="description"]', 'name', 'description', post.excerpt)
          updateMeta('meta[property="og:description"]', 'property', 'og:description', post.excerpt)
        }
        updateMeta('meta[property="og:title"]', 'property', 'og:title', `${post.title} — Whee! Photobooth`)
      } else {
        document.title = 'Guide Not Found — Whee! Photobooth'
      }
    } else {
      const meta = ROUTE_META[normalizedPath] || ROUTE_META['/']
      document.title = meta.title
      updateMeta('meta[name="description"]', 'name', 'description', meta.description)
      updateMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
      updateMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    }
  }, [location])

  return null
}
