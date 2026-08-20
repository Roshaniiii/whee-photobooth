import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'
import { BLOG_POSTS } from '../data/blogPosts'
import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = BLOG_POSTS[slug]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [slug])

  if (!post) {
    return (
      <div className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#f2e7b4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#DF82A3', fontFamily: "'Cause', serif" }}>Guide Not Found</h2>
        <button
          onClick={() => navigate('/blog')}
          style={{
            marginTop: '16px',
            background: '#DF82A3',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '10px 24px',
            cursor: 'pointer',
            fontFamily: "'Cause', serif",
            fontWeight: '700',
          }}
        >
          ← Back to All Guides
        </button>
      </div>
    )
  }

  // Pick 2 other related posts for internal linking
  const otherPosts = Object.entries(BLOG_POSTS)
    .filter(([key]) => key !== slug)
    .slice(0, 2)

  return (
    <div className="page-wrapper blog-post-wrapper" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f2e7b4', position: 'relative', overflowX: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <VerticalStripes />

      <div className="page-content blog-post-content" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', padding: '56px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>

        {/* Back Link */}
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(145, 114, 100, 0.2)',
              borderRadius: '100px',
              padding: '6px 16px',
              color: '#917264',
              fontFamily: "'Cause', serif",
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#DF82A3'; e.currentTarget.style.color = '#DF82A3' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(145, 114, 100, 0.2)'; e.currentTarget.style.color = '#917264' }}
          >
            <ArrowLeft size={14} /> Back to All Guides
          </button>
        </div>

        {/* Article Box */}
        <div style={{ width: '100%', padding: '32px 36px', border: '1px solid rgba(145,114,100,0.16)', borderRadius: '18px', background: 'rgba(255,255,255,0.65)', boxShadow: '0 8px 20px rgba(145,114,100,0.08)', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', fontSize: '12px', color: '#917264', opacity: 0.85, borderBottom: '1px solid rgba(145,114,100,0.12)', paddingBottom: '12px' }}>
            {post.date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#DF82A3" /> Published on {post.date}
              </span>
            )}
            {post.readTime && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="#DF82A3" /> {post.readTime}
              </span>
            )}
          </div>

          <div
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Related Articles Section for strong SEO internal linking */}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px dashed rgba(145,114,100,0.2)' }}>
            <h3 style={{ fontFamily: "'Cause', serif", fontSize: '18px', color: '#DF82A3', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={18} /> Related Guides You Might Like
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {otherPosts.map(([otherSlug, otherPost]) => (
                <div
                  key={otherSlug}
                  onClick={() => navigate(`/blog/${otherSlug}`)}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(145,114,100,0.14)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#DF82A3'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(145,114,100,0.14)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <h4 style={{ margin: '0 0 6px', color: '#DF82A3', fontFamily: "'Cause', serif", fontSize: '14px' }}>
                    {otherPost.title}
                  </h4>
                  <p style={{ margin: 0, color: '#917264', fontFamily: "'Cause', serif", fontSize: '12px', lineHeight: 1.5 }}>
                    {otherPost.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  )
}
