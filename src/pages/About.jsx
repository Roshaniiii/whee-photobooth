import { useEffect } from 'react'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="page-wrapper about-page-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f2e7b4',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <VerticalStripes />

      <div className="page-content about-page-content" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '900px',
        padding: '56px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
      }}>

        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(28px, 4.8vw, 38px)',
            color: '#DF82A3',
            margin: '0 0 8px 0',
            letterSpacing: '0.5px',
          }}>
            About Whee! Photobooth
          </h1>
        </div>

        <div style={{
          width: '100%',
          padding: '24px',
          border: '1px solid rgba(145,114,100,0.16)',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.5)',
          boxShadow: '0 8px 20px rgba(145,114,100,0.08)',
        }}>
          <div style={{
            width: '100%',
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#917264',
            fontFamily: "'Cause', serif",
          }}>
            <p style={{ marginBottom: '12px' }}>
              Welcome to Whee! Photobooth (accessible via <a href="https://wheephotobooth.site" target="_blank" rel="noopener noreferrer" style={{ color: '#DF82A3', textDecoration: 'none' }}>https://wheephotobooth.site</a>), your ultimate go-to digital space for creating aesthetic, high-quality, and fun photo strips entirely in your browser.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '18px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              Our Mission
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Whee! Photobooth was born out of a simple idea: to make the viral, trendy Korean 4-cut photobooth experience completely accessible to everyone, anywhere in the world, for free. We believe that capturing beautiful memories with friends and loved ones shouldn’t require expensive hardware downloads, account signups, or finding a physical studio at a crowded mall.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '18px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              What We Offer
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Our platform is engineered specifically for speed, creativity, and absolute privacy. Packed with real-time AR face-detection filters, customizable CSS color filters (like vintage 90s grain, rose gold, and classic grayscale), and an interactive customization dashboard, users can easily draw, add emoji stickers, and write text on their photo strips. Every single asset generated on our site can be downloaded instantly as a crisp, high-resolution PNG file—completely free of watermarks.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '18px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              Our Commitment to Privacy
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Unlike traditional photo apps that require you to upload your personal likeness to external databases, Whee! operates on a strict, local client-side architecture. This means your data processing happens completely within your own web browser window. We do not store, monitor, or collect your captured photos on our servers. Your memories remain entirely yours.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '18px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              Meet the Team
            </h2>
            <p style={{ marginBottom: '12px' }}>
              Whee! Photobooth is designed, developed, and maintained by a passionate team of digital creators led by Roshani. Our goal is to continuously push out new, gorgeous frame designs, seasonal holiday templates, and advanced camera filters based entirely on user feedback. Today, over 45,000 monthly active users across the United States, United Kingdom, India, the Philippines, and beyond use Whee! to capture their daily aesthetic joy.
            </p>

            <p style={{ marginBottom: '6px' }}>
              Have feedback, template requests, or partnership inquiries? Feel free to connect with us through our formal business email at <a href="mailto:wheephotobooth@gmail.com" style={{ color: '#DF82A3' }}>wheephotobooth@gmail.com</a> or follow our updates on social media.
            </p>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
