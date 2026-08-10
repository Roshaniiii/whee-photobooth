import { useNavigate } from 'react-router-dom'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

const POSTS = [
  {
    slug: 'how-to-create-perfect-korean-4-cut-photo-aesthetic',
    title: 'How to Create the Perfect Korean 4 Cut Photo Aesthetic Online for Free',
    excerpt: 'A practical guide to recreate the viral Korean 4-cut photostrip look at home using free online tools and simple lighting tricks.',
  },
  {
    slug: 'cute-korean-photo-booth-poses-to-try-with-your-bestie',
    title: '10 Cute Korean Photo Booth Poses to Try with Your Bestie',
    excerpt: 'Plan your session in advance with these 10 iconic K-pop-inspired poses—from finger hearts to cinematic sequence fades—for a flawless photo strip every time.',
  },
  {
    slug: 'ultimate-guide-printing-preserving-digital-photostrips',
    title: 'The Ultimate Guide to Printing and Preserving Your Digital Photostrips',
    excerpt: 'Learn how to choose the right paper, set up your printer, cut your strips perfectly, and display them creatively as phone cases, wall art, or scrapbook memories.',
  },
  {
    slug: 'virtual-photobooth-app-is-a-must-have',
    title: 'Why a Virtual Photo Booth App is a Must-Have for Your Next Online Party',
    excerpt: 'Learn how to choose the right paper, set up your printer, cut your strips perfectly, and display them creatively as phone cases, wall art, or scrapbook memories.',
  },
  {
    slug: 'get-the-90s-look-web-camera-aesthetic',
    title: 'How to Get the 90s Look Web Camera Aesthetic Using a Y2K Camera Filter Online',
    excerpt: 'You don\'t need expensive editing apps or technical Photoshop skills to achieve this nostalgic vibe. By using an accessible free online photo booth with filters.',
  },
  {
    slug: 'customize-photo-strips-online',
    title: 'How to Customize Photo Strips Online: Add Doodles, Text, and Stickers for Free',
    excerpt: 'Customizing your images helps transform a standard grid of pictures into a personalized piece of digital art. Whether you want to design a romantic anniversary strip.',
  },
]

export default function Blog() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper blog-page-wrapper" style={{
      minHeight: '100vh', width: '100%', backgroundColor: '#f2e7b4', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
    }}>

      <VerticalStripes />

      <div className="page-content blog-page-content" style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flex: 1,
      }}>

        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <h1 style={{ fontFamily: "'Cause', serif", fontSize: 'clamp(20px, 3vw, 26px)', color: '#DF82A3', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
            Blogs
          </h1>
          {/* <p style={{ color: '#917264', margin: 0 }}>Latest posts and tutorials</p> */}
        </div>

        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '18px' }}>
          {POSTS.map(post => (
            <article key={post.slug} onClick={() => navigate(`/blog/${post.slug}`)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.6)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(145,114,100,0.12)', boxShadow: '0 6px 18px rgba(145,114,100,0.06)' }}>
              <h2 style={{ margin: '0 0 8px', color: '#DF82A3', fontFamily: "'Cause', serif", fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: '600' }}>{post.title}</h2>
              <p style={{ margin: 0, color: '#917264', fontFamily: "'Cause', serif", fontSize: '13px' }}>{post.excerpt}</p>
            </article>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  )
}
