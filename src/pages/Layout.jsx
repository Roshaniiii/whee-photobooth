import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { playClick, playHover } from '../utils/sounds'

import t1a from '../assets/template_1strip_a.png'
import t1b from '../assets/template_1strip_b.png'
import t1c from '../assets/template_1strip_c.png'
import t2a from '../assets/template_2strip_a.png'
import t2b from '../assets/template_2strip_b.png'
import t2c from '../assets/template_2strip_c.png'
import t3a from '../assets/template_3strip_a.png'
import t4a from '../assets/template_4strip_a.png'

const TEMPLATES = [
  { id: 'template_1strip_a', label: 'Lace & Love',   shots: 1, file: t1a, canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  { id: 'template_1strip_b', label: 'Solo Moment',   shots: 1, file: t1b, canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  { id: 'template_1strip_c', label: 'Sweetheart',    shots: 1, file: t1c, canvasWidth: 900, canvasHeight: 1100, slots: [{ x: 70, y: 80, width: 760, height: 760 }] },
  { id: 'template_2strip_a', label: 'Double Take',   shots: 2, file: t2a, canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  { id: 'template_2strip_b', label: 'Two of Us',     shots: 2, file: t2b, canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  { id: 'template_2strip_c', label: 'Duo Bloom',     shots: 2, file: t2c, canvasWidth: 900, canvasHeight: 1600, slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }] },
  { id: 'template_3strip_a', label: 'Triple Charm',  shots: 3, file: t3a, canvasWidth: 900, canvasHeight: 2000, slots: [{ x: 40, y: 40, width: 820, height: 480 }, { x: 40, y: 560, width: 820, height: 480 }, { x: 40, y: 1080, width: 820, height: 480 }] },
  { id: 'template_4strip_a', label: 'Film Roll',     shots: 4, file: t4a, canvasWidth: 900, canvasHeight: 2400, slots: [{ x: 40, y: 40, width: 820, height: 440 }, { x: 40, y: 530, width: 820, height: 440 }, { x: 40, y: 1020, width: 820, height: 440 }, { x: 40, y: 1510, width: 820, height: 440 }] },
]

const NEW_LAYOUTS = [
  { id: 'new_1', label: 'Solo', shots: 1, canvasWidth: 900, canvasHeight: 1100,  slots: [{ x: 70, y: 80, width: 760, height: 760 }], rows: 1 },
  { id: 'new_2', label: 'Duo',  shots: 2, canvasWidth: 900, canvasHeight: 1600,  slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }], rows: 2 },
  { id: 'new_3', label: 'Trio', shots: 3, canvasWidth: 900, canvasHeight: 2000,  slots: [{ x: 40, y: 40, width: 820, height: 480 }, { x: 40, y: 560, width: 820, height: 480 }, { x: 40, y: 1080, width: 820, height: 480 }], rows: 3 },
  { id: 'new_4', label: 'Quad', shots: 4, canvasWidth: 900, canvasHeight: 2400,  slots: [{ x: 40, y: 40, width: 820, height: 440 }, { x: 40, y: 530, width: 820, height: 440 }, { x: 40, y: 1020, width: 820, height: 440 }, { x: 40, y: 1510, width: 820, height: 440 }], rows: 4 },
]

const FRAME_COLORS = [
  { id: 'white',    label: 'Snow',     hex: '#FFFFFF' },
  { id: 'cream',    label: 'Cream',    hex: '#F2E7B4' },
  { id: 'pink',     label: 'Blossom',  hex: '#F4B8CC' },
  { id: 'mauve',    label: 'Mauve',    hex: '#DF82A3' },
  { id: 'sage',     label: 'Sage',     hex: '#B5C9A1' },
  { id: 'mint',     label: 'Mint',     hex: '#A8D8C8' },
  { id: 'sky',      label: 'Sky',      hex: '#A8C8E8' },
  { id: 'lavender', label: 'Lavender', hex: '#C8B8E8' },
  { id: 'peach',    label: 'Peach',    hex: '#F4C4A0' },
  { id: 'butter',   label: 'Butter',   hex: '#F4E4A0' },
  { id: 'mocha',    label: 'Mocha',    hex: '#917264' },
  { id: 'black',    label: 'Noir',     hex: '#2A2A2A' },
]

// ── Each card rendered at its TRUE aspect ratio, but capped at max height ──
// Center card max-height = 300px. Side cards scale to 0.78.
const CENTER_MAX_H = 300
const CENTER_W     = 190

function Stripes() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderBottom: '3px solid #917264', opacity: 0.15 }} />
      ))}
    </div>
  )
}

function PillButton({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: "'Cause',serif", fontSize: '15px', fontWeight: '700',
      letterSpacing: '2px', textTransform: 'uppercase', color: '#F2E7B4',
      background: disabled ? '#C4A882' : '#DF82A3', border: 'none', borderRadius: '100px',
      padding: '13px 52px', cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 5px 0px #917264, 0 8px 20px rgba(145,114,100,0.25)',
      transition: 'transform 0.12s ease, box-shadow 0.12s ease', opacity: disabled ? 0.6 : 1,
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 0px #917264, 0 12px 24px rgba(145,114,100,0.3)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; if (!disabled) e.currentTarget.style.boxShadow = '0 5px 0px #917264, 0 8px 20px rgba(145,114,100,0.25)' }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 2px 0px #917264' } }}
      onMouseUp={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 0px #917264' } }}
    >{children}</button>
  )
}

function ShotBadge({ shots }) {
  return (
    <div style={{
      position: 'absolute', top: 6, right: 6, zIndex: 2,
      background: '#DF82A3', color: '#fff', borderRadius: '20px',
      padding: '2px 8px', fontSize: '10px', fontWeight: '700',
      boxShadow: '0 2px 6px rgba(223,130,163,0.4)',
    }}>
      {shots} {shots === 1 ? 'pic' : 'pics'}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TAB 1 — Templates carousel
// ══════════════════════════════════════════════════════════════
function PickTemplate({ onSelect }) {
  const [current, setCurrent] = useState(3) // Film Roll first

  function prev() { setCurrent(i => (i - 1 + TEMPLATES.length) % TEMPLATES.length) }
  function next() { setCurrent(i => (i + 1) % TEMPLATES.length) }

  const getPos = (idx) => {
    const diff = (idx - current + TEMPLATES.length) % TEMPLATES.length
    if (diff === 0) return 'center'
    if (diff === 1) return 'right'
    if (diff === TEMPLATES.length - 1) return 'left'
    return 'hidden'
  }

  // Each template card: true aspect ratio, capped at CENTER_MAX_H
  function cardDims(t) {
    const ratio = t.canvasHeight / t.canvasWidth
    const naturalH = CENTER_W * ratio
    const h = Math.min(naturalH, CENTER_MAX_H)
    const w = h / ratio
    return { w, h }
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

      {/* ── Carousel ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '580px',
        // height = center max height + label + breathing room
        height: `${CENTER_MAX_H + 52}px`,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>

        {/* Left arrow */}
        <button onClick={prev} style={{
          position: 'absolute', left: 0, zIndex: 10,
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(242,231,180,0.95)', border: '2px solid #DF82A3',
          color: '#917264', fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(145,114,100,0.2)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#DF82A3'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,231,180,0.95)'; e.currentTarget.style.color = '#917264' }}
        >‹</button>

        {TEMPLATES.map((t, idx) => {
          const pos = getPos(idx)
          if (pos === 'hidden') return null
          const isCenter = pos === 'center'
          const { w, h } = cardDims(t)
          const scale = isCenter ? 1 : 0.78

          return (
            <div key={t.id} onClick={() => !isCenter && setCurrent(idx)} style={{
              position: 'absolute',
              // Bring side cards much closer: ±(centerW/2 + sideW/2 + small gap)
              transform: isCenter
                ? 'translateX(0) scale(1)'
                : pos === 'left'
                  ? `translateX(-${Math.round(w * 0.78 / 2 + w / 2 + 12)}px) scale(0.78)`
                  : `translateX(${Math.round(w * 0.78 / 2 + w / 2 + 12)}px) scale(0.78)`,
              transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
              zIndex: isCenter ? 3 : 1,
              opacity: isCenter ? 1 : 0.6,
              cursor: isCenter ? 'default' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>

              {/* Card image — true aspect ratio, overflow hidden */}
              <div style={{
                position: 'relative',
                width: `${w}px`,
                height: `${h}px`,
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: isCenter
                  ? '0 16px 40px rgba(145,114,100,0.35)'
                  : '0 6px 16px rgba(145,114,100,0.2)',
                background: '#fff',
              }}>
                <img src={t.file} alt={t.label} style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top', display: 'block',
                }} />
                <ShotBadge shots={t.shots} />
              </div>

              {/* Label only under center card */}
              {isCenter && (
                <p style={{ fontFamily: "'Cause',serif", fontSize: '13px', fontWeight: '600', color: '#917264', letterSpacing: '1px', margin: 0 }}>
                  {t.label}
                </p>
              )}
            </div>
          )
        })}

        {/* Right arrow */}
        <button onClick={next} style={{
          position: 'absolute', right: 0, zIndex: 10,
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(242,231,180,0.95)', border: '2px solid #DF82A3',
          color: '#917264', fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(145,114,100,0.2)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#DF82A3'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,231,180,0.95)'; e.currentTarget.style.color = '#917264' }}
        >›</button>
      </div>

      {/* ── Dots ── */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {TEMPLATES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '22px' : '8px', height: '8px', borderRadius: '4px',
            background: i === current ? '#DF82A3' : '#C4A882',
            border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* ── Thumbnails ── */}
      <div style={{
        display: 'flex', gap: '8px', overflowX: 'auto',
        padding: '4px 8px', maxWidth: '500px', width: '100%',
        scrollbarWidth: 'none', flexShrink: 0, alignItems: 'center',
      }}>
        {TEMPLATES.map((t, i) => (
          <div key={t.id} onClick={() => setCurrent(i)} style={{
            flexShrink: 0, width: '44px', height: '54px',
            cursor: 'pointer', borderRadius: '7px', overflow: 'hidden',
            border: i === current ? '2px solid #DF82A3' : '2px solid transparent',
            boxShadow: i === current ? '0 0 0 2px rgba(223,130,163,0.3)' : 'none',
            transition: 'all 0.2s', opacity: i === current ? 1 : 0.55,
          }}>
            <img src={t.file} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          </div>
        ))}
      </div>

      {/* ── Button ── */}
      <div style={{ flexShrink: 0, paddingBottom: '4px' }}>
        <PillButton onClick={() => {
          playClick()
          onSelect(TEMPLATES[current])
        }}>Use This Template</PillButton>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TAB 2 — Build Your Own
// ══════════════════════════════════════════════════════════════
function BuildOwn({ onSelect }) {
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [selectedColor,  setSelectedColor]  = useState(FRAME_COLORS[0])

  // Preview box — fixed outer size, inner slots scale to layout
  // Outer: 80w × 240h (same proportions as a tall 4-strip)
  const PREV_W = 80
  const PREV_H = 240
  const PREV_PAD = 8

  function PreviewSlots() {
    if (!selectedLayout) {
      return <span style={{ fontSize: '10px', color: '#C4A882', textAlign: 'center', lineHeight: 1.5 }}>Pick a layout</span>
    }
    const n = selectedLayout.shots
    const innerH = PREV_H - PREV_PAD * 2
    const innerW = PREV_W - PREV_PAD * 2
    const gap = 4
    const slotH = Math.floor((innerH - gap * (n - 1)) / n)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, width: `${innerW}px` }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{
            width: '100%', height: `${slotH}px`,
            background: 'rgba(255,255,255,0.78)', borderRadius: '3px', flexShrink: 0,
          }} />
        ))}
      </div>
    )
  }

  // Layout icon sizes — proportional to actual strip heights
  const ICON_W = 26
  const ICON_MAX_H = 64
  function iconH(rows) {
    // 1 row → short, 4 rows → full height
    return Math.round(ICON_MAX_H * rows / 4) + (rows < 4 ? 8 : 0)
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>

      {/* ── Layout picker + Preview row ── */}
      <div style={{ width: '100%', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        {/* Layout grid — compact cards, 2×2 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: "'Cause',serif", fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#917264', margin: 0, textAlign: 'center' }}>
            Choose Layout
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {NEW_LAYOUTS.map(layout => {
              const isSel = selectedLayout?.id === layout.id
              const ih = iconH(layout.rows)
              return (
                <div key={layout.id} onClick={() => setSelectedLayout(layout)} style={{
                  cursor: 'pointer',
                  // Compact padding — tight left/right
                  padding: '10px 8px 8px',
                  borderRadius: '12px',
                  border: isSel ? '2px solid #DF82A3' : '2px solid #D4C49A',
                  background: isSel ? 'rgba(223,130,163,0.08)' : 'rgba(255,255,255,0.6)',
                  boxShadow: isSel ? '0 4px 14px rgba(223,130,163,0.22)' : '0 2px 6px rgba(145,114,100,0.08)',
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  // Fixed height — no layout shift
                  height: '100px',
                  justifyContent: 'center',
                }}>
                  {/* Strip icon — height proportional to rows */}
                  <div style={{
                    width: `${ICON_W}px`, height: `${ih}px`,
                    display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0,
                  }}>
                    {Array.from({ length: layout.rows }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, background: isSel ? '#DF82A3' : '#C4A882',
                        borderRadius: '2px', transition: 'background 0.2s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isSel ? '#DF82A3' : '#917264', letterSpacing: '0.3px' }}>{layout.label}</span>
                  <span style={{ fontSize: '9px', color: '#B09880' }}>{layout.shots} {layout.shots === 1 ? 'pic' : 'pics'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Frame preview — fixed size, proportional inner slots ── */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
          <p style={{ fontFamily: "'Cause',serif", fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#917264', margin: 0 }}>
            Preview
          </p>
          {/* Outer frame — fixed PREV_W × PREV_H always */}
          <div style={{
            width: `${PREV_W}px`, height: `${PREV_H}px`,
            borderRadius: '12px',
            background: selectedLayout ? selectedColor.hex : 'rgba(255,255,255,0.45)',
            border: '2px solid #D4C49A',
            boxShadow: '0 4px 16px rgba(145,114,100,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: `${PREV_PAD}px`,
            transition: 'background 0.3s',
            flexShrink: 0,
          }}>
            <PreviewSlots />
          </div>
          {selectedLayout && (
            <p style={{ fontSize: '10px', color: '#917264', fontStyle: 'italic', margin: 0 }}>{selectedColor.label}</p>
          )}
        </div>
      </div>

      {/* ── Color picker ── */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <p style={{ fontFamily: "'Cause',serif", fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#917264', margin: 0 }}>
          Frame Color
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '440px' }}>
          {FRAME_COLORS.map(c => (
            <div key={c.id} onClick={() => setSelectedColor(c)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px', background: c.hex,
                border: selectedColor.id === c.id ? '3px solid #917264' : '3px solid transparent',
                boxShadow: selectedColor.id === c.id ? '0 0 0 2px rgba(145,114,100,0.35)' : '0 2px 5px rgba(0,0,0,0.08)',
                transform: selectedColor.id === c.id ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              }} />
              <span style={{ fontSize: '9px', color: '#917264', fontWeight: selectedColor.id === c.id ? '700' : '400' }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Next button ── */}
      <div style={{ paddingBottom: '4px' }}>
        <PillButton onClick={() => {
          playClick()
          selectedLayout && onSelect({ ...selectedLayout, frameColor: selectedColor.hex, isCustom: true })
        }} disabled={!selectedLayout}>
          Next →
        </PillButton>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function Layout() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('template')

  function handleSelect(config) {
    sessionStorage.setItem('layoutConfig', JSON.stringify(config))
    sessionStorage.setItem('shots', String(config.slots.length))
    sessionStorage.setItem('layout', config.id)
    navigate('/camera')
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F2E7B4', position: 'relative', fontFamily: "'Cause',serif" }}>
      <Stripes />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px', margin: '0 auto', padding: '32px 20px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <button onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#917264', cursor: 'pointer', fontFamily: "'Cause',serif", fontSize: '14px', letterSpacing: '1px', padding: '4px 0', marginBottom: '8px' }}>
          ← Back
        </button>

        <h1 style={{ fontFamily: "'Unkempt',cursive", fontSize: 'clamp(28px,6vw,46px)', color: '#DF82A3', margin: '0 0 4px', letterSpacing: '2px', textAlign: 'center' }}>
          Your Frame
        </h1>
        <p style={{ fontFamily: "'Cause',serif", fontSize: '14px', color: '#917264', margin: '0 0 20px', letterSpacing: '0.5px' }}>
          Pick a template or build your own
        </p>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.5)', borderRadius: '100px', padding: '4px', border: '2px solid #D4C49A', marginBottom: '20px', gap: '4px', flexShrink: 0 }}>
          {[{ id: 'template', label: '✦ Templates' }, { id: 'build', label: '✐ Build Your Own' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: "'Cause',serif", fontSize: 'clamp(12px,2.5vw,14px)', fontWeight: '700', letterSpacing: '1px',
              padding: '9px clamp(14px,3.5vw,28px)', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#DF82A3' : 'transparent',
              color: tab === t.id ? '#F2E7B4' : '#917264',
              boxShadow: tab === t.id ? '0 3px 10px rgba(223,130,163,0.35)' : 'none',
              transition: 'all 0.25s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {tab === 'template' ? <PickTemplate onSelect={handleSelect} /> : <BuildOwn onSelect={handleSelect} />}
        </div>
      </div>
    </div>
  )
}