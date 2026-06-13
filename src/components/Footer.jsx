import logo from '../assets/favicon.png'
import linkedinIcon from '../assets/linkedin.png'
import twitterIcon from '../assets/twitter.png'

const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/roshaniiii',
  twitter:  'https://x.com/Roshaniii7',
}

export default function Footer() {
  return (
    <footer style={{
      width:          '100%',
      background:     '#917264',
      marginTop:      '32px',
      padding:        '24px 24px',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '14px',
      fontFamily:     "'Cause', serif",
      
    }}>

      {/* Logo + name — centered */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="Whee logo" style={{
          width: '28px', height: '28px', objectFit: 'contain', borderRadius: '8px',
        }} />
        <span style={{
          fontFamily: "Cause", fontSize: '16px',
          color: '#F2E7B4', letterSpacing: '0',
        }}>
          Whee! Photobooth
        </span>
      </div>

      {/* Social icons — centered */}
      <div style={{ display: 'flex', gap: '14px' }}>
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <img src={linkedinIcon} alt="LinkedIn" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
        </a>
        <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" title="Twitter / X">
          <img src={twitterIcon} alt="Twitter / X" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
        </a>
      </div>

      {/* Copyright */}
      <div style={{
        fontSize: '11px', color: '#F2E7B4', opacity: 0.85,
        letterSpacing: '0.5px', textAlign: 'center',
      }}>
        © 2026 Whee! Photobooth · Pose. Capture. Repeat.
      </div>

    </footer>
  )
}