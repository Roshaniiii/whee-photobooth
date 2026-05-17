import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const layouts = [
  { id: 'single',   label: 'Single',    shots: 1, preview: [[1, 1]] },
  { id: 'strip3',   label: '3 Strip',   shots: 3, preview: [[1,1],[1,1],[1,1]] },
  { id: 'strip4',   label: '4 Strip',   shots: 4, preview: [[1,1],[1,1],[1,1],[1,1]] },
  { id: 'grid',     label: '2x2 Grid',  shots: 4, preview: [[1,2],[1,2]] },
  { id: 'wide',     label: 'Wide 2',    shots: 2, preview: [[2,1],[2,1]] },
]

export default function Layout() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    sessionStorage.setItem('layout', selected.id)
    sessionStorage.setItem('shots', selected.shots)
    navigate('/camera')
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
      <div className="window" style={{ width: '100%', maxWidth: '750px' }}>

        {/* Title Bar */}
        <div className="window-titlebar">
          <span>🖼 Y2K Photobooth — Choose Layout</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>_</span>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>□</span>
            <span style={{ background: '#ff4444', color: '#fff', padding: '0 6px', fontSize: '12px' }}>✕</span>
          </div>
        </div>

        <div className="window-body" style={{ padding: '30px 20px', textAlign: 'center' }}>

          <h2 style={{
            fontSize: 'clamp(20px, 5vw, 32px)',
            fontWeight: 'bold',
            color: '#ff69b4',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Choose Your Layout
          </h2>
          <p style={{ color: '#c0c0c0', fontSize: '13px', marginBottom: '32px', letterSpacing: '1px' }}>
            SELECT A FRAME STYLE TO GET STARTED
          </p>

          {/* Layout Grid */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '32px'
          }}>
            {layouts.map((layout) => (
              <div
                key={layout.id}
                onClick={() => setSelected(layout)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  border: selected?.id === layout.id
                    ? '3px solid #ff69b4'
                    : '3px solid #333',
                  background: selected?.id === layout.id
                    ? 'rgba(255,105,180,0.1)'
                    : '#111',
                  boxShadow: selected?.id === layout.id
                    ? '0 0 16px rgba(255,105,180,0.5), inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff22'
                    : 'inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff22',
                  transition: 'all 0.15s',
                  minWidth: '100px'
                }}
              >
                {/* Layout Preview */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: layout.id === 'grid' ? '1fr 1fr' : '1fr',
                  gap: '4px',
                  marginBottom: '10px',
                  width: '60px',
                  margin: '0 auto 10px'
                }}>
                  {layout.preview.map((row, i) => (
                    <div key={i} style={{
                      height: layout.id === 'wide' ? '30px' : '20px',
                      background: selected?.id === layout.id ? '#ff69b4' : '#333',
                      border: '1px solid #555',
                      gridColumn: layout.id === 'wide' ? 'span 1' : 'span 1'
                    }} />
                  ))}
                </div>

                <p style={{
                  color: selected?.id === layout.id ? '#ff69b4' : '#c0c0c0',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  {layout.label}
                </p>
                <p style={{ color: '#666', fontSize: '11px' }}>
                  {layout.shots} shot{layout.shots > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => navigate('/')}>
              ← Back
            </button>
            <button
              className="btn-y2k"
              onClick={handleContinue}
              style={{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
            >
              Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}