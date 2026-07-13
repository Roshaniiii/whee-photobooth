import { MessageCircleHeart } from 'lucide-react'

export default function FeedbackButton() {

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
