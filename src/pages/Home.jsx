import { useNavigate } from 'react-router-dom'

// Import all assets — copy these files into your src/assets/ folder
import logo from '../assets/whee-logo.png'
import frame1 from '../assets/frame_1.png'
import frame2 from '../assets/frame_2.png'
import frame3 from '../assets/frame_3.png'
import frame4 from '../assets/frame_4.png'
import frame5 from '../assets/frame_5.png'
import frame6 from '../assets/frame_6.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#F2E7B4',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* ── Vertical Stripe Background ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            borderRight: '8px solid #917264',
            opacity: 0.20,
          }} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        padding: '48px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* ── Logo + Title ── */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <h1 style={{
            fontFamily: "'Networkand', 'Rosario', cursive",
            fontSize: 'clamp(38px, 7vw, 72px)',
            color: '#DF82A3',
            margin: 0,
            letterSpacing: '2px',
            lineHeight: 1.1,
          }}>
            Whee Photobooth
          </h1>

          {/* Tagline — shifted right */}
          <p style={{
            fontFamily: "'Rosario', serif",
            fontSize: 'clamp(13px, 2vw, 18px)',
            color: '#917264',
            margin: '6px 0 0 0',
            paddingLeft: 'clamp(40px, 10%, 140px)',
            letterSpacing: '0.5px',
          }}>
            Pose. Capture. Repeat.
          </p>
        </div>

        {/* ── Frames scattered layout ── */}
        {/*
          Replicating the reference: 6 frames in a loose organic cluster.
          Using absolute positioning inside a relative container sized to hold them.
        */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          height: 'clamp(360px, 55vw, 520px)',
          margin: '16px auto 32px',
        }}>

          {/* Frame 1 — top center, large */}
          <img src={frame1} alt="photo frame 1" style={{
            position: 'absolute',
            width: 'clamp(140px, 18vw, 200px)',
            left: '50%',
            top: '0%',
            transform: 'translateX(-60%) rotate(-3deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-60%) rotate(-3deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-60%) rotate(-3deg) scale(1)'}
          />

          {/* Frame 2 — top right */}
          <img src={frame2} alt="photo frame 2" style={{
            position: 'absolute',
            width: 'clamp(120px, 15vw, 170px)',
            right: '4%',
            top: '4%',
            transform: 'rotate(4deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(4deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(4deg) scale(1)'}
          />

          {/* Frame 3 — left side */}
          <img src={frame3} alt="photo frame 3" style={{
            position: 'absolute',
            width: 'clamp(100px, 12vw, 140px)',
            left: '2%',
            top: '8%',
            transform: 'rotate(-5deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(-5deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(-5deg) scale(1)'}
          />

          {/* Frame 4 — bottom left */}
          <img src={frame4} alt="photo frame 4" style={{
            position: 'absolute',
            width: 'clamp(120px, 15vw, 168px)',
            left: '12%',
            bottom: '2%',
            transform: 'rotate(3deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(3deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(3deg) scale(1)'}
          />

          {/* Frame 5 — bottom center, large */}
          <img src={frame5} alt="photo frame 5" style={{
            position: 'absolute',
            width: 'clamp(150px, 20vw, 220px)',
            left: '50%',
            bottom: '0%',
            transform: 'translateX(-50%) rotate(-2deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-50%) rotate(-2deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%) rotate(-2deg) scale(1)'}
          />

          {/* Frame 6 — bottom right */}
          <img src={frame6} alt="photo frame 6" style={{
            position: 'absolute',
            width: 'clamp(100px, 12vw, 138px)',
            right: '3%',
            bottom: '6%',
            transform: 'rotate(5deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(5deg) scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(5deg) scale(1)'}
          />

        </div>

        {/* ── START Button ── */}
        <button
          onClick={() => navigate('/layout')}
          style={{
            fontFamily: "'Rosario', serif",
            fontSize: 'clamp(15px, 2.5vw, 20px)',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#F2E7B4',
            background: '#DF82A3',
            border: 'none',
            borderRadius: '100px',
            padding: 'clamp(12px, 2vw, 16px) clamp(40px, 8vw, 72px)',
            cursor: 'pointer',
            boxShadow: '0 6px 0px #917264, 0 10px 24px rgba(145,114,100,0.25)',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 9px 0px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 6px 0px #917264, 0 10px 24px rgba(145,114,100,0.25)'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translateY(3px)'
            e.currentTarget.style.boxShadow = '0 3px 0px #917264, 0 4px 12px rgba(145,114,100,0.2)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 9px 0px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
        >
          Start
        </button>

      </div>
    </div>
  )
}