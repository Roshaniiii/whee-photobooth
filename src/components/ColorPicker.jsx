import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SketchPicker } from 'react-color'
import { Pipette, SlidersHorizontal, X } from 'lucide-react'

export default function ColorPicker({
  value,
  onChange,
  presets = [],
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Standardize presets array into objects { hex, label }
  const normalizedPresets = presets.map((p) => {
    if (typeof p === 'string') {
      return { hex: p, label: p, id: p }
    }
    return p
  })

  // Preset hex strings for SketchPicker
  const presetHexes = normalizedPresets.map((p) => p.hex)

  // Current selected hex color string
  const currentHex = typeof value === 'string' ? value : value?.hex || '#DF82A3'

  const handleChange = (colorResult) => {
    const hex = colorResult.hex
    const matchedPreset = normalizedPresets.find(
      (p) => p.hex.toLowerCase() === hex.toLowerCase()
    )
    onChange(hex, matchedPreset || { id: 'custom', label: 'Custom', hex })
  }

  const handleSelectPreset = (p) => {
    onChange(p.hex, p)
  }

  // Prevent background scroll when modal popup is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isOpen])

  // ── POPUP MODAL (Rendered to body via React Portal) ────────
  const renderPopover = () => {
    if (!isOpen) return null

    return createPortal(
      <div
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     999999,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding:    '16px',
          boxSizing:  'border-box',
        }}
      >
        {/* Tap outside overlay */}
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position:             'fixed',
            inset:                0,
            background:           'rgba(50, 30, 20, 0.45)',
            backdropFilter:       'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />

        {/* Picker modal card */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position:      'relative',
            zIndex:        1,
            boxShadow:     '0 12px 35px rgba(145,114,100,0.35), 0 3px 10px rgba(0,0,0,0.18)',
            borderRadius:  '16px',
            background:    '#FFFDF8',
            border:        '2px solid #D4C49A',
            padding:       '10px 10px 8px',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '8px',
            maxWidth:      'calc(100vw - 28px)',
            maxHeight:     'calc(100dvh - 32px)',
            overflowY:     'auto',
            boxSizing:     'border-box',
          }}
        >
          {/* Header row with title & close button */}
          <div
            style={{
              width:          '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              paddingBottom:  '6px',
              borderBottom:   '1px solid rgba(212,196,154,0.4)',
            }}
          >
            <span
              style={{
                fontFamily:    "'Cause', serif",
                fontSize:      '12px',
                fontWeight:    700,
                letterSpacing: '1px',
                color:         '#917264',
                textTransform: 'uppercase',
              }}
            >
              Custom Color
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close color picker"
              style={{
                background:    'rgba(223, 130, 163, 0.12)',
                border:        'none',
                cursor:        'pointer',
                color:         '#DF82A3',
                width:         '24px',
                height:        '24px',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                borderRadius:  '50%',
                padding:       0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          <SketchPicker
            color={currentHex}
            onChangeComplete={handleChange}
            presetColors={presetHexes.length ? presetHexes : undefined}
            disableAlpha
            width="210px"
          />
        </div>
      </div>,
      document.body
    )
  }

  // ── COMPACT VERSION ───────────────────────────────────────
  if (compact) {
    return (
      <div
        className={`color-picker-wrapper compact ${className}`}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        {/* Trigger button */}
        <button
          type="button"
          aria-label="Open color picker"
          title="Pick color"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width:          '28px',
            height:         '28px',
            borderRadius:   '50%',
            background:     currentHex,
            border:         '2px solid #DF82A3',
            boxShadow:      '0 2px 6px rgba(0,0,0,0.15)',
            cursor:         'pointer',
            padding:        0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            transition:     'transform 0.15s ease',
          }}
        >
          <Pipette
            size={14}
            style={{
              color:  '#fff',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
            }}
          />
        </button>

        {renderPopover()}
      </div>
    )
  }

  // ── STANDARD VERSION ──────────────────────────────────────
  return (
    <div
      className={`color-picker-wrapper standard ${className}`}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        width:          '100%',
        gap:            '8px',
        position:       'relative',
      }}
    >
      {/* Preset swatches row + Sliders toggle button */}
      <div
        style={{
          display:        'flex',
          flexWrap:       'wrap',
          gap:            '6px',
          justifyContent: 'center',
          maxWidth:       '360px',
          alignItems:     'center',
        }}
      >
        {normalizedPresets.map((p) => {
          const isSelected = currentHex.toLowerCase() === p.hex.toLowerCase()
          return (
            <div
              key={p.id || p.hex}
              onClick={() => handleSelectPreset(p)}
              style={{
                cursor:        'pointer',
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '1px',
              }}
            >
              <div
                style={{
                  width:        '24px',
                  height:       '24px',
                  borderRadius: '6px',
                  background:   p.hex,
                  border:       isSelected
                    ? '2px solid #917264'
                    : '2px solid transparent',
                  boxShadow:    isSelected
                    ? '0 0 0 2px rgba(145,114,100,0.3)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                  transform:    isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition:   'transform 0.15s ease',
                }}
              />
            </div>
          )
        })}

        {/* Sliders toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Custom Color Sliders"
          style={{
            height:       '24px',
            padding:      '0 8px',
            borderRadius: '6px',
            background:   isOpen ? '#DF82A3' : 'rgba(255,255,255,0.8)',
            color:        isOpen ? '#fff' : '#917264',
            border:       '1.5px solid #DF82A3',
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            gap:          '4px',
            fontSize:     '10px',
            fontWeight:   '700',
            fontFamily:   "'Cause', serif",
            transition:   'all 0.15s ease',
          }}
        >
          <SlidersHorizontal size={12} />
          <span>Sliders</span>
        </button>
      </div>

      {renderPopover()}
    </div>
  )
}