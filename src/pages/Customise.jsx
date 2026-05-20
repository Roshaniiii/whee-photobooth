import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** Theme tokens (deduped from design palette) */
const THEME = {
  pageBg: '#F2E7B4',
  text: '#917264',
  accent: '#DF82A3',
  accentSoft: '#F4B8CC',
  panel: 'rgba(255,255,255,0.55)',
  shadow: 'rgba(145,114,100,0.18)',
}

/** Unique swatches — no duplicate hex */
const PALETTE = [
  '#eae4e9', '#fff1e6', '#fde2e4', '#fad2e1', '#ffd3da', '#e2ece9', '#bee1e6',
  '#f0efeb', '#dfe7fd', '#cddafd', '#ec91d8', '#ffaaea', '#ffbeee', '#e9d3d0',
  '#ff61ab', '#ff6176', '#ff8161', '#ffb561', '#ffea62', '#dfff61', '#abff61',
  '#76ff61', '#61ff81', '#61ffb5', '#2A2A2A', '#ffffff',
]

const SIZES = [2, 6, 12, 20]

function Stripes() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderBottom: '3px solid #917264', opacity: 0.12 }} />
      ))}
    </div>
  )
}

function drawImageCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const s = Math.max(w / iw, h / ih)
  const dw = iw * s
  const dh = ih * s
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

export default function Customise() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const photoCanvasRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])

  const [color, setColor] = useState(THEME.accent)
  const [size, setSize] = useState(6)
  const [isGlow, setIsGlow] = useState(false)
  const [tool, setTool] = useState('pen')
  const [photosLoaded, setPhotosLoaded] = useState(false)
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const canvasWrapRef = useRef(null)

  useEffect(() => {
    const layoutConfig = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('layoutConfig') || 'null')
      } catch {
        return null
      }
    })()
    const stripPreviewUrl = sessionStorage.getItem('stripPreview')
    const capturedPhotos = JSON.parse(sessionStorage.getItem('capturedPhotos') || '[]')
    const legacyLayout = sessionStorage.getItem('layout') || 'single'

    const canvas = canvasRef.current
    const photoCanvas = photoCanvasRef.current
    if (!canvas || !photoCanvas) return

    const ctx = canvas.getContext('2d')
    const photoCtx = photoCanvas.getContext('2d')

    function sizeBoth(w, h) {
      canvas.width = w
      canvas.height = h
      photoCanvas.width = w
      photoCanvas.height = h
    }

    function fitDisplay() {
      requestAnimationFrame(() => {
        const wrap = canvasWrapRef.current
        const pc = photoCanvasRef.current
        if (!wrap || !pc || !pc.width || !pc.height) return
        const maxW = Math.max(200, wrap.getBoundingClientRect().width)
        const maxH = Math.max(160, window.innerHeight - 210)
        const scale = Math.min(maxW / pc.width, maxH / pc.height, 1)
        setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
      })
    }

    if (stripPreviewUrl) {
      const stripImg = new Image()
      stripImg.onload = () => {
        const nw = stripImg.naturalWidth || stripImg.width
        const nh = stripImg.naturalHeight || stripImg.height
        if (!nw || !nh) return
        sizeBoth(nw, nh)
        photoCtx.drawImage(stripImg, 0, 0)
        ctx.clearRect(0, 0, nw, nh)
        setPhotosLoaded(true)
        fitDisplay()
      }
      stripImg.onerror = () => setPhotosLoaded(false)
      stripImg.src = stripPreviewUrl
      return () => {
        stripImg.onload = null
        stripImg.onerror = null
      }
    }

    if (capturedPhotos.length === 0) return undefined

    const imgs = capturedPhotos.map((src) => {
      const im = new Image()
      im.src = src
      return im
    })

    if (layoutConfig?.slots?.length && layoutConfig.canvasWidth && layoutConfig.canvasHeight) {
      const { canvasWidth: cw, canvasHeight: ch, slots, isCustom, frameColor } = layoutConfig
      sizeBoth(cw, ch)
      let loaded = 0
      imgs.forEach((img) => {
        img.onload = () => {
          loaded++
          if (loaded !== imgs.length) return
          photoCtx.fillStyle = isCustom ? (frameColor || '#F4B8CC') : '#ffffff'
          photoCtx.fillRect(0, 0, cw, ch)
          slots.forEach((slot, i) => {
            const im = imgs[i] ?? imgs[imgs.length - 1]
            if (!im) return
            drawImageCover(photoCtx, im, slot.x, slot.y, slot.width, slot.height)
          })
          ctx.clearRect(0, 0, cw, ch)
          setPhotosLoaded(true)
          fitDisplay()
        }
        img.onerror = () => {
          loaded++
          if (loaded === imgs.length) setPhotosLoaded(true)
        }
      })
      return undefined
    }

    sizeBoth(640, 480)
    let loaded = 0
    imgs.forEach((img) => {
      img.onload = () => {
        loaded++
        if (loaded !== imgs.length) return
        photoCtx.fillStyle = '#111'
        photoCtx.fillRect(0, 0, 640, 480)
        if (legacyLayout === 'single') {
          drawImageCover(photoCtx, imgs[0], 0, 0, 640, 480)
        } else if (legacyLayout === 'strip3' || legacyLayout === 'strip4') {
          const h = 480 / imgs.length
          imgs.forEach((im, idx) => drawImageCover(photoCtx, im, 0, idx * h, 640, h))
        } else if (legacyLayout === 'grid') {
          drawImageCover(photoCtx, imgs[0], 0, 0, 320, 240)
          drawImageCover(photoCtx, imgs[1] || imgs[0], 320, 0, 320, 240)
          drawImageCover(photoCtx, imgs[2] || imgs[0], 0, 240, 320, 240)
          drawImageCover(photoCtx, imgs[3] || imgs[0], 320, 240, 320, 240)
        } else if (legacyLayout === 'wide') {
          drawImageCover(photoCtx, imgs[0], 0, 0, 640, 240)
          drawImageCover(photoCtx, imgs[1] || imgs[0], 0, 240, 640, 240)
        } else {
          drawImageCover(photoCtx, imgs[0], 0, 0, 640, 480)
        }
        ctx.clearRect(0, 0, 640, 480)
        setPhotosLoaded(true)
        fitDisplay()
      }
      img.onerror = () => {
        loaded++
        if (loaded === imgs.length) setPhotosLoaded(true)
      }
    })
    return undefined
  }, [])

  useEffect(() => {
    if (!photosLoaded) return
    const ro = new ResizeObserver(() => {
      const wrap = canvasWrapRef.current
      const pc = photoCanvasRef.current
      if (!wrap || !pc || !pc.width || !pc.height) return
      const maxW = Math.max(200, wrap.getBoundingClientRect().width)
      const maxH = Math.max(160, window.innerHeight - 210)
      const scale = Math.min(maxW / pc.width, maxH / pc.height, 1)
      setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
    })
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current)
    const onWin = () => ro.disconnect()
    window.addEventListener('resize', onWin)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWin)
    }
  }, [photosLoaded])

  function getPos(e) {
    const c = canvasRef.current
    const rect = c.getBoundingClientRect()
    const scaleX = c.width / rect.width
    const scaleY = c.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  function saveHistory() {
    const c = canvasRef.current
    historyRef.current.push(c.toDataURL())
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
    const c = canvasRef.current
    const ctx = c.getContext('2d')
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
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    redoRef.current.push(c.toDataURL())
    const prev = historyRef.current.pop()
    const img = new Image()
    img.src = prev
    img.onload = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0)
    }
  }

  function redo() {
    if (redoRef.current.length === 0) return
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    historyRef.current.push(c.toDataURL())
    const next = redoRef.current.pop()
    const img = new Image()
    img.src = next
    img.onload = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0)
    }
  }

  function handleDownload() {
    const merge = document.createElement('canvas')
    const pc = photoCanvasRef.current
    const dc = canvasRef.current
    if (!pc || !dc) return
    merge.width = pc.width
    merge.height = pc.height
    const mctx = merge.getContext('2d')
    mctx.drawImage(pc, 0, 0)
    mctx.drawImage(dc, 0, 0)
    const a = document.createElement('a')
    a.href = merge.toDataURL('image/png')
    a.download = `whee-photobooth-${Date.now()}.png`
    a.click()
  }

  const toolBtn = (active) => ({
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Rosario',serif",
    fontSize: '22px',
    lineHeight: 1,
    padding: '6px 4px',
    color: active ? THEME.accent : THEME.text,
    opacity: active ? 1 : 0.85,
    textDecoration: active ? 'underline' : 'none',
    textUnderlineOffset: '4px',
    transition: 'color 0.15s',
  })

  return (
    <div style={{
      height: '100dvh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: THEME.pageBg,
      position: 'relative',
      fontFamily: "'Rosario',serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Stripes />

      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '10px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxSizing: 'border-box',
      }}>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => navigate('/camera')}
            style={{ background: 'none', border: 'none', color: THEME.text, cursor: 'pointer', fontFamily: "'Rosario',serif", fontSize: '14px', letterSpacing: '1px', padding: 0 }}
          >
            ← Back
          </button>
          <h1 style={{
            fontFamily: "'Networkand',cursive",
            fontSize: 'clamp(20px,4vw,30px)',
            color: THEME.accent,
            margin: '0 auto',
            letterSpacing: '2px',
            textAlign: 'center',
          }}>
            Doodle your strip
          </h1>
          <div style={{ width: '48px' }} />
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          alignItems: 'stretch',
        }}>

          {/* Tools — no boxes, sit on page background */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            paddingTop: '4px',
            width: '40px',
          }}>
            <button type="button" title="Pen" onClick={() => setTool('pen')} style={toolBtn(tool === 'pen')}>✏️</button>
            <button type="button" title="Eraser" onClick={() => setTool('eraser')} style={toolBtn(tool === 'eraser')}>⌫</button>
            <button type="button" title="Glow" onClick={() => setIsGlow((g) => !g)} style={toolBtn(isGlow)}>✦</button>
            <button type="button" title="Undo" onClick={undo} style={toolBtn(false)}>↩</button>
            <button type="button" title="Redo" onClick={redo} style={toolBtn(false)}>↪</button>
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                title={`Size ${s}`}
                onClick={() => setSize(s)}
                style={{
                  ...toolBtn(size === s),
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Canvas + palette — fills remaining height */}
          <div style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{
              flex: 1,
              minHeight: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#2a1f1a',
              boxShadow: `0 6px 24px ${THEME.shadow}`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {!photosLoaded && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: THEME.panel,
                  color: THEME.text,
                  fontSize: '13px',
                  letterSpacing: '2px',
                }}>
                  LOADING…
                </div>
              )}

              <div style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <canvas
                  ref={photoCanvasRef}
                  style={{
                    position: 'absolute',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'relative',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    cursor: tool === 'eraser' ? 'cell' : 'crosshair',
                    touchAction: 'none',
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

            {/* Colors — free-floating dots, no swatch boxes */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px 14px',
              padding: '4px 0',
              flexShrink: 0,
            }}>
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  style={{
                    width: color === c ? 22 : 18,
                    height: color === c ? 22 : 18,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? `2px solid ${THEME.accent}` : '2px solid rgba(145,114,100,0.25)',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: color === c ? `0 0 0 3px ${THEME.accentSoft}` : 'none',
                    transition: 'transform 0.15s, width 0.15s, height 0.15s',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexShrink: 0,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '11px', color: THEME.text, letterSpacing: '1px' }}>Active</span>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: color,
                  border: `2px solid ${THEME.text}`,
                  boxShadow: isGlow ? `0 0 14px ${color}` : 'none',
                }}
              />
              <button
                type="button"
                onClick={handleDownload}
                style={{
                  fontFamily: "'Rosario',serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#F2E7B4',
                  background: '#917264',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #6b5248, 0 6px 16px rgba(145,114,100,0.25)',
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
