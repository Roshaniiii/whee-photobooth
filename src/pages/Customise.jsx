import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COLORS = [
  '#000000', '#ffffff', '#ff69b4', '#ff0000',
  '#ff4500', '#ffff00', '#00ff00', '#00ffff',
  '#0000ff', '#8000ff', '#ff00ff', '#c0c0c0',
  '#39ff14', '#ff1493', '#00bfff', '#ffd700'
]

const SIZES = [2, 6, 12, 20]

export default function Customise() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const photoCanvasRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])

  const [color, setColor] = useState('#ff69b4')
  const [size, setSize] = useState(6)
  const [isGlow, setIsGlow] = useState(false)
  const [tool, setTool] = useState('pen') // pen or eraser
  const [photosLoaded, setPhotosLoaded] = useState(false)

  const capturedPhotos = JSON.parse(sessionStorage.getItem('capturedPhotos') || '[]')
  const layout = sessionStorage.getItem('layout') || 'single'

  // Load photos onto the background canvas
  useEffect(() => {
    if (capturedPhotos.length === 0) return
    const canvas = canvasRef.current
    const photoCanvas = photoCanvasRef.current
    if (!canvas || !photoCanvas) return

    const ctx = canvas.getContext('2d')
    const photoCtx = photoCanvas.getContext('2d')

    // Set canvas size
    canvas.width = 640
    canvas.height = 480
    photoCanvas.width = 640
    photoCanvas.height = 480

    // Draw photos based on layout
    const imgs = capturedPhotos.map(src => {
      const img = new Image()
      img.src = src
      return img
    })

    let loaded = 0
    imgs.forEach((img, i) => {
      img.onload = () => {
        loaded++
        if (loaded === imgs.length) {
          photoCtx.fillStyle = '#111'
          photoCtx.fillRect(0, 0, 640, 480)

          if (layout === 'single') {
            photoCtx.drawImage(imgs[0], 0, 0, 640, 480)
          } else if (layout === 'strip3' || layout === 'strip4') {
            const h = 480 / imgs.length
            imgs.forEach((im, idx) => {
              photoCtx.drawImage(im, 0, idx * h, 640, h)
            })
          } else if (layout === 'grid') {
            photoCtx.drawImage(imgs[0] || imgs[0], 0, 0, 320, 240)
            photoCtx.drawImage(imgs[1] || imgs[0], 320, 0, 320, 240)
            photoCtx.drawImage(imgs[2] || imgs[0], 0, 240, 320, 240)
            photoCtx.drawImage(imgs[3] || imgs[0], 320, 240, 320, 240)
          } else if (layout === 'wide') {
            photoCtx.drawImage(imgs[0], 0, 0, 640, 240)
            photoCtx.drawImage(imgs[1] || imgs[0], 0, 240, 640, 240)
          }

          // Clear drawing canvas (transparent)
          ctx.clearRect(0, 0, 640, 480)
          setPhotosLoaded(true)
        }
      }
    })
  }, [])

  // Drawing helpers
  function getPos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  function saveHistory() {
    const canvas = canvasRef.current
    historyRef.current.push(canvas.toDataURL())
    redoRef.current = []
  }

  function startDraw(e) {
    e.preventDefault()
    saveHistory()
    isDrawing.current = true
    lastPos.current = getPos(e)
  }

  function draw(e) {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e)

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth = size * 2
      ctx.shadowBlur = 0
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      if (isGlow) {
        ctx.shadowBlur = 20
        ctx.shadowColor = color
      } else {
        ctx.shadowBlur = 0
      }
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDraw(e) {
    e.preventDefault()
    isDrawing.current = false
    lastPos.current = null
  }

  function undo() {
    if (historyRef.current.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    redoRef.current.push(canvas.toDataURL())
    const prev = historyRef.current.pop()
    const img = new Image()
    img.src = prev
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }

  function redo() {
    if (redoRef.current.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    historyRef.current.push(canvas.toDataURL())
    const next = redoRef.current.pop()
    const img = new Image()
    img.src = next
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }

  function handleDownload() {
    // Merge photo canvas + drawing canvas
    const merge = document.createElement('canvas')
    merge.width = 640
    merge.height = 480
    const ctx = merge.getContext('2d')
    ctx.drawImage(photoCanvasRef.current, 0, 0)
    ctx.drawImage(canvasRef.current, 0, 0)
    const a = document.createElement('a')
    a.href = merge.toDataURL('image/png')
    a.download = `y2k-photobooth-${Date.now()}.png`
    a.click()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 70%)'
    }}>
      <div className="window" style={{ width: '100%', maxWidth: '900px' }}>

        {/* Title Bar */}
        <div className="window-titlebar">
          <span>🎨 Y2K Photobooth — Customise (Paint Mode)</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>_</span>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>□</span>
            <span style={{ background: '#ff4444', color: '#fff', padding: '0 6px', fontSize: '12px' }}>✕</span>
          </div>
        </div>

        {/* MS Paint Menu Bar */}
        <div style={{
          background: '#c0c0c0',
          padding: '2px 8px',
          display: 'flex',
          gap: '16px',
          borderBottom: '2px solid #808080'
        }}>
          {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map(m => (
            <span key={m} style={{
              fontSize: '13px', color: '#000',
              cursor: 'pointer', padding: '2px 6px',
              fontFamily: 'Arial, sans-serif'
            }}
              onMouseEnter={e => e.target.style.background = '#000080' || e.target.style.color === '#fff'}
            >
              {m}
            </span>
          ))}
        </div>

        <div className="window-body" style={{ padding: '8px', display: 'flex', gap: '8px' }}>

          {/* LEFT — MS Paint Toolbar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: '#c0c0c0',
            padding: '6px',
            border: '2px inset #808080',
            minWidth: '44px',
            alignItems: 'center'
          }}>

            {/* Pen Tool */}
            <button
              onClick={() => setTool('pen')}
              title="Pen"
              style={{
                width: '36px', height: '36px',
                background: tool === 'pen' ? '#000080' : '#c0c0c0',
                color: tool === 'pen' ? '#fff' : '#000',
                border: tool === 'pen'
                  ? '2px inset #fff'
                  : '2px outset #fff',
                cursor: 'pointer', fontSize: '18px'
              }}>
              ✏️
            </button>

            {/* Eraser */}
            <button
              onClick={() => setTool('eraser')}
              title="Eraser"
              style={{
                width: '36px', height: '36px',
                background: tool === 'eraser' ? '#000080' : '#c0c0c0',
                color: tool === 'eraser' ? '#fff' : '#000',
                border: tool === 'eraser'
                  ? '2px inset #fff'
                  : '2px outset #fff',
                cursor: 'pointer', fontSize: '18px'
              }}>
              🧹
            </button>

            <div style={{ width: '100%', height: '2px', background: '#808080', margin: '4px 0' }} />

            {/* Glow Toggle */}
            <button
              onClick={() => setIsGlow(g => !g)}
              title="Glow Pen"
              style={{
                width: '36px', height: '36px',
                background: isGlow ? '#ff69b4' : '#c0c0c0',
                border: isGlow ? '2px inset #fff' : '2px outset #fff',
                cursor: 'pointer', fontSize: '16px'
              }}>
              ✨
            </button>

            <div style={{ width: '100%', height: '2px', background: '#808080', margin: '4px 0' }} />

            {/* Undo */}
            <button onClick={undo} title="Undo"
              style={{
                width: '36px', height: '36px',
                background: '#c0c0c0',
                border: '2px outset #fff',
                cursor: 'pointer', fontSize: '16px'
              }}>
              ↩
            </button>

            {/* Redo */}
            <button onClick={redo} title="Redo"
              style={{
                width: '36px', height: '36px',
                background: '#c0c0c0',
                border: '2px outset #fff',
                cursor: 'pointer', fontSize: '16px'
              }}>
              ↪
            </button>

            <div style={{ width: '100%', height: '2px', background: '#808080', margin: '4px 0' }} />

            {/* Pen Sizes */}
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                title={`Size ${s}`}
                style={{
                  width: '36px', height: '36px',
                  background: size === s ? '#000080' : '#c0c0c0',
                  border: size === s ? '2px inset #fff' : '2px outset #fff',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                <div style={{
                  width: `${Math.min(s + 4, 24)}px`,
                  height: `${Math.min(s + 4, 24)}px`,
                  borderRadius: '50%',
                  background: size === s ? '#fff' : '#000'
                }} />
              </button>
            ))}
          </div>

          {/* CENTER — Canvas */}
          <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>

            {!photosLoaded && (
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#111', color: '#ff69b4', letterSpacing: '2px', fontSize: '14px'
              }}>
                LOADING...
              </div>
            )}

            {/* Photo layer (background) */}
            <canvas
              ref={photoCanvasRef}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                display: 'block'
              }}
            />

            {/* Drawing layer (on top) */}
            <canvas
              ref={canvasRef}
              style={{
                position: 'relative',
                width: '100%',
                display: 'block',
                cursor: tool === 'eraser' ? 'cell' : 'crosshair',
                touchAction: 'none'
              }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>
        </div>

        {/* BOTTOM — Color Palette + Download (MS Paint style) */}
        <div style={{
          background: '#c0c0c0',
          padding: '6px 8px',
          borderTop: '2px solid #808080',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>

          {/* Current color box */}
          <div style={{
            width: '36px', height: '36px',
            background: color,
            border: '3px inset #808080',
            flexShrink: 0,
            boxShadow: `0 0 ${isGlow ? 12 : 0}px ${color}`
          }} />

          {/* Color palette */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            maxWidth: '280px'
          }}>
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '20px', height: '20px',
                  background: c,
                  border: color === c ? '3px inset #000' : '2px outset #fff',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <button className="btn-secondary"
              onClick={() => navigate('/camera')}
              style={{ padding: '8px 16px', fontSize: '12px' }}>
              ← Back
            </button>
            <button className="btn-y2k"
              onClick={handleDownload}
              style={{ padding: '8px 20px', fontSize: '13px' }}>
              ⬇ Download
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}