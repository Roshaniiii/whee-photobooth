import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import VerticalStripes from '../components/VerticalStripes'

const THEME = {
  pageBg: '#F2E7B4',
  text: '#917264',
  accent: '#DF82A3',
  accentSoft: '#F4B8CC',
  panel: 'rgba(255,255,255,0.55)',
}

const HOME_BTN_SHADOW = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'

const PEN_PALETTE = [
  '#917264', '#DF82A3', '#F4B8CC', '#2A2A2A', '#ffffff',
  '#ff61ab', '#ffb561', '#76ff61', '#bee1e6', '#cddafd',
]

const TEXT_COLORS = [
  '#917264', '#DF82A3', '#2A2A2A', '#ffffff', '#ff61ab',
  '#ffb561', '#76ff61', '#bee1e6', '#ff6176', '#abff61',
]

const PEN_SIZES = [6, 12, 20]
const EMOJIS = ['✨', '💖', '⭐', '🌸', '🎀', '✦', '♥', '😊', '🦋', '💫']
const TEXT_MAX = 15
const TEXT_FONT_SIZES = [18, 24, 32, 42]
const EMOJI_SIZES = [24, 32, 40, 48]

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

function panelStyle() {
  return {
    flexShrink: 0,
    width: 'fit-content',
    minWidth: '88px',
    maxWidth: '110px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: THEME.panel,
    border: '2px solid #D4C49A',
    borderRadius: '14px',
    padding: '10px 8px',
    boxShadow: HOME_BTN_SHADOW,
    alignSelf: 'center',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  }
}

function sectionLabel(text) {
  return {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: THEME.text,
    textAlign: 'center',
    margin: 0,
  }
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
  const [textDraft, setTextDraft] = useState('')
  const [textBold, setTextBold] = useState(false)
  const [textItalic, setTextItalic] = useState(false)
  const [textFontSize, setTextFontSize] = useState(24)
  const [textColor, setTextColor] = useState(THEME.accent)
  const [emojiSize, setEmojiSize] = useState(32)
  const [photosLoaded, setPhotosLoaded] = useState(false)
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [dragOverCanvas, setDragOverCanvas] = useState(false)

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
        const maxW = Math.max(200, wrap.getBoundingClientRect().width - 8)
        const maxH = Math.max(200, window.innerHeight - 180)
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
      const maxW = Math.max(200, wrap.getBoundingClientRect().width - 8)
      const maxH = Math.max(200, window.innerHeight - 180)
      const scale = Math.min(maxW / pc.width, maxH / pc.height, 1)
      setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
    })
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current)
    return () => ro.disconnect()
  }, [photosLoaded])

  function getPosFromClient(clientX, clientY) {
    const c = canvasRef.current
    const rect = c.getBoundingClientRect()
    const scaleX = c.width / rect.width
    const scaleY = c.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  function getPos(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return getPosFromClient(clientX, clientY)
  }

  function saveHistory() {
    const c = canvasRef.current
    historyRef.current.push(c.toDataURL())
    redoRef.current = []
  }

  function restoreCanvas(dataUrl) {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0)
    }
  }

  function undo() {
    if (historyRef.current.length === 0) return
    const c = canvasRef.current
    redoRef.current.push(c.toDataURL())
    const prev = historyRef.current.pop()
    restoreCanvas(prev)
  }

  function redo() {
    if (redoRef.current.length === 0) return
    const c = canvasRef.current
    historyRef.current.push(c.toDataURL())
    const next = redoRef.current.pop()
    restoreCanvas(next)
  }

  function buildTextFont({ bold, italic, fontSize }) {
    return `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${fontSize}px 'Cause', serif`
  }

  function drawTextOnCanvas(text, pos, opts) {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.shadowBlur = 0
    ctx.font = buildTextFont(opts)
    ctx.fillStyle = opts.color
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(text, pos.x, pos.y)
    ctx.restore()
  }

  function drawEmojiOnCanvas(emoji, pos, fontSize) {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.shadowBlur = 0
    ctx.font = `${fontSize}px serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(emoji, pos.x, pos.y)
    ctx.restore()
  }

  function handleCanvasDrop(e) {
    e.preventDefault()
    setDragOverCanvas(false)
    let payload
    try {
      payload = JSON.parse(e.dataTransfer.getData('application/json'))
    } catch {
      return
    }
    const pos = getPosFromClient(e.clientX, e.clientY)
    saveHistory()

    if (payload.type === 'text' && payload.text?.trim()) {
      drawTextOnCanvas(payload.text.trim(), pos, payload)
    } else if (payload.type === 'emoji' && payload.emoji) {
      drawEmojiOnCanvas(payload.emoji, pos, payload.fontSize ?? emojiSize)
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

  function setDragPayload(e, payload) {
    e.dataTransfer.setData('application/json', JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'copy'
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

  const fmtBtn = (active) => ({
    flex: 1,
    minWidth: '28px',
    height: '28px',
    borderRadius: '6px',
    border: active ? '2px solid #DF82A3' : '2px solid #D4C49A',
    background: active ? 'rgba(223,130,163,0.12)' : '#fff',
    color: active ? THEME.accent : THEME.text,
    fontFamily: "'Cause', serif",
    fontSize: '12px',
    fontWeight: 700,
    fontStyle: 'normal',
    cursor: 'pointer',
    padding: 0,
  })

  const canvasStackStyle = displaySize.w > 0
    ? { width: `${displaySize.w}px`, height: `${displaySize.h}px` }
    : { maxWidth: '100%', maxHeight: 'calc(100vh - 200px)', width: 'auto', height: 'auto' }

  const textPreviewStyle = {
    fontFamily: "'Cause', serif",
    fontSize: `${Math.min(textFontSize, 20)}px`,
    fontWeight: textBold ? 700 : 400,
    fontStyle: textItalic ? 'italic' : 'normal',
    color: textColor,
    textAlign: 'center',
    wordBreak: 'break-word',
    lineHeight: 1.2,
  }

  return (
    <div style={{
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
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '12px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxSizing: 'border-box',
      }}>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <BackButton onClick={() => navigate('/camera')} />
          <h1 style={{
            fontFamily: "'Unkempt',cursive",
            fontSize: 'clamp(20px,4vw,30px)',
            color: THEME.accent,
            margin: '0 auto',
            letterSpacing: '2px',
            textAlign: 'center',
          }}>
            Doodle your strip
          </h1>
          <div style={{ width: '72px' }} />
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}>

          {/* Left — draw tools */}
          <div style={panelStyle()}>
            <p style={sectionLabel('Tools')}>Tools</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <button type="button" title="Pen" onClick={() => { setTool('pen'); setIsGlow(false); glowWasUsedRef.current = false }} style={toolBtn(tool === 'pen' && !isGlow)}>✏️</button>
              <button type="button" title="Eraser" onClick={() => { setTool('eraser'); setIsGlow(false); glowWasUsedRef.current = false }} style={toolBtn(tool === 'eraser')}>⌫</button>
              <button type="button" title="Glow pen — tap again to undo glow stroke" onClick={toggleGlow} style={toolBtn(isGlow)}>✦</button>
              <button type="button" title="Undo" onClick={undo} style={toolBtn(false)}>↩</button>
              <button type="button" title="Redo" onClick={redo} style={toolBtn(false)}>↪</button>
            </div>

            <p style={{ ...sectionLabel('Size'), marginTop: '2px' }}>Size</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              {PEN_SIZES.map(s => (
                <button key={s} type="button" onClick={() => setSize(s)} style={{ ...toolBtn(size === s), fontSize: '11px', fontWeight: 700 }}>
                  {s}
                </button>
              ))}
            </div>

            <p style={{ ...sectionLabel('Color'), marginTop: '2px' }}>Color</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
              {PEN_PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Pen color ${c}`}
                  onClick={() => setColor(c)}
                  style={{
                    width: color === c ? 20 : 16,
                    height: color === c ? 20 : 16,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? `2px solid ${THEME.accent}` : '2px solid rgba(145,114,100,0.25)',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Center — strip canvas */}
          <div style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div
              ref={canvasWrapRef}
              style={{
                flex: 1,
                minHeight: 0,
                width: 'fit-content',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              onDragOver={e => { e.preventDefault(); setDragOverCanvas(true) }}
              onDragLeave={() => setDragOverCanvas(false)}
              onDrop={handleCanvasDrop}
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

              <div style={{
                position: 'relative',
                ...canvasStackStyle,
                outline: dragOverCanvas ? '3px dashed #DF82A3' : 'none',
                outlineOffset: '4px',
                borderRadius: '12px',
                transition: 'outline 0.15s',
              }}>
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
                    cursor: tool === 'eraser' ? 'cell' : isGlow ? 'crosshair' : tool === 'pen' ? 'crosshair' : 'default',
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
                padding: '10px 28px',
                cursor: 'pointer',
                boxShadow: HOME_BTN_SHADOW,
                flexShrink: 0,
              }}
            >
              Download
            </button>
          </div>

          {/* Right — text & emoji drag sources */}
          <div style={{ ...panelStyle(), maxWidth: '120px', minWidth: '100px' }}>
            <p style={sectionLabel('Text')}>Text</p>
            <input
              type="text"
              value={textDraft}
              maxLength={TEXT_MAX}
              placeholder="Say it!"
              onChange={e => setTextDraft(e.target.value.slice(0, TEXT_MAX))}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: "'Cause',serif",
                fontSize: '11px',
                padding: '6px 8px',
                borderRadius: '8px',
                border: '2px solid #D4C49A',
                background: '#fff',
                color: THEME.text,
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '8px', color: THEME.text, textAlign: 'center', opacity: 0.7 }}>
              {textDraft.length}/{TEXT_MAX}
            </span>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button type="button" onClick={() => setTextBold(b => !b)} style={{ ...fmtBtn(textBold), fontWeight: 800 }}>B</button>
              <button type="button" onClick={() => setTextItalic(i => !i)} style={{ ...fmtBtn(textItalic), fontStyle: 'italic' }}>I</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
              {TEXT_FONT_SIZES.map(fs => (
                <button
                  key={fs}
                  type="button"
                  onClick={() => setTextFontSize(fs)}
                  style={{
                    ...fmtBtn(textFontSize === fs),
                    flex: '0 0 auto',
                    minWidth: '24px',
                    fontSize: '9px',
                    padding: '0 4px',
                  }}
                >
                  {fs}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
              {TEXT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTextColor(c)}
                  style={{
                    width: textColor === c ? 18 : 14,
                    height: textColor === c ? 18 : 14,
                    borderRadius: '50%',
                    background: c,
                    border: textColor === c ? `2px solid ${THEME.accent}` : '1px solid rgba(145,114,100,0.3)',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            <div
              draggable={!!textDraft.trim()}
              onDragStart={e => setDragPayload(e, {
                type: 'text',
                text: textDraft,
                bold: textBold,
                italic: textItalic,
                fontSize: textFontSize,
                color: textColor,
              })}
              style={{
                ...textPreviewStyle,
                padding: '8px 6px',
                borderRadius: '8px',
                border: '2px dashed #D4C49A',
                background: textDraft.trim() ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: textDraft.trim() ? 'grab' : 'not-allowed',
                opacity: textDraft.trim() ? 1 : 0.55,
                userSelect: 'none',
              }}
            >
              {textDraft.trim() || 'Type & drag'}
            </div>
            <span style={{ fontSize: '8px', color: THEME.text, textAlign: 'center', opacity: 0.65 }}>
              Drag onto strip
            </span>

            <p style={{ ...sectionLabel('Stickers'), marginTop: '4px' }}>Stickers</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
              {EMOJI_SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEmojiSize(s)}
                  style={{ ...fmtBtn(emojiSize === s), flex: '0 0 auto', minWidth: '22px', fontSize: '9px' }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
              {EMOJIS.map(em => (
                <div
                  key={em}
                  draggable
                  onDragStart={e => setDragPayload(e, { type: 'emoji', emoji: em, fontSize: emojiSize })}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    borderRadius: '8px',
                    border: '2px solid #D4C49A',
                    background: '#fff',
                    cursor: 'grab',
                    userSelect: 'none',
                  }}
                >
                  {em}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '8px', color: THEME.text, textAlign: 'center', opacity: 0.65 }}>
              Drag onto strip
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
