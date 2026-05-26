import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import sparkleOverlay from '../assets/sparkle_overlay.png'

// ── Template imports — needed to overlay on canvas ────────────
import t1a from '../assets/template_1strip_a.png'
import t1b from '../assets/template_1strip_b.png'
import t1c from '../assets/template_1strip_c.png'
import t2a from '../assets/template_2strip_a.png'
import t2b from '../assets/template_2strip_b.png'
import t2c from '../assets/template_2strip_c.png'
import t3a from '../assets/template_3strip_a.png'
import t4a from '../assets/template_4strip_a.png'

// Map template id → imported asset URL
const TEMPLATE_ASSETS = {
  template_1strip_a: t1a,
  template_1strip_b: t1b,
  template_1strip_c: t1c,
  template_2strip_a: t2a,
  template_2strip_b: t2b,
  template_2strip_c: t2c,
  template_3strip_a: t3a,
  template_4strip_a: t4a,
}

const TEMPLATE_CONFIGS = {
  template_1strip_a: { canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  template_1strip_b: { canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  template_1strip_c: { canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  template_2strip_a: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_2strip_b: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_2strip_c: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_3strip_a: { canvasWidth: 900, canvasHeight: 2000, slots: [{ x: 40, y: 40, width: 820, height: 480 }, { x: 40, y: 560, width: 820, height: 480 }, { x: 40, y: 1080, width: 820, height: 480 }] },
  template_4strip_a: { canvasWidth: 900, canvasHeight: 2400, slots: [{ x: 40, y: 40, width: 820, height: 440 }, { x: 40, y: 530, width: 820, height: 440 }, { x: 40, y: 1020, width: 820, height: 440 }, { x: 40, y: 1510, width: 820, height: 440 }] },
}

/** 4-frame strip height — other layouts scale proportionally for the result page */
const FOUR_FRAME_REF_HEIGHT = 2400
const STRIP_DISPLAY_MAX_HEIGHT_4 = 460

function getStripImageStyle(layoutConfig) {
  const cw = layoutConfig?.canvasWidth ?? 900
  const ch = layoutConfig?.canvasHeight ?? 1100
  const scale = ch / FOUR_FRAME_REF_HEIGHT
  const maxH = Math.round(STRIP_DISPLAY_MAX_HEIGHT_4 * scale)
  const maxW = Math.round(maxH * (cw / ch))
  return {
    display: 'block',
    maxHeight: `min(72vh, ${maxH}px)`,
    maxWidth: `min(36vw, ${maxW}px)`,
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  }
}

const CROP_ASPECT = 4 / 3

const FILTERS = [
  { id: 'none', label: 'Normal', source: 'none' },
  {
    id: 'sunshine',
    label: 'Sunshine',
    source: 'css',
    css: 'brightness(1.15) saturate(1.4) sepia(0.18) contrast(1.05)',
  },
  {
    id: 'rosegold',
    label: 'Rose Gold',
    source: 'css',
    css: 'sepia(0.45) saturate(1.5) brightness(1.08) hue-rotate(-15deg)',
  },
  {
    id: 'greyglow',
    label: 'Grey Glow',
    source: 'css',
    css: 'grayscale(1) brightness(1.12) contrast(1.18)',
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    source: 'css',
    css: 'brightness(1.1) saturate(0.85) contrast(0.92) blur(0.6px)',
  },
  {
  id: 'sparkle',
  label: 'Sparkle',
  source: 'css',
  css: 'none',
  desc: 'Star frame',
  },
  { id: 'blush', label: 'Blush', source: 'backend' },
  { id: 'cat_ears', label: 'Cat', source: 'backend' },
  { id: 'hearts', label: 'Hearts', source: 'backend' },
  {id: 'star_face', label: 'Star Face', source: 'backend' },
]

const ICON_COLOR = '#917264'

function IconUpload({ size = 22, color = ICON_COLOR }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15V5M12 5L8 9M12 5l4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconFlip({ size = 22, color = ICON_COLOR }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 9h10a4 4 0 1 1 0 8H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L3 9l4-4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 15H11a4 4 0 0 0 0-8h6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 11l4 4-4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function getFilterById(id) {
  return FILTERS.find(f => f.id === id) ?? FILTERS[0]
}

function isBackendFilter(id) {
  return getFilterById(id).source === 'backend'
}

function isCssFilter(id) {
  return getFilterById(id).source === 'css'
}

function getCssFilterValue(id) {
  const f = getFilterById(id)
  return f.source === 'css' ? f.css : 'none'
}

async function bakeCssFilter(b64, css) {
  if (!css) return `data:image/jpeg;base64,${b64}`
  const img = await loadImage(`data:image/jpeg;base64,${b64}`)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  ctx.filter = css
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

function emptySlots(count) {
  return Array(count).fill(null)
}

function filledSlotCount(slots) {
  return slots.filter(s => s?.displayUrl).length
}

function firstEmptySlotIndex(slots) {
  return slots.findIndex(s => !s?.displayUrl)
}

/** Compact vertical frame strip (inside camera view) — matches layout shot count */
function FrameProgressStrip({ total, slots, activeIndex, onSlotClick }) {
  const box = total <= 1 ? 64 : total === 2 ? 56 : 48
  const gap = total <= 2 ? 10 : 8

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8,
        display: 'flex',
        flexDirection: 'column',
        gap,
        pointerEvents: 'auto',
        maxHeight: '88%',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const entry = slots[i]
        const hasPhoto = !!entry?.displayUrl
        const isActive = activeIndex >= 0 && i === activeIndex && !hasPhoto
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSlotClick(i)}
            title={hasPhoto ? `Frame ${i + 1} — tap to replace` : `Frame ${i + 1}`}
            style={{
              width: box,
              height: box,
              borderRadius: 14,
              border: `2px dashed ${isActive ? '#DF82A3' : 'rgba(223,130,163,0.75)'}`,
              background: hasPhoto
                ? '#fff'
                : isActive
                  ? 'rgba(223,130,163,0.42)'
                  : 'rgba(255,255,255,0.55)',
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: isActive ? '0 0 12px rgba(223,130,163,0.5)' : '0 2px 8px rgba(145,114,100,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasPhoto ? (
              <img
                src={entry.displayUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
            ) : (
              <span style={{
                fontFamily: "'Networkand',cursive",
                fontSize: box * 0.38,
                color: isActive ? '#fff' : '#DF82A3',
                lineHeight: 1,
                pointerEvents: 'none',
              }}>
                {i + 1}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function Stripes() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderBottom: '3px solid #917264', opacity: 0.15 }} />
      ))}
    </div>
  )
}

export default function Camera() {
  const navigate          = useNavigate()
  const videoRef          = useRef(null)
  const canvasRef         = useRef(null)
  const previewCanvasRef  = useRef(null)
  const streamRef         = useRef(null)
  const facingModeRef     = useRef('user')
  const selectedFilterRef = useRef('none')
  const filterRunIdRef    = useRef(0)
  const filterAbortRef    = useRef(null)
  const filterSlotsRunRef = useRef(0)

  const [cameraReady,    setCameraReady]    = useState(false)
  const [facingMode,     setFacingMode]     = useState('user')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [filteredFrame,  setFilteredFrame]  = useState(null)
  const [timerSecs,      setTimerSecs]      = useState(0)
  const [countdown,      setCountdown]      = useState(null)
  const [capturing,      setCapturing]      = useState(false)
  const [stripPreview,   setStripPreview]   = useState(null)
  const [isProcessing,   setIsProcessing]   = useState(false)
  const [cropSource,     setCropSource]     = useState(null)
  const [showCrop,       setShowCrop]       = useState(false)
  const [cropAspect,     setCropAspect]     = useState(CROP_ASPECT)
  const [targetSlotIndex, setTargetSlotIndex] = useState(null)

  const fileInputRef = useRef(null)

  facingModeRef.current = facingMode
  selectedFilterRef.current = selectedFilter

  const activeCssFilter = isCssFilter(selectedFilter) ? getCssFilterValue(selectedFilter) : 'none'

  const layoutConfig  = JSON.parse(sessionStorage.getItem('layoutConfig') || 'null')
  const totalShots    = layoutConfig?.slots?.length || 1
  const templateSrc   = layoutConfig?.isCustom ? null : TEMPLATE_ASSETS[layoutConfig?.id]

  const [slots, setSlots] = useState(() => emptySlots(totalShots))

  const filledCount = filledSlotCount(slots)
  const nextCaptureIndex = firstEmptySlotIndex(slots)

  // ── Camera start/stop ─────────────────────────────────────
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  async function startCamera() {
    try {
      if (streamRef.current) stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraReady(true)
        }
      }
    } catch {
      alert('Camera access denied. Please allow camera permission and refresh.')
    }
  }

  function cancelFilterPreview() {
    filterRunIdRef.current += 1
    filterAbortRef.current?.abort()
    filterAbortRef.current = null
  }

  function stopCamera() {
    cancelFilterPreview()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  // ── Capture raw frame → base64 JPEG string (no prefix) ───
    async function captureRawFrame({ preview = false } = {}) {
    const video = videoRef.current
    if (!video || video.readyState < 2) return null

    const target = preview ? previewCanvasRef.current : canvasRef.current
    if (!target) return null

    let w = video.videoWidth  || 640
    let h = video.videoHeight || 480
    if (preview) {
      const maxW = 480
      if (w > maxW) {
        h = Math.round(h * (maxW / w))
        w = maxW
      }
    }

    target.width  = w
    target.height = h
    const ctx = target.getContext('2d')
    const mirror = facingModeRef.current === 'user'
    if (mirror) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(video, -w, 0, w, h)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0, w, h)
    }

    // ── Bake sparkle overlay into captured frame ──────────────────────────
    if (!preview && selectedFilterRef.current === 'sparkle') {
      await new Promise((resolve) => {
        const overlayImg = new Image()
        overlayImg.onload = () => {
          ctx.drawImage(overlayImg, 0, 0, w, h)
          resolve()
        }
        overlayImg.onerror = resolve   // fail silently if PNG missing
        overlayImg.src = sparkleOverlay
      })
    }
    const quality = preview ? 0.68 : 0.92
    return target.toDataURL('image/jpeg', quality).split(',')[1]
  }

  async function applyFilterToPhoto(dataUrl, filterId) {
    if (!dataUrl || filterId === 'none') return dataUrl
    const b64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    return applyFilter(b64, filterId)
  }

  // ── Apply filter (CSS instant, backend via API) ──────────
  async function applyFilter(b64, filter, { signal, preview = false } = {}) {
    if (filter === 'none') return 'data:image/jpeg;base64,' + b64
    if (isCssFilter(filter)) return bakeCssFilter(b64, getCssFilterValue(filter))
    try {
      const res = await fetch('http://localhost:8000/apply-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64, filter, preview}),
        signal,
      })
      if (!res.ok) throw new Error(`Filter API ${res.status}`)
      const data = await res.json()
      if (!data?.image) throw new Error('No image in response')
      return 'data:image/jpeg;base64,' + data.image
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      return 'data:image/jpeg;base64,' + b64
    }
  }

  // Live backend filter preview on camera
  useEffect(() => {
    if (!cameraReady || stripPreview || capturing) return

    const runId = ++filterRunIdRef.current
    filterAbortRef.current?.abort()
    filterAbortRef.current = null

    if (selectedFilter === 'none' || !isBackendFilter(selectedFilter)) {
      setFilteredFrame(null)
      return
    }

    let inFlight = false
    const runLoop = async () => {
      while (runId === filterRunIdRef.current) {
        const filterId = selectedFilterRef.current
        if (filterId === 'none' || !isBackendFilter(filterId)) break
        if (inFlight) {
          await sleep(40)
          continue
        }
        const frame = captureRawFrame({ preview: true })
        if (!frame) {
          await sleep(80)
          continue
        }
        inFlight = true
        const controller = new AbortController()
        filterAbortRef.current = controller
        try {
          const result = await applyFilter(frame, filterId, { signal: controller.signal, preview: true })
          if (runId === filterRunIdRef.current && filterId === selectedFilterRef.current) {
            setFilteredFrame(result)
          }
        } catch (err) {
          if (err?.name !== 'AbortError') console.warn('Filter preview failed:', err)
        } finally {
          inFlight = false
          if (filterAbortRef.current === controller) filterAbortRef.current = null
        }
      }
    }
    runLoop()
    return () => {
      filterAbortRef.current?.abort()
      filterAbortRef.current = null
    }
  }, [selectedFilter, cameraReady, stripPreview, capturing])

  // Re-apply filters to filled slots when filter changes
  useEffect(() => {
    if (stripPreview || capturing) return
    const runId = ++filterSlotsRunRef.current
    let cancelled = false

    setSlots(prev => {
      if (!prev.some(s => s?.rawUrl)) return prev
      ;(async () => {
        const next = await Promise.all(
          prev.map(async s => {
            if (!s?.rawUrl) return s
            const displayUrl = await applyFilterToPhoto(s.rawUrl, selectedFilter)
            return { ...s, displayUrl }
          }),
        )
        if (!cancelled && runId === filterSlotsRunRef.current) setSlots(next)
      })()
      return prev
    })

    return () => { cancelled = true }
  }, [selectedFilter, stripPreview, capturing])

  async function captureOne() {
    const frame = await captureRawFrame()
    if (!frame) return null
    const rawUrl = `data:image/jpeg;base64,${frame}`
    const displayUrl = await applyFilterToPhoto(rawUrl, selectedFilter)
    return { displayUrl, rawUrl }
  }

  function setSlotPhoto(index, displayUrl, source, rawUrl) {
    setSlots(prev => {
      const next = [...prev]
      next[index] = {
        displayUrl,
        source,
        rawUrl: rawUrl || displayUrl,
      }
      return next
    })
  }

  async function finishStrip(photos) {
    if (photos.length < totalShots) return
    setIsProcessing(true)
    const strip = await buildStrip(photos, layoutConfig, templateSrc)
    setIsProcessing(false)

    if (strip) {
      stopCamera()
      setStripPreview(strip)
      sessionStorage.setItem('stripPreview', strip)
      sessionStorage.setItem('capturedPhotos', JSON.stringify(photos))
    }
  }

  // Timer Off: one photo per capture click. Timer On: auto sequence with countdown.
  async function startCapture() {
    if (capturing || stripPreview || nextCaptureIndex < 0) return

    setCapturing(true)
    cancelFilterPreview()
    setFilteredFrame(null)

    if (timerSecs === 0) {
      const shot = await captureOne()
      if (shot) setSlotPhoto(nextCaptureIndex, shot.displayUrl, 'camera', shot.rawUrl)
      setCapturing(false)
      return
    }

    let working = [...slots]
    let index = firstEmptySlotIndex(working)
    while (index >= 0) {
      for (let t = timerSecs; t >= 1; t--) {
        setCountdown(t)
        await sleep(1000)
      }
      setCountdown(null)
      await sleep(250)

      const shot = await captureOne()
      if (shot) {
        working[index] = { displayUrl: shot.displayUrl, source: 'camera', rawUrl: shot.rawUrl }
        setSlots([...working])
      }

      index = firstEmptySlotIndex(working)
      if (index < 0) break
      await sleep(600)
    }

    setCountdown(null)
    setCapturing(false)
  }

  useEffect(() => {
    if (stripPreview || capturing || isProcessing) return
    if (filledCount >= totalShots && slots.every(s => s?.displayUrl)) {
      finishStrip(slots.map(s => s.displayUrl))
    }
  }, [slots, stripPreview, capturing, isProcessing])

  function retake() {
    setStripPreview(null)
    setSlots(emptySlots(totalShots))
    setFilteredFrame(null)
    setCountdown(null)
    setCapturing(false)
    setTargetSlotIndex(null)
    startCamera()
  }

  function openUploadForSlot(slotIndex) {
    const idx = slotIndex ?? firstEmptySlotIndex(slots)
    if (idx < 0) return
    const slot = layoutConfig?.slots?.[idx]
    if (slot) setCropAspect(slot.width / slot.height)
    else setCropAspect(CROP_ASPECT)
    setTargetSlotIndex(idx)
    fileInputRef.current?.click()
  }

  function handleUploadPick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropSource(reader.result)
      setShowCrop(true)
    }
    reader.readAsDataURL(file)
  }

  async function handleCropConfirm(croppedDataUrl) {
    const idx = targetSlotIndex ?? firstEmptySlotIndex(slots)
    if (idx < 0) {
      setShowCrop(false)
      setCropSource(null)
      return
    }
    const displayUrl = await applyFilterToPhoto(croppedDataUrl, selectedFilter)
    setSlotPhoto(idx, displayUrl, 'upload', croppedDataUrl)
    setShowCrop(false)
    setCropSource(null)
    setTargetSlotIndex(null)
  }

  function clearSlot(index) {
    setSlots(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  function handleDownload() {
    if (!stripPreview) return
    const a = document.createElement('a')
    a.href     = stripPreview
    a.download = `whee-photobooth-${Date.now()}.png`
    a.click()
  }

  function handleCustomise() { navigate('/customise') }

  function flipCamera() {
    if (capturing) return
    setFacingMode(f => f === 'user' ? 'environment' : 'user')
    setCameraReady(false)
    setFilteredFrame(null)
  }

  const allDone = !!stripPreview

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F2E7B4', position: 'relative', fontFamily: "'Rosario',serif" }}>
      <Stripes />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%',
        maxWidth: allDone ? 'min(1100px, 98vw)' : '720px',
        margin: '0 auto',
        padding: allDone ? '20px 20px 24px' : '24px 16px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: allDone ? '12px' : '14px',
        minHeight: allDone ? 'calc(100vh - 8px)' : undefined,
        boxSizing: 'border-box',
      }}>

        {/* ── Header ── */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate('/layout')} style={{ background: 'none', border: 'none', color: '#917264', cursor: 'pointer', fontFamily: "'Rosario',serif", fontSize: '14px', letterSpacing: '1px', padding: 0 }}>
            ← Back
          </button>
          <h1 style={{ fontFamily: "'Networkand',cursive", fontSize: 'clamp(22px,5vw,34px)', color: '#DF82A3', margin: '0 auto', letterSpacing: '2px', textAlign: 'center' }}>
            {allDone ? 'Your Strip!' : 'Strike a Pose'}
          </h1>
          <div style={{ width: '48px' }} />
        </div>

        {/* ── Camera view + frame strip overlay ── */}
        {!allDone ? (
          <div style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#2a1f1a',
            boxShadow: '0 8px 32px rgba(145,114,100,0.25)',
            position: 'relative',
            aspectRatio: '4/3',
            maxHeight: '62vh',
          }}>
            {typeof countdown === 'number' && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)',
              }}>
                <span style={{
                  fontSize: '120px',
                  fontWeight: '700', color: '#F2E7B4',
                  textShadow: '0 0 40px rgba(223,130,163,0.9)',
                }}>
                  {countdown}
                </span>
              </div>
            )}
            {isProcessing && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(242,231,180,0.9)',
              }}>
                <p style={{ fontFamily: "'Rosario',serif", fontSize: '13px', color: '#917264', letterSpacing: '2px', margin: 0 }}>
                  BUILDING YOUR STRIP...
                </p>
              </div>
            )}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                    filter: activeCssFilter !== 'none'
                      ? activeCssFilter
                      : undefined,
                  }}
                />

                {/* Sparkle overlay */}
                {selectedFilter === 'sparkle' && !allDone && (
                  <img
                    src={sparkleOverlay}
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                      zIndex: 3,
                    }}
                  />
                )}
              </div>
            {filteredFrame && isBackendFilter(selectedFilter) && (
              <img
                src={filteredFrame}
                alt=""
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', pointerEvents: 'none', zIndex: 2,
                }}
              />
            )}
            <FrameProgressStrip
              total={totalShots}
              slots={slots}
              activeIndex={nextCaptureIndex}
              onSlotClick={openUploadForSlot}
            />
          </div>
        ) : (
          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            minHeight: 0,
            maxHeight: 'calc(100vh - 100px)',
          }}>
            <div style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}>
              <div style={{
                borderRadius: 16,
                overflow: 'hidden',
                background: '#2a1f1a',
                boxShadow: '0 8px 32px rgba(145,114,100,0.25)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
                {isProcessing && (
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(242,231,180,0.9)',
                  }}>
                    <p style={{ fontFamily: "'Rosario',serif", fontSize: '13px', color: '#917264', letterSpacing: '2px', margin: 0 }}>
                      BUILDING YOUR STRIP...
                    </p>
                  </div>
                )}
                <img
                  src={stripPreview}
                  alt="Your photo strip"
                  style={getStripImageStyle(layoutConfig)}
                />
              </div>
            </div>

            <div style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 12,
              paddingRight: 4,
              minWidth: 148,
              marginLeft: 'auto',
            }}>
              <button type="button" onClick={retake} style={{
                fontFamily: "'Rosario',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#917264', background: 'rgba(255,255,255,0.75)',
                border: '2px solid #D4C49A', borderRadius: '100px',
                padding: '11px 22px', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(145,114,100,0.15)', transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F4B8CC'; e.currentTarget.style.borderColor = '#DF82A3' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = '#D4C49A' }}
              >Retake</button>

              <button type="button" onClick={handleDownload} style={{
                fontFamily: "'Rosario',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#F2E7B4', background: '#917264',
                border: 'none', borderRadius: '100px',
                padding: '11px 22px', cursor: 'pointer',
                boxShadow: '0 5px 0px #6b5248, 0 8px 20px rgba(145,114,100,0.3)',
                transition: 'transform 0.12s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >Download</button>

              <button type="button" onClick={handleCustomise} style={{
                fontFamily: "'Rosario',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#F2E7B4', background: '#DF82A3',
                border: 'none', borderRadius: '100px',
                padding: '11px 22px', cursor: 'pointer',
                boxShadow: '0 5px 0px #917264, 0 8px 20px rgba(223,130,163,0.3)',
                transition: 'transform 0.12s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >Customise</button>
            </div>
          </div>
        )}

        {/* ══ CONTROLS ══ */}
        {!allDone ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

            {/* Upload | Flip | Capture | Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%' }}>

              {/* Upload */}
              <button
                type="button"
                onClick={() => openUploadForSlot()}
                disabled={capturing}
                title="Upload photo"
                aria-label="Upload photo"
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.75)', border: '2px solid #D4C49A',
                  cursor: capturing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(145,114,100,0.15)', transition: 'all 0.2s',
                  opacity: capturing ? 0.4 : 1, padding: 0,
                }}
                onMouseEnter={e => { if (!capturing) e.currentTarget.style.background = '#F4B8CC' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)' }}
              >
                <IconUpload />
              </button>

              {/* Flip */}
              <button
                type="button"
                onClick={flipCamera}
                disabled={capturing}
                title="Flip camera"
                aria-label="Flip camera"
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.75)', border: '2px solid #D4C49A',
                  cursor: capturing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(145,114,100,0.15)', transition: 'all 0.2s',
                  opacity: capturing ? 0.4 : 1, padding: 0,
                }}
                onMouseEnter={e => { if (!capturing) e.currentTarget.style.background = '#F4B8CC' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)' }}
              >
                <IconFlip />
              </button>

              {/* Capture — clean circle, NO emoji */}
              <button onClick={startCapture} disabled={!cameraReady || capturing || nextCaptureIndex < 0} style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: capturing ? '#C4A882' : '#DF82A3',
                border: '4px solid #ffffff',
                cursor: !cameraReady || capturing ? 'not-allowed' : 'pointer',
                boxShadow: capturing ? 'none' : '0 6px 20px rgba(223,130,163,0.5)',
                transition: 'all 0.2s',
                opacity: !cameraReady ? 0.5 : 1,
                position: 'relative',
                padding: 0,
              }} aria-label="Capture">
                {/* Inner ring decoration — no emoji / no text */}
                <div style={{
                  position: 'absolute', inset: '12px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.9)',
                  background: 'transparent',
                  pointerEvents: 'none',
                }} />
              </button>

              {/* Timer */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: '#917264', letterSpacing: '1px', textTransform: 'uppercase' }}>Timer</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 3, 5, 10].map(t => (
                    <button key={t} onClick={() => !capturing && setTimerSecs(t)} style={{
                      width: '30px', height: '28px', borderRadius: '6px',
                      background: timerSecs === t ? '#DF82A3' : 'rgba(255,255,255,0.75)',
                      color: timerSecs === t ? '#fff' : '#917264',
                      border: `2px solid ${timerSecs === t ? '#DF82A3' : '#D4C49A'}`,
                      fontSize: '10px', fontWeight: '700',
                      cursor: capturing ? 'not-allowed' : 'pointer',
                      fontFamily: "'Rosario',serif", transition: 'all 0.2s',
                    }}>
                      {t === 0 ? 'Off' : `${t}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hint */}
            <p style={{ fontSize: '12px', color: '#917264', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
              {capturing
                ? (timerSecs > 0
                  ? `Taking photo ${filledCount + 1} of ${totalShots}...`
                  : 'Capturing...')
                : timerSecs > 0 && totalShots > 1
                  ? `${totalShots} shots will be taken automatically`
                  : totalShots > 1
                    ? `Press capture — photo moves to frame (${filledCount} / ${totalShots})`
                    : 'Press capture — live filter preview on camera'
              }
            </p>

            {/* Filter strip */}
            <div style={{ width: '100%', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => {
                  if (capturing) return
                  if (f.id === 'none') {
                    setSelectedFilter('none')
                    return
                  }
                  if (selectedFilter === f.id) {
                    setSelectedFilter('none')
                    return
                  }
                  setSelectedFilter(f.id)
                }} title={f.label} style={{
                  flexShrink: 0, minWidth: '62px', padding: '10px 8px',
                  borderRadius: '10px',
                  background: selectedFilter === f.id ? '#DF82A3' : 'rgba(255,255,255,0.75)',
                  color: selectedFilter === f.id ? '#fff' : '#917264',
                  border: `2px solid ${selectedFilter === f.id ? '#DF82A3' : '#D4C49A'}`,
                  cursor: capturing ? 'not-allowed' : 'pointer',
                  fontFamily: "'Rosario',serif", fontSize: '10px', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  transition: 'all 0.2s', opacity: capturing ? 0.5 : 1,
                }}>
                  {f.label}
                </button>
              ))}
            </div>

          </div>
        ) : null}

      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUploadPick}
      />
      {showCrop && cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          aspect={cropAspect}
          onConfirm={handleCropConfirm}
          onCancel={() => { setShowCrop(false); setCropSource(null); setTargetSlotIndex(null) }}
        />
      )}
    </div>
  )
}

function ImageCropModal({ imageSrc, aspect = CROP_ASPECT, onConfirm, onCancel }) {
  const viewportRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)

  function onPointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragRef.current) return
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    })
  }

  function onPointerUp(e) {
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  async function handleApply() {
    const viewport = viewportRef.current
    if (!viewport) return
    const vw = viewport.clientWidth
    const vh = viewport.clientHeight
    const img = await loadImage(imageSrc)
    const outW = 1280
    const outH = Math.round(outW / aspect)
    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#2a1f1a'
    ctx.fillRect(0, 0, outW, outH)

    const baseScale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight) * scale
    const drawW = img.naturalWidth * baseScale
    const drawH = img.naturalHeight * baseScale
    const dx = (vw - drawW) / 2 + offset.x
    const dy = (vh - drawH) / 2 + offset.y
    const sx = (-dx / baseScale)
    const sy = (-dy / baseScale)
    const sw = vw / baseScale
    const sh = vh / baseScale

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
    onConfirm(canvas.toDataURL('image/jpeg', 0.92))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(42,31,26,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 16, gap: 14, fontFamily: "'Rosario',serif",
    }}>
      <p style={{ color: '#F2E7B4', fontSize: 14, letterSpacing: 1, margin: 0, textTransform: 'uppercase' }}>
        Crop to fit frame
      </p>
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: 'min(92vw, 420px)',
          aspectRatio: `${aspect}`,
          borderRadius: 12,
          overflow: 'hidden',
          border: '3px solid #DF82A3',
          position: 'relative',
          background: '#2a1f1a',
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        <img
          src={imageSrc}
          alt="crop"
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            maxWidth: 'none',
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
            transformOrigin: 'center center',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
      <label style={{ color: '#917264', fontSize: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.02}
          value={scale}
          onChange={e => setScale(Number(e.target.value))}
          style={{ width: 180, accentColor: '#DF82A3' }}
        />
      </label>
      <p style={{ color: '#917264', fontSize: 11, margin: 0, fontStyle: 'italic' }}>
        Drag to reposition
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onCancel} style={{
          fontFamily: "'Rosario',serif", fontSize: 13, fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: '#917264', background: 'rgba(255,255,255,0.75)',
          border: '2px solid #D4C49A', borderRadius: '100px',
          padding: '10px 24px', cursor: 'pointer',
        }}>Cancel</button>
        <button type="button" onClick={handleApply} style={{
          fontFamily: "'Rosario',serif", fontSize: 13, fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: '#F2E7B4', background: '#DF82A3',
          border: 'none', borderRadius: '100px',
          padding: '10px 24px', cursor: 'pointer',
        }}>Apply</button>
      </div>
    </div>
  )
}

// ── sleep ─────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function buildStrip(photos, layoutConfig, templateSrc) {
  if (!photos.length || !layoutConfig) return null

  const { canvasWidth, canvasHeight, slots, isCustom, frameColor } = layoutConfig

  const canvas = document.createElement('canvas')
  canvas.width  = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')

  if (isCustom) {
    ctx.fillStyle = frameColor || '#FFFFFF'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    const photoImgs = await Promise.all(photos.map(loadImage))
    slots.forEach((slot, i) => {
      const img = photoImgs[i] ?? photoImgs[photoImgs.length - 1]
      if (!img) return
      ctx.save()
      ctx.beginPath()
      ctx.rect(slot.x, slot.y, slot.width, slot.height)
      ctx.clip()
      drawCover(ctx, img, slot.x, slot.y, slot.width, slot.height)
      ctx.restore()
    })
  } else {
    // Step 1: White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Step 2: Draw photos into slots
    const photoImgs = await Promise.all(photos.map(loadImage))
    slots.forEach((slot, i) => {
      const img = photoImgs[i] ?? photoImgs[photoImgs.length - 1]
      if (!img) return
      ctx.save()
      ctx.beginPath()
      ctx.rect(slot.x, slot.y, slot.width, slot.height)
      ctx.clip()
      drawCover(ctx, img, slot.x, slot.y, slot.width, slot.height)
      ctx.restore()
    })

    // Step 3: Draw template but SKIP the slot rectangles
    const tmpl = await loadImage(templateSrc)
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, canvasWidth, canvasHeight)
    slots.forEach(slot => {
      ctx.rect(slot.x, slot.y, slot.width, slot.height)
    })
    ctx.clip('evenodd')
    ctx.drawImage(tmpl, 0, 0, canvasWidth, canvasHeight)
    ctx.restore()
  }

  return canvas.toDataURL('image/png')
}

function drawCover(ctx, img, x, y, w, h) {
  const scaleX = w / img.naturalWidth
  const scaleY = h / img.naturalHeight
  const scale  = Math.max(scaleX, scaleY)
  const sw     = img.naturalWidth  * scale
  const sh     = img.naturalHeight * scale
  const ox     = (sw - w) / 2
  const oy     = (sh - h) / 2
  ctx.drawImage(img, ox / scale, oy / scale, w / scale, h / scale, x, y, w, h)
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img   = new Image()
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src     = src
  })
}