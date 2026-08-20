import { useNavigate } from 'react-router-dom'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'
import { BLOG_POSTS } from '../data/blogPosts'
import { BookOpen, Calendar, Clock } from 'lucide-react'

const POSTS = Object.entries(BLOG_POSTS).map(([slug, post]) => ({
  slug,
  ...post,
}))

export default function Blog() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper blog-page-wrapper" style={{
      minHeight: '100vh', width: '100%', backgroundColor: '#f2e7b4', position: 'relative', overflowX: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
    }}>

      <VerticalStripes />

      <div className="page-content blog-page-content" style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '1080px', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flex: 1,
      }}>

        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <h1 style={{ fontFamily: "'Cause', serif", fontSize: 'clamp(24px, 4vw, 34px)', color: '#DF82A3', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
            Guides &amp; Inspiration
          </h1>
          <p style={{ color: '#917264', margin: 0, fontFamily: "'Cause', serif", fontSize: '15px' }}>
            Tips, posing ideas, lighting guides, and DIY crafts for the perfect photobooth aesthetic.
          </p>
        </div>

        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '18px' }}>
          {POSTS.map(post => (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.65)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(145,114,100,0.16)',
                boxShadow: '0 6px 18px rgba(145,114,100,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(145,114,100,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(145,114,100,0.06)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '11px', color: '#917264', opacity: 0.85 }}>
                  {post.date && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} color="#DF82A3" /> {post.date}
                    </span>
                  )}
                  {post.readTime && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} color="#DF82A3" /> {post.readTime}
                    </span>
                  )}
                </div>
                <h2 style={{ margin: '0 0 10px', color: '#DF82A3', fontFamily: "'Cause', serif", fontSize: 'clamp(14px, 1.6vw, 17px)', fontWeight: '700', lineHeight: 1.35 }}>
                  {post.title}
                </h2>
                <p style={{ margin: 0, color: '#917264', fontFamily: "'Cause', serif", fontSize: '13px', lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(145,114,100,0.1)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#DF82A3' }}>
                <BookOpen size={14} /> Read Full Guide →
              </div>
            </article>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  )
}
