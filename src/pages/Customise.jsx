import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import VerticalStripes from '../components/VerticalStripes'
import { Eraser, PenLine, Sparkles, Undo2, Redo2 } from 'lucide-react'

const THEME = {
  pageBg: '#F2E7B4',
  text: '#917264',
  accent: '#DF82A3',
  accentSoft: '#F4B8CC',
  panel: 'rgba(255,255,255,0.55)',
}

const HOME_BTN_SHADOW = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'

const PALETTE = [
  '#D20000', '#DF82A3', '#FE693A', '#FFDF2E', '#7EC636',
  '#2987C2', '#0B5CB4', '#230AAE', '#B9ABFA', '#82218B',
  '#A6615A', '#635A56', '#Fc759E', '#070707', '#ffffff',
]

const SIZES = [6, 12, 20]


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
  const canvasWrapRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])
  const glowWasUsedRef = useRef(false)

  const [color, setColor] = useState(THEME.accent)
  const [size, setSize] = useState(6)
  const [isGlow, setIsGlow] = useState(false)
  const [tool, setTool] = useState('pen')
  const [photosLoaded, setPhotosLoaded] = useState(false)
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })

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
        const maxH = Math.max(200, window.innerHeight - 220)
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
      const maxH = Math.max(200, window.innerHeight - 220)
      const scale = Math.min(maxW / pc.width, maxH / pc.height, 1)
      setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
    })
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current)
    return () => ro.disconnect()
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

  function clearCanvasShadow() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
  }

  function startDraw(e) {
    e.preventDefault()
    if (tool !== 'pen' && tool !== 'eraser') return

    saveHistory()
    isDrawing.current = true
    lastPos.current = getPos(e)

    if (isGlow && tool === 'pen') glowWasUsedRef.current = true
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
    } else if (isGlow && tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.shadowBlur = 20
      ctx.shadowColor = color
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.shadowBlur = 0
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
    clearCanvasShadow()
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
      clearCanvasShadow()
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
      clearCanvasShadow()
    }
  }

  function toggleGlow() {
    if (isGlow) {
      if (glowWasUsedRef.current) undo()
      glowWasUsedRef.current = false
      setIsGlow(false)
      setTool('pen')
    } else {
      setIsGlow(true)
      setTool('pen')
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
    background: active ? 'rgba(223,130,163,0.15)' : 'transparent',
    border: active ? '2px solid #DF82A3' : '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Cause',serif",
    fontSize: '16px',
    lineHeight: 1,
    padding: '5px 4px',
    color: active ? THEME.accent : THEME.text,
    transition: 'all 0.15s',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  const canvasStackStyle = displaySize.w > 0 && displaySize.h > 0
    ? { width: `${displaySize.w}px`, height: `${displaySize.h}px` }
    : { maxWidth: '100%', maxHeight: 'calc(100dvh - 200px)', width: 'auto', height: 'auto' }

  return (
    <div className="page-wrapper customise-page-wrapper" style={{
      height: '100dvh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: THEME.pageBg,
      position: 'relative',
      fontFamily: "'Cause',serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <VerticalStripes />

      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '28px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxSizing: 'border-box',
      }}>

        <PageHeader onBack={() => navigate('/camera')} title="Doodle your strip" className="customise-header" titleClassName="customise-title" />

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center',
        }}>

          {/* Left — framed tools */}
          <div style={{
            flexShrink: 0,
            width: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: THEME.panel,
            border: '2px solid #D4C49A',
            borderRadius: '14px',
            padding: '8px 6px',
            boxShadow: HOME_BTN_SHADOW,
            alignSelf: 'center',
          }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>
              Tools
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <button type="button" title="Pen" onClick={() => { setTool('pen'); setIsGlow(false); glowWasUsedRef.current = false }} style={toolBtn(tool === 'pen' && !isGlow)}>
                <PenLine size={16} color={tool === 'pen' && !isGlow ? THEME.accent : THEME.text} />
              </button>
              <button type="button" title="Eraser" onClick={() => { setTool('eraser'); setIsGlow(false); glowWasUsedRef.current = false }} style={toolBtn(tool === 'eraser')}>
                <Eraser size={18} color={tool === 'eraser' ? THEME.accent : THEME.text} />
              </button>
              <button type="button" title="Glow" onClick={toggleGlow} style={toolBtn(isGlow)}>
                <Sparkles size={16} color={isGlow ? THEME.accent : THEME.text} />
              </button>
              <button type="button" title="Undo" onClick={undo} style={toolBtn(false)}>
                <Undo2 size={16} color={THEME.text} />
              </button>
              <button type="button" title="Redo" onClick={redo} style={toolBtn(false)}>
                <Redo2 size={16} color={THEME.text} />
              </button>
            </div>

            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>
              Size
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              {SIZES.map(s => (
                <button key={s} type="button" title={`Size ${s}`} onClick={() => setSize(s)} style={{ ...toolBtn(size === s), fontSize: '11px', fontWeight: 700 }}>
                  {s}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>
              Color
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
              {PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  style={{
                    width: color === c ? 16 : 12,
                    height: color === c ? 16 : 12,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? `2px solid ${THEME.accent}` : '1px solid rgba(145,114,100,0.25)',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Center — canvas + download */}
          <div style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            margin: 0,
            padding: 0,
            gap: 0,
          }}>
            <div
              ref={canvasWrapRef}
              style={{
                flex: '1 1 auto',
                minHeight: 0,
                width: 'auto',
                maxWidth: '100%',
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {!photosLoaded && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: THEME.text,
                  fontSize: '13px',
                  letterSpacing: '2px',
                }}>
                  LOADING…
                </div>
              )}

              <div style={{ position: 'relative', ...canvasStackStyle }}>
                <canvas
                  ref={photoCanvasRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    borderRadius: '12px',
                    boxShadow: HOME_BTN_SHADOW,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    borderRadius: '12px',
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

            <button
              type="button"
              onClick={handleDownload}
              style={{
                fontFamily: "'Cause',serif",
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#F2E7B4',
                background: '#DF82A3',
                border: 'none',
                borderRadius: '100px',
                padding: '11px 32px',
                cursor: 'pointer',
                boxShadow: HOME_BTN_SHADOW,
                flexShrink: 0,
                marginTop: '10px',
                marginBottom: '4px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
