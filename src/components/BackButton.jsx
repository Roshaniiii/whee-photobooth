export default function BackButton({ onClick, label = '← Back' }) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.55)',
        border: '2px solid #D4C49A',
        borderRadius: '100px',
        color: '#917264',
        cursor: 'pointer',
        fontFamily: "'Cause',serif",
        fontSize: '13px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        padding: '7px 16px',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(223,130,163,0.12)'
        e.currentTarget.style.borderColor = '#DF82A3'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
        e.currentTarget.style.borderColor = '#D4C49A'
      }}
    >
      {label}
    </button>
  )
}
