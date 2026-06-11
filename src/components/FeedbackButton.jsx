export default function FeedbackButton() {
  return (
    <button
      data-tally-open="2EoW4V"
      // data-tally-layout="modal"
      data-tally-hide-title="1"
      data-tally-emoji-text="💌"
      data-tally-emoji-animation="none"
      data-tally-auto-close="3000"
      style={{
        position:     'fixed',
        top:          '24px',
        right:        '24px',
        zIndex:       1000,
        background:   'rgba(223, 130, 163, 0.12)',
        color:        'rgb(145, 114, 100)',
        border:       '2px solid rgb(223, 130, 163)',
        borderRadius: '100px',
        padding:      '7px 16px',
        fontSize:     '13px',
        fontWeight:   '600',
        fontFamily:   "'Cause', serif",
        cursor:       'pointer',
        letterSpacing:'0.5px',
        textTransform:'uppercase',
        transition:   'background 0.2s, border-color 0.2',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* 💌 */}
      🩷
    </button>
  )
}