import { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import VerticalStripes from '../components/VerticalStripes'
import ColorPicker from '../components/ColorPicker'
import { Eraser, PenLine, Sparkles, Undo2, Redo2 } from 'lucide-react'
import { createHeartClipPath, drawImageWithRotation } from '../utils/canvasUtils'

// ── Import your stickers from assets/stickers/ ───────────────
// Add or remove imports to match your actual sticker files
import sticker1 from '../assets/stickers/1.png'
import sticker2 from '../assets/stickers/2.png'
import sticker3 from '../assets/stickers/3.png'
import sticker4 from '../assets/stickers/4.png'
import sticker5 from '../assets/stickers/5.png'
import sticker6 from '../assets/stickers/6.png'
import sticker7 from '../assets/stickers/7.png'
import sticker8 from '../assets/stickers/8.png'
import sticker9 from '../assets/stickers/9.png'
import sticker10 from '../assets/stickers/10.png'
import sticker11 from '../assets/stickers/11.png'
import sticker12 from '../assets/stickers/12.png'
import sticker13 from '../assets/stickers/13.png'
import sticker14 from '../assets/stickers/14.png'
import sticker15 from '../assets/stickers/15.png'
import sticker16 from '../assets/stickers/16.png'
import sticker17 from '../assets/stickers/17.png'
import sticker18 from '../assets/stickers/18.png'
import sticker19 from '../assets/stickers/19.png'
import sticker20 from '../assets/stickers/20.png'
import sticker21 from '../assets/stickers/21.png'
import sticker22 from '../assets/stickers/22.png'

// ── Sticker config ────────────────────────────────────────────
const STICKERS = [
  { id: 's1', src: sticker1, label: 'Sticker 1' },
  { id: 's2', src: sticker2, label: 'Sticker 2' },
  { id: 's3', src: sticker3, label: 'Sticker 3' },
  { id: 's4', src: sticker4, label: 'Sticker 4' },
  { id: 's5', src: sticker5, label: 'Sticker 5' },
  { id: 's6', src: sticker6, label: 'Sticker 6' },
  { id: 's7', src: sticker7, label: 'Sticker 7' },
  { id: 's8', src: sticker8, label: 'Sticker 8' },
  { id: 's9', src: sticker9, label: 'Sticker 9' },
  { id: 's10', src: sticker10, label: 'Sticker 10' },
  { id: 's11', src: sticker11, label: 'Sticker 11' },
  { id: 's12', src: sticker12, label: 'Sticker 12' },
  { id: 's13', src: sticker13, label: 'Sticker 13' },
  { id: 's14', src: sticker14, label: 'Sticker 14' },
  { id: 's15', src: sticker15, label: 'Sticker 15' },
  { id: 's16', src: sticker16, label: 'Sticker 16' },
  { id: 's17', src: sticker17, label: 'Sticker 17' },
  { id: 's18', src: sticker18, label: 'Sticker 18' },
  { id: 's19', src: sticker19, label: 'Sticker 19' },
  { id: 's20', src: sticker20, label: 'Sticker 20' },
  { id: 's21', src: sticker21, label: 'Sticker 21' },
  { id: 's22', src: sticker22, label: 'Sticker 22' },
]

// Default size when sticker is dropped on canvas
const DEFAULT_STICKER_SIZE = 100

const THEME = {
  pageBg:    '#F2E7B4',
  text:      '#917264',
  accent:    '#DF82A3',
  accentSoft:'#F4B8CC',
  panel:     'rgba(255,255,255,0.55)',
}

const HOME_BTN_SHADOW = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'

const PALETTE = [
  '#917264', '#DF82A3', '#F4B8CC', '#2A2A2A', '#ffffff',
  '#ff61ab', '#ffb561', '#76ff61', '#bee1e6', '#cddafd',
  '#eae4e9', '#fde2e4', '#ec91d8', '#ff6176', '#abff61',
]

const SIZES = [6, 12, 20]


function drawImageCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const s  = Math.max(w / iw, h / ih)
  const dw = iw * s
  const dh = ih * s
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

export default function Customise() {
  const navigate       = useNavigate()
  const canvasRef      = useRef(null)
  const photoCanvasRef = useRef(null)
  const canvasWrapRef  = useRef(null)
  const isDrawing      = useRef(false)
  const lastPos        = useRef(null)
  const historyRef     = useRef([])
  const redoRef        = useRef([])
  const glowWasUsedRef = useRef(false)

  const [color,        setColor]        = useState(THEME.accent)
  const [size,         setSize]         = useState(6)
  const [isGlow,       setIsGlow]       = useState(false)
  const [tool,         setTool]         = useState('sticker')
  const [mobileTab,    setMobileTab]    = useState('stickers') // 'stickers' | 'draw'
  const [photosLoaded, setPhotosLoaded] = useState(false)
  const [displaySize,  setDisplaySize]  = useState({ w: 0, h: 0 })
  const [dragOver,     setDragOver]     = useState(false)

  // ── Sticker placement state ───────────────────────────────
  // Each placed sticker: { id, src, x, y, size, selected }
  const [placedStickers,    setPlacedStickers]    = useState([])
  const [selectedSticker,   setSelectedSticker]   = useState(null)
  const stickerDragRef      = useRef(null) // for moving placed stickers
  const resizeDragRef       = useRef(null) // for resizing placed stickers

  // ── Load photos ───────────────────────────────────────────
  useEffect(() => {
    const layoutConfig = (() => {
      try { return JSON.parse(sessionStorage.getItem('layoutConfig') || 'null') }
      catch { return null }
    })()
    const stripPreviewUrl = sessionStorage.getItem('stripPreview')
    const capturedPhotos  = JSON.parse(sessionStorage.getItem('capturedPhotos') || '[]')
    const legacyLayout    = sessionStorage.getItem('layout') || 'single'

    const canvas      = canvasRef.current
    const photoCanvas = photoCanvasRef.current
    if (!canvas || !photoCanvas) return

    const ctx      = canvas.getContext('2d')
    const photoCtx = photoCanvas.getContext('2d')

    function sizeBoth(w, h) {
      canvas.width = w; canvas.height = h
      photoCanvas.width = w; photoCanvas.height = h
    }

    function fitDisplay() {
      requestAnimationFrame(() => {
        const wrap = canvasWrapRef.current
        const pc   = photoCanvasRef.current
        if (!wrap || !pc || !pc.width || !pc.height) return
        const isMobile = window.innerWidth <= 640
        const maxW  = Math.max(200, wrap.getBoundingClientRect().width || window.innerWidth - 32)
        const maxH  = isMobile ? Infinity : Math.max(200, window.innerHeight - 220)
        const scale = Math.min(maxW / pc.width, isMobile ? 1 : maxH / pc.height)
        setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
      })
    }

    if (stripPreviewUrl) {
      const stripImg    = new Image()
      stripImg.onload   = () => {
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
      stripImg.src     = stripPreviewUrl
      return () => { stripImg.onload = null; stripImg.onerror = null }
    }

    if (capturedPhotos.length === 0) return undefined

    const imgs = capturedPhotos.map((src) => { const im = new Image(); im.src = src; return im })

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
        img.onerror = () => { loaded++; if (loaded === imgs.length) setPhotosLoaded(true) }
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
      img.onerror = () => { loaded++; if (loaded === imgs.length) setPhotosLoaded(true) }
    })
    return undefined
  }, [])

  useEffect(() => {
    if (!photosLoaded) return
    const ro = new ResizeObserver(() => {
      const wrap = canvasWrapRef.current
      const pc   = photoCanvasRef.current
      if (!wrap || !pc || !pc.width || !pc.height) return
      const isMobile = window.innerWidth <= 640
      const maxW  = Math.max(200, wrap.getBoundingClientRect().width || window.innerWidth - 32)
      const maxH  = isMobile ? Infinity : Math.max(200, window.innerHeight - 220)
      const scale = Math.min(maxW / pc.width, isMobile ? 1 : maxH / pc.height)
      setDisplaySize({ w: Math.floor(pc.width * scale), h: Math.floor(pc.height * scale) })
    })
    if (canvasWrapRef.current) ro.observe(canvasWrapRef.current)
    return () => ro.disconnect()
  }, [photosLoaded])

  // ── Drawing helpers ───────────────────────────────────────
  function getPos(e) {
    const c     = canvasRef.current
    const rect  = c.getBoundingClientRect()
    const scaleX = c.width / rect.width
    const scaleY = c.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }

  function saveHistory() {
    const c = canvasRef.current
    historyRef.current.push(c.toDataURL())
    redoRef.current = []
  }

  function clearCanvasShadow() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.shadowBlur  = 0
    ctx.shadowColor = 'transparent'
  }

  function startDraw(e) {
    // Block drawing if sticker tool is active or a sticker is selected
    if (tool !== 'pen' && tool !== 'eraser') return
    if (selectedSticker) return
    if (e.cancelable) e.preventDefault()
    saveHistory()
    isDrawing.current = true
    lastPos.current   = getPos(e)
    if (isGlow && tool === 'pen') glowWasUsedRef.current = true
  }

  function draw(e) {
    if (!isDrawing.current) return
    if (e.cancelable) e.preventDefault()
    const c   = canvasRef.current
    const ctx = c.getContext('2d')
    const pos = getPos(e)

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth   = size * 2
      ctx.shadowBlur  = 0
    } else if (isGlow && tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth   = size
      ctx.shadowBlur  = 20
      ctx.shadowColor = color
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth   = size
      ctx.shadowBlur  = 0
    }

    ctx.lineCap  = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDraw(e) {
    if (!isDrawing.current) return
    if (e.cancelable) e.preventDefault()
    isDrawing.current = false
    lastPos.current   = null
    clearCanvasShadow()
  }

  function undo() {
    if (historyRef.current.length === 0) return
    const c   = canvasRef.current
    const ctx = c.getContext('2d')
    redoRef.current.push(c.toDataURL())
    const prev = historyRef.current.pop()
    const img  = new Image()
    img.src    = prev
    img.onload = () => { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0); clearCanvasShadow() }
  }

  function redo() {
    if (redoRef.current.length === 0) return
    const c   = canvasRef.current
    const ctx = c.getContext('2d')
    historyRef.current.push(c.toDataURL())
    const next = redoRef.current.pop()
    const img  = new Image()
    img.src    = next
    img.onload = () => { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0); clearCanvasShadow() }
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

  // ── Sticker drag from panel → canvas ─────────────────────
  function handleStickerDragStart(e, sticker) {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'new-sticker',
      src:  sticker.src,
      id:   sticker.id,
    }))
    e.dataTransfer.effectAllowed = 'copy'
  }

  function getCanvasPos(clientX, clientY) {
    const wrap = canvasWrapRef.current
    if (!wrap) return { x: 0, y: 0 }
    const rect   = wrap.getBoundingClientRect()
    const scaleX = (photoCanvasRef.current?.width  || 1) / (displaySize.w || 1)
    const scaleY = (photoCanvasRef.current?.height || 1) / (displaySize.h || 1)
    return {
      x: (clientX - rect.left)  * scaleX,
      y: (clientY - rect.top)   * scaleY,
    }
  }

  function handleCanvasDrop(e) {
    e.preventDefault()
    setDragOver(false)
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json'))
      if (payload.type === 'new-sticker') {
        const pos = getCanvasPos(e.clientX, e.clientY)
        const newSticker = {
          uid:  Date.now(),
          src:  payload.src,
          x:    pos.x - DEFAULT_STICKER_SIZE / 2,
          y:    pos.y - DEFAULT_STICKER_SIZE / 2,
          size: DEFAULT_STICKER_SIZE,
        }
        setPlacedStickers(prev => [...prev, newSticker])
        setSelectedSticker(newSticker.uid)
        setTool('sticker')   // ← switch to sticker mode on drop
      }
    } catch { }
  }

  // ── Sticker move (drag placed sticker) ───────────────────
  function handleStickerTouchStart(e, sticker) {
    e.preventDefault()
    const touch = e.touches[0]

    // ── Lock page scroll for the entire drag so the screen doesn't move ──
    const prevBodyOverflow  = document.body.style.overflow
    const prevHtmlOverflow  = document.documentElement.style.overflow
    const prevBodyTouch     = document.body.style.touchAction
    document.body.style.overflow            = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction         = 'none'

    // Create a ghost image that follows the finger
    const ghost = document.createElement('img')
    ghost.src = sticker.src
    ghost.style.cssText = `
      position: fixed;
      width: 64px;
      height: 64px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.88;
      transform: translate(-50%, -50%) scale(1.12);
      will-change: transform;
      transition: none;
      left: ${touch.clientX}px;
      top: ${touch.clientY}px;
    `
    document.body.appendChild(ghost)

    function onTouchMove(ev) {
      ev.preventDefault()
      const t = ev.touches[0]
      ghost.style.left = `${t.clientX}px`
      ghost.style.top  = `${t.clientY}px`
    }

    function onTouchEnd(ev) {
      ev.preventDefault()
      document.body.removeChild(ghost)

      // ── Restore page scroll ──
      document.body.style.overflow            = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.touchAction         = prevBodyTouch

      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)

      const t = ev.changedTouches[0]

      // Check if finger is over the canvas wrap
      const wrap = canvasWrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()

      if (
        t.clientX >= rect.left &&
        t.clientX <= rect.right &&
        t.clientY >= rect.top  &&
        t.clientY <= rect.bottom
      ) {
        // Convert touch position to canvas coordinates
        const pos = getCanvasPos(t.clientX, t.clientY)
        const newSticker = {
          uid:  Date.now(),
          src:  sticker.src,
          x:    pos.x - DEFAULT_STICKER_SIZE / 2,
          y:    pos.y - DEFAULT_STICKER_SIZE / 2,
          size: DEFAULT_STICKER_SIZE,
        }
        setPlacedStickers(prev => [...prev, newSticker])
        setSelectedSticker(newSticker.uid)
        setTool('sticker')
      }
    }

    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd,  { passive: false })
  }

  function handleStickerPointerDown(e, uid) {
    e.stopPropagation()
    e.preventDefault()
    setSelectedSticker(uid)
    setTool('sticker') // switch away from pen so canvas doesn't draw
    stickerDragRef.current = {
      uid,
      startX:  e.clientX,
      startY:  e.clientY,
      moved:   false,
    }
    window.addEventListener('pointermove', handleStickerPointerMove)
    window.addEventListener('pointerup',   handleStickerPointerUp)
  }

  function handleStickerPointerMove(e) {
    if (!stickerDragRef.current) return
    const { uid, startX, startY } = stickerDragRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    // Only move if actually dragging (moved more than 3px)
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      stickerDragRef.current.moved = true
      const scaleX = (photoCanvasRef.current?.width  || 1) / (displaySize.w || 1)
      const scaleY = (photoCanvasRef.current?.height || 1) / (displaySize.h || 1)
      const moveDx = dx * scaleX
      const moveDy = dy * scaleY
      stickerDragRef.current.startX = e.clientX
      stickerDragRef.current.startY = e.clientY
      setPlacedStickers(prev => prev.map(s =>
        s.uid === uid ? { ...s, x: s.x + moveDx, y: s.y + moveDy } : s
      ))
    }
  }

  function handleStickerPointerUp(e) {
    const ref = stickerDragRef.current
    stickerDragRef.current = null
    window.removeEventListener('pointermove', handleStickerPointerMove)
    window.removeEventListener('pointerup',   handleStickerPointerUp)
    // If user just tapped (didn't drag) → keep selected to show resize/delete
    if (ref && !ref.moved) {
      setSelectedSticker(ref.uid)
    }
  }

  // ── Sticker resize (corner handle) ───────────────────────
  function handleResizePointerDown(e, uid) {
    e.stopPropagation()
    e.preventDefault()
    const sticker = placedStickers.find(s => s.uid === uid)
    if (!sticker) return
    resizeDragRef.current = {
      uid,
      startX:    e.clientX,
      startY:    e.clientY,
      startSize: sticker.size,
    }
    window.addEventListener('pointermove', handleResizePointerMove)
    window.addEventListener('pointerup',   handleResizePointerUp)
  }

  function handleResizePointerMove(e) {
    if (!resizeDragRef.current) return
    const { uid, startX, startY, startSize } = resizeDragRef.current
    const scaleX = (photoCanvasRef.current?.width  || 1) / (displaySize.w || 1)
    const scaleY = (photoCanvasRef.current?.height || 1) / (displaySize.h || 1)
    const dx   = (e.clientX - startX) * scaleX
    const dy   = (e.clientY - startY) * scaleY
    const delta = (Math.abs(dx) > Math.abs(dy) ? dx : dy)
    const newSize = Math.max(20, Math.min(400, startSize + delta))
    setPlacedStickers(prev => prev.map(s =>
      s.uid === uid ? { ...s, size: newSize } : s
    ))
  }

  function handleResizePointerUp() {
    resizeDragRef.current = null
    window.removeEventListener('pointermove', handleResizePointerMove)
    window.removeEventListener('pointerup',   handleResizePointerUp)
  }

  // ── Delete selected sticker ───────────────────────────────
  function deleteSelectedSticker() {
    if (!selectedSticker) return
    setPlacedStickers(prev => prev.filter(s => s.uid !== selectedSticker))
    setSelectedSticker(null)
  }

  // ── Deselect when clicking canvas background ─────────────
  function handleCanvasClick() {
    if (e.target === canvasRef.current || e.target === canvasWrapRef.current) {
    setSelectedSticker(null)
    if (tool === 'sticker') setTool('pen')
  }
}

  // ── Download — bake stickers into canvas then download ────
  function handleDownload() {
    const merge = document.createElement('canvas')
    const pc    = photoCanvasRef.current
    const dc    = canvasRef.current
    if (!pc || !dc) return
    merge.width  = pc.width
    merge.height = pc.height
    const mctx  = merge.getContext('2d')
    mctx.drawImage(pc, 0, 0)
    mctx.drawImage(dc, 0, 0)

    // Bake placed stickers into the download
    const promises = placedStickers.map(sticker => new Promise(resolve => {
      const img    = new Image()
      img.onload   = () => {
        mctx.drawImage(img, sticker.x, sticker.y, sticker.size, sticker.size)
        resolve()
      }
      img.onerror  = resolve
      img.src      = sticker.src
    }))

    Promise.all(promises).then(() => {
      const a      = document.createElement('a')
      a.href       = merge.toDataURL('image/png')
      a.download   = `whee-photobooth-${Date.now()}.png`
      a.click()
    })
  }

  const toolBtn = (active) => ({
    background:     active ? 'rgba(223,130,163,0.15)' : 'transparent',
    border:         active ? '2px solid #DF82A3' : '2px solid transparent',
    borderRadius:   '8px',
    cursor:         'pointer',
    fontFamily:     "'Cause',serif",
    fontSize:       '16px',
    lineHeight:     1,
    padding:        '5px 4px',
    color:          active ? THEME.accent : THEME.text,
    transition:     'all 0.15s',
    width:          '36px',
    height:         '36px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  })

  const canvasStackStyle = displaySize.w > 0 && displaySize.h > 0
    ? { width: `${displaySize.w}px`, height: `${displaySize.h}px` }
    : { maxWidth: '100%', maxHeight: 'calc(100dvh - 200px)', width: 'auto', height: 'auto' }

  // ── Convert canvas coords → display coords for sticker overlay
  const scaleToDisplay = displaySize.w > 0 && photoCanvasRef.current?.width
    ? displaySize.w / photoCanvasRef.current.width
    : 1

  return (
    <div className="page-wrapper customise-page-wrapper" style={{
      height:          '100dvh',
      width:           '100%',
      overflow:        'hidden',
      backgroundColor: THEME.pageBg,
      position:        'relative',
      fontFamily:      "'Cause',serif",
      display:         'flex',
      flexDirection:   'column',
    }}>
      <VerticalStripes />

      <div className="customise-inner-container" style={{
        position:      'relative',
        zIndex:        1,
        flex:          1,
        minHeight:     0,
        width:         '100%',
        maxWidth:      '1100px',
        margin:        '0 auto',
        padding:       '28px 16px 16px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        boxSizing:     'border-box',
      }}>

        <PageHeader onBack={() => navigate('/camera')} title="Doodle your strip" className="customise-header" titleClassName="customise-title" />

        {/* ── Main 3-column layout ── */}
        <div
          className="customise-main-row"
          style={{
            flex:           1,
            minHeight:      0,
            display:        'flex',
            flexDirection:  'row',
            gap:            '6px',
            alignItems:     'stretch',
            justifyContent: 'center',
          }}
        >

          {/* ══ LEFT — draw tools ══ */}
          <div
            className="customise-toolbar"
            style={{
              flexShrink:     0,
              width:          '80px',
              display:        'flex',
              flexDirection:  'column',
              gap:            '4px',
              background:     THEME.panel,
              border:         '2px solid #D4C49A',
              borderRadius:   '14px',
              padding:        '8px 6px',
              boxShadow:      HOME_BTN_SHADOW,
              alignSelf:      'center',
              overflowY:      'auto',
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>Tools</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <button type="button" title="Pen" onClick={() => { setTool('pen'); setIsGlow(false); setSelectedSticker(null); glowWasUsedRef.current = false }} style={toolBtn(tool === 'pen' && !isGlow)}><PenLine size={16} color={tool === 'pen' && !isGlow ? THEME.accent : THEME.text} /></button>
              <button type="button" title="Eraser" onClick={() => { setTool('eraser'); setIsGlow(false); setSelectedSticker(null); glowWasUsedRef.current = false }} style={toolBtn(tool === 'eraser')}>
               <Eraser size={18} color={tool === 'eraser' ? THEME.accent : THEME.text} />
              </button>
              <button type="button" title="Glow" onClick={toggleGlow} style={toolBtn(isGlow)}><Sparkles size={16} color={isGlow ? THEME.accent : THEME.text} /></button>
              <button type="button" title="Undo" onClick={undo}  style={toolBtn(false)}><Undo2 size={16} color={THEME.text} /></button>
              <button type="button" title="Redo" onClick={redo}  style={toolBtn(false)}><Redo2 size={16} color={THEME.text} /></button>
            </div>

            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>Size</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              {SIZES.map(s => (
                <button key={s} type="button" title={`Size ${s}`} onClick={() => setSize(s)} style={{ ...toolBtn(size === s), fontSize: '11px', fontWeight: 700 }}>
                  {s}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: THEME.text, textAlign: 'center' }}>Color</span>
            <ColorPicker
              value={color}
              onChange={(hex) => setColor(hex)}
              presets={PALETTE}
              compact
            />
          </div>

          {/* ══ CENTER — canvas + download ══ */}
          <div
            className="customise-canvas-container" 
            style={{
              flex:           1,
              minWidth:       0,
              minHeight:      0,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'flex-end',
              gap:            0,
            }}
          >
            <div
              ref={canvasWrapRef}
              onClick={handleCanvasClick}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleCanvasDrop}
              style={{
                flex:           '1 1 auto',
                minHeight:      0,
                width:          'auto',
                maxWidth:       '100%',
                margin:         0,
                padding:        0,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                position:       'relative',
                outline:        dragOver ? '3px dashed #DF82A3' : 'none',
                outlineOffset:  '4px',
                borderRadius:   '12px',
                transition:     'outline 0.15s',
              }}
            >
              {!photosLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.text, fontSize: '13px', letterSpacing: '2px' }}>
                  LOADING…
                </div>
              )}

              {/* Canvas stack */}
              <div style={{ position: 'relative', ...canvasStackStyle }}>
                <canvas
                  ref={photoCanvasRef}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '12px', boxShadow: HOME_BTN_SHADOW }}
                />
                <canvas
                ref={canvasRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  borderRadius: '12px',
                  touchAction: (tool === 'pen' || tool === 'eraser') ? 'none' : 'pan-y',
                  // ← Pass clicks through to stickers when not in draw mode
                  pointerEvents: (tool === 'pen' || tool === 'eraser') ? 'auto' : 'none',
                  cursor: tool === 'eraser' ? 'cell' : tool === 'pen' ? 'crosshair' : 'default',
                }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />

                {/* ── Placed stickers overlay ── */}
                {placedStickers.map(sticker => {
                  const dispX    = sticker.x * scaleToDisplay
                  const dispY    = sticker.y * scaleToDisplay
                  const dispSize = sticker.size * scaleToDisplay
                  const isSel    = selectedSticker === sticker.uid

                  return (
                    <div
                      key={sticker.uid}
                      style={{
                        position:  'absolute',
                        left:      `${dispX}px`,
                        top:       `${dispY}px`,
                        width:     `${dispSize}px`,
                        height:    `${dispSize}px`,
                        cursor:    'move',
                        userSelect:'none',
                        outline:   isSel ? '2px dashed #DF82A3' : 'none',
                        outlineOffset: '2px',
                        borderRadius: '4px',
                        zIndex:    10,
                      }}
                      onPointerDown={e => handleStickerPointerDown(e, sticker.uid)}
                    >
                      <img
                        src={sticker.src}
                        alt="sticker"
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
                      />

                      {/* Delete button — only when selected */}
                      {isSel && (
                        <button
                          onPointerDown={e => { e.stopPropagation(); deleteSelectedSticker() }}
                          style={{
                            position:       'absolute',
                            top:            '-10px',
                            right:          '-10px',
                            width:          '20px',
                            height:         '20px',
                            borderRadius:   '50%',
                            background:     '#DF82A3',
                            color:          '#fff',
                            border:         'none',
                            cursor:         'pointer',
                            fontSize:       '12px',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            lineHeight:     1,
                            zIndex:         20,
                            boxShadow:      '0 2px 6px rgba(0,0,0,0.2)',
                          }}
                        >
                          ✕
                        </button>
                      )}

                      {/* Resize handle — bottom right corner */}
                      {isSel && (
                        <div
                          onPointerDown={e => handleResizePointerDown(e, sticker.uid)}
                          style={{
                            position:     'absolute',
                            bottom:       '-8px',
                            right:        '-8px',
                            width:        '16px',
                            height:       '16px',
                            borderRadius: '4px',
                            background:   '#DF82A3',
                            cursor:       'se-resize',
                            zIndex:       20,
                            boxShadow:    '0 2px 6px rgba(0,0,0,0.2)',
                            display:      'flex',
                            alignItems:   'center',
                            justifyContent:'center',
                          }}
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8">
                            <path d="M1 7L7 1M4 7L7 4M7 7V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Download button */}
            <button
              type="button"
              className="customise-download-btn"
              onClick={handleDownload}
              style={{
                fontFamily:    "'Cause',serif",
                fontSize:      '13px',
                fontWeight:    700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color:         '#F2E7B4',
                background:    '#DF82A3',
                border:        'none',
                borderRadius:  '100px',
                padding:       '11px 32px',
                cursor:        'pointer',
                boxShadow:     HOME_BTN_SHADOW,
                flexShrink:    0,
                marginTop:     '12px',
                marginBottom:  '4px',
                position:      'relative',
                zIndex:        2,
              }}
            >
              Download
            </button>
          </div>

          {/* ══ RIGHT — sticker panel ══ */}
          <div
            className="customise-sticker-panel"
            style={{
              flexShrink:     0,
              width:          '90px',
              display:        'flex',
              flexDirection:  'column',
              gap:            '6px',
              background:     THEME.panel,
              border:         '2px solid #D4C49A',
              borderRadius:   '14px',
              padding:        '8px 6px',
              boxShadow:      HOME_BTN_SHADOW,
              alignSelf:      'center',
              overflowY:      'auto',
              maxHeight:      '100%',
            }}
          >
            {/* ── Mobile-only tab row: Draw | Stickers (hidden on desktop via CSS) ── */}
            <div className="mobile-panel-tabs">
              <button
                type="button"
                className={`mobile-panel-tab${mobileTab === 'draw' ? ' mobile-panel-tab--active' : ''}`}
                onClick={() => { setMobileTab('draw'); setTool('pen'); setIsGlow(false); setSelectedSticker(null); glowWasUsedRef.current = false }}
              >
                <PenLine size={13} /><span>Draw</span>
              </button>
              <button
                type="button"
                className={`mobile-panel-tab${mobileTab === 'stickers' ? ' mobile-panel-tab--active' : ''}`}
                onClick={() => setMobileTab('stickers')}
              >
                <Sparkles size={13} /><span>Stickers</span>
              </button>
            </div>

            {/* Desktop-only header */}
            <span className="sticker-panel-desktop-label" style={{
              fontSize:      '9px',
              fontWeight:    700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color:         THEME.text,
              textAlign:     'center',
              flexShrink:    0,
            }}>
              Stickers
            </span>

            {/* ── Draw tools (mobile: shown when draw tab active; desktop: hidden) ── */}
            <div className={`mobile-draw-panel${mobileTab === 'draw' ? ' mobile-draw-panel--visible' : ''}`}>
              {/* Tools row */}
              <div className="mdp-section">
                <span className="mdp-label">Tools</span>
                <div className="mdp-row">
                  <button type="button" title="Pen"
                    className={`mdp-btn${tool === 'pen' && !isGlow ? ' mdp-btn--active' : ''}`}
                    onClick={() => { setTool('pen'); setIsGlow(false); setSelectedSticker(null); glowWasUsedRef.current = false }}>
                    <PenLine size={16} color={tool === 'pen' && !isGlow ? THEME.accent : THEME.text} />
                  </button>
                  <button type="button" title="Eraser"
                    className={`mdp-btn${tool === 'eraser' ? ' mdp-btn--active' : ''}`}
                    onClick={() => { setTool('eraser'); setIsGlow(false); setSelectedSticker(null); glowWasUsedRef.current = false }}>
                    <Eraser size={16} color={tool === 'eraser' ? THEME.accent : THEME.text} />
                  </button>
                  <button type="button" title="Glow"
                    className={`mdp-btn${isGlow ? ' mdp-btn--active' : ''}`}
                    onClick={toggleGlow}>
                    <Sparkles size={16} color={isGlow ? THEME.accent : THEME.text} />
                  </button>
                  <button type="button" title="Undo" className="mdp-btn" onClick={undo}>
                    <Undo2 size={16} color={THEME.text} />
                  </button>
                  <button type="button" title="Redo" className="mdp-btn" onClick={redo}>
                    <Redo2 size={16} color={THEME.text} />
                  </button>
                </div>
              </div>

              {/* Size row */}
              <div className="mdp-section">
                <span className="mdp-label">Size</span>
                <div className="mdp-row">
                  {SIZES.map(s => (
                    <button key={s} type="button"
                      className={`mdp-btn mdp-size-btn${size === s ? ' mdp-btn--active' : ''}`}
                      onClick={() => setSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color row with ColorPicker */}
              <div className="mdp-section">
                <span className="mdp-label">Color</span>
                <div className="mdp-row">
                  <ColorPicker
                    value={color}
                    onChange={(hex) => setColor(hex)}
                    presets={PALETTE}
                    compact
                  />
                </div>
              </div>
            </div>

            {/* ── Sticker grid — 2 cols (desktop) / 3-row horiz scroll (mobile) ── */}
            <div
              className={`sticker-grid-wrap${mobileTab === 'draw' ? ' mobile-tab--hidden' : ''}`}
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap:                 '5px',
              }}
            >
              {STICKERS.map(sticker => (
                <div
                  key={sticker.id}
                  draggable
                  onDragStart={e => handleStickerDragStart(e, sticker)}
                  onTouchStart={e => handleStickerTouchStart(e, sticker)}
                  style={{
                    aspectRatio:    '1',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    background:     'rgba(255,255,255,0.6)',
                    borderRadius:   '8px',
                    border:         '2px solid #D4C49A',
                    cursor:         'grab',
                    padding:        '4px',
                    transition:     'border-color 0.15s, transform 0.15s',
                    userSelect:     'none',
                    touchAction:    'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#DF82A3'; e.currentTarget.style.transform = 'scale(1.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#D4C49A'; e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.label}
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>

            {/* Hint — desktop only */}
            <p className="sticker-panel-desktop-label" style={{
              fontSize:   '8px',
              color:      THEME.text,
              textAlign:  'center',
              opacity:    0.6,
              margin:     0,
              lineHeight: 1.3,
              flexShrink: 0,
            }}>
              Drag onto strip
            </p>

          </div>

        </div>
      </div>
    </div>
  )
}