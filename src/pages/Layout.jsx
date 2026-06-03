import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { playClick } from '../utils/sounds'
import VerticalStripes from '../components/VerticalStripes'
import PageHeader from '../components/PageHeader'

import { TEMPLATES } from '../config/templates'

const NEW_LAYOUTS = [
  { id: 'new_1', label: 'Solo', shots: 1, canvasWidth: 900, canvasHeight: 1100,  slots: [{ x: 70, y: 80, width: 760, height: 760 }], rows: 1 },
  { id: 'new_2', label: 'Duo',  shots: 2, canvasWidth: 900, canvasHeight: 1600,  slots: [{ x: 40, y: 50, width: 820, height: 600 }, { x: 40, y: 700, width: 820, height: 600 }], rows: 2 },
  { id: 'new_3', label: 'Trio', shots: 3, canvasWidth: 900, canvasHeight: 2000,  slots: [{ x: 40, y: 40, width: 820, height: 480 }, { x: 40, y: 560, width: 820, height: 480 }, { x: 40, y: 1080, width: 820, height: 480 }], rows: 3 },
  { id: 'new_4', label: 'Quad', shots: 4, canvasWidth: 900, canvasHeight: 2400,  slots: [{ x: 40, y: 40, width: 820, height: 440 }, { x: 40, y: 530, width: 820, height: 440 }, { x: 40, y: 1020, width: 820, height: 440 }, { x: 40, y: 1510, width: 820, height: 440 }], rows: 4 },
]

const FRAME_COLORS = [
  { id: 'white',    label: 'Snow',     hex: '#FFFFFF' },
  { id: 'cream',    label: 'Grey',     hex: '#B5B5B5' },
  { id: 'pink',     label: 'Blossom',  hex: '#F4B8CC' },
  { id: 'mauve',    label: 'Mauve',    hex: '#DF82A3' },
  { id: 'sage',     label: 'Sage',     hex: '#B5C9A1' },
  { id: 'mint',     label: 'Mint',     hex: '#A8D8C8' },
  { id: 'sky',      label: 'Sky',      hex: '#A8C8E8' },
  { id: 'lavender', label: 'Lavender', hex: '#C8B8E8' },
  { id: 'peach',    label: 'Peach',    hex: '#F4C4A0' },
  { id: 'butter',   label: 'Slate',    hex: '#8E8E8E' },
  { id: 'mocha',    label: 'Mocha',    hex: '#917264' },
  { id: 'black',    label: 'Noir',     hex: '#2A2A2A' },
]

// ── Each card rendered at its TRUE aspect ratio, but capped at max height ──
// Center card max-height = 300px. Side cards scale to 0.78.
const CENTER_MAX_H = 360
const CENTER_W     = 240

// Fixed preview box — always Trio (3-frame) outer size; slots reflow inside
const PREVIEW_FIXED_W = 112
const PREVIEW_FIXED_H = 170
const PREVIEW_PAD = 7

const HOME_BTN_SHADOW = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'
const HOME_BTN_SHADOW_HOVER = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'

function getFixedPreviewDims() {
  return { w: PREVIEW_FIXED_W, h: PREVIEW_FIXED_H, pad: PREVIEW_PAD }
}

function PillButton({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: "'Cause',serif", fontSize: '15px', fontWeight: '700',
      letterSpacing: '2px', textTransform: 'uppercase', color: '#F2E7B4',
      background: disabled ? '#C4A882' : '#DF82A3', border: 'none', borderRadius: '100px',
      padding: '13px 52px', cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : HOME_BTN_SHADOW,
      transition: 'transform 0.12s ease, box-shadow 0.12s ease', opacity: disabled ? 0.6 : 1,
    }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = HOME_BTN_SHADOW_HOVER
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (!disabled) e.currentTarget.style.boxShadow = HOME_BTN_SHADOW
      }}
      onMouseDown={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(3px)'
          e.currentTarget.style.boxShadow = '0 5px 3px #917264, 0 4px 12px rgba(145,114,100,0.2)'
        }
      }}
      onMouseUp={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = HOME_BTN_SHADOW_HOVER
        }
      }}
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>

      {/* ── Carousel ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '700px',
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
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: '6px' }}>
        {TEMPLATES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '22px' : '8px', height: '8px', borderRadius: '4px',
            background: i === current ? '#DF82A3' : '#C4A882',
            border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* ── Button ── */}
      <div style={{ flexShrink: 0, marginTop: '20px' }}>
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
  const [selectedColor, setSelectedColor] = useState(FRAME_COLORS[0])

  const previewDims = getFixedPreviewDims()
  const ICON_W = 22
  const ICON_MAX_H = 52

  function iconH(rows) {
    return Math.round(ICON_MAX_H * rows / 4) + (rows < 4 ? 4 : 0)
  }

  function PreviewSlots() {
    const innerH = previewDims.h - previewDims.pad * 2
    const innerW = previewDims.w - previewDims.pad * 2
    const gap = 3

    if (!selectedLayout) {
      return (
        <span style={{ fontSize: '9px', color: '#C4A882', textAlign: 'center', lineHeight: 1.4 }}>
          Pick a layout
        </span>
      )
    }

    const n = selectedLayout.shots
    const slotH = Math.floor((innerH - gap * (n - 1)) / n)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, width: `${innerW}px`, height: `${innerH}px` }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{
            width: '100%', height: `${slotH}px`,
            background: 'rgba(255,255,255,0.78)', borderRadius: '3px', flexShrink: 0,
          }} />
        ))}
      </div>
    )
  }

  const panelLabel = {
    fontFamily: "'Cause',serif", fontSize: '10px', fontWeight: '700',
    letterSpacing: '1.5px', textTransform: 'uppercase', color: '#917264', margin: 0,
    textAlign: 'center',
  }

  return (
    <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

      {/* Layout + Preview — tight gap, fixed preview size */}
      <div style={{
        width: 'fit-content',
        minWidth: 100,
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Choose layout — narrow */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: 'center',
        }}>
          <p style={panelLabel}>Choose Layout</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5px',
            width: '100%',
            maxWidth: '148px',
          }}>
            {NEW_LAYOUTS.map(layout => {
              const isSel = selectedLayout?.id === layout.id
              const ih = iconH(layout.rows)
              return (
                <div key={layout.id} onClick={() => setSelectedLayout(layout)} style={{
                  cursor: 'pointer',
                  padding: '6px 3px 5px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid #DF82A3' : '2px solid #D4C49A',
                  background: isSel ? 'rgba(223,130,163,0.1)' : 'rgba(255,255,255,0.55)',
                  boxShadow: isSel ? HOME_BTN_SHADOW : '0 2px 4px rgba(145,114,100,0.1)',
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  height: '76px', justifyContent: 'center',
                }}>
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
                  <span style={{ fontSize: '10px', fontWeight: '700', color: isSel ? '#DF82A3' : '#917264' }}>
                    {layout.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Preview — fixed Trio size */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: 'center',
        }}>
          <p style={panelLabel}>Preview</p>
          <div style={{
            width: `${previewDims.w}px`,
            height: `${previewDims.h}px`,
            borderRadius: '12px',
            background: selectedLayout ? selectedColor.hex : 'rgba(255,255,255,0.45)',
            border: '2px solid #D4C49A',
            boxShadow: HOME_BTN_SHADOW,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: `${previewDims.pad}px`,
            transition: 'background 0.3s',
            flexShrink: 0,
          }}>
            <PreviewSlots />
          </div>
          {selectedLayout && (
            <p style={{ fontSize: '9px', color: '#917264', fontStyle: 'italic', margin: 0 }}>
              {selectedColor.label}
            </p>
          )}
        </div>
      </div>

      {/* ── Color picker ── */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <p style={{ fontFamily: "'Cause',serif", fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#917264', margin: 0 }}>
          Frame Color
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '400px' }}>
          {FRAME_COLORS.map(c => (
            <div key={c.id} onClick={() => setSelectedColor(c)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px', background: c.hex,
                border: selectedColor.id === c.id ? '3px solid #917264' : '3px solid transparent',
                boxShadow: selectedColor.id === c.id ? '0 0 0 2px rgba(145,114,100,0.35)' : '0 2px 5px rgba(0,0,0,0.08)',
                transform: selectedColor.id === c.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              }} />
              <span style={{ fontSize: '8px', color: '#917264', fontWeight: selectedColor.id === c.id ? '700' : '400' }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Next button ── */}
      <div>
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
    <div style={{
      height: '100vh', width: '100%', backgroundColor: '#f2e7b4',
      position: 'relative', overflow: 'hidden', fontFamily: "'Cause',serif",
    }}>
      <VerticalStripes />
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px',
        height: '100%', margin: '0 auto', padding: '24px 16px 16px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        <PageHeader onBack={() => navigate('/')} title="Your Frame" />

        <p style={{ fontFamily: "'Cause',serif", fontSize: '13px', color: '#917264', margin: '0 0 12px', letterSpacing: '0.5px' }}>
          Pick a template or build your own
        </p>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.5)', borderRadius: '100px', padding: '4px', border: '2px solid #D4C49A', marginBottom: '12px', gap: '4px', flexShrink: 0 }}>
          {[{ id: 'template', label: '✦ Templates' }, { id: 'build', label: '✐ Build Your Own' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: "'Cause',serif", fontSize: 'clamp(12px,2.5vw,14px)', fontWeight: '700', letterSpacing: '1px',
              padding: '8px clamp(12px,3vw,24px)', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#DF82A3' : 'transparent',
              color: tab === t.id ? '#F2E7B4' : '#917264',
              boxShadow: tab === t.id ? '0 3px 10px rgba(223,130,163,0.35)' : 'none',
              transition: 'all 0.25s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          {tab === 'template' ? <PickTemplate onSelect={handleSelect} /> : <BuildOwn onSelect={handleSelect} />}
        </div>
      </div>
    </div>
  )
}