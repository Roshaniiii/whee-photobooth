import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircleHeart, Mail } from 'lucide-react'
import logo from '../assets/donate.png'

// Navbar dispatches a custom event to open SupportButton's popup
function openSupportPopup() {
    window.dispatchEvent(new CustomEvent('whee:openSupport'))
}

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const hideOn = ['/camera', '/customise']
    if (hideOn.includes(location.pathname)) return null

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'transparent',
            backdropFilter: 'none',
            borderBottom: 'none',
            padding: '0 20px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Cause', serif",
        }}>

            {/* ── Left: Logo + Name ── */}
            <button
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                <img src={logo} alt="Whee logo" style={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                }} />
                <span style={{
                    fontFamily: "'Cause', cursive",
                    fontSize: '16px',
                    color: '#DF82A3',
                    letterSpacing: '1px',
                }}>
                    Whee!
                </span>
            </button>

            {/* ── Right: Action buttons ── */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                {/* Support button — opens SupportButton popup */}
                <button
                    className="nav-support-btn"
                    onClick={openSupportPopup}
                    style={{
                        background: 'rgba(223, 130, 163, 0.12)',
                        color: 'rgb(145, 114, 100)',
                        border: '2px solid rgb(223, 130, 163)',
                        borderRadius: '100px',
                        padding: '7px 16px',
                        minHeight: '36px',
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
                        gap: '6px',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{ fontSize: '14px' }}>🧁</span>
                    <span className="nav-btn-text">Support</span>
                </button>

                {/* Feedback button — opens Tally */}
                <button
                    className="nav-feedback-btn"
                    data-tally-open="2EoW4V"
                    data-tally-layout="modal"
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
                        minHeight: '36px',
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
                        gap: '6px',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <MessageCircleHeart size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">Feedback</span>
                </button>

                {/* Contact button */}
                <button
                    className="nav-contact-btn"
                    onClick={() => navigate('/contact')}
                    style={{
                        background: 'rgba(223, 130, 163, 0.12)',
                        color: 'rgb(145, 114, 100)',
                        border: '2px solid rgb(223, 130, 163)',
                        borderRadius: '100px',
                        padding: '7px 16px',
                        minHeight: '36px',
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
                        gap: '6px',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Mail size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">Contact</span>
                </button>

            </div>
        </nav>
    )
}