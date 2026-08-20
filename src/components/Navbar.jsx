import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircleHeart, Mail, BookOpen, Info } from 'lucide-react'
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

    const navBtnStyle = (isActive) => ({
        background: isActive ? 'rgba(223, 130, 163, 0.22)' : 'rgba(223, 130, 163, 0.12)',
        color: isActive ? '#DF82A3' : 'rgb(145, 114, 100)',
        border: isActive ? '2px solid rgb(223, 130, 163)' : '2px solid rgba(223, 130, 163, 0.6)',
        borderRadius: '100px',
        padding: '7px 14px',
        minHeight: '36px',
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: "'Cause', serif",
        cursor: 'pointer',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
    })

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: 'none',
            padding: '0 16px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Cause', serif",
            boxSizing: 'border-box',
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
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>

                {/* About button */}
                <button
                    className="nav-about-btn"
                    onClick={() => navigate('/about')}
                    style={navBtnStyle(location.pathname === '/about')}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Info size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">About</span>
                </button>

                {/* Blog button */}
                <button
                    className="nav-blog-btn"
                    onClick={() => navigate('/blog')}
                    style={navBtnStyle(location.pathname.startsWith('/blog'))}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <BookOpen size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">Blog</span>
                </button>

                {/* Contact button */}
                <button
                    className="nav-contact-btn"
                    onClick={() => navigate('/contact')}
                    style={navBtnStyle(location.pathname === '/contact')}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Mail size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">Contact</span>
                </button>

                {/* Support button */}
                <button
                    className="nav-support-btn"
                    onClick={openSupportPopup}
                    style={navBtnStyle(false)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{ fontSize: '14px' }}>🧁</span>
                    <span className="nav-btn-text">Donate</span>
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
                    style={navBtnStyle(false)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <MessageCircleHeart size={14} strokeWidth={2.2} />
                    <span className="nav-btn-text">Feedback</span>
                </button>

            </div>
        </nav>
    )
}