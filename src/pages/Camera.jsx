import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// ── Template imports — needed to overlay on canvas ────────────
import t1a from '../assets/template_1strip_a.png'
import t1b from '../assets/template_1strip_b.png'
import t2a from '../assets/template_2strip_a.png'
import t2b from '../assets/template_2strip_b.png'
import t2c from '../assets/template_2strip_c.png'
import t3a from '../assets/template_3strip_a.png'
import t4a from '../assets/template_4strip_a.png'

// Map template id → imported asset URL
const TEMPLATE_ASSETS = {
  template_1strip_a: t1a,
  template_1strip_b: t1b,
  template_2strip_a: t2a,
  template_2strip_b: t2b,
  template_2strip_c: t2c,
  template_3strip_a: t3a,
  template_4strip_a: t4a,
}

const TEMPLATE_CONFIGS = {
  template_1strip_a: { canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  template_1strip_b: { canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  template_2strip_a: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_2strip_b: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_2strip_c: { canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  template_3strip_a: { canvasWidth: 900, canvasHeight: 2000, slots: [{ x: 40, y: 40, width: 820, height: 480 }, { x: 40, y: 560, width: 820, height: 480 }, { x: 40, y: 1080, width: 820, height: 480 }] },
  template_4strip_a: { canvasWidth: 900, canvasHeight: 2400, slots: [{ x: 40, y: 40, width: 820, height: 440 }, { x: 40, y: 530, width: 820, height: 440 }, { x: 40, y: 1020, width: 820, height: 440 }, { x: 40, y: 1510, width: 820, height: 440 }] },
}

const FILTERS = [
  { id: 'none',        label: 'Normal',      emoji: '🤍' },
  { id: 'vhs',         label: 'VHS',         emoji: '📼' },
  { id: 'glitch',      label: 'Glitch',      emoji: '⚡' },
  { id: 'y2k',         label: 'Y2K',         emoji: '💿' },
  { id: 'crt',         label: 'CRT',         emoji: '📺' },
  { id: 'grain',       label: 'Grain',       emoji: '🎞' },
  { id: 'chroma',      label: 'Chroma',      emoji: '🌈' },
  { id: 'smooth_skin', label: 'Smooth',      emoji: '✨' },
  { id: 'blush',       label: 'Blush',       emoji: '🌸' },
  { id: 'cat_ears',    label: 'Cat',         emoji: '🐱' },
  { id: 'hearts',      label: 'Hearts',      emoji: '💕' },
]

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
  const streamRef         = useRef(null)
  const filterIntervalRef = useRef(null)
  const isFilterPendingRef = useRef(false)

  const [cameraReady,    setCameraReady]    = useState(false)
  const [facingMode,     setFacingMode]     = useState('user')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [filteredFrame,  setFilteredFrame]  = useState(null)
  const [timerSecs,      setTimerSecs]      = useState(3)
  const [countdown,      setCountdown]      = useState(null)
  const [capturing,      setCapturing]      = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [stripPreview,   setStripPreview]   = useState(null)
  const [isProcessing,   setIsProcessing]   = useState(false)

  // Read config — note: file asset must come from TEMPLATE_ASSETS not sessionStorage
  const layoutConfig  = JSON.parse(sessionStorage.getItem('layoutConfig') || 'null')
  const totalShots    = layoutConfig?.slots?.length || 1
  const uploadedImage = sessionStorage.getItem('uploadedImage')

  // ── Camera start/stop ─────────────────────────────────────
  useEffect(() => {
    if (uploadedImage) { setCameraReady(true); return }
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

  function stopCamera() {
    clearInterval(filterIntervalRef.current)
    isFilterPendingRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  // ── Capture raw frame → base64 JPEG string (no prefix) ───
  function captureRawFrame() {
    if (uploadedImage) return uploadedImage.split(',')[1]
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (facingMode === 'user') {
      ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -canvas.width, 0); ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0)
    }
    return canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
  }

  // ── Apply filter via Python backend ──────────────────────
  async function applyFilter(b64, filter) {
    if (filter === 'none') return 'data:image/jpeg;base64,' + b64
    try {
      const res  = await fetch('http://localhost:8000/apply-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64, filter }),
      })
      const data = await res.json()
      return 'data:image/jpeg;base64,' + data.image
    } catch {
      return 'data:image/jpeg;base64,' + b64
    }
  }

  // ── Live filter preview ───────────────────────────────────
  useEffect(() => {
    if (!cameraReady || stripPreview) return
    clearInterval(filterIntervalRef.current)
    isFilterPendingRef.current = false
    if (selectedFilter === 'none') { setFilteredFrame(null); return }
    filterIntervalRef.current = setInterval(async () => {
      if (isFilterPendingRef.current) return
      const frame = captureRawFrame()
      if (!frame) return
      isFilterPendingRef.current = true
      try {
        setFilteredFrame(await applyFilter(frame, selectedFilter))
      } finally {
        isFilterPendingRef.current = false
      }
    }, 500)
    return () => {
      clearInterval(filterIntervalRef.current)
      isFilterPendingRef.current = false
    }
  }, [selectedFilter, cameraReady, stripPreview])

  // ── Capture one photo with filter ────────────────────────
  async function captureOne() {
    const frame = captureRawFrame()
    if (!frame) return null
    return await applyFilter(frame, selectedFilter)
  }

  // ── Auto-sequence: countdown → shoot all frames ──────────
  async function startCapture() {
    if (capturing || stripPreview) return
    setCapturing(true)
    clearInterval(filterIntervalRef.current)
    setFilteredFrame(null)

    const photos = []

    for (let shot = 0; shot < totalShots; shot++) {
      // Countdown
      if (timerSecs > 0) {
        for (let t = timerSecs; t >= 1; t--) {
          setCountdown(t)
          await sleep(1000)
        }
      }
      // Brief pause before shutter (countdown shows numbers only)
      setCountdown(null)
      await sleep(250)

      const photo = await captureOne()
      if (photo) photos.push(photo)
      setCapturedPhotos([...photos])

      if (shot < totalShots - 1) await sleep(600)
    }

    setCapturing(false)
    setIsProcessing(true)

    // Build strip — pass template asset URL from TEMPLATE_ASSETS map
    const templateSrc = layoutConfig?.isCustom ? null : TEMPLATE_ASSETS[layoutConfig?.id]
    const strip = await buildStrip(photos, layoutConfig, templateSrc)

    setIsProcessing(false)

    if (strip) {
      stopCamera()
      setStripPreview(strip)
      sessionStorage.setItem('stripPreview', strip)
      sessionStorage.setItem('capturedPhotos', JSON.stringify(photos))
    }
  }

  function retake() {
    setStripPreview(null)
    setFilteredFrame(null)
    setCapturedPhotos([])
    setCountdown(null)
    setCapturing(false)
    sessionStorage.removeItem('uploadedImage')
    startCamera()
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

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px', margin: '0 auto', padding: '24px 16px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

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

        {/* ── Shot dots ── */}
        {!allDone && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {Array.from({ length: totalShots }).map((_, i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: i < capturedPhotos.length ? '#DF82A3' : 'rgba(145,114,100,0.25)',
                border: '2px solid #DF82A3',
                boxShadow: i < capturedPhotos.length ? '0 0 6px rgba(223,130,163,0.6)' : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
            <span style={{ fontSize: '12px', color: '#917264', marginLeft: '4px' }}>
              {capturedPhotos.length} / {totalShots}
            </span>
          </div>
        )}

        {/* ── Camera / Strip preview box ── */}
        <div style={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#2a1f1a',
          boxShadow: '0 8px 32px rgba(145,114,100,0.25)',
          position: 'relative',
          aspectRatio: allDone ? 'auto' : '4/3',
          maxHeight: allDone ? 'none' : '52vh',
        }}>

          {/* Countdown overlay */}
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

          {/* Processing overlay */}
          {isProcessing && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(242,231,180,0.9)', gap: '12px',
            }}>
              <div style={{ fontSize: '28px' }}>✨</div>
              <p style={{ fontFamily: "'Rosario',serif", fontSize: '13px', color: '#917264', letterSpacing: '2px', margin: 0 }}>
                BUILDING YOUR STRIP...
              </p>
            </div>
          )}

          {/* Strip preview after capture */}
          {allDone ? (
            <img src={stripPreview} alt="Your photo strip" style={{
              width: '100%', display: 'block',
              maxHeight: '72vh', objectFit: 'contain',
              background: '#2a1f1a',
            }} />
          ) : (
            <>
              {filteredFrame && selectedFilter !== 'none' ? (
                <img src={filteredFrame} alt="filtered" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
              )}
              {uploadedImage && selectedFilter === 'none' && (
                <img src={uploadedImage} alt="upload" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              )}
            </>
          )}
        </div>

        {/* Thumbnail row during capture */}
        {capturedPhotos.length > 0 && !allDone && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {capturedPhotos.map((p, i) => (
              <div key={i} style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #DF82A3', flexShrink: 0 }}>
                <img src={p} alt={`shot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* ══ CONTROLS ══ */}
        {!allDone ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

            {/* Flip | Capture | Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%' }}>

              {/* Flip */}
              <button onClick={flipCamera} disabled={capturing} title="Flip camera" style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.75)', border: '2px solid #D4C49A',
                fontSize: '20px', cursor: capturing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(145,114,100,0.15)', transition: 'all 0.2s',
                opacity: capturing ? 0.4 : 1,
              }}
                onMouseEnter={e => { if (!capturing) e.currentTarget.style.background = '#F4B8CC' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)' }}
              >🔄</button>

              {/* Capture — clean circle, NO emoji */}
              <button onClick={startCapture} disabled={!cameraReady || capturing} style={{
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
                ? `Taking photo ${capturedPhotos.length + 1} of ${totalShots}...`
                : totalShots > 1
                  ? `${totalShots} shots will be taken automatically`
                  : 'Press to capture'
              }
            </p>

            {/* Filter strip */}
            <div style={{ width: '100%', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => !capturing && setSelectedFilter(f.id)} style={{
                  flexShrink: 0, minWidth: '62px', padding: '7px 5px',
                  borderRadius: '10px',
                  background: selectedFilter === f.id ? '#DF82A3' : 'rgba(255,255,255,0.75)',
                  color: selectedFilter === f.id ? '#fff' : '#917264',
                  border: `2px solid ${selectedFilter === f.id ? '#DF82A3' : '#D4C49A'}`,
                  cursor: capturing ? 'not-allowed' : 'pointer',
                  fontFamily: "'Rosario',serif", fontSize: '10px', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  transition: 'all 0.2s', opacity: capturing ? 0.5 : 1,
                }}>
                  <div style={{ fontSize: '16px', marginBottom: '3px' }}>{f.emoji}</div>
                  {f.label}
                </button>
              ))}
            </div>

          </div>
        ) : (
          /* Post-capture actions */
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>

            <button onClick={retake} style={{
              fontFamily: "'Rosario',serif", fontSize: '14px', fontWeight: '700',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#917264', background: 'rgba(255,255,255,0.75)',
              border: '2px solid #D4C49A', borderRadius: '100px',
              padding: '12px 28px', cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(145,114,100,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F4B8CC'; e.currentTarget.style.borderColor = '#DF82A3' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = '#D4C49A' }}
            >🔄 Retake</button>

            <button onClick={handleDownload} style={{
              fontFamily: "'Rosario',serif", fontSize: '14px', fontWeight: '700',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#F2E7B4', background: '#917264',
              border: 'none', borderRadius: '100px',
              padding: '12px 28px', cursor: 'pointer',
              boxShadow: '0 5px 0px #6b5248, 0 8px 20px rgba(145,114,100,0.3)',
              transition: 'transform 0.12s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >⬇ Download</button>

            <button onClick={handleCustomise} style={{
              fontFamily: "'Rosario',serif", fontSize: '14px', fontWeight: '700',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#F2E7B4', background: '#DF82A3',
              border: 'none', borderRadius: '100px',
              padding: '12px 28px', cursor: 'pointer',
              boxShadow: '0 5px 0px #917264, 0 8px 20px rgba(223,130,163,0.3)',
              transition: 'transform 0.12s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >✏ Customise</button>

          </div>
        )}

      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
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