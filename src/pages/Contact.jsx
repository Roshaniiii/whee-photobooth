import { useForm, ValidationError } from '@formspree/react'
import { useNavigate } from 'react-router-dom'
import { playClick } from '../utils/sounds'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'
import BackButton from '../components/BackButton'

export default function Contact() {
  const navigate = useNavigate()
  const [state, handleSubmit] = useForm('mnjegawo')

  const handleFormSubmit = (e) => {
    playClick()
    handleSubmit(e)
  }

  // Auto-navigate on successful submission
  if (state.succeeded) {
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  return (
    <div className="page-wrapper contact-page-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f2e7b4',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <VerticalStripes />

      {/* Back Button */}
      <BackButton onClick={() => {
        playClick()
        navigate('/')
      }} />

      {/* Content */}
      <div className="page-content contact-page-content" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '600px',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Cause', cursive",
            fontSize: 'clamp(32px, 6vw, 40px)',
            color: '#DF82A3',
            margin: '0 0 12px 0',
            letterSpacing: '1px',
          }}>
            Get in Touch
          </h1>
          <p style={{
            fontFamily: "'Cause', serif",
            fontSize: '14px',
            color: '#917264',
            margin: 0,
            lineHeight: '1.6',
            fontWeight: '500',
          }}>
            Have a question, suggestion, or just want to say hello? Fill in the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Success Message */}
        {state.succeeded && (
          <div style={{
            width: '100%',
            padding: '16px',
            marginBottom: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#DF82A3',
            fontFamily: "'Cause', serif",
            fontSize: '15px',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease-in',
          }}>
            Thanks for reaching out! We'll be in touch soon.
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleFormSubmit}
          style={{
            width: '100%',
            padding: '28px',
            border: '2px solid #D4C49A',
            borderRadius: '12px',
            backgroundColor: 'rgba(250, 250, 249, 0.44)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Name Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#917264',
              letterSpacing: '0.3px',
              fontFamily: "'Cause', serif",
            }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              style={{
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #D4C49A',
                borderRadius: '6px',
                color: '#2D2D3D',
                fontSize: '12px',
                fontFamily: "'Cause', serif",
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#DF82A3'
                e.target.style.boxShadow = '0 0 0 3px rgba(223, 130, 163, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4C49A'
                e.target.style.boxShadow = 'none'
              }}
            />
            <ValidationError field="name" errors={state.errors} style={{ fontSize: '11px', color: '#C74545' }} />
          </div>

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: "'Cause', serif",
              fontSize: '13px',
              fontWeight: '600',
              color: '#917264',
              letterSpacing: '0.3px',
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              style={{
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #D4C49A',
                borderRadius: '6px',
                color: '#2D2D3D',
                fontSize: '12px',
                fontFamily: "'Cause', serif",
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#DF82A3'
                e.target.style.boxShadow = '0 0 0 3px rgba(223, 130, 163, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4C49A'
                e.target.style.boxShadow = 'none'
              }}
            />
            <ValidationError field="email" errors={state.errors} style={{ fontSize: '11px', color: '#C74545' }} />
          </div>

          {/* Subject Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: "'Cause', serif",
              fontSize: '13px',
              fontWeight: '600',
              color: '#917264',
              letterSpacing: '0.3px',
            }}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              placeholder="What's this about?"
              style={{
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #D4C49A',
                borderRadius: '6px',
                color: '#2D2D3D',
                fontSize: '12px',
                fontFamily: "'Cause', serif",
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#DF82A3'
                e.target.style.boxShadow = '0 0 0 3px rgba(223, 130, 163, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4C49A'
                e.target.style.boxShadow = 'none'
              }}
            />
            <ValidationError field="subject" errors={state.errors} style={{ fontSize: '11px', color: '#C74545' }} />
          </div>

          {/* Message Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: "'Cause', serif",
              fontSize: '13px',
              fontWeight: '600',
              color: '#917264',
              letterSpacing: '0.3px',
            }}>
              Message
            </label>
            <textarea
              name="message"
              required
              placeholder="Write your message here..."
              rows="5"
              style={{
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #D4C49A',
                borderRadius: '6px',
                color: '#2D2D3D',
                fontSize: '12px',
                fontFamily: "'Cause', serif",
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#DF82A3'
                e.target.style.boxShadow = '0 0 0 3px rgba(223, 130, 163, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4C49A'
                e.target.style.boxShadow = 'none'
              }}
            />
            <ValidationError field="message" errors={state.errors} style={{ fontSize: '11px', color: '#C74545' }} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.submitting || state.succeeded}
            style={{
              marginTop: '4px',
              padding: '12px 32px',
              backgroundColor: state.submitting || state.succeeded ? '#D4C49A' : '#DF82A3',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              fontFamily: "'Cause', serif",
              cursor: state.submitting || state.succeeded ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: state.submitting || state.succeeded ? 'none' : '0 4px 12px rgba(223, 130, 163, 0.25)',
              opacity: state.submitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!state.submitting && !state.succeeded) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 16px rgba(223, 130, 163, 0.35)'
              }
            }}
            onMouseLeave={(e) => {
              if (!state.submitting && !state.succeeded) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(223, 130, 163, 0.25)'
              }
            }}
          >
            {state.submitting ? 'Sending...' : 'Send Message'}
          </button>

          {/* Form Error */}
          <ValidationError errors={state.errors} style={{ fontSize: '11px', color: '#C74545', textAlign: 'center' }} />
        </form>
      </div>

      {/* Footer */}
      <Footer />

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
