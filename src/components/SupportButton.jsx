import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function SupportButton() {
  const [open, setOpen] = useState(false)
  const onCloseRef            = useRef(null)

  // Listen for Camera.jsx trigger
  useEffect(() => {
    function handleOpenEvent(e) {
      onCloseRef.current = e.detail?.onClose || null
      setOpen(true)
    }
    window.addEventListener('whee:openSupport', handleOpenEvent)
    return () => window.removeEventListener('whee:openSupport', handleOpenEvent)
  }, [])

  function handleClose() {
    setOpen(false)
    // Trigger Tally after support popup closes
    if (onCloseRef.current) {
      onCloseRef.current()
      onCloseRef.current = null
    }
  }

  return (
    <>
      <button
        className="support-button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          top: '24px',
          right: '96px',
          zIndex: 1000,
          background: 'rgba(223, 130, 163, 0.12)',
          color: 'rgb(145, 114, 100)',
          border: '2px solid rgb(223, 130, 163)',
          borderRadius: '100px',
          padding: '7px 16px',
          minHeight: '42px',
          fontSize: 'clamp(10px, 1.2vw, 13px)',
          fontWeight: '600',
          fontFamily: "'Cause', serif",
          cursor: 'pointer',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          transition: 'transform 0.2s ease, background 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <span style={{ fontSize: '14px' }}>🧁</span>
        <span>Support Whee</span>
      </button>

      {/* ── Popup overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:       'fixed',
            inset:          0,
            background:     'rgba(145,114,100,0.45)',
            zIndex:         2000,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '20px',
          }}
        >
          {/* ── Card ── */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #F9EFD5 0%, #F2E7B4 100%)',
              borderRadius: '28px',
              padding: '32px 24px 24px',
              maxWidth: '380px',
              width: 'min(92vw, 380px)',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(145,114,100,0.24)',
              fontFamily: "'Rosario', serif",
              position: 'relative',
              border: '1px solid rgba(223,130,163,0.2)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(145,114,100,0.08)',
                border: 'none',
                borderRadius: '999px',
                width: '32px',
                height: '32px',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#917264',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close support dialog"
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div style={{
              fontSize: '48px',
              marginBottom: '12px',
              filter: 'drop-shadow(0 3px 6px rgba(145,114,100,0.15))',
            }}>
              🧁
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily:    "'Networkand', cursive",
              fontSize:      '22px',
              color:         '#DF82A3',
              margin:        '0 0 10px',
              letterSpacing: '1px',
            }}>
              Support Whee!
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '13px',
              color: '#917264',
              margin: '0 0 6px',
              lineHeight: 1.6,
            }}>
              Whee is completely free for everyone ♡
            </p>
            <p style={{
              fontSize: '13px',
              color: '#917264',
              margin: '0 0 18px',
              lineHeight: 1.6,
            }}>
              If this made you smile, a small donation helps keep it going.
            </p>

            {/* What your support does */}
            <div style={{
              background: 'rgba(223,130,163,0.10)',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '18px',
              textAlign: 'left',
              border: '1px solid rgba(223,130,163,0.16)',
            }}>
              {[
                '🎨  Funds new templates & filters',
                '✨  Helps Whee stay free for everyone',
              ].map(item => (
                <p key={item} style={{
                  fontSize:   '12px',
                  color:      '#917264',
                  margin:     '4px 0',
                  lineHeight: 1.5,
                }}>
                  {item}
                </p>
              ))}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              {/* Donate button */}
              <a
                href="https://razorpay.me/@wheephotobooth"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #DF82A3 0%, #D96F95 100%)',
                  color: '#F8F1DA',
                  borderRadius: '999px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 18px rgba(223,130,163,0.26)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 22px rgba(223,130,163,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 18px rgba(223,130,163,0.26)'
                }}
              >
                <span style={{ fontSize: '15px' }}>🧁</span>
                <span>Donate</span>
              </a>

              {/* Skip link */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  color: '#917264',
                  opacity: 0.75,
                  cursor: 'pointer',
                  fontFamily: "'Rosario', serif",
                  textDecoration: 'underline',
                }}
              >
                Maybe later
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}