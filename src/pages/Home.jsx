import { useNavigate } from 'react-router-dom'
import { playClick } from '../utils/sounds'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

// Import all assets — copy these files into your src/assets/ folder
import frame1 from '../assets/frame_1.png'
import frame2 from '../assets/frame_2.png'
import frame3 from '../assets/frame_3.png'
import frame4 from '../assets/frame_4.png'
import frame5 from '../assets/frame_5.png'
import frame6 from '../assets/frame_6.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper home-page-wrapper" style={{
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

      {/* ── Content ── */}
      <div className="page-content home-page-content" style={{
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
        <div style={{ textAlign: 'center', marginBottom: '3px' }}>
          <h1 className="home-title" style={{
            fontFamily: "'Unkempt', 'Cause', cursive",
            fontSize: 'clamp(38px, 7vw, 55px)',
            color: '#DF82A3',
            margin: 0,
            letterSpacing: '1px',
            lineHeight: 1,
          }}>
            Whee! Photobooth
          </h1>

          {/* Tagline — shifted right */}
          <p className="home-subtitle" style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(13px, 2vw, 16px)',
            color: '#917264',
            margin: '5px 0 0 0',
            letterSpacing: '0.5px',
          }}>
            Pose. Capture. Repeat.
          </p>
        </div>

        {/* ── Frames scattered layout — clustered like Image 1 ── */}
        <div className="home-frames-wrap" style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          height: 'clamp(300px, 48vw, 420px)',
          margin: '8px auto 28px',
        }}>

          {/* Frame 3 — top left, small */}
          <img className="home-frame frame-3" src={frame3} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(110px, 13vw, 130px)',
            left: '7%',
            top: '19%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 1 — top center, large — most prominent */}
          <img className="home-frame frame-1" src={frame1} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(170px, 22vw, 200px)',
            left: '45%',
            top: '1%',
            transform: 'translateX(-55%) rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
            zIndex: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-55%) rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-55%) rotate(0deg) scale(1)'}
          />

          {/* Frame 2 — top right, medium */}
          <img className="home-frame frame-6" src={frame6} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(140px, 16vw, 160px)',
            right: '15%',
            top: '13%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 3 — bottom left, medium */}
          <img className="home-frame frame-2" src={frame2} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(140px, 15vw, 150px)',
            left: '12%',
            bottom: '10%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 4 — bottom center, large */}
          <img className="home-frame frame-4" src={frame4} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(200px, 22vw, 210px)',
            left: '53%',
            bottom: '-4%',
            transform: 'translateX(-50%) rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
            zIndex: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-50%) rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%) rotate(0deg) scale(1)'}
          />

          {/* Frame 6 — bottom right, small */}
          <img className="home-frame frame-5" src={frame5} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(120px, 13vw, 130px)',
            right: '9%',
            bottom: '14%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

        </div>
      
        {/* ── START Button ── */}
        <button
          onClick={() => {
            playClick()
            navigate('/layout')
          }}
          style={{
            fontFamily: "'Cause', serif",
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
            boxShadow: '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translateY(3px)'
            e.currentTarget.style.boxShadow = '0 5px 3px #917264, 0 4px 12px rgba(145,114,100,0.2)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
        >
          Start
        </button>
        {/* <section style={{ maxWidth: '500px', margin: '24px auto 0', textAlign: 'center', padding: '0 16px' }}>
          <h2 style={{
            fontFamily: "'Networkand', cursive",
            fontSize: '15px',
            color: '#917264',
            fontWeight: '400',
            letterSpacing: '0.5px',
          }}>
            Free Online Photo Booth — Capture, Filter & Customize Your Photo Strips
          </h2>
        </section> */}
      </div>
      <Footer /> 
      
    </div>
  )
}