import hideyLogo from '../assets/hidey_logo.png'
import { MessageCircleHeart, ArrowRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const HIDEY_URL = 'https://tryhidey.xyz'

export default function FeedbackButton() {
  const location = useLocation()
  const showHideyCallout = location.pathname === '/camera' || location.pathname === '/customise'

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '10px',
    }}>
      {showHideyCallout && (
        <a
          href={HIDEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.96)',
            border: '1px solid rgba(145,114,100,0.18)',
            borderRadius: '999px',
            padding: '8px 12px',
            textDecoration: 'none',
            color: '#917264',
            fontFamily: "'Cause', serif",
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 10px 24px rgba(145,114,100,0.12)',
          }}
        >
          <span>Check Out Hidey</span>
          <ArrowRight size={15} color="#DF82A3" />
          <img src={hideyLogo} alt="Hidey" style={{ width: '23px', height: '23px', borderRadius: '10%' }} />
        </a>
      )}

      <button
        className="feedback-button"
        data-tally-open="2EoW4V"
        // data-tally-layout="modal"
        data-tally-hide-title="1"
        data-tally-emoji-text="💌"
        data-tally-emoji-animation="none"
        data-tally-auto-close="3000"
        style={{
          background: 'rgba(223, 130, 163, 0.12)',
          color: 'rgb(145, 114, 100)',
          border: '2px solid rgb(223, 130, 163)',
          borderRadius: '100px',
          padding: '7px 16px',
          fontSize: '13px',
          fontWeight: '600',
          fontFamily: "'Cause', serif",
          cursor: 'pointer',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          transition: 'background 0.2s, border-color 0.2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minWidth: '44px',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <MessageCircleHeart size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}
