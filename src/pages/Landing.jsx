import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      // Save uploaded image to sessionStorage so Camera page can use it
      sessionStorage.setItem('uploadedImage', ev.target.result)
      navigate('/layout')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 70%)'
    }}>

      {/* MS Paint Window */}
      <div className="window" style={{ width: '100%', maxWidth: '700px' }}>

        {/* Title Bar */}
        <div className="window-titlebar">
          <span>📷 Y2K Photobooth — Paint</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>_</span>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>□</span>
            <span style={{ background: '#ff4444', color: '#fff', padding: '0 6px', fontSize: '12px' }}>✕</span>
          </div>
        </div>

        {/* Window Body */}
        <div className="window-body" style={{ textAlign: 'center', padding: '40px 20px' }}>

          {/* Logo */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: 'clamp(36px, 8vw, 72px)',
              fontWeight: 'bold',
              color: '#ff69b4',
              textShadow: '4px 4px 0px #ff1493, 8px 8px 0px rgba(255,20,147,0.3)',
              letterSpacing: '4px',
              display: 'block'
            }}>
              Y2K
            </span>
            <span style={{
              fontSize: 'clamp(16px, 4vw, 28px)',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '8px',
              textTransform: 'uppercase'
            }}>
              PHOTOBOOTH
            </span>
          </div>

          {/* Subtitle */}
          <p style={{
            color: '#c0c0c0',
            fontSize: '14px',
            letterSpacing: '2px',
            marginBottom: '40px',
            textTransform: 'uppercase'
          }}>
            ✨ your y2k moment, captured ✨
          </p>

          {/* Preview Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {['#ff69b4', '#00ffff', '#ff4500', '#39ff14', '#ff69b4'].map((color, i) => (
              <div key={i} style={{
                width: '80px',
                height: '100px',
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: `0 0 10px ${color}55`
              }}>
                {['📷', '✨', '💿', '⭐', '🌸'][i]}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-y2k" onClick={() => navigate('/layout')}>
              ▶ Start
            </button>
            <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
              ⬆ Upload Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />

          {/* Footer */}
          <p style={{ color: '#444', fontSize: '11px', marginTop: '32px', letterSpacing: '1px' }}>
            INSPIRED BY MS PAINT • Y2K AESTHETIC • {new Date().getFullYear()}
          </p>

        </div>
      </div>
    </div>
  )
}