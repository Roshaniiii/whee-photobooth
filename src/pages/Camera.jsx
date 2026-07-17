import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import sparkleOverlay from '../assets/sparkle_overlay.png'
import VerticalStripes from '../components/VerticalStripes'
import PageHeader from '../components/PageHeader'
import { playClick, playCapture } from '../utils/sounds'
import { Upload, FlipHorizontal2 } from 'lucide-react'

import { TEMPLATE_ASSETS } from '../config/templates'
import { hasFilterApi, filterApiEndpoint } from '../config/api'
import { drawImageWithRotation } from '../utils/canvasUtils'

/** 4-frame strip height — other layouts scale proportionally for the result page */
const FOUR_FRAME_REF_HEIGHT = 2000
const STRIP_DISPLAY_MAX_HEIGHT_4 = 620
const HOME_BTN_SHADOW = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'
const HOME_BTN_SHADOW_HOVER = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'

function getStripImageStyle(layoutConfig) {
  const cw = layoutConfig?.canvasWidth ?? 600
  const ch = layoutConfig?.canvasHeight ?? 700
  const scale = ch / FOUR_FRAME_REF_HEIGHT
  const maxH = Math.round(STRIP_DISPLAY_MAX_HEIGHT_4 * scale)
  const maxW = Math.round(maxH * (cw / ch))
  return {
    display: 'block',
    maxHeight: `min(82vh, ${maxH}px)`,
    maxWidth: `min(48vw, ${maxW}px)`,
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
    css: 'brightness(1.2) saturate(1.4) sepia(0.18) contrast(0.8)',
  },
  {
    id: 'rosegold',
    label: 'Rose Gold',
    source: 'css',
    css: 'sepia(0.45) saturate(1.5) brightness(1.08) hue-rotate(-15deg)',
  },
    {
    id: 'modern',
    label: 'Modern',
    source: 'css',
    css: 'brightness(110%) contrast(120%) saturate(130%) sepia(10%) hue-rotate(350deg)',
  },
  {
    id: 'popular',
    label: 'Popular',
    source: 'css',
    css: 'brightness(105%) contrast(115%) saturate(110%) hue-rotate(350deg) drop-shadow(5px 5px 8px #444444)',
  },
  {
    id: 'grey',
    label: 'Grey',
    source: 'css',
    css: 'brightness(100%) contrast(100%) saturate(0%) grayscale(100%)',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    source: 'css',
    css: 'brightness(129%) contrast(62%) saturate(136%) hue-rotate(348deg)',
  },
  {
    id: 'pink_glow',
    label: 'Pink Glow',
    source: 'css',
    css: 'brightness(1.1) saturate(2.5) sepia(1) hue-rotate(-30deg) contrast(1.05)',
  },
  {
    id: 'blue_glow',
    label: 'Blue Glow',
    source: 'css',
    css: 'brightness(1.2) saturate(2.5) sepia(1) hue-rotate(160deg) contrast(1.05)',
  },
  {
    id: 'green_glow',
    label: 'Green Glow',
    source: 'css',
    css: 'brightness(1.1) saturate(2.5) sepia(1) hue-rotate(80deg) contrast(1.05)',
  },
  {
    id: 'random_light',
    label: 'Light Leak',
    source: 'none',
    css: 'brightness(1.15) contrast(1.1) saturate(1.3) sepia(0.2)',
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    source: 'css',
    css: 'saturate(0.7) brightness(1.1) contrast(1.2)',
  },
  {
    id: 'sparkle',
    label: 'Sparkle',
    source: 'css',
    css: 'none', // sparkle is a special case — it's a PNG overlay, not a CSS filter
  },
  { id: 'blush', label: 'Blush', source: 'backend' },
  { id: 'cat_ears', label: 'Cat', source: 'backend' },
  { id: 'hearts', label: 'Hearts', source: 'backend' },
  { id: 'star_face', label: 'Star Face', source: 'backend' },
  { id: 'pixel', label: 'Pixel', desc: 'CRT retro',source: 'backend' },
  { id: 'heatmap', label: 'Thermal', desc: 'Heat vision', source: 'backend' },
]


const ICON_COLOR = '#917264'


function getFilterById(id) {
  return FILTERS.find(f => f.id === id) ?? FILTERS[0]
}

function isBackendFilter(id) {
  return getFilterById(id).source === 'backend'
}

function getVisibleFilters() {
  return hasFilterApi() ? FILTERS : FILTERS.filter(f => f.source !== 'backend')
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
function FrameProgressStrip({ total, slots, activeIndex, onSlotClick, slotShapes }) {
  const stripRef = useRef(null)
  const buttonRefs = useRef([])
  const gap = total <= 2 ? 10 : 8
  const buttonSize = total <= 1 ? 82 : total <= 4 ? 74 : total <= 8 ? 62 : 54

  useEffect(() => {
    if (activeIndex < 0) return

    const container = stripRef.current
    const button = buttonRefs.current[activeIndex]
    if (!container || !button) return

    const buttonTop = button.offsetTop
    const buttonBottom = buttonTop + button.offsetHeight
    const containerTop = container.scrollTop
    const containerHeight = container.clientHeight

    if (buttonBottom > containerTop + containerHeight || buttonTop < containerTop) {
      button.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex, slots, total])

  return (
    <div
      ref={stripRef}
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
        width: buttonSize + 4,
        maxHeight: '88%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '2px 0',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const entry = slots[i]
        const hasPhoto = !!entry?.displayUrl
        const isActive = activeIndex >= 0 && i === activeIndex && !hasPhoto

        return (
          <button
            key={i}
            ref={el => { buttonRefs.current[i] = el }}
            type="button"
            onClick={() => onSlotClick(i)}
            title={hasPhoto ? `Frame ${i + 1} — tap to replace` : `Frame ${i + 1}`}
            style={{
              width: buttonSize,
              height: buttonSize,
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
              scrollMarginTop: 6,
              scrollMarginBottom: 6,
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
                fontFamily: "'Unkempt',cursive",
                fontSize: Math.max(16, buttonSize * 0.38),
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
  const [timerSecs,      setTimerSecs]      = useState(3)
  const [countdown,      setCountdown]      = useState(null)
  const [capturing,      setCapturing]      = useState(false)
  const [stripPreview,   setStripPreview]   = useState(null)
  const [isProcessing,   setIsProcessing]   = useState(false)
  const [cropSource,     setCropSource]     = useState(null)
  const [showCrop,       setShowCrop]       = useState(false)
  const [cropAspect,     setCropAspect]     = useState(CROP_ASPECT)
  const [targetSlotIndex, setTargetSlotIndex] = useState(null)

  const fileInputRef = useRef(null)
  const glowCanvasRef = useRef(null)
  const dreamyCanvasRef = useRef(null)

  facingModeRef.current = facingMode
  selectedFilterRef.current = selectedFilter
  const activeCssFilter = isCssFilter(selectedFilter) ? getCssFilterValue(selectedFilter) : 'none'

  const layoutConfig  = JSON.parse(sessionStorage.getItem('layoutConfig') || 'null')
  const totalShots    = layoutConfig?.slots?.length || 1
  const templateSrc   = layoutConfig?.isCustom ? null : TEMPLATE_ASSETS[layoutConfig?.id]

  const [slots, setSlots] = useState(() => emptySlots(totalShots))

  const filledCount = filledSlotCount(slots)
  const nextCaptureIndex = firstEmptySlotIndex(slots)

  useEffect(() => {
    if (!hasFilterApi() && isBackendFilter(selectedFilter)) {
      setSelectedFilter('none')
    }
  }, [])

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

  // ── Random light canvas animation ─────────────────────────────────────────
  useEffect(() => {
    if (selectedFilter !== 'random_light') return
    const canvas = glowCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame
    let t = 0

    const draw = () => {
      t += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const lights = [
        { x: 0.5 + 0.4 * Math.sin(t * 0.7),       y: 0.5 + 0.35 * Math.cos(t * 0.5),       c: 'rgba(234, 61, 177, 0.65)' },
        { x: 0.5 + 0.4 * Math.sin(t * 0.4 + 2),   y: 0.5 + 0.35 * Math.cos(t * 0.8 + 1),   c: 'rgba(180,210,255,0.60)' },
        { x: 0.5 + 0.4 * Math.sin(t * 1.1 + 4),   y: 0.5 + 0.35 * Math.cos(t * 0.3 + 3),   c: 'rgba(71, 183, 227, 0.58)' },
      ]
      lights.forEach(({ x, y, c }) => {
        const grd = ctx.createRadialGradient(
          x * canvas.width, y * canvas.height, 0,
          x * canvas.width, y * canvas.height, canvas.width * 0.55
        )
        grd.addColorStop(0, c)
        grd.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [selectedFilter])

  // ── Dreamy light bloom overlay ────────────────────────────────────────────

  useEffect(() => {
    if (selectedFilter !== 'dreamy') return
    const canvas = dreamyCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ── White bloom from top-right corner ──────────────────────────────────
    const grd = ctx.createRadialGradient(
      canvas.width * 0.25, canvas.height * 0.05, 0,
      canvas.width * 0.25, canvas.height * 0.05, canvas.width * 0.75
    )
    grd.addColorStop(0, 'rgba(100, 180, 255, 0.92)')   // blue core
    grd.addColorStop(0,   'rgba(241, 141, 246, 0.92)')   // pink core
    grd.addColorStop(0.6, 'rgba(255, 200, 220, 0.25)')   // soft pink fade    
    grd.addColorStop(1,   'rgba(255, 255, 255, 0)')       // transparent edge
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ── Dark vignette on edges ──────────────────────────────────────────────
    const vig = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.25,
      canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.85
    )
    vig.addColorStop(0,   'rgba(0,0,0,0)')
    vig.addColorStop(0.6, 'rgba(0,0,0,0)')
    vig.addColorStop(1,   'rgba(0,0,0,0.72)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, canvas.width, canvas.height)

  }, [selectedFilter])

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

    // ── Apply CSS filter to canvas pixel data ─────────────────
  function applyCanvasFilter(ctx, w, h, filterId) {
    const filter = FILTERS.find(f => f.id === filterId)
    if (!filter || filter.source === 'none' || !filter.css || filter.css === 'none') return

    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i+1], b = d[i+2]

      if (filterId === 'sunshine') {
        // brightness(1.2) saturate(1.4) sepia(0.18) contrast(0.8)
        r = Math.min(255, r * 1.2); g = Math.min(255, g * 1.2); b = Math.min(255, b * 1.2)
        const sr = Math.min(255, r*0.393 + g*0.769 + b*0.189)
        const sg = Math.min(255, r*0.349 + g*0.686 + b*0.168)
        const sb = Math.min(255, r*0.272 + g*0.534 + b*0.131)
        r = Math.round(r + (sr - r) * 0.18)
        g = Math.round(g + (sg - g) * 0.18)
        b = Math.round(b + (sb - b) * 0.18)
        d[i]   = Math.min(255, Math.max(0, ((r - 128) * 0.8) + 128))
        d[i+1] = Math.min(255, Math.max(0, ((g - 128) * 0.8) + 128))
        d[i+2] = Math.min(255, Math.max(0, ((b - 128) * 0.8) + 128))
        continue

      } else if (filterId === 'rosegold') {
        // sepia(0.45) saturate(1.5) brightness(1.08) hue-rotate(-15deg)
        const sr = Math.min(255, r*0.393 + g*0.769 + b*0.189)
        const sg = Math.min(255, r*0.349 + g*0.686 + b*0.168)
        const sb = Math.min(255, r*0.272 + g*0.534 + b*0.131)
        r = Math.round(r + (sr - r) * 0.45)
        g = Math.round(g + (sg - g) * 0.45)
        b = Math.round(b + (sb - b) * 0.45)
        r = Math.min(255, r * 1.08)
        g = Math.min(255, g * 1.08)
        b = Math.min(255, b * 1.08)
        // hue-rotate(-15deg) approximation — boost red, reduce blue slightly
        d[i]   = Math.min(255, r * 1.08)
        d[i+1] = Math.min(255, g * 0.98)
        d[i+2] = Math.min(255, b * 0.90)
        continue

      } else if (filterId === 'pink_glow') {
        // sepia→hue-rotate(-30deg) = warm pink
        const sr = Math.min(255, r*0.393 + g*0.769 + b*0.189)
        const sg = Math.min(255, r*0.349 + g*0.686 + b*0.168)
        const sb = Math.min(255, r*0.272 + g*0.534 + b*0.131)
        d[i]   = Math.min(255, sr * 1.1 * 1.05)
        d[i+1] = Math.min(255, sg * 0.85 * 1.05)
        d[i+2] = Math.min(255, sb * 0.95 * 1.05)
        continue

      } else if (filterId === 'blue_glow') {
        // sepia→hue-rotate(160deg) = cool blue
        const sr = Math.min(255, r*0.393 + g*0.769 + b*0.189)
        const sg = Math.min(255, r*0.349 + g*0.686 + b*0.168)
        const sb = Math.min(255, r*0.272 + g*0.534 + b*0.131)
        d[i]   = Math.min(255, sb * 0.8 * 1.2 * 1.05)
        d[i+1] = Math.min(255, sg * 0.9 * 1.2 * 1.05)
        d[i+2] = Math.min(255, sr * 1.2 * 1.2 * 1.05)
        continue

      } else if (filterId === 'green_glow') {
        // sepia→hue-rotate(80deg) = green
        const sr = Math.min(255, r*0.393 + g*0.769 + b*0.189)
        const sg = Math.min(255, r*0.349 + g*0.686 + b*0.168)
        const sb = Math.min(255, r*0.272 + g*0.534 + b*0.131)
        d[i]   = Math.min(255, sg * 0.7 * 1.1 * 1.05)
        d[i+1] = Math.min(255, sr * 1.1 * 1.1 * 1.05)
        d[i+2] = Math.min(255, sb * 0.7 * 1.1 * 1.05)
        continue

      } else if (filterId === 'dreamy') {
        // saturate(0.7) brightness(1.1) contrast(1.2)
        const gray = 0.299*r + 0.587*g + 0.114*b
        r = Math.round(gray + (r - gray) * 0.7)
        g = Math.round(gray + (g - gray) * 0.7)
        b = Math.round(gray + (b - gray) * 0.7)
        r = Math.min(255, r * 1.1); g = Math.min(255, g * 1.1); b = Math.min(255, b * 1.1)
        d[i]   = Math.min(255, Math.max(0, ((r - 128) * 1.2) + 128))
        d[i+1] = Math.min(255, Math.max(0, ((g - 128) * 1.2) + 128))
        d[i+2] = Math.min(255, Math.max(0, ((b - 128) * 1.2) + 128))
        continue
      } else if (filterId === 'modern') {
      // brightness(110%)
      r = r * 1.10; g = g * 1.10; b = b * 1.10

      // sepia(10%)
      const sr1 = r * 0.393 + g * 0.769 + b * 0.189
      const sg1 = r * 0.349 + g * 0.686 + b * 0.168
      const sb1 = r * 0.272 + g * 0.534 + b * 0.131
      r = r + (sr1 - r) * 0.10
      g = g + (sg1 - g) * 0.10
      b = b + (sb1 - b) * 0.10

      // hue-rotate(350deg) = -10deg → very slight warm shift
      const cos350 =  0.9848
      const sin350 = -0.1736
      const nr1 = r * (0.213 + cos350*0.787 - sin350*0.213) + g * (0.715 - cos350*0.715 - sin350*0.715) + b * (0.072 - cos350*0.072 + sin350*0.928)
      const ng1 = r * (0.213 - cos350*0.213 + sin350*0.143) + g * (0.715 + cos350*0.285 + sin350*0.140) + b * (0.072 - cos350*0.072 - sin350*0.283)
      const nb1 = r * (0.213 - cos350*0.213 - sin350*0.787) + g * (0.715 - cos350*0.715 + sin350*0.715) + b * (0.072 + cos350*0.928 + sin350*0.072)
      r = nr1; g = ng1; b = nb1

      // saturate(130%)
      const gray1 = 0.299*r + 0.587*g + 0.114*b
      r = gray1 + (r - gray1) * 1.30
      g = gray1 + (g - gray1) * 1.30
      b = gray1 + (b - gray1) * 1.30

      // contrast(120%)
      r = ((r - 128) * 1.20) + 128
      g = ((g - 128) * 1.20) + 128
      b = ((b - 128) * 1.20) + 128

    // ── Filter 2 ──────────────────────────────────────────
    // brightness(105%) contrast(115%) saturate(110%) hue-rotate(350deg)
    // drop-shadow is ignored on canvas (canvas doesn't support drop-shadow on pixels)
    } else if (filterId === 'popular') {
      // brightness(105%)
      r = r * 1.05; g = g * 1.05; b = b * 1.05

      // hue-rotate(350deg) = -10deg
      const cos350 =  0.9848
      const sin350 = -0.1736
      const nr2 = r * (0.213 + cos350*0.787 - sin350*0.213) + g * (0.715 - cos350*0.715 - sin350*0.715) + b * (0.072 - cos350*0.072 + sin350*0.928)
      const ng2 = r * (0.213 - cos350*0.213 + sin350*0.143) + g * (0.715 + cos350*0.285 + sin350*0.140) + b * (0.072 - cos350*0.072 - sin350*0.283)
      const nb2 = r * (0.213 - cos350*0.213 - sin350*0.787) + g * (0.715 - cos350*0.715 + sin350*0.715) + b * (0.072 + cos350*0.928 + sin350*0.072)
      r = nr2; g = ng2; b = nb2

      // saturate(110%)
      const gray2 = 0.299*r + 0.587*g + 0.114*b
      r = gray2 + (r - gray2) * 1.10
      g = gray2 + (g - gray2) * 1.10
      b = gray2 + (b - gray2) * 1.10

      // contrast(115%)
      r = ((r - 128) * 1.15) + 128
      g = ((g - 128) * 1.15) + 128
      b = ((b - 128) * 1.15) + 128

    // ── Filter 3 ──────────────────────────────────────────
    // brightness(100%) contrast(100%) saturate(0%) grayscale(100%)
    } else if (filterId === 'grey') {
      // grayscale(100%) — full black and white
      const gray3 = Math.round(0.299*r + 0.587*g + 0.114*b)
      r = gray3; g = gray3; b = gray3
      // brightness(100%) contrast(100%) = no change needed

    // ── Filter 4 ──────────────────────────────────────────
    // brightness(129%) contrast(62%) saturate(136%) hue-rotate(348deg)
    } else if (filterId === 'vintage') {
      // brightness(129%)
      r = r * 1.29; g = g * 1.29; b = b * 1.29

      // hue-rotate(348deg) = -12deg
      const cos348 =  0.9781
      const sin348 = -0.2079
      const nr4 = r * (0.213 + cos348*0.787 - sin348*0.213) + g * (0.715 - cos348*0.715 - sin348*0.715) + b * (0.072 - cos348*0.072 + sin348*0.928)
      const ng4 = r * (0.213 - cos348*0.213 + sin348*0.143) + g * (0.715 + cos348*0.285 + sin348*0.140) + b * (0.072 - cos348*0.072 - sin348*0.283)
      const nb4 = r * (0.213 - cos348*0.213 - sin348*0.787) + g * (0.715 - cos348*0.715 + sin348*0.715) + b * (0.072 + cos348*0.928 + sin348*0.072)
      r = nr4; g = ng4; b = nb4

      // saturate(136%)
      const gray4 = 0.299*r + 0.587*g + 0.114*b
      r = gray4 + (r - gray4) * 1.36
      g = gray4 + (g - gray4) * 1.36
      b = gray4 + (b - gray4) * 1.36

      // contrast(62%) — reduces contrast significantly
      r = ((r - 128) * 0.62) + 128
      g = ((g - 128) * 0.62) + 128
      b = ((b - 128) * 0.62) + 128
    }

      d[i] = Math.min(255, Math.max(0, r))
      d[i+1] = Math.min(255, Math.max(0, g))
      d[i+2] = Math.min(255, Math.max(0, b))
    }

    ctx.putImageData(imageData, 0, 0)
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

    // ── Bake random light canvas into captured frame ──────────────────────
      if (!preview && selectedFilterRef.current === 'random_light') {
        const glowCanvas = glowCanvasRef.current
        if (glowCanvas) {
          ctx.globalCompositeOperation = 'screen'   // same blend as CSS mixBlendMode
          ctx.drawImage(glowCanvas, 0, 0, w, h)
          ctx.globalCompositeOperation = 'source-over'   // reset to default
        }
      }

        // ── Bake dreamy bloom into captured frame ─────────────────────────────
      if (!preview && selectedFilterRef.current === 'dreamy') {
        const dreamyCanvas = dreamyCanvasRef.current
        if (dreamyCanvas) {
          ctx.globalCompositeOperation = 'screen'
          ctx.drawImage(dreamyCanvas, 0, 0, w, h)
          ctx.globalCompositeOperation = 'source-over'
        }
      }
      
      if (!preview) applyCanvasFilter(ctx, w, h, selectedFilter)


    const quality = preview ? 0.68 : 0.92
    return target.toDataURL('image/jpeg', quality).split(',')[1]
  }


    async function applyFilterToPhoto(dataUrl, filterId) {
    if (!dataUrl || filterId === 'none') return dataUrl

    const filter = FILTERS.find(f => f.id === filterId)
    if (!filter) return dataUrl

    // CSS filters — bake using bakeCssFilter for uploaded photos
    // (captured photos already have it baked via captureRawFrame)
    if (filter.source === 'css') {
      const b64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
      return bakeCssFilter(b64, getCssFilterValue(filterId))
    }

    // Backend filters — send to Python API
    if (filter.source === 'backend') {
      const b64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
      return applyFilter(b64, filterId)
    }

    // source === 'none' or anything else — return as-is
    return dataUrl
  }

  // ── Apply filter (CSS instant, backend via API) ──────────
  async function applyFilter(b64, filter, { signal, preview = false } = {}) {
    if (filter === 'none') return 'data:image/jpeg;base64,' + b64
    if (isCssFilter(filter)) return bakeCssFilter(b64, getCssFilterValue(filter))
    if (!hasFilterApi()) return 'data:image/jpeg;base64,' + b64
    try {
      const res = await fetch(filterApiEndpoint('/apply-filter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: b64,
          filter,
          preview,
        }),
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
        const frame = await captureRawFrame({ preview: true })
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

    // ── Popup logic ───────────────────────────────────
    setTimeout(() => {
      const emailShown   = localStorage.getItem('emailPopupShown')
      const supportShown = localStorage.getItem('supportPopupShown')
      const visitCount   = parseInt(localStorage.getItem('visitCount') || '0')

      // Increment visit count every time user captures
      localStorage.setItem('visitCount', visitCount + 1)

      if (visitCount === 0) {
        // ── First time ever → show Tally form only ──
        if (!emailShown) {
          try {
            if (window.Tally?.openPopup) {
              window.Tally.openPopup('2EoW4V', {
                width:     400,
                overlay:   true,
                autoClose: 4000,
              })
            } else if (window.Tally?.open) {
              window.Tally.open('2EoW4V')
            }
            localStorage.setItem('emailPopupShown', 'true')
          } catch (err) {
            console.warn('Tally popup trigger failed:', err)
          }
        }

      } else if (visitCount === 1) {
        // ── Second time → show Support popup only ──
        if (!supportShown) {
          window.dispatchEvent(new CustomEvent('whee:openSupport'))
          localStorage.setItem('supportPopupShown', 'true')
        }

      }
      // ── After both shown → no more popups ever ──

    }, 1000)
    // ─────────────────────────────────────────────────
  }
}
  
  function setSlotPhoto(index, displayUrl, source = 'camera', rawUrl = null) {
    if (index < 0) return
    setSlots(prev => {
      const next = [...prev]
      next[index] = { displayUrl, source, rawUrl }
      return next
    })
  }

  async function captureOne() {
    try {
      const raw = await captureRawFrame()
      if (!raw) return null

      const displayUrl = await applyFilterToPhoto(`data:image/jpeg;base64,${raw}`, selectedFilterRef.current)
      return {
        rawUrl: `data:image/jpeg;base64,${raw}`,
        displayUrl,
      }
    } catch (err) {
      console.error('Capture failed:', err)
      return null
    }
  }

  // Timer Off: one photo per capture click. Timer On: auto sequence with countdown.
  async function startCapture() {
    if (capturing || stripPreview || nextCaptureIndex < 0) return

    setCapturing(true)
    cancelFilterPreview()
    setFilteredFrame(null)

    try {
      if (timerSecs === 0) {
        const shot = await captureOne()
        if (shot) setSlotPhoto(nextCaptureIndex, shot.displayUrl, 'camera', shot.rawUrl)
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
    } finally {
      setCapturing(false)
    }
  }

  useEffect(() => {
    if (stripPreview || capturing || isProcessing) return
    if (filledCount >= totalShots && slots.every(s => s?.displayUrl)) {
      finishStrip(slots.map(s => s.displayUrl))
    }
  }, [slots, stripPreview, capturing, isProcessing])

  function retake() {
    playClick()
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

  
  function handleDownload() {
    playClick()
    if (!stripPreview) return
    const a = document.createElement('a')
    a.href     = stripPreview
    a.download = `whee-photobooth-${Date.now()}.png`
    a.click()
  }

  function handleCustomise() {
    playClick()
    navigate('/customise')
  }

  function flipCamera() {
    if (capturing) return
    setFacingMode(f => f === 'user' ? 'environment' : 'user')
    setCameraReady(false)
    setFilteredFrame(null)
  }

  const allDone = !!stripPreview

  return (
    <div className="page-wrapper camera-page-wrapper" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F2E7B4', position: 'relative', fontFamily: "'Cause',serif", overflow: 'hidden' }}>
      <VerticalStripes />

      <div className="page-content camera-page-content" style={{
        position: 'relative', zIndex: 1, width: '100%',
        maxWidth: allDone ? 'min(1100px, 98vw)' : '720px',
        margin: '0 auto',
        padding: allDone ? '28px 20px 24px' : '28px 16px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: allDone ? '12px' : '14px',
        minHeight: allDone ? 'calc(100vh - 8px)' : undefined,
        boxSizing: 'border-box',
      }}>

        <PageHeader
          onBack={() => navigate('/layout')}
          title={allDone ? 'Your Strip!' : 'Strike a Pose'}
          className="camera-header"
          titleClassName="camera-title"
        />

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
                  fontWeight: '700', color: '#DF82A3',
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
                <p style={{ fontFamily: "'Cause',serif", fontSize: '13px', color: '#917264', letterSpacing: '2px', margin: 0 }}>
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

                {/*random light canvas */}
                {selectedFilter === 'random_light' && (
                  <canvas
                    ref={glowCanvasRef}
                    width={640}
                    height={480}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}

                {selectedFilter === 'dreamy' && (
                  <canvas
                    ref={dreamyCanvasRef}
                    width={640}
                    height={480}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}
                {/* Backend filter overlay — INSIDE the relative div */}
                  {filteredFrame && isBackendFilter(selectedFilter) && (
                    <img
                      src={filteredFrame}
                      alt=""
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                  )}

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
              slotShapes={layoutConfig?.slots?.map(s => ({ aspect: s.width / s.height }))}
            />
          </div>
        ) : (
          <div style={{
            flex: 1,
            width: 'fit-content',
            minWidth: 100,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            minHeight: 0,
            maxHeight: 'calc(100vh - 100px)',
          }}>
            <div style={{
              flexShrink: 0,
              width: 'fit-content',
              minWidth: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0,
              padding: 0,
            }}>
              {isProcessing && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(242,231,180,0.9)',
                }}>
                  <p style={{ fontFamily: "'Cause',serif", fontSize: '13px', color: '#917264', letterSpacing: '2px', margin: 0 }}>
                    BUILDING YOUR STRIP...
                  </p>
                </div>
              )}
              <img
                src={stripPreview}
                alt="Your photo strip"
                style={{
                  ...getStripImageStyle(layoutConfig),
                  borderRadius: 12,
                  boxShadow: HOME_BTN_SHADOW,
                  margin: 0,
                }}
              />
            </div>

            <div style={{
              flexShrink: 0,
              width: 'fit-content',
              minWidth: 100,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 10,
            }}>
              <button type="button" onClick={retake} style={{
                fontFamily: "'Cause',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#917264', background: 'rgba(255,255,255,0.75)',
                border: '2px solid #D4C49A', borderRadius: '100px',
                padding: '11px 24px', cursor: 'pointer',
                boxShadow: HOME_BTN_SHADOW, transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F4B8CC'; e.currentTarget.style.borderColor = '#DF82A3' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = '#D4C49A' }}
              >Retake</button>

              <button type="button" onClick={handleDownload} style={{
                fontFamily: "'Cause',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#F2E7B4', background: '#917264',
                border: 'none', borderRadius: '100px',
                padding: '11px 24px', cursor: 'pointer',
                boxShadow: HOME_BTN_SHADOW,
                transition: 'transform 0.12s, box-shadow 0.12s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = HOME_BTN_SHADOW_HOVER }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = HOME_BTN_SHADOW }}
              >Download</button>

              <button type="button" onClick={handleCustomise} style={{
                fontFamily: "'Cause',serif", fontSize: '13px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#F2E7B4', background: '#DF82A3',
                border: 'none', borderRadius: '100px',
                padding: '11px 24px', cursor: 'pointer',
                boxShadow: HOME_BTN_SHADOW,
                transition: 'transform 0.12s, box-shadow 0.12s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = HOME_BTN_SHADOW_HOVER }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = HOME_BTN_SHADOW }}
              >Customise</button>
            </div>
          </div>
        )}

        {/* ══ CONTROLS ══ */}
        {!allDone ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

            {/* Upload | Flip | Capture | Timer */}
            <div className="camera-controls-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%' }}>

              {/* Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
                  <Upload size={22} color={capturing ? ICON_COLOR : ICON_COLOR} />
                </button>
                <span style={{ fontFamily: "'Cause',serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#917264' }}>
                  Upload
                </span>
              </div>

              {/* Flip */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
                  <FlipHorizontal2 size={22} color={ICON_COLOR} />
                </button>
                <span style={{ fontFamily: "'Cause',serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#917264' }}>
                  Flip
                </span>
              </div>

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
                <span style={{ fontSize: '10px', color: '#917264', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Timer</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 3, 5, 10].map(t => (
                    <button key={t} onClick={() => !capturing && setTimerSecs(t)} style={{
                      width: '30px', height: '28px', borderRadius: '6px',
                      background: timerSecs === t ? '#DF82A3' : 'rgba(255,255,255,0.75)',
                      color: timerSecs === t ? '#fff' : '#917264',
                      border: `2px solid ${timerSecs === t ? '#DF82A3' : '#D4C49A'}`,
                      fontSize: '10px', fontWeight: '700',
                      cursor: capturing ? 'not-allowed' : 'pointer',
                      fontFamily: "'Cause',serif", transition: 'all 0.2s',
                    }}>
                      {t === 0 ? 'Off' : `${t}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            
            {/* Hint */}
            <p className="camera-actions-row" style={{ fontSize: '12px', color: '#917264', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
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
              {getVisibleFilters().map(f => (
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
                  fontFamily: "'Cause',serif", fontSize: '10px', fontWeight: '700',
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

function clampOffset(ox, oy, vw, vh, drawW, drawH) {
  const maxX = Math.max(0, (drawW - vw) / 2)
  const maxY = Math.max(0, (drawH - vh) / 2)
  return {
    x: Math.min(maxX, Math.max(-maxX, ox)),
    y: Math.min(maxY, Math.max(-maxY, oy)),
  }
}

function ImageCropModal({ imageSrc, aspect = CROP_ASPECT, onConfirm, onCancel }) {
  const viewportRef = useRef(null)
  const [imgMeta, setImgMeta] = useState(null)
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 })
  const [userScale, setUserScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    loadImage(imageSrc).then(img => {
      if (!cancelled) {
        setImgMeta({ nw: img.naturalWidth, nh: img.naturalHeight })
        setUserScale(1)
        setOffset({ x: 0, y: 0 })
      }
    })
    return () => { cancelled = true }
  }, [imageSrc])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const measure = () => {
      setViewportSize({ w: el.clientWidth, h: el.clientHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const coverScale = imgMeta && viewportSize.w > 0
    ? Math.max(viewportSize.w / imgMeta.nw, viewportSize.h / imgMeta.nh)
    : 1
  const totalScale = coverScale * userScale
  const drawW = imgMeta ? imgMeta.nw * totalScale : 0
  const drawH = imgMeta ? imgMeta.nh * totalScale : 0
  const clampedOffset = viewportSize.w > 0
    ? clampOffset(offset.x, offset.y, viewportSize.w, viewportSize.h, drawW, drawH)
    : offset

  function onPointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: clampedOffset.x, oy: clampedOffset.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragRef.current || !imgMeta || viewportSize.w <= 0) return
    const raw = {
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    }
    setOffset(clampOffset(raw.x, raw.y, viewportSize.w, viewportSize.h, drawW, drawH))
  }

  function onPointerUp(e) {
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  function handleZoomChange(next) {
    setUserScale(next)
    if (imgMeta && viewportSize.w > 0) {
      const cs = Math.max(viewportSize.w / imgMeta.nw, viewportSize.h / imgMeta.nh)
      const dw = imgMeta.nw * cs * next
      const dh = imgMeta.nh * cs * next
      setOffset(prev => clampOffset(prev.x, prev.y, viewportSize.w, viewportSize.h, dw, dh))
    }
  }

  async function handleApply() {
    const viewport = viewportRef.current
    if (!viewport || !imgMeta) return
    const vw = viewport.clientWidth
    const vh = viewport.clientHeight
    const img = await loadImage(imageSrc)
    const outW = 1280
    const outH = Math.round(outW / aspect)
    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1a1410'
    ctx.fillRect(0, 0, outW, outH)

    const cs = Math.max(vw / img.naturalWidth, vh / img.naturalHeight)
    const total = cs * userScale
    const dW = img.naturalWidth * total
    const dH = img.naturalHeight * total
    const off = clampOffset(offset.x, offset.y, vw, vh, dW, dH)
    const dx = (vw - dW) / 2 + off.x
    const dy = (vh - dH) / 2 + off.y
    const sx = -dx / total
    const sy = -dy / total
    const sw = vw / total
    const sh = vh / total

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
    onConfirm(canvas.toDataURL('image/jpeg', 0.92))
  }

  const aspectLabel = aspect >= 1
    ? `${aspect.toFixed(2)} : 1`
    : `1 : ${(1 / aspect).toFixed(2)}`

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(42,31,26,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 16, gap: 12, fontFamily: "'Cause',serif",
    }}>
      <p style={{ color: '#F2E7B4', fontSize: 14, letterSpacing: 1, margin: 0, textTransform: 'uppercase' }}>
        Crop to fit frame
      </p>
      <p style={{ color: '#917264', fontSize: 11, margin: 0 }}>
        What you see is what appears in your strip ({aspectLabel})
      </p>
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: aspect >= 1 ? 'min(92vw, 420px)' : 'auto',
          height: aspect < 1 ? 'min(58vh, 520px)' : 'auto',
          maxWidth: 'min(92vw, 420px)',
          maxHeight: 'min(58vh, 520px)',
          aspectRatio: `${aspect}`,
          borderRadius: 12,
          overflow: 'hidden',
          border: '3px solid #DF82A3',
          position: 'relative',
          background: '#1a1410',
          touchAction: 'none',
          cursor: imgMeta ? 'grab' : 'wait',
          boxShadow: '0 8px 28px rgba(145,114,100,0.35)',
        }}
      >
        {imgMeta && drawW > 0 && (
          <img
            src={imageSrc}
            alt="crop preview"
            draggable={false}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${drawW}px`,
              height: `${drawH}px`,
              maxWidth: 'none',
              maxHeight: 'none',
              transform: `translate(calc(-50% + ${clampedOffset.x}px), calc(-50% + ${clampedOffset.y}px))`,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        )}
        {!imgMeta && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F2E7B4', fontSize: 12, letterSpacing: 1,
          }}>
            Loading…
          </div>
        )}
      </div>
      <label style={{ color: '#917264', fontSize: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.02}
          value={userScale}
          onChange={e => handleZoomChange(Number(e.target.value))}
          style={{ width: 200, accentColor: '#DF82A3' }}
          disabled={!imgMeta}
        />
      </label>
      <p style={{ color: '#917264', fontSize: 11, margin: 0, fontStyle: 'italic' }}>
        Drag to reposition · pinch zoom with slider
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onCancel} style={{
          fontFamily: "'Cause',serif", fontSize: 13, fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: '#917264', background: 'rgba(255,255,255,0.75)',
          border: '2px solid #D4C49A', borderRadius: '100px',
          padding: '10px 24px', cursor: 'pointer',
        }}>Cancel</button>
        <button type="button" onClick={handleApply} disabled={!imgMeta} style={{
          fontFamily: "'Cause',serif", fontSize: 13, fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: '#F2E7B4', background: imgMeta ? '#DF82A3' : '#C4A882',
          border: 'none', borderRadius: '100px',
          padding: '10px 24px', cursor: imgMeta ? 'pointer' : 'not-allowed',
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
      drawImageWithRotation(
        ctx, img,
        slot.x, slot.y, slot.width, slot.height,
        slot.rotation ?? 0,
        slot.clipShape ?? null
      )
    })
  } else {
    // Photos first, then transparent template frame on top
    const photoImgs = await Promise.all(photos.map(loadImage))
    slots.forEach((slot, i) => {
      const img = photoImgs[i] ?? photoImgs[photoImgs.length - 1]
      if (!img) return
      drawImageWithRotation(
        ctx, img,
        slot.x, slot.y, slot.width, slot.height,
        slot.rotation ?? 0,
        slot.clipShape ?? null
      )
    })

    const tmpl = await loadImage(templateSrc)
    ctx.drawImage(tmpl, 0, 0, canvasWidth, canvasHeight)
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