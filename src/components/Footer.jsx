// Use standard anchor tags for footer links (keeps SEO and normal navigation)
import logo from '../assets/favicon.png'
import linkedinIcon from '../assets/linkedin.png'
import twitterIcon from '../assets/twitter.png'
import instagramIcon from '../assets/instagram.png'

const SOCIAL = {
  linkedin: 'https://linkedin.com/in/roshani-gusain',
  twitter: 'https://x.com/Roshaniii7',
  instagram: 'https://instagram.com/wheephotobooth',
}

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#917264',
      marginTop: '32px',
      padding: '24px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      fontFamily: "'Cause', serif",
    }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px',
        gap: '24px'
      }}>
        {/* Left Side: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <img src={logo} alt="Whee logo" style={{
            width: '28px', height: '28px', objectFit: 'contain', borderRadius: '8px',
          }} />
          <span style={{
            fontFamily: "Cause", fontSize: '16px',
            color: '#F2E7B4', letterSpacing: '0',
          }}>
            Whee!
          </span>
        </div>

        {/* Center Side: Links stacked vertically */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', alignItems: 'center', textAlign: 'center' }}>
          <a href="/about" style={{
            color: '#F2E7B4', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s ease', letterSpacing: '0.3px',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9' }}>
            About Us
          </a>
          <a href="/blog" style={{
            color: '#F2E7B4', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s ease', letterSpacing: '0.3px',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9' }}>
            Blog
          </a>
          <a href="/contact" style={{
            color: '#F2E7B4', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s ease', letterSpacing: '0.3px',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9' }}>
            Contact Us
          </a>
          <a href="/privacy-policy" style={{
            color: '#F2E7B4', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s ease', letterSpacing: '0.3px',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9' }}>
            Privacy & Cookies Policy
          </a>
          <a href="/terms-of-service" style={{
            color: '#F2E7B4', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s ease', letterSpacing: '0.3px',
          }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9' }}>
            Terms of Service
          </a>
        </div>

        {/* Right Side: Socials */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <img src={linkedinIcon} alt="LinkedIn" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </a>
          <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" title="Twitter / X">
            <img src={twitterIcon} alt="Twitter / X" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </a>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
            <img src={instagramIcon} alt="Instagram" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        marginTop: '10px', fontSize: '11px', color: '#F2E7B4', opacity: 0.85,
        letterSpacing: '0.5px', textAlign: 'center', width: '100%'
      }}>
        © 2026 Whee! Photobooth · Pose. Capture. Repeat.
      </div>

    </footer>
  )
}