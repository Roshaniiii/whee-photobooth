import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const firstRender = useRef(true)
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    firstRender.current = false
  }, [status])

  function handleClose() {
    setOpen(false)
  }

  const isEmailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) {
      setFeedback('No problem — just close the popup and enjoy the site.')
      return
    }

    if (!isEmailValid) {
      setFeedback('Please enter a valid email address.')
      return
    }

    setStatus('sending')
    setFeedback('')

    try {
      const response = await fetch('https://formspree.io/f/xljrewye', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setStatus('success')
      setFeedback('Thanks! You’re on the list for updates.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setFeedback('Something went wrong. Please try again in a moment.')
    }
  }

  if (!open) {
    return null
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(145,114,100,0.45)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #F9EFD5 0%, #F2E7B4 100%)',
          borderRadius: '28px',
          padding: '30px 24px 22px',
          maxWidth: '420px',
          width: 'min(94vw, 420px)',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(145,114,100,0.24)',
          fontFamily: "'Rosario', serif",
          position: 'relative',
          border: '1px solid rgba(223,130,163,0.2)',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(145,114,100,0.08)',
            border: 'none',
            borderRadius: '999px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            color: '#917264',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close announcement dialog"
        >
          <X size={15} />
        </button>

        <h2
          style={{
            fontFamily: "'Unkempt', cursive",
            fontSize: '24px',
            color: '#DF82A3',
            margin: '0 0 12px',
            letterSpacing: '1px',
          }}
        >
          New Updates
        </h2>

        <p style={{ fontSize: '12px', color: '#917264', margin: '0 0 14px', lineHeight: 1.7 }}>
          Thank you SO much for all the love! Your support means a lot to me — I’m reading every bit of feedback and adding new features little by little.
        </p>
        
        <div
          style={{
            background: 'rgba(223,130,163,0.10)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '18px',
            textAlign: 'left',
            border: '1px solid rgba(223,130,163,0.16)',
          }}
        >
          <p style={{ fontSize: '14px', color: '#917264', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            New templates are live now! <br></br>
            If you want to be notified when new templates drop, leave your email below and I’ll send a quick note.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="announcement-email" style={{
            display: 'block',
            textAlign: 'left',
            fontSize: '12px',
            color: '#917264',
            fontWeight: 700,
          }}>
            Email for updates (optional)
          </label>
          <input
            id="announcement-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              borderRadius: '18px',
              border: '1px solid rgba(145,114,100,0.18)',
              padding: '12px 14px',
              fontSize: '14px',
              color: '#5D4732',
              background: '#F8F4EA',
              outline: 'none',
            }}
          />

          {feedback && (
            <p style={{ fontSize: '13px', color: status === 'error' ? '#B45C4B' : '#917264', margin: 0, minHeight: '18px' }}>
              {feedback}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                flex: '1 1 160px',
                minWidth: '140px',
                background: 'linear-gradient(135deg, #DF82A3 0%, #D96F95 100%)',
                color: '#F8F1DA',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 18px rgba(223,130,163,0.26)',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Keep me posted'}
            </button>
            <a
              href="https://razorpay.me/@wheephotobooth"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              style={{
                flex: '1 1 140px',
                minWidth: '140px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '2px solid #DF82A3',
                color: '#917264',
                borderRadius: '999px',
                padding: '12px 18px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              🧁 Donate
            </a>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              color: '#917264',
              opacity: 0.8,
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
              fontFamily: "'Rosario', serif",
            }}
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  )
}
